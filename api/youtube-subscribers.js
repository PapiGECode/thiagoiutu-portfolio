const CHANNEL_ID = "UCa3jp09F9qG4SaHIeHEdcKA";

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const apiKey = process.env.THIAGO_YOUTUBE_API_KEY || "AIzaSyAzj6ZWwiGY4o49yNZLMwhbA2iWKZ0HuT4";
  if (!apiKey) {
    return res.status(500).json({ error: "YouTube API key is not configured" });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${encodeURIComponent(CHANNEL_ID)}&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube API returned ${response.status}`);
    const data = await response.json();
    const item = (data.items || [])[0] || {};
    const stats = item.statistics || {};
    const subscribers = stats.subscriberCount;
    if (subscribers === undefined) throw new Error("No subscriber count");
    return res.status(200).json({
      subscriberCount: parseInt(subscribers, 10),
      channelId: CHANNEL_ID,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(502).json({ error: "Unable to read YouTube statistics", detail: String(err.message || err) });
  }
};

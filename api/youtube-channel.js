const fs = require('fs');
const path = require('path');

const CHANNEL_ID = "UCa3jp09F9qG4SaHIeHEdcKA";
let memoryCache = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

function getFallbackData() {
  try {
    const fallbackPath = path.join(__dirname, 'fallback-channel.json');
    if (fs.existsSync(fallbackPath)) {
      return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading fallback-channel.json:', e);
  }
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const now = Date.now();
  if (memoryCache && (now - lastFetchTime < CACHE_TTL_MS)) {
    return res.status(200).json(memoryCache);
  }

  const apiKey = process.env.THIAGO_YOUTUBE_API_KEY || "AIzaSyAzj6ZWwiGY4o49yNZLMwhbA2iWKZ0HuT4";
  if (!apiKey) {
    const fallback = getFallbackData();
    if (fallback) return res.status(200).json(fallback);
    return res.status(500).json({ error: "YouTube API key is not configured" });
  }

  try {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,statistics,contentDetails&id=${encodeURIComponent(CHANNEL_ID)}&key=${encodeURIComponent(apiKey)}`;
    const channelRes = await fetch(channelUrl);
    if (!channelRes.ok) {
      throw new Error(`YouTube API returned status ${channelRes.status}`);
    }
    const channelPayload = await channelRes.json();
    const channel = (channelPayload.items || [])[0] || {};
    const snippet = channel.snippet || {};
    const stats = channel.statistics || {};
    const branding = (channel.brandingSettings || {}).image || {};
    const uploadsId = ((channel.contentDetails || {}).relatedPlaylists || {}).uploads;

    let videos = [];
    if (uploadsId) {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsId)}&maxResults=50&key=${encodeURIComponent(apiKey)}`;
      const playlistRes = await fetch(playlistUrl);
      if (playlistRes.ok) {
        const playlistPayload = await playlistRes.json();
        for (const video of playlistPayload.items || []) {
          const videoSnippet = video.snippet || {};
          const videoId = (video.contentDetails || {}).videoId;
          if (!videoId) continue;
          const thumbnails = videoSnippet.thumbnails || {};
          const thumbnail = (thumbnails.high || thumbnails.medium || thumbnails.default || {}).url;
          videos.push({
            id: videoId,
            title: videoSnippet.title || "Vídeo de ThiagoIUTU",
            thumbnail,
            publishedAt: videoSnippet.publishedAt,
            url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
          });
        }
      }
    }

    if (videos.length > 0) {
      const ids = videos.map(v => v.id).join(",");
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,liveStreamingDetails&id=${encodeURIComponent(ids)}&key=${encodeURIComponent(apiKey)}`;
      const detailsRes = await fetch(detailsUrl);
      if (detailsRes.ok) {
        const detailsPayload = await detailsRes.json();
        const byId = {};
        for (const item of detailsPayload.items || []) {
          byId[item.id] = item;
        }
        for (const video of videos) {
          const item = byId[video.id] || {};
          video.duration = (item.contentDetails || {}).duration || "";
          video.views = (item.statistics || {}).viewCount;
          video.isLive = "liveStreamingDetails" in item;
        }
      }
    }

    let playlists = [];
    try {
      const listsUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${encodeURIComponent(CHANNEL_ID)}&maxResults=50&key=${encodeURIComponent(apiKey)}`;
      const listsRes = await fetch(listsUrl);
      if (listsRes.ok) {
        const listsPayload = await listsRes.json();
        playlists = (listsPayload.items || []).map(p => ({
          id: p.id,
          title: (p.snippet || {}).title,
          thumbnail: ((p.snippet || {}).thumbnails?.medium || {}).url,
          url: `https://www.youtube.com/playlist?list=${p.id}`,
          count: (p.contentDetails || {}).itemCount || 0,
        }));
      }
    } catch (_) {}

    const result = {
      channelId: CHANNEL_ID,
      title: snippet.title || "ThiagoIUTU",
      handle: "@ThiagoIUTU",
      description: snippet.description || "",
      avatar: (snippet.thumbnails?.high || snippet.thumbnails?.default || {}).url,
      banner: branding.bannerExternalUrl,
      subscriberCount: parseInt(stats.subscriberCount || 0, 10),
      videoCount: parseInt(stats.videoCount || 0, 10),
      videos,
      playlists,
    };

    memoryCache = result;
    lastFetchTime = Date.now();
    return res.status(200).json(result);
  } catch (err) {
    console.error("YouTube API fetch failed, using fallback data:", err.message);
    const fallback = memoryCache || getFallbackData();
    if (fallback) {
      return res.status(200).json(fallback);
    }
    return res.status(502).json({ error: "Unable to read YouTube channel", detail: String(err.message || err) });
  }
};

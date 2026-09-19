import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, urlencode, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
CHANNEL_ID = "UCa3jp09F9qG4SaHIeHEdcKA"


def get_api_key():
    configured = os.environ.get("THIAGO_YOUTUBE_API_KEY")
    if configured:
        return configured
    secret_file = ROOT / ".env.local"
    if secret_file.exists():
        for line in secret_file.read_text(encoding="utf-8").splitlines():
            if line.startswith("THIAGO_YOUTUBE_API_KEY="):
                return line.split("=", 1)[1].strip()
    return None


def youtube_request(resource, params, api_key):
    query = dict(params)
    query["key"] = api_key
    endpoint = "https://www.googleapis.com/youtube/v3/" + resource + "?" + urlencode(query)
    request = Request(endpoint, headers={"Accept": "application/json"})
    with urlopen(request, timeout=10) as response:
        return json.load(response)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        target = Path(self.translate_path(self.path)).resolve()
        try:
            relative = target.relative_to(ROOT)
        except ValueError:
            self.send_error(404)
            return None
        if any(part.startswith('.') or part == '__pycache__' for part in relative.parts) or target.suffix == '.py':
            self.send_error(404)
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/youtube-channel":
            return self.send_youtube_channel()
        if path != "/api/youtube-subscribers":
            return super().do_GET()

        api_key = get_api_key()
        if not api_key:
            return self.send_json(500, {"error": "YouTube API key is not configured"})

        endpoint = (
            "https://www.googleapis.com/youtube/v3/channels?part=statistics&id="
            + quote(CHANNEL_ID)
            + "&key="
            + quote(api_key)
        )
        try:
            payload = youtube_request("channels", {"part": "statistics", "id": CHANNEL_ID}, api_key)
            item = payload.get("items", [{}])[0]
            statistics = item.get("statistics", {})
            subscribers = statistics.get("subscriberCount")
            if subscribers is None:
                raise ValueError("YouTube did not return subscriberCount")
            self.send_json(200, {
                "subscriberCount": int(subscribers),
                "channelId": CHANNEL_ID,
                "updatedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
            })
        except Exception as error:
            self.send_json(502, {"error": "Unable to read YouTube statistics", "detail": str(error)})

    def send_youtube_channel(self):
        api_key = get_api_key()
        if not api_key:
            return self.send_json(500, {"error": "YouTube API key is not configured"})
        try:
            channel_payload = youtube_request(
                "channels",
                {
                    "part": "snippet,brandingSettings,statistics,contentDetails",
                    "id": CHANNEL_ID,
                },
                api_key,
            )
            channel = channel_payload.get("items", [{}])[0]
            snippet = channel.get("snippet", {})
            stats = channel.get("statistics", {})
            branding = channel.get("brandingSettings", {}).get("image", {})
            uploads_id = channel.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads")
            videos = []
            if uploads_id:
                playlist_payload = youtube_request(
                    "playlistItems",
                    {"part": "snippet,contentDetails", "playlistId": uploads_id, "maxResults": "50"},
                    api_key,
                )
                for video in playlist_payload.get("items", []):
                    video_snippet = video.get("snippet", {})
                    video_id = video.get("contentDetails", {}).get("videoId")
                    if not video_id:
                        continue
                    thumbnails = video_snippet.get("thumbnails", {})
                    thumbnail = (thumbnails.get("high") or thumbnails.get("medium") or thumbnails.get("default") or {}).get("url")
                    videos.append({
                        "id": video_id,
                        "title": video_snippet.get("title", "Vídeo de ThiagoIUTU"),
                        "thumbnail": thumbnail,
                        "publishedAt": video_snippet.get("publishedAt"),
                        "url": "https://www.youtube.com/watch?v=" + quote(video_id),
                    })
            if videos:
                details = youtube_request("videos", {"part": "contentDetails,statistics,liveStreamingDetails", "id": ",".join(v["id"] for v in videos)}, api_key)
                by_id = {item["id"]: item for item in details.get("items", [])}
                for video in videos:
                    item = by_id.get(video["id"], {})
                    video["duration"] = item.get("contentDetails", {}).get("duration", "")
                    video["views"] = item.get("statistics", {}).get("viewCount")
                    video["isLive"] = "liveStreamingDetails" in item
            lists = youtube_request("playlists", {"part": "snippet,contentDetails", "channelId": CHANNEL_ID, "maxResults": "50"}, api_key)
            playlists = [{"id": p["id"], "title": p["snippet"]["title"], "thumbnail": (p["snippet"].get("thumbnails", {}).get("medium") or {}).get("url"), "url": "https://www.youtube.com/playlist?list=" + p["id"], "count": p.get("contentDetails", {}).get("itemCount", 0)} for p in lists.get("items", [])]
            self.send_json(200, {
                "channelId": CHANNEL_ID,
                "title": snippet.get("title", "ThiagoIUTU"),
                "handle": "@ThiagoIUTU",
                "description": snippet.get("description", ""),
                "avatar": (snippet.get("thumbnails", {}).get("high") or snippet.get("thumbnails", {}).get("default") or {}).get("url"),
                "banner": branding.get("bannerExternalUrl"),
                "subscriberCount": int(stats.get("subscriberCount", 0)),
                "videoCount": int(stats.get("videoCount", 0)),
                "videos": videos,
                "playlists": playlists,
            })
        except Exception as error:
            self.send_json(502, {"error": "Unable to read YouTube channel", "detail": str(error)})


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), Handler)
    print("ThiagoIUTU local server: http://127.0.0.1:8000")
    server.serve_forever()

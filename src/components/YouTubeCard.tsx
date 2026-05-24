import { Play } from 'lucide-react';

interface YouTubeCardProps {
  url: string;
  caption: string;
}

/** Extracts the YouTube video ID from a watch URL.
 *  e.g. "https://www.youtube.com/watch?v=PuH5VKlhH_Y" → "PuH5VKlhH_Y" */
function extractYouTubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname?.includes('youtube.com')) {
    return parsed.searchParams.get('v');
  }
  if (parsed.hostname === 'youtu.be') {
    return parsed.pathname.slice(1);
  }
  return null;
}

/** Thumbnail URL for a YouTube video ID (hqdefault — 480×360). */
function youtubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

const YouTubeCard = ({ url, caption }: YouTubeCardProps) => {
  const videoId = extractYouTubeId(url);
  const thumbnailUrl = videoId ? youtubeThumbnail(videoId) : null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={caption}
      className="group relative aspect-square overflow-hidden rounded-md border bg-muted block w-full"
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={caption}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-accent">
          <span className="text-xs text-muted-foreground">Video unavailable</span>
        </div>
      )}
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="rounded-full bg-black/70 p-3">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </div>
      {/* Caption on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-white leading-tight">{caption}</p>
      </div>
    </a>
  );
};

export default YouTubeCard;

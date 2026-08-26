// components/EmbedPlayer.jsx
// Accepts a raw YouTube or Instagram URL and renders the correct embed.
import { useEffect, useRef } from "react";

function getYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/
  ];
  for (const re of patterns) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

function isInstagram(url) {
  return /instagram\.com/.test(url);
}

export default function EmbedPlayer({ url, title = "Video" }) {
  const containerRef = useRef(null);

  const youTubeId = url ? getYouTubeId(url) : null;
  const instagram = url ? isInstagram(url) : false;

  // Instagram requires its embed.js script to render the blockquote widget.
  useEffect(() => {
    if (!instagram) return;
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => window.instgrm?.Embeds?.process();
    } else {
      window.instgrm.Embeds.process();
    }
  }, [instagram, url]);

  if (!url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        No video available
      </div>
    );
  }

  if (youTubeId) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youTubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (instagram) {
    return (
      <div ref={containerRef} className="flex w-full justify-center overflow-hidden rounded-lg">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ width: "100%", margin: 0 }}
        />
      </div>
    );
  }

  // Fallback: unknown link type, just offer it as a clickable link.
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 text-brand-600 underline"
    >
      Open video link
    </a>
  );
}

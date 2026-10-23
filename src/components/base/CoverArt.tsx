import { useState } from "react";

interface CoverArtProps {
  src?: string;
  title: string;
  artist: string;
  tone: string;
  /** show title and artist on the fallback tile (large covers only) */
  showText?: boolean;
  className?: string;
}

/**
 * Album cover with a styled fallback: if the artwork is missing or fails to
 * load (Spotify's image host is slow or blocked), a tinted tile with the
 * title takes its place instead of broken alt text over a blank square.
 */
export default function CoverArt({
  src,
  title,
  artist,
  tone,
  showText = false,
  className = "",
}: CoverArtProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${title} by ${artist}`}
        className={`flex h-full w-full flex-col justify-end bg-gradient-to-br p-5 ${tone} ${className}`}
      >
        {showText && (
          <>
            <span className="font-display text-[clamp(1.4rem,3vw,2rem)] uppercase leading-[0.95] text-foreground-950">
              {title}
            </span>
            <span className="mt-2 text-[13px] text-foreground-700">{artist}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${title} album artwork`}
      title={`${title} by ${artist}`}
      width={640}
      height={640}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

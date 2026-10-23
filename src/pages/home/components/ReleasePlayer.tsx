import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import useSpotifyPreview from "@/hooks/useSpotifyPreview";
import type { Release } from "@/mocks/work";
import SeekBar from "@/pages/home/components/SeekBar";

interface ReleasePlayerProps {
  release: Release;
  onPlayingChange?: (playing: boolean) => void;
  toggleRef?: MutableRefObject<(() => void) | null>;
}

function Equalizer({ active, small = false }: { active: boolean; small?: boolean }) {
  return (
    <span className={`flex items-end gap-[3px] ${small ? "h-3" : "h-4"}`} aria-hidden="true">
      {[0, 1, 2, 3].map((bar) => (
        <span
          key={bar}
          className="w-[3px] origin-bottom rounded-full bg-primary-500 transition-all duration-300"
          style={{
            height: active ? `${[10, 16, 7, 13][bar]}px` : "5px",
            animation: active ? `eq-bounce 900ms ease-in-out ${bar * 120}ms infinite` : undefined,
          }}
        />
      ))}
    </span>
  );
}

export default function ReleasePlayer({ release, onPlayingChange, toggleRef }: ReleasePlayerProps) {
  const { ready, playing, position, duration, failed, toggle, seek } = useSpotifyPreview(
    release.spotifyTrackId ?? null,
    true,
  );

  useEffect(() => {
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  useEffect(() => {
    if (!toggleRef) return undefined;
    toggleRef.current = toggle;
    return () => {
      toggleRef.current = null;
    };
  }, [toggle, toggleRef]);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [docked, setDocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // playing again (from the inline card) brings the floating bar back
  useEffect(() => {
    if (playing) setDismissed(false);
  }, [playing]);

  const close = () => {
    if (playing) toggle();
    setDismissed(true);
  };

  // Esc closes the floating bar exactly like the × button does
  useEffect(() => {
    if (!docked || dismissed) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (playing) toggle();
      setDismissed(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [docked, dismissed, playing, toggle]);

  useEffect(() => {
    const update = () => {
      const el = cardRef.current;
      if (!el) return;
      setDocked(el.getBoundingClientRect().bottom < 16);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* The playback engine is created outside React's tree by the hook, so
          nothing here can be disturbed by the Spotify embed's own DOM changes. */}
      <div ref={cardRef} aria-hidden={docked}>
        <div className="relative mt-8 overflow-hidden rounded-card border border-white/[0.08] bg-background-100">
          <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-background-200 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] sm:h-28 sm:w-28">
              {release.coverArt ? (
                <img
                  src={release.coverArt}
                  alt={`${release.title} album artwork`}
                  title={`${release.title} by ${release.artist}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className={`photo-tone h-full w-full bg-gradient-to-br ${release.coverTone}`} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground-600">
                <Equalizer active={playing} />
                <span>{playing ? "Now playing" : "Ready to play"}</span>
              </div>
              <p className="mt-2 truncate font-heading text-lg font-semibold text-foreground-950 sm:text-xl">
                {release.title}
              </p>
              <p className="mt-1 truncate text-sm text-foreground-700">
                {release.artist} · {release.role} · {release.year}
              </p>

              <div className="mt-4 flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={toggle}
                  disabled={!ready}
                  aria-label={playing ? `Pause ${release.title}` : `Play ${release.title}`}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-background-50 transition-colors duration-200 hover:bg-primary-400 disabled:opacity-50"
                >
                  <i
                    className={`text-xl ${playing ? "ri-pause-fill" : "ri-play-fill"}`}
                    aria-hidden="true"
                  />
                </button>

                <SeekBar
                  ready={ready}
                  position={position}
                  duration={duration}
                  onSeek={seek}
                  label={`Seek within ${release.title}`}
                />

                <a
                  href={release.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${release.title} on Spotify`}
                  className="hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground-700 transition-colors duration-200 hover:text-primary-500 sm:flex"
                >
                  <i className="ri-spotify-line text-lg" aria-hidden="true" />
                </a>
              </div>

              {failed && (
                <p className="mt-3 text-xs text-foreground-600">
                  The in-page player couldn&apos;t load.{" "}
                  <a
                    href={release.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-500 underline decoration-primary-500/40 underline-offset-2"
                  >
                    Listen on Spotify
                  </a>
                  .
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-white/[0.06] px-4 py-2.5 sm:px-5">
            <a
              href={release.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-foreground-600 transition-colors duration-200 hover:text-primary-500"
            >
              <i className="ri-external-link-line text-sm" aria-hidden="true" />
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>

      {docked && !dismissed && (
        <div className="fixed inset-x-0 bottom-[84px] z-40 px-3 sm:px-5 lg:bottom-6">
          <div className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-pill border border-white/[0.12] bg-background-100/95 p-2 shadow-[0_26px_60px_-26px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:gap-4 sm:pr-4">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-background-200">
              {release.coverArt ? (
                <img
                  src={release.coverArt}
                  alt={`${release.title} album artwork`}
                  title={`${release.title} by ${release.artist}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${release.coverTone}`} />
              )}
            </div>

            <button
              type="button"
              onClick={toggle}
              disabled={!ready}
              aria-label={playing ? `Pause ${release.title}` : `Play ${release.title}`}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-background-50 transition-colors duration-200 hover:bg-primary-400 disabled:opacity-50"
            >
              <i
                className={`${playing ? "ri-pause-fill" : "ri-play-fill"} text-lg`}
                aria-hidden="true"
              />
            </button>

            <div className="hidden min-w-0 shrink-0 sm:block">
              <p className="max-w-[180px] truncate font-heading text-[13px] font-semibold text-foreground-950">
                {release.title}
              </p>
              <p className="max-w-[180px] truncate text-[11px] text-foreground-600">
                {release.artist}
              </p>
            </div>

            <div className="hidden sm:block">
              <Equalizer active={playing} small />
            </div>

            <SeekBar
              ready={ready}
              position={position}
              duration={duration}
              onSeek={seek}
              label={`Seek within ${release.title}`}
              compact
            />

            <a
              href={release.spotify}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${release.title} on Spotify`}
              className="hidden h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-600 transition-colors duration-200 hover:text-primary-500 sm:flex"
            >
              <i className="ri-spotify-line text-base" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={close}
              aria-label="Close the mini player"
              title="Close the mini player"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-600 transition-colors duration-200 hover:bg-background-200 hover:text-foreground-950"
            >
              <i className="ri-close-line text-lg" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
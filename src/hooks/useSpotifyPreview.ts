import { useCallback, useEffect, useRef, useState } from "react";

interface SpotifyPlaybackData {
  isPaused?: boolean;
  isBuffering?: boolean;
  duration?: number;
  position?: number;
}

interface SpotifyController {
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  destroy: () => void;
  addListener: (event: string, callback: (e: { data?: SpotifyPlaybackData }) => void) => void;
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: Record<string, string | number>,
    callback: (controller: SpotifyController) => void,
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    __spotifyIframeApi?: SpotifyIframeApi;
  }
}

const SCRIPT_ID = "spotify-iframe-api";
let apiPromise: Promise<SpotifyIframeApi> | null = null;

function loadSpotifyIframeApi(): Promise<SpotifyIframeApi> {
  if (window.__spotifyIframeApi) return Promise.resolve(window.__spotifyIframeApi);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<SpotifyIframeApi>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("Spotify player timed out")), 12000);

    const previous = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api: SpotifyIframeApi) => {
      window.clearTimeout(timeout);
      window.__spotifyIframeApi = api;
      previous?.(api);
      resolve(api);
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Spotify player failed to load"));
      };
      document.body.appendChild(script);
    }
  });

  return apiPromise;
}

/**
 * Creates the invisible playback host outside of React's tree.
 *
 * The Spotify iframe API rearranges the element it is given, so if that element
 * were rendered by React, a later unmount would fail with
 * "Failed to execute 'removeChild' on 'Node'". Keeping the host in plain DOM
 * means React never has to reconcile anything inside it.
 */
function createPlaybackHost(): HTMLDivElement {
  // Safety net: never allow two engines (and two audio streams) to coexist.
  document.querySelectorAll('[data-spotify-engine="true"]').forEach((stale) => {
    try {
      stale.remove();
    } catch {
      // already detached
    }
  });

  const host = document.createElement("div");
  host.className = "spotify-engine";
  host.setAttribute("aria-hidden", "true");
  host.setAttribute("data-spotify-engine", "true");
  document.body.appendChild(host);
  return host;
}

export default function useSpotifyPreview(trackId: string | null, autoPlay = false) {
  const controllerRef = useRef<SpotifyController | null>(null);
  const playingRef = useRef(false);
  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  /**
   * The embed occasionally ignores the very first play() call while it is still
   * waking up. One quiet retry a moment later is enough to make it stick.
   */
  const nudge = useCallback(() => {
    window.setTimeout(() => {
      if (!controllerRef.current || playingRef.current) return;
      try {
        controllerRef.current.play();
      } catch {
        // ignore, the UI keeps the play button available
      }
    }, 900);
  }, []);

  useEffect(() => {
    if (!trackId) return undefined;

    let cancelled = false;
    let controller: SpotifyController | null = null;
    const host = createPlaybackHost();
    const mount = document.createElement("div");
    host.appendChild(mount);

    setReady(false);
    setFailed(false);
    setPlaying(false);
    playingRef.current = false;
    setPosition(0);
    setDuration(0);

    loadSpotifyIframeApi()
      .then((api) => {
        if (cancelled) return;
        api.createController(
          mount,
          { uri: `spotify:track:${trackId}`, width: "100%", height: 80 },
          (instance) => {
            if (cancelled) {
              try {
                instance.destroy();
              } catch {
                // ignore teardown errors from the embed
              }
              return;
            }
            controller = instance;
            controllerRef.current = instance;
            instance.addListener("playback_update", (event) => {
              const data = event?.data ?? {};
              const isPaused = Boolean(data.isPaused);
              playingRef.current = !isPaused;
              setPlaying(!isPaused);
              if (typeof data.position === "number") setPosition(data.position / 1000);
              if (typeof data.duration === "number") setDuration(data.duration / 1000);
            });
            setReady(true);
            if (autoPlayRef.current) {
              try {
                instance.play();
                nudge();
              } catch {
                setPlaying(false);
              }
            }
          },
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      try {
        controller?.destroy();
      } catch {
        // ignore teardown errors from the embed
      }
      controllerRef.current = null;
      playingRef.current = false;
      // The host lives outside React's tree, so it is safe to remove outright.
      window.setTimeout(() => {
        try {
          host.remove();
        } catch {
          // already gone
        }
      }, 0);
    };
  }, [trackId, nudge]);

  const toggle = useCallback(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    if (playingRef.current) {
      try {
        controller.pause();
      } catch {
        // ignore
      }
      return;
    }
    try {
      controller.play();
      nudge();
    } catch {
      // ignore
    }
  }, [nudge]);

  const play = useCallback(() => {
    if (playingRef.current) return;
    toggle();
  }, [toggle]);

  const seek = useCallback((seconds: number) => {
    const controller = controllerRef.current;
    if (!controller || !Number.isFinite(seconds)) return;
    try {
      controller.seek(Math.max(0, seconds));
    } catch {
      // ignore seek errors on preview-only playback
    }
  }, []);

  return {
    ready,
    playing,
    position,
    duration,
    failed,
    toggle,
    play,
    seek,
  };
}
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Gives a 0 → 1 progress value for a section as it travels through the
 * viewport: 0 when the top edge enters the bottom of the screen, 1 when the
 * bottom edge leaves the top. Used for scroll-linked parallax that never pins.
 *
 * When `enabled` is false nothing is measured and no listener is attached, so
 * phones and reduced-motion visitors keep a completely static layout.
 */
export function useScrollLink<T extends HTMLElement = HTMLDivElement>(
  enabled: boolean,
  onProgress: (progress: number) => void,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    if (!enabled) return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const span = rect.height + window.innerHeight;

      if (span <= 0) {
        callback.current(0);
        return;
      }

      const raw = (window.innerHeight - rect.top) / span;
      callback.current(Math.min(Math.max(raw, 0), 1));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return ref;
}
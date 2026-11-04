import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/**
 * True only when a pinned scroll section should be used: desktop widths and no
 * "prefers-reduced-motion" request. Anything else falls back to plain layout.
 */
export function usePinnedEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const widthQuery = window.matchMedia("(min-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setEnabled(widthQuery.matches && !motionQuery.matches);

    update();

    widthQuery.addEventListener?.("change", update);
    motionQuery.addEventListener?.("change", update);

    return () => {
      widthQuery.removeEventListener?.("change", update);
      motionQuery.removeEventListener?.("change", update);
    };
  }, []);

  return enabled;
}

interface PinnedScroll {
  /** attach to the tall outer section */
  ref: RefObject<HTMLDivElement | null>;
  /** 0 → 1 across the whole pinned travel */
  progress: number;
  /** which step is currently active, clamped to 0 .. count - 1 */
  index: number;
}

/**
 * Tracks how far a tall section has been scrolled while its inner panel is
 * stuck to the viewport, and derives both a 0-1 progress value and a step index.
 */
export function usePinnedScroll(count: number, enabled: boolean): PinnedScroll {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      setIndex(0);
      return undefined;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;

      if (travel <= 0) {
        setProgress(0);
        setIndex(0);
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      const next = scrolled / travel;

      setProgress(next);
      setIndex(Math.min(Math.max(count - 1, 0), Math.floor(next * count)));
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
  }, [count, enabled]);

  return { ref, progress, index };
}
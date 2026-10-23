import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/base/Icon";
import usePanelBehavior from "@/hooks/usePanelBehavior";
import { srcSetFor } from "@/design/assets";
import { TOUR_EVENT, tourPhotos } from "@/lib/tour";

/**
 * Full-screen photo tour of the studio. Opened with `openTour()` from
 * lib/tour. Arrows, swipe and the keyboard move between photos; Esc closes.
 */
export default function PhotoTour() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const touchX = useRef<number | null>(null);

  const total = tourPhotos.length;
  const photo = tourPhotos[index];

  const close = useCallback(() => setOpen(false), []);
  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + total) % total),
    [total],
  );

  usePanelBehavior(open, close, panelRef);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const start = (event as CustomEvent<number>).detail ?? 0;
      setIndex(Math.min(Math.max(start, 0), total - 1));
      setOpen(true);
    };
    window.addEventListener(TOUR_EVENT, onOpen);
    return () => window.removeEventListener(TOUR_EVENT, onOpen);
  }, [total]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  // warm the next photo so arrowing through feels instant
  useEffect(() => {
    if (!open) return;
    const next = new Image();
    next.src = tourPhotos[(index + 1) % total].src;
  }, [open, index, total]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo tour of the studio"
      tabIndex={-1}
      className="photo-tour fixed inset-0 z-[70] flex flex-col bg-black/95 text-white outline-none backdrop-blur-sm"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="content-shell flex items-center justify-between py-4">
        <p className="text-[12px] uppercase tracking-[0.18em] text-white/60">
          Photo tour · {index + 1} / {total}
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Close the photo tour"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60"
        >
          <Icon name="ri-close-line" className="text-xl" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <img
          key={photo.src}
          src={photo.src}
          srcSet={srcSetFor(photo.src)}
          sizes="(min-width: 768px) 80vw, 100vw"
          alt={photo.alt}
          decoding="async"
          className="photo-tour-img max-h-full max-w-full rounded-[14px] object-contain"
        />

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 md:flex"
        >
          <Icon name="ri-arrow-left-line" className="text-lg" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 md:flex"
        >
          <Icon name="ri-arrow-right-line" className="text-lg" />
        </button>
      </div>

      <div className="content-shell py-5 text-center" aria-live="polite">
        <p className="font-display text-[22px] uppercase leading-none">{photo.title}</p>
        <p className="mt-2 text-[14px] text-white/70">{photo.caption}</p>

        <div className="mt-4 flex justify-center gap-2">
          {tourPhotos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}: ${p.title}`}
              aria-current={i === index}
              className="group flex h-6 items-center"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary-500" : "w-4 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

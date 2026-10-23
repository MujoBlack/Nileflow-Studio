import { useState } from "react";
import { studioImages } from "@/design/assets";

/**
 * Floating white tour card that sits over the hero photo.
 * Until a real tour video is uploaded it plays the studio still with a slow
 * push-in, and the round button pauses / resumes it.
 */
export default function HeroTourCard() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="w-full rounded-[24px] bg-white p-4 shadow-[0_28px_80px_-28px_rgba(0,0,0,0.75)]">
      <div className="flex items-center justify-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
        <span className="font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.01em] text-[#0E0E10]">
          See the room
        </span>
      </div>

      <p className="mx-auto mt-2 max-w-[22rem] text-center text-[18px] leading-snug text-[#52525B]">
        See the desk, the vocal corner and the lounge before you book.
      </p>

      <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-[16px] bg-[#0E0E10]">
        <img
          src={studioImages.guitar}
          alt="The studio room seen from the door, with the guitar corner on the left and the control desk ahead"
          title="Nile Flow House studio tour, Zurich"
          className={`tour-media-zoom h-full w-full object-cover object-center ${
            playing ? "" : "is-paused"
          }`}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause the studio tour" : "Play the studio tour"}
          className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/65"
        >
          <i
            className={`${playing ? "ri-pause-fill" : "ri-play-fill"} text-xl`}
            aria-hidden="true"
          />
        </button>

        <div className="pointer-events-none absolute bottom-5 left-5 right-5 text-white">
          <p className="text-[14px] font-semibold uppercase tracking-[0.12em]">
            Studio tour · 01:00
          </p>
          <p className="font-display mt-1 text-[20px] uppercase leading-none tracking-[0.01em]">
            Watch the room
          </p>
        </div>
      </div>
    </div>
  );
}
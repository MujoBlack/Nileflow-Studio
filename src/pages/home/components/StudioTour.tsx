import { useState } from "react";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import { studioImages } from "@/design/assets";

export default function StudioTour() {
  const [notified, setNotified] = useState(false);

  return (
    <section id="studio" className="scroll-mt-24 bg-background-50 py-16 md:py-24">
      <div className="content-shell">
        <SectionHeading
          label="The room"
          title={
            <>
              One room, <em>set up properly</em>
            </>
          }
          description="A production desk, a treated vocal corner and a sofa for listening back. One room, and nothing in it you won't use."
        />

        <Reveal className="mt-12">
          <div className="photo-tone group relative aspect-[16/9] w-full overflow-hidden rounded-card border border-white/[0.08]">
            <img
              src={studioImages.studioMain}
              alt="Wide view of the Nile Flow House studio desk and MIDI keyboard"
              className="h-full w-full object-cover object-center"
            />
            <button
              type="button"
              onClick={() => setNotified(true)}
              aria-label="Play the studio tour video"
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-background-50 transition-transform duration-300 group-hover:scale-105">
                <i className="ri-play-fill text-3xl" aria-hidden="true" />
              </span>
            </button>
            {notified && (
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-3 rounded-card border border-white/[0.08] bg-background-100/95 px-4 py-3 backdrop-blur-md sm:right-auto">
                <i className="ri-information-line text-lg text-primary-500" aria-hidden="true" />
                <p className="text-sm text-foreground-800">
                  The full studio tour video is coming soon.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
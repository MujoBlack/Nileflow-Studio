import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import { studioImages, srcSetFor } from "@/design/assets";
import { openTour, tourPhotos } from "@/lib/tour";
import Icon from "@/components/base/Icon";

export default function StudioTour() {
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
              srcSet={srcSetFor(studioImages.studioMain)}
              sizes="(min-width: 1364px) 1300px, 100vw"
              loading="lazy"
              decoding="async"
              alt="Wide view of the Nile Flow House studio desk and MIDI keyboard"
              className="h-full w-full object-cover object-center"
            />
            <button
              type="button"
              onClick={() => openTour(1)}
              className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-pill bg-background-50/80 px-5 py-3 font-display text-[13px] uppercase tracking-[0.12em] text-foreground-950 backdrop-blur-md transition-colors duration-200 hover:bg-background-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 md:bottom-6 md:right-6"
            >
              <Icon name="ri-image-line" className="text-base text-primary-500" />
              Photo tour · {tourPhotos.length} photos
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
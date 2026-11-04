import Icon from "@/components/base/Icon";
import { studioImages, srcSetFor } from "@/design/assets";
import { openTour, tourPhotos } from "@/lib/tour";

/**
 * Floating white tour card that sits over the hero photo. Until a real tour
 * video exists it opens the photo tour; the still keeps a slow push-in.
 * On phones it collapses to a compact row so the hero stays short.
 */
export default function HeroTourCard() {
  return (
    <>
      <button
        type="button"
        onClick={() => openTour(0)}
        className="flex w-full items-center gap-3 rounded-[18px] bg-white p-2.5 pr-4 text-left shadow-[0_20px_60px_-24px_rgba(0,0,0,0.75)] sm:hidden"
      >
        <img
          src={studioImages.guitar}
          srcSet={srcSetFor(studioImages.guitar)}
          sizes="72px"
          alt=""
          className="h-14 w-14 shrink-0 rounded-[12px] object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[18px] uppercase leading-none text-[#0E0E10]">
            See the room
          </span>
          <span className="mt-1 block text-[13px] text-[#52525B]">
            Photo tour · {tourPhotos.length} photos
          </span>
        </span>
        <Icon name="ri-arrow-right-up-line" className="text-lg text-[#0E0E10]" />
      </button>

      <div className="hidden w-full rounded-[24px] bg-white p-4 shadow-[0_28px_80px_-28px_rgba(0,0,0,0.75)] sm:block">
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
          <span className="font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.01em] text-[#0E0E10]">
            See the room
          </span>
        </div>

        <p className="mx-auto mt-2 max-w-[22rem] text-center text-[18px] leading-snug text-[#52525B]">
          See the desk, the vocal corner and the lounge before you book.
        </p>

        <button
          type="button"
          onClick={() => openTour(0)}
          aria-label="Open the photo tour of the studio"
          className="group relative mt-4 block aspect-video w-full overflow-hidden rounded-[16px] bg-[#0E0E10] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <img
            src={studioImages.guitar}
            srcSet={srcSetFor(studioImages.guitar)}
            sizes="480px"
            alt="The studio room seen from the door, with the guitar corner on the left and the control desk ahead"
            className="tour-media-zoom h-full w-full object-cover object-center"
          />
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
            aria-hidden="true"
          />
          <span className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors duration-200 group-hover:bg-black/70">
            <Icon name="ri-image-line" className="text-xl" />
          </span>
          <span className="pointer-events-none absolute bottom-5 left-5 right-5 text-white">
            <span className="block text-[14px] font-semibold uppercase tracking-[0.12em]">
              Photo tour · {tourPhotos.length} photos
            </span>
            <span className="font-display mt-1 block text-[20px] uppercase leading-none tracking-[0.01em]">
              Walk through the room
            </span>
          </span>
        </button>
      </div>
    </>
  );
}

import { useRef } from "react";
import type { CSSProperties } from "react";
import Reveal from "@/components/base/Reveal";
import Button from "@/components/base/Button";
import FlowPattern from "@/components/base/FlowPattern";
import { usePinnedEnabled } from "@/hooks/usePinnedScroll";
import { useScrollLink } from "@/hooks/useScrollLink";
import { studioImages, srcSetFor } from "@/design/assets";
import { siteInfo } from "@/mocks/site";

interface Photo {
  src: string;
  alt: string;
}

/* interior photos only — no building, street or front-door shots.
   Nine different photos across the four columns: the six bright inner slots are
   all unique, and the three dimmed outer slots reuse photos that only appear
   once elsewhere on the page. */
const outerLeftPhotos: Photo[] = [
  {
    src: studioImages.team,
    alt: "Portrait of the producer at Nile Flow House, looking up from the desk",
  },
  {
    src: studioImages.path,
    alt: "The paved path leading up to the studio entrance",
  },
  {
    src: studioImages.sessionVocal,
    alt: "The vocal corner in warm evening light, seen from the doorway",
  },
];

const innerLeftPhotos: Photo[] = [
  {
    src: studioImages.hero,
    alt: "Producer at the desk in the attic studio, room tidy and cables tucked away",
  },
  {
    src: studioImages.sessionPodcast,
    alt: "Two microphones and headphones set up at the lounge table for a podcast",
  },
  {
    src: studioImages.vocalCorner,
    alt: "The vocal corner with microphone and guitar, clear of clutter",
  },
];

const innerRightPhotos: Photo[] = [
  {
    src: studioImages.producerDesk,
    alt: "Producer seated at the control desk, working on a session",
  },
  {
    src: studioImages.guitar,
    alt: "The studio room looking towards the guitar corner, desk tidy",
  },
  {
    src: studioImages.sessionDryHire,
    alt: "The studio room cleared for dry hire, desk, monitors and speakers ready",
  },
];

const outerRightPhotos: Photo[] = [
  {
    src: studioImages.path,
    alt: "The path up to the studio, quiet and tidy",
  },
  {
    src: studioImages.sessionVocal,
    alt: "Warm light falling on the vocal corner microphone",
  },
  {
    src: studioImages.team,
    alt: "The producer between takes in the studio",
  },
];

const stripPhotos: Photo[] = [
  {
    src: studioImages.hero,
    alt: "Producer at the desk in the attic studio",
  },
  {
    src: studioImages.guitar,
    alt: "The studio room with the guitar corner and control desk",
  },
  {
    src: studioImages.sessionPodcast,
    alt: "Podcast microphones set up at the lounge table",
  },
  {
    src: studioImages.vocalCorner,
    alt: "The treated vocal corner with microphone and guitar",
  },
];

/** how far each column travels from the middle of the section, in px */
const PARALLAX = 50;

/** column width — narrows on smaller desktops so the middle text stays clear */
const COL = "clamp(96px, 9.5vw, 180px)";
const GAP = "10px";

/** the band leaves 110px of clear space above and below */
const BAND_INSET = "110px";
/** the inner column starts this much lower (mirrored on the right) */
const STAGGER = "90px";

/* top and bottom 20% of the band fade out */
const VERTICAL_FADE =
  "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)";
/* …and the far left / far right 15% dissolves toward the screen edge */
const FADE_LEFT = `${VERTICAL_FADE}, linear-gradient(to right, transparent 0%, #000 15%, #000 100%)`;
const FADE_RIGHT = `${VERTICAL_FADE}, linear-gradient(to left, transparent 0%, #000 15%, #000 100%)`;

const columnVars = { "--col": COL, "--gap": GAP } as unknown as CSSProperties;

const bandStyle: CSSProperties = {
  maskRepeat: "no-repeat",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

function PhotoColumn({ photos, dim = false }: { photos: Photo[]; dim?: boolean }) {
  return (
    <div
      className={`flex w-full flex-col gap-[10px] will-change-transform ${
        dim ? "opacity-35" : "opacity-100"
      }`}
    >
      {photos.map((photo) => (
        <div
          key={photo.src}
          className="relative h-[210px] w-full overflow-hidden rounded-[12px] border border-white/[0.06]"
        >
          <img
            src={photo.src}
            srcSet={srcSetFor(photo.src)}
            sizes="220px"
            loading="lazy"
            decoding="async"
            alt={photo.alt}
            title="Inside Nile Flow House studio, Zurich"
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

export default function FinalCta() {
  const parallax = usePinnedEnabled();

  const outerLeftRef = useRef<HTMLDivElement | null>(null);
  const innerLeftRef = useRef<HTMLDivElement | null>(null);
  const innerRightRef = useRef<HTMLDivElement | null>(null);
  const outerRightRef = useRef<HTMLDivElement | null>(null);

  const sectionRef = useScrollLink<HTMLDivElement>(parallax, (progress) => {
    const t = (progress - 0.5) * 2; // -1 → 1 across the section
    const shift = (el: HTMLDivElement | null, value: number) => {
      if (!el) return;
      el.style.transform = `translate3d(0, ${value.toFixed(2)}px, 0)`;
    };

    // outer columns drift down, inner columns drift up
    shift(outerLeftRef.current, t * PARALLAX);
    shift(outerRightRef.current, t * PARALLAX);
    shift(innerLeftRef.current, -t * PARALLAX);
    shift(innerRightRef.current, -t * PARALLAX);
  });

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-background-50">
      <div ref={sectionRef} className="relative">
        {/* star lattice, softly faded so it never sits behind the photo columns */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 24%, #000 76%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 24%, #000 76%, transparent 100%)",
          }}
        >
          <FlowPattern />
        </div>

        {/* masked, scroll-linked photo columns — nothing touches the section edges */}
        <div
          className="pointer-events-none absolute inset-x-0 z-0 hidden lg:block"
          style={{ ...columnVars, top: BAND_INSET, bottom: BAND_INSET }}
          aria-hidden="true"
        >
          {/* left pair: outer starts at the top, inner 90px lower */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{
              ...bandStyle,
              width: "calc(2% + (var(--col) * 2) + var(--gap))",
              maskImage: FADE_LEFT,
              WebkitMaskImage: FADE_LEFT,
            }}
          >
            <div className="absolute left-[2%] top-0" style={{ width: "var(--col)" }}>
              <div ref={outerLeftRef}>
                <PhotoColumn photos={outerLeftPhotos} dim />
              </div>
            </div>
            <div
              className="absolute"
              style={{
                top: STAGGER,
                left: "calc(2% + var(--col) + var(--gap))",
                width: "var(--col)",
              }}
            >
              <div ref={innerLeftRef}>
                <PhotoColumn photos={innerLeftPhotos} />
              </div>
            </div>
          </div>

          {/* right pair: mirrored — inner starts at the top, outer 90px lower */}
          <div
            className="absolute inset-y-0 right-0 overflow-hidden"
            style={{
              ...bandStyle,
              width: "calc(2% + (var(--col) * 2) + var(--gap))",
              maskImage: FADE_RIGHT,
              WebkitMaskImage: FADE_RIGHT,
            }}
          >
            <div className="absolute right-[2%] top-0" style={{ width: "var(--col)" }}>
              <div ref={innerRightRef}>
                <PhotoColumn photos={innerRightPhotos} />
              </div>
            </div>
            <div
              className="absolute"
              style={{
                top: STAGGER,
                right: "calc(2% + var(--col) + var(--gap))",
                width: "var(--col)",
              }}
            >
              <div ref={outerRightRef}>
                <PhotoColumn photos={outerRightPhotos} dim />
              </div>
            </div>
          </div>
        </div>

        <div className="content-shell relative z-10 py-16 md:py-24 lg:py-28">
          <Reveal>
            <div className="mx-auto max-w-[420px] text-center xl:max-w-[520px]">
              <span className="label-eyebrow block">Book a session</span>
              <h2 className="headline mt-3.5 text-[clamp(2rem,5vw,3.6rem)] text-foreground-950">
                Ready when <em>you are.</em>
              </h2>
              <p className="mx-auto mt-5 max-w-[380px] text-[15px] leading-relaxed text-foreground-700">
                Pick a time in the calendar, or tell us about a bigger project and we&apos;ll put a
                plan together.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button to="/book" size="lg" arrow>
                  Book a session
                </Button>
                <Button to="/quote" size="lg" variant="secondary" arrow>
                  Ask about a project
                </Button>
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-foreground-600">
                Studio in {siteInfo.city} · {siteInfo.email}
              </p>
            </div>
          </Reveal>

          {/* phones / reduced motion: a plain static strip, no parallax */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden">
            {stripPhotos.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] border border-white/[0.06]"
              >
                <img
                  src={photo.src}
                  srcSet={srcSetFor(photo.src)}
                  sizes="220px"
                  loading="lazy"
                  decoding="async"
                  alt={photo.alt}
                  title="Inside Nile Flow House studio, Zurich"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
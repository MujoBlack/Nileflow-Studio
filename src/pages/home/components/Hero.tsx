import Button from "@/components/base/Button";
import Reveal from "@/components/base/Reveal";
import HeroTourCard from "@/pages/home/components/HeroTourCard";
import { studioImages, srcSetFor } from "@/design/assets";
import { siteInfo } from "@/mocks/site";
import Icon from "@/components/base/Icon";

const counters = [
  { value: "CHF 40", label: "Per hour, from" },
  { value: "5.0", label: "Google rating" },
  { value: "48h", label: "Free cancellation" },
  { value: "30%", label: "Deposit to book" },
];

export default function Hero() {
  return (
    <section id="top" className="relative w-full scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={studioImages.hero}
          srcSet={srcSetFor(studioImages.hero)}
          sizes="100vw"
          fetchPriority="high"
          decoding="async"
          alt="Producer working at the desk in the Nile Flow House attic studio"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-background-50/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-50 via-background-50/45 to-background-50/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background-50/88 via-background-50/30 to-transparent" />
        {/* extra shade behind the headline and copy so the text stays readable on the busy photo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_18%_52%,rgb(14_14_16/0.72),transparent_70%)]" />
      </div>

      <div className="content-shell relative z-10 flex min-h-[620px] w-full flex-col justify-end pb-8 pt-28 md:min-h-[min(100vh,820px)] md:pb-10 md:pt-32">
        <div className="flex flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="w-full lg:max-w-[600px]">
            <Reveal>
              <span className="label-eyebrow block">
                Recording studio · {siteInfo.city}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="headline mt-4 text-[clamp(2.7rem,6.4vw,5.4rem)] text-foreground-950">
                Where sound <em>flows.</em>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-foreground-800 md:text-[17px]">
                A small attic studio for vocals, beats, podcasts and voiceover. You book the room
                by the hour, and an engineer works with you the whole time.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to="/book" size="lg" arrow>
                  Book a session
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  arrow
                  onClick={() => {
                    document
                      .getElementById("work")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Hear our work
                </Button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-6 flex items-center gap-2 text-xs text-foreground-700">
                <Icon name="ri-time-line" className="text-sm" />
                Book online · 30% deposit · free cancellation up to 48 hours before
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={200}
            className="mx-auto w-full sm:max-w-[440px] lg:ml-auto lg:mr-0 lg:w-[500px] lg:max-w-[500px] lg:shrink-0"
          >
            <HeroTourCard />
          </Reveal>
        </div>

        <Reveal delay={360} className="mt-10 md:mt-12">
          <dl className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {counters.map((c) => (
              <div
                key={c.label}
                className="rounded-[10px] border border-white/[0.08] bg-background-50/60 px-4 py-3.5 backdrop-blur-md"
              >
                <dt className="font-display text-xl font-bold leading-none text-foreground-950">
                  {c.value}
                </dt>
                <dd className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                  {c.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
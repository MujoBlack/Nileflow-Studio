import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import StarLattice from "@/components/base/StarLattice";
import { studioImages, srcSetFor } from "@/design/assets";
import { whyUs } from "@/mocks/whyUs";

export default function WhyUs() {
  const [activeId, setActiveId] = useState<string>(whyUs[0].id);
  const rows = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-why-id");
          if (id) setActiveId(id);
        });
      },
      // only the row crossing the middle of the viewport counts as "in view"
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    Object.values(rows.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="why" className="relative scroll-mt-24 overflow-hidden bg-background-50 py-16 md:py-24">
      <StarLattice />
      <div className="content-shell relative z-10">
        <SectionHeading
          label="Why here"
          title={
            <>
              Built for the way artists <em>work</em>
            </>
          }
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <div className="border-b border-white/[0.08]">
              {whyUs.map((item, i) => {
                const isActive = activeId === item.id;
                return (
                  <div
                    key={item.id}
                    data-why-id={item.id}
                    ref={(el) => {
                      rows.current[item.id] = el;
                    }}
                    className="border-t border-white/[0.08] py-6 transition-colors duration-500 md:py-7"
                  >
                    <div className="flex items-start gap-4 md:gap-7">
                      <span
                        className={`font-display text-[13px] leading-none transition-colors duration-500 md:pt-2 ${
                          isActive ? "text-primary-500" : "text-foreground-500"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`headline text-[clamp(1.45rem,2.9vw,2.25rem)] transition-colors duration-500 ${
                            isActive ? "text-primary-500" : "text-foreground-400"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`mt-2.5 max-w-md text-[13px] leading-relaxed transition-colors duration-500 md:text-sm ${
                            isActive ? "text-foreground-700" : "text-foreground-500"
                          }`}
                        >
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-28">
            <div className="photo-tone relative aspect-[4/5] w-full overflow-hidden rounded-card border border-white/[0.08]">
              <img
                src={studioImages.whyDetail}
                srcSet={srcSetFor(studioImages.whyDetail)}
                sizes="(min-width: 1024px) 560px, 100vw"
                loading="lazy"
                decoding="async"
                alt="Condenser microphone with a pop filter in front of a studio monitor and the slatted wall at Nile Flow House"
                title="Desk microphone, Nile Flow House recording studio Zurich"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-foreground-500">
              At the desk
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
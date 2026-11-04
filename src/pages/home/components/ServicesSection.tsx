import { Link } from "react-router-dom";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import FlowPattern from "@/components/base/FlowPattern";
import { services } from "@/mocks/services";
import Icon from "@/components/base/Icon";

export default function ServicesSection() {
  return (
    <section id="project-work" className="relative scroll-mt-24 overflow-hidden bg-background-100/40 py-16 md:py-24">
      <FlowPattern />
      <div className="content-shell relative z-10">
        <SectionHeading
          label="Project work"
          title={
            <>
              Send us <em>your files</em>
            </>
          }
          description="Recorded somewhere else, or need a song finished? Send us your files and we'll reply with a fixed price within a day."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const featured = i === 1;

            return (
              <Reveal key={service.id} delay={i * 60}>
                <div
                  className={`flex h-full flex-col rounded-card border p-6 transition-colors duration-300 ${
                    featured
                      ? "border-transparent bg-primary-500 text-background-50"
                      : "border-white/[0.08] bg-background-100 hover:border-primary-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${
                        featured
                          ? "bg-background-50/12 text-background-50"
                          : "bg-secondary-100 text-primary-500"
                      }`}
                    >
                      <Icon name={service.icon} className="text-lg" />
                    </span>
                    {featured && (
                      <span className="rounded-pill bg-background-50/12 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em]">
                        Most booked
                      </span>
                    )}
                  </div>

                  <h3 className="headline mt-5 text-[1.15rem] leading-[1.05]">{service.name}</h3>
                  <p
                    className={`mt-2.5 text-[13px] leading-relaxed ${
                      featured ? "text-background-50/75" : "text-foreground-700"
                    }`}
                  >
                    {service.blurb}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {service.included.map((line) => (
                      <li key={line} className="flex items-start gap-2.5">
                        <Icon
                          name="ri-check-line"
                          className={`mt-0.5 text-[13px] ${
                            featured ? "text-background-50" : "text-primary-500"
                          }`}
                        />
                        <span
                          className={`text-[12.5px] leading-snug ${
                            featured ? "text-background-50/85" : "text-foreground-700"
                          }`}
                        >
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 font-display text-sm uppercase tracking-[0.06em]">
                    {service.from}
                  </p>

                  <Link
                    to="/quote"
                    className={`mt-3 inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-pill px-4 py-2.5 font-display text-[12px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                      featured
                        ? "bg-background-50 text-foreground-950 hover:bg-background-100"
                        : "border border-white/15 text-foreground-950 hover:bg-background-200"
                    }`}
                  >
                    Get a quote
                    <Icon name="ri-arrow-right-up-line" className="text-sm" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
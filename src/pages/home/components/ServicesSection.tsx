import { Link } from "react-router-dom";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import FlowPattern from "@/components/base/FlowPattern";
import { services } from "@/mocks/services";
import { formatCHF } from "@/lib/booking";
import Icon from "@/components/base/Icon";

const quoteLink = (service: string) => `/quote?service=${encodeURIComponent(service)}`;

export default function ServicesSection() {
  return (
    <section id="packages" className="relative scroll-mt-24 overflow-hidden bg-background-100/40 py-16 md:py-24">
      <FlowPattern />
      <div className="content-shell relative z-10">
        <SectionHeading
          label="Packages"
          title={
            <>
              One price, <em>finished song</em>
            </>
          }
          description="Fixed prices for the projects we do most. Pick a bundle and we'll confirm your studio date, or tell us what you need and we'll send an offer."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const featured = Boolean(service.featured);

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
                          ? "bg-black/10 text-background-50"
                          : "bg-secondary-100 text-primary-500"
                      }`}
                    >
                      <Icon name={service.icon} className="text-lg" />
                    </span>
                    {featured && (
                      <span className="rounded-pill bg-black/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em]">
                        Everything included
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

                  <p className="mt-5 flex items-baseline gap-2">
                    <span className="font-display text-[1.9rem] uppercase leading-none">
                      {formatCHF(service.price)}
                    </span>
                    <span
                      className={`text-[12px] ${featured ? "text-background-50/70" : "text-foreground-600"}`}
                    >
                      {service.unit}
                    </span>
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

                  <Link
                    to={quoteLink(service.name)}
                    className={`mt-6 inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-pill px-4 py-2.5 font-display text-[12px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                      featured
                        ? "bg-background-50 text-foreground-950 hover:bg-background-100"
                        : "border border-white/15 text-foreground-950 hover:bg-background-200"
                    }`}
                  >
                    {service.cta}
                    <Icon name="ri-arrow-right-up-line" className="text-sm" />
                  </Link>
                </div>
              </Reveal>
            );
          })}

          <Reveal delay={services.length * 60}>
            <div className="flex h-full flex-col rounded-card border border-dashed border-white/20 p-6 transition-colors duration-300 hover:border-primary-500/50">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-secondary-100 text-primary-500">
                <Icon name="ri-add-line" className="text-lg" />
              </span>
              <h3 className="headline mt-5 text-[1.15rem] leading-[1.05] text-foreground-950">
                Something else?
              </h3>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-foreground-700">
                Need something that isn't listed here? Describe your project and we'll send you an
                offer within a day.
              </p>
              <p className="mt-5 font-display text-[15px] uppercase tracking-[0.05em] text-primary-500">
                Custom offer
              </p>
              <Link
                to={quoteLink("Something else")}
                className="mt-6 inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-4 py-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
              >
                Describe your project
                <Icon name="ri-arrow-right-up-line" className="text-sm" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

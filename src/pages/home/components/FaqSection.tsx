import { useState } from "react";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import { faq } from "@/mocks/faq";
import { siteInfo } from "@/mocks/site";

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faq[0]?.id ?? null);

  return (
    <section id="faq" className="scroll-mt-24 bg-background-100/40 py-16 md:py-24">
      <div className="content-shell">
        <SectionHeading
          label="FAQ"
          title={
            <>
              Before <em>you book</em>
            </>
          }
          description={`Still unsure? Write to ${siteInfo.email} and we'll answer the same day.`}
        />

        <Reveal className="mt-14">
          <div className="mx-auto max-w-[880px] divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {faq.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={`font-display text-[15px] uppercase tracking-[0.03em] transition-colors duration-200 ${
                        isOpen ? "text-primary-500" : "text-foreground-950"
                      }`}
                    >
                      {item.question}
                    </span>
                    <i
                      className={`shrink-0 text-lg text-foreground-600 transition-transform duration-300 ${
                        isOpen ? "ri-subtract-line rotate-180" : "ri-add-line"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 pr-8 text-sm leading-relaxed text-foreground-700">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
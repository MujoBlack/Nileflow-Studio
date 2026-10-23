import { Link } from "react-router-dom";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import { imageByKey } from "@/design/assets";
import { sessions } from "@/mocks/sessions";

export default function SessionsSection() {
  return (
    <section id="sessions" className="bg-background-50 py-16 md:py-24">
      <div className="content-shell">
        <SectionHeading
          label="Book by the hour"
          title={
            <>
              Come in and <em>record</em>
            </>
          }
          description="Pick what you're coming in for. We'll have the room set up before you arrive."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sessions.map((session, i) => {
            const image = session.asset ? imageByKey[session.asset] : null;
            return (
              <Reveal key={session.id} delay={i * 70}>
                <article className="flex h-full flex-col overflow-hidden rounded-card border border-white/[0.08] bg-background-100 transition-colors duration-300 hover:border-primary-500/40">
                  <div className="photo-tone relative aspect-[4/3] w-full">
                    {image ? (
                      <img
                        src={image}
                        alt={`${session.name} at Nile Flow House`}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-background-200">
                        <span className="flex h-14 w-14 items-center justify-center rounded-md bg-background-100">
                          <i className={`${session.icon} text-2xl text-foreground-500`} aria-hidden="true" />
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-pill bg-secondary-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-secondary-900">
                        {session.accentNote}
                      </span>
                    </div>
                    <h3 className="headline mt-4 text-[1.15rem] leading-[1.05] text-foreground-950">
                      {session.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-700">
                      {session.blurb}
                    </p>
                    <p className="mt-5 font-display text-[15px] uppercase tracking-[0.05em] text-primary-500">
                      from CHF {session.pricePerHour}/hr
                    </p>
                    <Link
                      to={`/book?session=${session.id}`}
                      className="mt-4 inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-4 py-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
                    >
                      Book
                      <i className="ri-arrow-right-up-line text-sm" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
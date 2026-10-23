import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import Button from "@/components/base/Button";
import { scrollToSection } from "@/lib/scroll";
import { imageByKey } from "@/design/assets";
import { team } from "@/mocks/team";

export default function TeamSection() {
  const core = team.filter((m) => m.group === "core");

  return (
    <section id="team" className="scroll-mt-24 bg-background-100/40 py-16 md:py-24">
      <div className="content-shell">
        <SectionHeading
          label="The team"
          title={
            <>
              Who you&apos;ll <em>work with</em>
            </>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {core.map((member, i) => {
            const image = member.asset ? imageByKey[member.asset] : null;
            return (
              <Reveal key={member.id} delay={i * 70}>
                <div className="overflow-hidden rounded-card border border-white/[0.08] bg-background-100">
                  <div className="photo-tone relative aspect-[4/5] w-full">
                    {image ? (
                      <img
                        src={image}
                        alt={`${member.name}, ${member.role} at Nile Flow House`}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-background-200">
                        <span className="flex h-14 w-14 items-center justify-center rounded-md bg-background-100">
                          <i className={`${member.icon} text-2xl text-foreground-500`} aria-hidden="true" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="headline text-[1.05rem] leading-[1.05] text-foreground-950">
                      {member.name}
                    </h3>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-primary-500">
                      {member.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-700">{member.bio}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}

          {/* always-open third slot: invite collaborators */}
          <Reveal delay={core.length * 70}>
            <div className="flex h-full flex-col overflow-hidden rounded-card border border-white/[0.08] bg-background-100">
              <div className="relative flex aspect-[4/5] w-full items-center justify-center bg-background-200">
                <span
                  className="font-display text-[64px] leading-none text-primary-500"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="headline text-[1.05rem] leading-[1.05] text-foreground-950">
                  Work with us
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-700">
                  Singer, rapper or player? We&apos;re always open to new collaborators.
                </p>
                <Button onClick={() => scrollToSection("contact")} arrow className="mt-5 w-full">
                  Get in touch
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
import { BOOKING_SESSIONS, formatCHF } from "@/lib/booking";
import type { BookingDraft } from "@/lib/booking";
import Icon from "@/components/base/Icon";

interface StepProps {
  draft: BookingDraft;
  update: (patch: Partial<BookingDraft>) => void;
  errors: Record<string, string>;
}

export default function SessionStep({ draft, update, errors }: StepProps) {
  return (
    <div>
      <h3 className="headline text-[clamp(1.5rem,3.2vw,2.2rem)] text-foreground-950">
        What are you <em>booking?</em>
      </h3>
      <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-foreground-700">
        One room, four ways to use it. An engineer is included unless you pick dry hire.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BOOKING_SESSIONS.map((session) => {
          const active = draft.sessionId === session.id;
          return (
            <button
              key={session.id}
              type="button"
              onClick={() => update({ sessionId: session.id })}
              aria-pressed={active}
              className={`group flex cursor-pointer flex-col rounded-card border p-5 text-left transition-colors duration-200 ${
                active
                  ? "border-primary-500 bg-primary-500/[0.08]"
                  : "border-white/[0.08] bg-background-100 hover:border-primary-500/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${
                    active ? "bg-primary-500 text-background-50" : "bg-background-200 text-primary-500"
                  }`}
                >
                  <Icon name={session.icon} className="text-lg" />
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                    active ? "border-primary-500 bg-primary-500" : "border-white/20"
                  }`}
                  aria-hidden="true"
                >
                  {active && <Icon name="ri-check-line" className="text-[11px] text-background-50" />}
                </span>
              </div>

              <h4 className="headline mt-4 text-[1.05rem] leading-[1.05] text-foreground-950">
                {session.name}
              </h4>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-700">
                {session.blurb}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
                <span className="text-[11px] uppercase tracking-[0.12em] text-foreground-600">
                  {session.note}
                </span>
                <span className="font-display text-sm uppercase tracking-[0.04em] text-primary-500">
                  {formatCHF(session.rate)}/hr
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {errors.session && (
        <p className="mt-4 text-sm text-accent-500">{errors.session}</p>
      )}
    </div>
  );
}
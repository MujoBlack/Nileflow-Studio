import { BOOKING_EXTRAS, formatCHF } from "@/lib/booking";
import type { BookingDraft } from "@/lib/booking";

interface StepProps {
  draft: BookingDraft;
  update: (patch: Partial<BookingDraft>) => void;
  errors: Record<string, string>;
}

export default function ExtrasStep({ draft, update }: StepProps) {
  const toggle = (id: string) => {
    const next = draft.extras.includes(id)
      ? draft.extras.filter((x) => x !== id)
      : [...draft.extras, id];
    update({ extras: next });
  };

  return (
    <div>
      <h3 className="headline text-[clamp(1.5rem,3.2vw,2.2rem)] text-foreground-950">
        Anything <em>else?</em>
      </h3>
      <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-foreground-700">
        Optional, and you can decide on the day for most of these. Skip through if you&apos;re not
        sure.
      </p>

      <div className="mt-7 flex flex-col gap-2.5">
        {BOOKING_EXTRAS.map((extra) => {
          const checked = draft.extras.includes(extra.id);
          return (
            <label
              key={extra.id}
              className={`flex cursor-pointer items-start gap-4 rounded-card border p-4 transition-colors duration-200 ${
                checked
                  ? "border-primary-500/60 bg-primary-500/[0.07]"
                  : "border-white/[0.08] bg-background-100 hover:border-primary-500/30"
              }`}
            >
              <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  name={extra.id}
                  checked={checked}
                  onChange={() => toggle(extra.id)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-[5px] border border-white/20 bg-transparent checked:border-primary-500 checked:bg-primary-500"
                />
                {checked && (
                  <i
                    className="ri-check-line pointer-events-none absolute text-[13px] text-background-50"
                    aria-hidden="true"
                  />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium text-foreground-950">
                  {extra.name}
                </span>
                {extra.note && (
                  <span className="mt-1 block text-[12.5px] text-foreground-600">{extra.note}</span>
                )}
              </span>

              <span className="shrink-0 text-right">
                <span className="block font-display text-[13px] uppercase tracking-[0.04em] text-primary-500">
                  {extra.price > 0 ? formatCHF(extra.price) : "On request"}
                </span>
                <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.1em] text-foreground-500">
                  {extra.unit}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
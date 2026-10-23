import type { ReactNode } from "react";
import type { BookingDraft } from "@/lib/booking";

interface StepProps {
  draft: BookingDraft;
  update: (patch: Partial<BookingDraft>) => void;
  errors: Record<string, string>;
}

const inputClass =
  "w-full box-border rounded-[10px] border border-white/[0.12] bg-background-100 px-3.5 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 transition-colors duration-200 focus:border-primary-500 focus:outline-none";

function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-1.5 text-[12px] text-accent-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-foreground-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default function DetailsStep({ draft, update, errors }: StepProps) {
  return (
    <div>
      <h3 className="headline text-[clamp(1.5rem,3.2vw,2.2rem)] text-foreground-950">
        Who&apos;s <em>coming in?</em>
      </h3>
      <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-foreground-700">
        We only use these to confirm the session and reach you if the room needs to change.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="bk-name" error={errors.name}>
          <input
            id="bk-name"
            name="name"
            type="text"
            autoComplete="name"
            value={draft.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Camilla Gonzo"
            className={inputClass}
          />
        </Field>

        <Field label="Email" htmlFor="bk-email" error={errors.email}>
          <input
            id="bk-email"
            name="email"
            type="email"
            autoComplete="email"
            value={draft.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Phone" htmlFor="bk-phone" error={errors.phone}>
          <input
            id="bk-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={draft.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+41 79 000 00 00"
            className={inputClass}
          />
        </Field>

        <Field
          label="Artist or project"
          htmlFor="bk-project"
          hint="Optional — helps us prep the session."
        >
          <input
            id="bk-project"
            name="project"
            type="text"
            value={draft.project}
            onChange={(e) => update({ project: e.target.value })}
            placeholder="Second single, working title"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
          First session with us?
        </p>
        <div className="mt-2 flex gap-2">
          {(["yes", "no"] as const).map((value) => {
            const active = draft.firstTime === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => update({ firstTime: value })}
                aria-pressed={active}
                className={`min-w-[92px] cursor-pointer whitespace-nowrap rounded-pill border px-5 py-2.5 text-[12px] uppercase tracking-[0.1em] transition-colors duration-200 ${
                  active
                    ? "border-primary-500 bg-primary-500 text-background-50"
                    : "border-white/[0.12] text-foreground-800 hover:border-primary-500/50"
                }`}
              >
                {value === "yes" ? "Yes" : "No"}
              </button>
            );
          })}
        </div>
        {errors.firstTime && <p className="mt-1.5 text-[12px] text-accent-500">{errors.firstTime}</p>}
      </div>

      <div className="mt-6">
        <Field
          label="Notes for the engineer"
          htmlFor="bk-notes"
          hint="Optional — references, tempo, anything we should know."
        >
          <textarea
            id="bk-notes"
            name="notes"
            rows={3}
            maxLength={500}
            value={draft.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Two verses and a hook, tuned reference ready."
            className={`${inputClass} resize-y`}
          />
        </Field>
      </div>

      <div className="mt-7 rounded-card border border-white/[0.08] bg-background-100 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              name="terms"
              checked={draft.terms}
              onChange={(e) => update({ terms: e.target.checked })}
              className="h-5 w-5 cursor-pointer appearance-none rounded-[5px] border border-white/20 bg-transparent checked:border-primary-500 checked:bg-primary-500"
            />
            {draft.terms && (
              <i
                className="ri-check-line pointer-events-none absolute text-[13px] text-background-50"
                aria-hidden="true"
              />
            )}
          </span>
          <span className="text-[13px] leading-relaxed text-foreground-700">
            I accept the studio terms and the cancellation policy: free cancellation up to 48 hours
            before the start time; inside 48 hours the deposit is kept.
          </span>
        </label>
        {errors.terms && <p className="mt-2 text-[12px] text-accent-500">{errors.terms}</p>}
      </div>
    </div>
  );
}
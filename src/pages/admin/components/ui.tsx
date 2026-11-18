import type { ReactNode } from "react";

export function Card({ title, action, children, className = "" }: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card border border-white/[0.08] bg-background-100 p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({ label, value, note, tone = "default" }: {
  label: string;
  value: string;
  note?: string;
  tone?: "default" | "good" | "bad";
}) {
  const color =
    tone === "good" ? "text-primary-500" : tone === "bad" ? "text-rose-400" : "text-foreground-950";
  return (
    <div className="rounded-card border border-white/[0.08] bg-background-100 p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-foreground-600">{label}</p>
      <p className={`mt-2 font-display text-2xl font-bold leading-none ${color}`}>{value}</p>
      {note && <p className="mt-1.5 text-[11.5px] text-foreground-600">{note}</p>}
    </div>
  );
}

const PILL_TONES = {
  teal: "bg-primary-500/[0.14] text-primary-500",
  red: "bg-rose-400/[0.14] text-rose-400",
  grey: "bg-white/[0.06] text-foreground-700",
  amber: "bg-amber-400/[0.14] text-amber-300",
};

export function Pill({ tone, children }: { tone: keyof typeof PILL_TONES; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-pill px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] ${PILL_TONES[tone]}`}>
      {children}
    </span>
  );
}

export const inputClass =
  "mt-1.5 w-full box-border rounded-[10px] border border-white/[0.12] bg-background-50 px-3 py-2.5 text-[13px] text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none";

export const labelClass = "block text-[10.5px] uppercase tracking-[0.14em] text-foreground-600";

export const primaryButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-4 py-2.5 font-display text-[11.5px] uppercase tracking-[0.12em] text-background-50 transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-40";

export const ghostButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill border border-white/[0.12] px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] text-foreground-700 transition-colors hover:bg-background-200";

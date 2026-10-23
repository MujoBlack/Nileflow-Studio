import { useMemo, useState } from "react";
import {
  LENGTHS,
  formatHour,
  formatRange,
  fromISODate,
  isClosed,
  isPast,
  isStartTaken,
  startTimes,
  toISODate,
} from "@/lib/booking";
import type { BookingDraft } from "@/lib/booking";

interface StepProps {
  draft: BookingDraft;
  update: (patch: Partial<BookingDraft>) => void;
  errors: Record<string, string>;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

export default function DateTimeStep({ draft, update, errors }: StepProps) {
  const today = new Date();
  const [view, setView] = useState(() =>
    startOfMonth(draft.date ? fromISODate(draft.date) : today),
  );

  const cells = useMemo(() => {
    const first = startOfMonth(view);
    // Monday-first grid: getDay() is Sunday-first
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const list: (string | null)[] = [];
    for (let i = 0; i < offset; i += 1) list.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push(toISODate(new Date(view.getFullYear(), view.getMonth(), d, 12, 0, 0, 0)));
    }
    return list;
  }, [view]);

  const times = draft.date ? startTimes(draft.date, draft.hours) : [];
  const freeTimes = times.filter((hour) => !isStartTaken(draft.date, hour, draft.hours));

  const pickDate = (iso: string) => {
    const keep = draft.startHour !== null && startTimes(iso, draft.hours).includes(draft.startHour);
    update({ date: iso, startHour: keep ? draft.startHour : null });
  };

  const pickHours = (hours: number) => {
    if (draft.startHour === null) {
      update({ hours });
      return;
    }
    const stillFits = startTimes(draft.date, hours).includes(draft.startHour);
    update({ hours, startHour: stillFits ? draft.startHour : null });
  };

  return (
    <div>
      <h3 className="headline text-[clamp(1.5rem,3.2vw,2.2rem)] text-foreground-950">
        Pick your <em>slot.</em>
      </h3>
      <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-foreground-700">
        Mon–Fri 10:00–22:00, Sat 10:00–20:00. Closed on Sundays.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* calendar */}
        <div className="rounded-card border border-white/[0.08] bg-background-100 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1, 12))}
              aria-label="Previous month"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-700 transition-colors hover:bg-background-200 hover:text-foreground-950"
            >
              <i className="ri-arrow-left-s-line text-lg" aria-hidden="true" />
            </button>
            <p className="font-display text-[13px] uppercase tracking-[0.14em] text-foreground-950">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1, 12))}
              aria-label="Next month"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-700 transition-colors hover:bg-background-200 hover:text-foreground-950"
            >
              <i className="ri-arrow-right-s-line text-lg" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className="pb-1 text-center text-[10px] uppercase tracking-[0.1em] text-foreground-500"
              >
                {d}
              </span>
            ))}
            {cells.map((iso, i) => {
              if (!iso) return <span key={`pad-${i}`} />;
              const disabled = isPast(iso) || isClosed(iso);
              const selected = draft.date === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => pickDate(iso)}
                  aria-pressed={selected}
                  className={`aspect-square cursor-pointer rounded-[8px] text-[13px] transition-colors duration-150 ${
                    selected
                      ? "bg-primary-500 font-semibold text-background-50"
                      : disabled
                        ? "cursor-not-allowed text-foreground-500/50"
                        : "text-foreground-800 hover:bg-background-200"
                  }`}
                >
                  {Number(iso.slice(-2))}
                </button>
              );
            })}
          </div>
          {errors.date && <p className="mt-3 text-sm text-accent-500">{errors.date}</p>}
        </div>

        {/* times + length */}
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-foreground-600">Start time</p>
          <div className="mt-2.5 grid grid-cols-3 gap-2 lg:grid-cols-2">
            {times.length === 0 && (
              <p className="col-span-full text-[13px] text-foreground-600">
                {draft.date ? "No times left for that length." : "Choose a day first."}
              </p>
            )}
            {times.map((hour) => {
              const taken = !freeTimes.includes(hour);
              const selected = draft.startHour === hour;
              return (
                <button
                  key={hour}
                  type="button"
                  disabled={taken}
                  onClick={() => update({ startHour: hour })}
                  aria-pressed={selected}
                  className={`cursor-pointer rounded-pill border px-2 py-2 text-[12px] transition-colors duration-150 ${
                    selected
                      ? "border-primary-500 bg-primary-500 font-semibold text-background-50"
                      : taken
                        ? "cursor-not-allowed border-white/[0.06] text-foreground-500/40 line-through"
                        : "border-white/[0.12] text-foreground-800 hover:border-primary-500/50"
                  }`}
                >
                  {formatHour(hour)}
                </button>
              );
            })}
          </div>
          {errors.start && <p className="mt-3 text-sm text-accent-500">{errors.start}</p>}

          <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-foreground-600">
            Length
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {LENGTHS.map((len) => {
              const fits = !draft.date || startTimes(draft.date, len).length > 0;
              return (
                <button
                  key={len}
                  type="button"
                  disabled={!fits}
                  onClick={() => pickHours(len)}
                  aria-pressed={draft.hours === len}
                  className={`cursor-pointer whitespace-nowrap rounded-pill border px-3 py-2 text-[12px] transition-colors duration-150 ${
                    draft.hours === len
                      ? "border-primary-500 bg-primary-500 font-semibold text-background-50"
                      : fits
                        ? "border-white/[0.12] text-foreground-800 hover:border-primary-500/50"
                        : "cursor-not-allowed border-white/[0.06] text-foreground-500/40"
                  }`}
                >
                  {len}h
                </button>
              );
            })}
          </div>

          {draft.date && draft.startHour !== null && (
            <div className="mt-5 rounded-[10px] border border-primary-500/25 bg-primary-500/[0.07] px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-foreground-600">Ends at</p>
              <p className="mt-1 font-display text-[15px] text-foreground-950">
                {formatRange(draft.startHour, draft.hours)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
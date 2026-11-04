import { useMemo, useState } from "react";
import { OPEN_HOURS, formatHour, toISODate, weekdayOf } from "@/lib/booking";
import type { StoredBooking } from "@/lib/booking";
import Icon from "@/components/base/Icon";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarPanelProps {
  bookings: StoredBooking[];
}

/** Monday of the week containing `date`. */
function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const shift = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - shift);
  return d;
}

export default function CalendarPanel({ bookings }: CalendarPanelProps) {
  const [offset, setOffset] = useState(0);
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});

  const days = useMemo(() => {
    const monday = mondayOf(new Date());
    monday.setDate(monday.getDate() + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [offset]);

  const todayISO = toISODate(new Date());

  const bookingAt = (iso: string, hour: number) =>
    bookings.find(
      (b) =>
        b.status !== "cancelled" &&
        b.date === iso &&
        hour >= b.startHour &&
        hour < b.startHour + b.hours,
    );

  const toggle = (iso: string, hour: number) => {
    if (bookingAt(iso, hour)) return;
    const key = `${iso}:${hour}`;
    setBlocked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rangeLabel = `${days[0].getDate()}–${days[6].getDate()} ${
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      days[6].getMonth()
    ]
  }`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[13px] uppercase tracking-[0.14em] text-foreground-950">
          {rangeLabel}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOffset((v) => v - 1)}
            aria-label="Previous week"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/[0.12] text-foreground-700 hover:bg-background-100"
          >
            <Icon name="ri-arrow-left-s-line" className="text-lg" />
          </button>
          <button
            type="button"
            onClick={() => setOffset(0)}
            className="cursor-pointer whitespace-nowrap rounded-pill border border-white/[0.12] px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-foreground-700 hover:bg-background-100"
          >
            This week
          </button>
          <button
            type="button"
            onClick={() => setOffset((v) => v + 1)}
            aria-label="Next week"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/[0.12] text-foreground-700 hover:bg-background-100"
          >
            <Icon name="ri-arrow-right-s-line" className="text-lg" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day, i) => {
          const iso = toISODate(day);
          const hours = OPEN_HOURS[weekdayOf(iso)];
          const slots = hours
            ? Array.from({ length: hours.close - hours.open }, (_, k) => hours.open + k)
            : [];

          return (
            <div
              key={iso}
              className={`rounded-card border p-2.5 ${
                iso === todayISO
                  ? "border-primary-500/50 bg-primary-500/[0.05]"
                  : "border-white/[0.08] bg-background-100"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2 px-1 pb-2">
                <span className="text-[10px] uppercase tracking-[0.14em] text-foreground-600">
                  {DAY_NAMES[i]}
                </span>
                <span className="font-display text-[13px] text-foreground-950">
                  {day.getDate()}
                </span>
              </div>

              {!hours ? (
                <p className="px-1 py-3 text-[11px] text-foreground-500">Closed</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {slots.map((hour) => {
                    const booking = bookingAt(iso, hour);
                    const isBlocked = blocked[`${iso}:${hour}`];
                    const isStart = booking && booking.startHour === hour;

                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => toggle(iso, hour)}
                        title={
                          booking
                            ? `${booking.customer.name} · ${booking.sessionName}`
                            : isBlocked
                              ? "Blocked — click to free"
                              : "Click to block"
                        }
                        className={`flex min-h-[26px] cursor-pointer items-center justify-between gap-1 rounded-[5px] px-1.5 text-[10px] transition-colors ${
                          booking
                            ? "cursor-default bg-primary-500/[0.18] text-primary-500"
                            : isBlocked
                              ? "bg-background-300 text-foreground-500 line-through"
                              : "text-foreground-500 hover:bg-background-200"
                        }`}
                      >
                        <span>{formatHour(hour)}</span>
                        {isStart && (
                          <span className="max-w-[52px] truncate text-[9.5px]">
                            {booking?.customer.name.split(" ")[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[11.5px] text-foreground-600">
        <Icon name="ri-information-line" className="text-sm text-primary-500" />
        Click an empty slot to block it. Blocked slots are local to this preview.
      </p>
    </div>
  );
}
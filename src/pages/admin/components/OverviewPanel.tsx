import { formatCHF, fromISODate, formatRange, toISODate } from "@/lib/booking";
import type { StoredBooking } from "@/lib/booking";

interface OverviewPanelProps {
  bookings: StoredBooking[];
  deposits: number;
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-card border border-white/[0.08] bg-background-100 p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-foreground-600">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold leading-none text-foreground-950">
        {value}
      </p>
      {note && <p className="mt-1.5 text-[11.5px] text-foreground-600">{note}</p>}
    </div>
  );
}

export default function OverviewPanel({ bookings, deposits }: OverviewPanelProps) {
  const todayISO = toISODate(new Date());
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const weekEnd = new Date(now.getTime() + 7 * 86_400_000);

  const active = bookings.filter((b) => b.status !== "cancelled");
  const today = active.filter((b) => b.date === todayISO);
  const week = active.filter((b) => {
    const d = fromISODate(b.date);
    return d >= now && d < weekEnd;
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Today" value={String(today.length)} note="sessions booked" />
        <Stat label="This week" value={String(week.length)} note="sessions booked" />
        <Stat label="Deposits this week" value={formatCHF(deposits)} note="30% received" />
        <Stat label="Total bookings" value={String(active.length)} note="all time" />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-white/[0.08] bg-background-100 p-5">
          <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
            Today
          </h2>
          {today.length === 0 ? (
            <p className="mt-4 text-[13px] text-foreground-600">No sessions booked today.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.08]">
              {today.map((b) => (
                <li key={b.ref} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground-950">
                      {b.customer.name}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-foreground-600">
                      {b.sessionName} · {formatRange(b.startHour, b.hours)}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-primary-500">
                    {b.ref}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-card border border-white/[0.08] bg-background-100 p-5">
          <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
            Coming up
          </h2>
          {week.length === 0 ? (
            <p className="mt-4 text-[13px] text-foreground-600">Nothing in the next seven days.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.08]">
              {week.slice(0, 6).map((b) => (
                <li key={b.ref} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground-950">
                      {b.customer.name}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-foreground-600">
                      {b.date} · {formatRange(b.startHour, b.hours)}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11.5px] text-foreground-700">
                    {formatCHF(b.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
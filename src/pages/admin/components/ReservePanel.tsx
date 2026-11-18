import { useState } from "react";
import type { FormEvent } from "react";
import {
  ADMIN_HOLD_PURPOSES,
  BOOKING_SESSIONS,
  OPEN_HOURS,
  createAdminReservation,
  formatHour,
  formatRange,
  isAdminHold,
  isClosed,
  overlapsBooking,
  toISODate,
  weekdayOf,
} from "@/lib/booking";
import type { StoredBooking } from "@/lib/booking";
import type { AdminUser } from "@/pages/admin/adminData";
import Icon from "@/components/base/Icon";
import { Card, Pill, inputClass, labelClass, primaryButton } from "@/pages/admin/components/ui";

interface ReservePanelProps {
  admin: AdminUser;
  bookings: StoredBooking[];
  onChange: () => void;
}

export default function ReservePanel({ admin, bookings, onChange }: ReservePanelProps) {
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [startHour, setStartHour] = useState(14);
  const [hours, setHours] = useState(2);
  const [purpose, setPurpose] = useState(ADMIN_HOLD_PURPOSES[0]);
  const [sessionId, setSessionId] = useState(BOOKING_SESSIONS[0].id);
  const [guest, setGuest] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const open = OPEN_HOURS[weekdayOf(date)];
  const startOptions = open
    ? Array.from({ length: open.close - open.open }, (_, i) => open.open + i)
    : [];
  const clash = open ? overlapsBooking(date, startHour, hours) : undefined;
  const tooLate = open ? startHour + hours > open.close : false;

  const holds = bookings
    .filter((b) => isAdminHold(b) && b.status !== "cancelled")
    .sort((a, b) => (a.date + a.startHour > b.date + b.startHour ? 1 : -1));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!open || clash || tooLate) return;
    const hold = createAdminReservation({
      adminName: admin.name,
      adminEmail: admin.email,
      purpose,
      sessionId,
      date,
      startHour,
      hours,
      guest,
      notes,
    });
    setMessage({ ok: true, text: `Reserved ${hold.date}, ${formatRange(hold.startHour, hold.hours)}. Ref ${hold.ref}. No payment taken.` });
    setGuest("");
    setNotes("");
    onChange();
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card title="Reserve the studio">
        <p className="-mt-1 mb-5 max-w-[520px] text-[12.5px] leading-relaxed text-foreground-700">
          Hold the room for yourself or a client without paying. The slot disappears from public
          booking straight away and shows on the calendar as an admin hold.
        </p>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <span className={labelClass}>What is it for?</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ADMIN_HOLD_PURPOSES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  aria-pressed={purpose === p}
                  className={`cursor-pointer rounded-pill border px-3 py-1.5 text-[12px] transition-colors ${
                    purpose === p
                      ? "border-primary-500 bg-primary-500 text-background-50"
                      : "border-white/[0.12] text-foreground-700 hover:bg-background-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className={labelClass}>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </label>

          <label className="block">
            <span className={labelClass}>Room setup</span>
            <select value={sessionId} onChange={(e) => setSessionId(e.target.value)} className={inputClass}>
              {BOOKING_SESSIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Start</span>
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              disabled={!open}
              className={inputClass}
            >
              {startOptions.map((h) => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Length</span>
            <select value={hours} onChange={(e) => setHours(Number(e.target.value))} className={inputClass}>
              {[1, 2, 3, 4, 6, 8, 12].map((h) => (
                <option key={h} value={h}>{h} {h === 1 ? "hour" : "hours"}</option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className={labelClass}>Who's coming (optional)</span>
            <input
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              placeholder={`Leave empty for ${admin.name}`}
              className={inputClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className={labelClass}>Note for the team</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Writing camp with Jenva, leave the desk set up"
              className={inputClass}
            />
          </label>

          <div className="sm:col-span-2">
            {isClosed(date) && (
              <p className="mb-3 flex items-center gap-2 text-[12px] text-rose-400">
                <Icon name="ri-alarm-warning-line" className="text-sm" /> The studio is closed that day.
              </p>
            )}
            {clash && (
              <p className="mb-3 flex items-center gap-2 text-[12px] text-rose-400">
                <Icon name="ri-alarm-warning-line" className="text-sm" />
                Clashes with {clash.customer.name} ({formatRange(clash.startHour, clash.hours)}, {clash.ref}).
              </p>
            )}
            {tooLate && !clash && (
              <p className="mb-3 flex items-center gap-2 text-[12px] text-rose-400">
                <Icon name="ri-alarm-warning-line" className="text-sm" /> That runs past closing time.
              </p>
            )}
            {message && (
              <p className="mb-3 flex items-center gap-2 text-[12px] text-primary-500">
                <Icon name="ri-check-line" className="text-sm" /> {message.text}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={!open || Boolean(clash) || tooLate} className={primaryButton}>
                <Icon name="ri-calendar-event-line" className="text-sm" />
                Reserve, no payment
              </button>
              <span className="text-[11.5px] text-foreground-600">Logged as reserved by {admin.name}</span>
            </div>
          </div>
        </form>
      </Card>

      <Card title={`Admin holds (${holds.length})`}>
        {holds.length === 0 ? (
          <p className="text-[13px] text-foreground-600">No admin holds yet.</p>
        ) : (
          <ul className="divide-y divide-white/[0.08]">
            {holds.map((h) => (
              <li key={h.ref} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-foreground-950">{h.customer.project}</p>
                  <p className="mt-0.5 text-[11.5px] text-foreground-600">
                    {h.date} · {formatRange(h.startHour, h.hours)} · {h.customer.name}
                  </p>
                  {h.customer.notes && (
                    <p className="mt-1 truncate text-[11.5px] text-foreground-500">{h.customer.notes}</p>
                  )}
                </div>
                <Pill tone="amber">CHF 0</Pill>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

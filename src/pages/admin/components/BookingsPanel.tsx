import { useState } from "react";
import { formatCHF, formatRange, updateBooking } from "@/lib/booking";
import type { StoredBooking } from "@/lib/booking";

const STATUSES = ["confirmed", "deposit paid", "completed", "cancelled"];

interface BookingsPanelProps {
  bookings: StoredBooking[];
  onChange: () => void;
}

export default function BookingsPanel({ bookings, onChange }: BookingsPanelProps) {
  const [filter, setFilter] = useState("all");
  const [openRef, setOpenRef] = useState<string | null>(null);

  const visible =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const setStatus = (ref: string, status: string) => {
    updateBooking(ref, { status });
    onChange();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`cursor-pointer whitespace-nowrap rounded-pill border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] capitalize transition-colors ${
              filter === value
                ? "border-primary-500 bg-primary-500 text-background-50"
                : "border-white/[0.12] text-foreground-700 hover:bg-background-100"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-card border border-white/[0.08] bg-background-100 p-8 text-center">
          <p className="text-[13px] text-foreground-600">No bookings with that status yet.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-card border border-white/[0.08]">
          <div className="hidden grid-cols-[90px_1fr_1fr_110px_120px] gap-4 border-b border-white/[0.08] bg-background-100 px-4 py-2.5 md:grid">
            {["Ref", "Customer", "Session", "Total", "Status"].map((h) => (
              <span key={h} className="text-[10px] uppercase tracking-[0.14em] text-foreground-600">
                {h}
              </span>
            ))}
          </div>

          {visible.map((booking) => {
            const expanded = openRef === booking.ref;
            return (
              <div key={booking.ref} className="border-b border-white/[0.08] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenRef(expanded ? null : booking.ref)}
                  className="grid w-full cursor-pointer grid-cols-2 gap-x-4 gap-y-1 px-4 py-3 text-left transition-colors hover:bg-background-100 md:grid-cols-[90px_1fr_1fr_110px_120px] md:items-center"
                >
                  <span className="text-[12px] font-medium text-primary-500">{booking.ref}</span>
                  <span className="truncate text-[12.5px] text-foreground-950">
                    {booking.customer.name}
                  </span>
                  <span className="truncate text-[12px] text-foreground-700">
                    {booking.sessionName}
                  </span>
                  <span className="text-[12px] text-foreground-900">
                    {formatCHF(booking.total)}
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        booking.status === "cancelled"
                          ? "bg-accent-500"
                          : booking.status === "completed"
                            ? "bg-foreground-500"
                            : "bg-primary-500"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[11.5px] capitalize text-foreground-800">
                      {booking.status}
                    </span>
                  </span>
                </button>

                {expanded && (
                  <div className="bg-background-100/60 px-4 py-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <dl className="space-y-1.5 text-[12px]">
                        <div className="flex justify-between gap-3">
                          <dt className="text-foreground-600">When</dt>
                          <dd className="text-foreground-900">
                            {booking.date} · {formatRange(booking.startHour, booking.hours)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-foreground-600">Deposit</dt>
                          <dd className="text-foreground-900">{formatCHF(booking.deposit)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-foreground-600">Method</dt>
                          <dd className="text-foreground-900 capitalize">
                            {booking.paymentMethod}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-foreground-600">Email</dt>
                          <dd className="truncate text-foreground-900">{booking.customer.email}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-foreground-600">Phone</dt>
                          <dd className="text-foreground-900">{booking.customer.phone}</dd>
                        </div>
                      </dl>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-foreground-600">
                          Notes
                        </p>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-foreground-700">
                          {booking.customer.notes || "—"}
                        </p>
                        <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-foreground-600">
                          Status
                        </p>
                        <select
                          value={booking.status}
                          onChange={(e) => setStatus(booking.ref, e.target.value)}
                          className="mt-1.5 w-full cursor-pointer rounded-[8px] border border-white/[0.12] bg-background-100 px-2.5 py-2 text-[12px] capitalize text-foreground-950 focus:border-primary-500 focus:outline-none"
                        >
                          {[...new Set([booking.status, ...STATUSES])].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
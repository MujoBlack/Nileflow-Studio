import { useState } from "react";
import { BOOKING_EXTRAS, BOOKING_SESSIONS, formatCHF } from "@/lib/booking";
import { openingHours } from "@/mocks/site";

interface SettingsPanelProps {
  section: "quotes" | "prices" | "settings";
}

export default function SettingsPanel({ section }: SettingsPanelProps) {
  const [rates, setRates] = useState(() =>
    BOOKING_SESSIONS.map((s) => ({ id: s.id, name: s.name, rate: s.rate })),
  );
  const [extras, setExtras] = useState(() =>
    BOOKING_EXTRAS.map((e) => ({ id: e.id, name: e.name, price: e.price })),
  );
  const [deposit, setDeposit] = useState(30);
  const [cancelHours, setCancelHours] = useState(48);
  const [hours, setHours] = useState(() =>
    openingHours.map((h) => ({ day: h.day, hours: h.hours })),
  );
  const [saved, setSaved] = useState(false);

  const flash = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  if (section === "quotes") {
    return (
      <div className="rounded-card border border-white/[0.08] bg-background-100 p-6">
        <h2 className="headline text-[1.2rem] text-foreground-950">
          Quote requests <em>by email.</em>
        </h2>
        <p className="mt-3 max-w-[520px] text-[13px] leading-relaxed text-foreground-700">
          Every request sent from the quote panel is stored by the site&apos;s Forms feature and
          emailed to the studio. Open Forms to read and reply to them.
        </p>
        <div className="mt-5 rounded-[10px] border border-white/[0.08] bg-background-50 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-foreground-600">
            Form endpoint
          </p>
          <p className="mt-1 break-all font-mono text-[11.5px] text-foreground-700">
            readdy.ai/api/form/dbdmdtr0h265e6qa8s4g
          </p>
        </div>
        <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-foreground-500">
          <i className="ri-information-line mt-0.5 text-sm" aria-hidden="true" />
          Requests are not mirrored here — a dashboard list would need Readdy Backend or SaaS
          Supabase connected.
        </p>
      </div>
    );
  }

  if (section === "prices") {
    return (
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-white/[0.08] bg-background-100 p-5">
          <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
            Session rates (per hour)
          </h2>
          <div className="mt-4 space-y-2.5">
            {rates.map((rate, i) => (
              <label key={rate.id} className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-foreground-800">{rate.name}</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[11px] text-foreground-600">CHF</span>
                  <input
                    type="number"
                    min={0}
                    value={rate.rate}
                    onChange={(e) =>
                      setRates((prev) =>
                        prev.map((r, idx) =>
                          idx === i ? { ...r, rate: Number(e.target.value) } : r,
                        ),
                      )
                    }
                    className="w-20 rounded-[8px] border border-white/[0.12] bg-background-50 px-2 py-1.5 text-right text-[13px] text-foreground-950 focus:border-primary-500 focus:outline-none"
                  />
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-white/[0.08] bg-background-100 p-5">
          <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
            Extras
          </h2>
          <div className="mt-4 space-y-2.5">
            {extras.map((extra, i) => (
              <label key={extra.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-[13px] text-foreground-800">
                  {extra.name}
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[11px] text-foreground-600">CHF</span>
                  <input
                    type="number"
                    min={0}
                    value={extra.price}
                    onChange={(e) =>
                      setExtras((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, price: Number(e.target.value) } : x,
                        ),
                      )
                    }
                    className="w-20 rounded-[8px] border border-white/[0.12] bg-background-50 px-2 py-1.5 text-right text-[13px] text-foreground-950 focus:border-primary-500 focus:outline-none"
                  />
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={flash}
            className="cursor-pointer whitespace-nowrap rounded-pill bg-primary-500 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-background-50 transition-colors hover:bg-primary-400"
          >
            Save prices
          </button>
          {saved && (
            <span className="text-[12px] text-primary-500">Saved for this preview session.</span>
          )}
          <span className="text-[11.5px] text-foreground-500">
            e.g. {formatCHF(rates[0]?.rate ?? 0)}/hr vocal ·{" "}
            {formatCHF(extras[0]?.price ?? 0)} rough mix
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-card border border-white/[0.08] bg-background-100 p-5">
        <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
          Opening hours
        </h2>
        <div className="mt-4 space-y-2.5">
          {hours.map((row, i) => (
            <label key={row.day} className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-foreground-800">{row.day}</span>
              <input
                type="text"
                value={row.hours}
                onChange={(e) =>
                  setHours((prev) =>
                    prev.map((h, idx) => (idx === i ? { ...h, hours: e.target.value } : h)),
                  )
                }
                className="w-36 rounded-[8px] border border-white/[0.12] bg-background-50 px-2.5 py-1.5 text-right text-[12.5px] text-foreground-950 focus:border-primary-500 focus:outline-none"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-white/[0.08] bg-background-100 p-5">
        <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
          Booking rules
        </h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-foreground-800">Deposit taken</span>
            <span className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={100}
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-20 rounded-[8px] border border-white/[0.12] bg-background-50 px-2 py-1.5 text-right text-[13px] text-foreground-950 focus:border-primary-500 focus:outline-none"
              />
              <span className="text-[11px] text-foreground-600">%</span>
            </span>
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-foreground-800">Free cancellation</span>
            <span className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                value={cancelHours}
                onChange={(e) => setCancelHours(Number(e.target.value))}
                className="w-20 rounded-[8px] border border-white/[0.12] bg-background-50 px-2 py-1.5 text-right text-[13px] text-foreground-950 focus:border-primary-500 focus:outline-none"
              />
              <span className="text-[11px] text-foreground-600">h before</span>
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={flash}
          className="mt-5 cursor-pointer whitespace-nowrap rounded-pill bg-primary-500 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-background-50 transition-colors hover:bg-primary-400"
        >
          Save settings
        </button>
        {saved && (
          <span className="ml-3 text-[12px] text-primary-500">Saved for this preview session.</span>
        )}
      </div>
    </div>
  );
}
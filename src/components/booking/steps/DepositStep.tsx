import { useState } from "react";
import {
  findSession,
  formatCHF,
  formatRange,
  priceBreakdown,
} from "@/lib/booking";
import type { BookingDraft } from "@/lib/booking";
import { prettyDate } from "@/components/booking/BookingSummary";

interface DepositStepProps {
  draft: BookingDraft;
  processing: boolean;
  total: number;
  deposit: number;
  onPay: (method: string) => void;
}

const METHODS = [
  {
    id: "card",
    label: "Card",
    note: "Visa, Mastercard, American Express",
    icon: "ri-bank-card-line",
  },
  {
    id: "twint",
    label: "TWINT",
    note: "Pay with the TWINT app",
    icon: "ri-smartphone-line",
  },
];

/**
 * Payment is simulated for now. When Stripe is connected this component is the
 * only thing that has to change — it already receives the amount to charge.
 */
export default function DepositStep({ draft, processing, total, deposit, onPay }: DepositStepProps) {
  const [method, setMethod] = useState("card");
  const session = findSession(draft.sessionId);
  const price = priceBreakdown(session.rate, draft.hours, draft.extras);

  return (
    <div>
      <h3 className="headline text-[clamp(1.5rem,3.2vw,2.2rem)] text-foreground-950">
        Check and <em>confirm.</em>
      </h3>
      <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-foreground-700">
        We hold the room with a 30% deposit. The rest is paid at the studio.
      </p>

      <div className="mt-7 overflow-hidden rounded-card border border-white/[0.08]">
        <dl className="divide-y divide-white/[0.08]">
          <div className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">Session</dt>
            <dd className="text-sm text-foreground-950">{session.name}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">When</dt>
            <dd className="text-sm text-foreground-950">
              {prettyDate(draft.date)}
              {draft.startHour !== null && ` · ${formatRange(draft.startHour, draft.hours)}`}
            </dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">Name</dt>
            <dd className="text-sm text-foreground-950">
              {draft.name || "—"}
              {draft.project && (
                <span className="block text-[12px] text-foreground-600">{draft.project}</span>
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">Contact</dt>
            <dd className="text-sm text-foreground-950">
              {draft.email || "—"}
              <span className="block text-[12px] text-foreground-600">{draft.phone}</span>
            </dd>
          </div>
        </dl>

        <div className="border-t border-white/[0.08] bg-background-100 px-4 py-4">
          <div className="flex justify-between gap-4 text-[12.5px]">
            <span className="text-foreground-600">
              {draft.hours}h × {formatCHF(session.rate)}
            </span>
            <span className="text-foreground-900">{formatCHF(price.base)}</span>
          </div>
          {price.extras > 0 && (
            <div className="mt-1.5 flex justify-between gap-4 text-[12.5px]">
              <span className="text-foreground-600">Extras</span>
              <span className="text-foreground-900">{formatCHF(price.extras)}</span>
            </div>
          )}
          <div className="mt-3 flex items-end justify-between gap-4 border-t border-white/[0.08] pt-3">
            <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
              Total
            </span>
            <span className="font-display text-lg font-bold text-foreground-950">
              {formatCHF(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
          Deposit due now — {formatCHF(deposit)}
        </p>
        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {METHODS.map((option) => {
            const active = method === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
                aria-pressed={active}
                className={`flex cursor-pointer items-center gap-3 rounded-card border p-4 text-left transition-colors duration-200 ${
                  active
                    ? "border-primary-500 bg-primary-500/[0.08]"
                    : "border-white/[0.08] bg-background-100 hover:border-primary-500/40"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${
                    active ? "bg-primary-500 text-background-50" : "bg-background-200 text-primary-500"
                  }`}
                >
                  <i className={`${option.icon} text-lg`} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-foreground-950">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-foreground-600">
                    {option.note}
                  </span>
                </span>
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    active ? "border-primary-500 bg-primary-500" : "border-white/20"
                  }`}
                  aria-hidden="true"
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-background-50" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-card border border-white/[0.08] bg-background-100 p-4">
        <p className="flex items-start gap-2.5 text-[12px] leading-relaxed text-foreground-600">
          <i className="ri-lock-2-line mt-0.5 text-sm text-primary-500" aria-hidden="true" />
          Payments are handled by Stripe with card and TWINT. Nothing is charged in this preview.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onPay(method)}
        disabled={processing}
        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-4 font-display text-[13px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {processing ? (
          <>
            <i className="ri-loader-4-line animate-spin text-base" aria-hidden="true" />
            Processing…
          </>
        ) : (
          <>
            Pay {formatCHF(deposit)} deposit
            <i className="ri-arrow-right-up-line text-base" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}
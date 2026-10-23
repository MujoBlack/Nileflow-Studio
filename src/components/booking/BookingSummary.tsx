import {
  findExtra,
  findSession,
  formatCHF,
  formatRange,
  fromISODate,
  priceBreakdown,
} from "@/lib/booking";
import type { BookingDraft } from "@/lib/booking";
import Icon from "@/components/base/Icon";

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function prettyDate(iso: string): string {
  if (!iso) return "Not chosen";
  const d = fromISODate(iso);
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    d.getDay()
  ];
  return `${weekday} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export default function BookingSummary({
  draft,
  compact = false,
}: {
  draft: BookingDraft;
  compact?: boolean;
}) {
  const session = findSession(draft.sessionId);
  const price = priceBreakdown(session.rate, draft.hours, draft.extras);
  const chosenExtras = draft.extras
    .map((id) => findExtra(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <div className="rounded-card border border-white/[0.08] bg-background-100 p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-foreground-600">Your booking</p>

      <p className="mt-3 font-display text-[15px] leading-tight text-foreground-950">
        {session.name}
      </p>
      <p className="mt-1 text-[12px] text-foreground-600">
        {formatCHF(session.rate)} / hour · {session.note}
      </p>

      <dl className="mt-4 space-y-2 border-t border-white/[0.08] pt-4 text-[12.5px]">
        <div className="flex justify-between gap-3">
          <dt className="text-foreground-600">Day</dt>
          <dd className="text-right text-foreground-900">
            {draft.date ? prettyDate(draft.date) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-foreground-600">Time</dt>
          <dd className="text-right text-foreground-900">
            {draft.startHour !== null ? formatRange(draft.startHour, draft.hours) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-foreground-600">Length</dt>
          <dd className="text-right text-foreground-900">{draft.hours} hours</dd>
        </div>
      </dl>

      {!compact && chosenExtras.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-white/[0.08] pt-4">
          {chosenExtras.map((extra) => (
            <li key={extra.id} className="flex justify-between gap-3 text-[12px]">
              <span className="text-foreground-700">{extra.name}</span>
              <span className="shrink-0 text-foreground-900">
                {extra.price > 0 ? formatCHF(extra.price) : "—"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-1.5 border-t border-white/[0.08] pt-4 text-[12.5px]">
        <div className="flex justify-between gap-3">
          <dt className="text-foreground-600">
            {draft.hours}h × {formatCHF(session.rate)}
          </dt>
          <dd className="text-foreground-900">{formatCHF(price.base)}</dd>
        </div>
        {price.extras > 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-foreground-600">Extras</dt>
            <dd className="text-foreground-900">{formatCHF(price.extras)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-3 border-t border-white/[0.08] pt-2.5">
          <dt className="font-medium text-foreground-950">Total</dt>
          <dd className="font-display text-[15px] font-bold text-foreground-950">
            {formatCHF(price.total)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-primary-500">Deposit due now (30%)</dt>
          <dd className="text-primary-500">{formatCHF(price.deposit)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-foreground-600">Pay at the studio (70%)</dt>
          <dd className="text-foreground-600">{formatCHF(price.onSite)}</dd>
        </div>
      </dl>

      <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-foreground-500">
        <Icon name="ri-shield-check-line" className="mt-0.5 text-sm text-primary-500" />
        Free cancellation up to 48 hours before the start time.
      </p>
    </div>
  );
}
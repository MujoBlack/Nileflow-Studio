import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import SessionStep from "@/components/booking/steps/SessionStep";
import DateTimeStep from "@/components/booking/steps/DateTimeStep";
import ExtrasStep from "@/components/booking/steps/ExtrasStep";
import DetailsStep from "@/components/booking/steps/DetailsStep";
import DepositStep from "@/components/booking/steps/DepositStep";
import BookingSuccess from "@/components/booking/BookingSuccess";
import BookingSummary from "@/components/booking/BookingSummary";
import {
  BOOKING_SESSIONS,
  createBooking,
  emptyDraft,
  findSession,
  priceBreakdown,
} from "@/lib/booking";
import type { BookingDraft, StoredBooking } from "@/lib/booking";
import Icon from "@/components/base/Icon";

const STEPS = ["Session", "Date & time", "Extras", "Details", "Deposit"];

interface BookingPanelProps {
  open: boolean;
  initialSessionId?: string | null;
  onClose: () => void;
}

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function phoneOk(value: string) {
  return value.replace(/[^\d]/g, "").length >= 9;
}

export default function BookingPanel({ open, initialSessionId, onClose }: BookingPanelProps) {
  const [draft, setDraft] = useState<BookingDraft>(() =>
    emptyDraft(
      initialSessionId && BOOKING_SESSIONS.some((s) => s.id === initialSessionId)
        ? initialSessionId
        : BOOKING_SESSIONS[0].id,
    ),
  );
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<StoredBooking | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  // a session passed in the URL preselects step 1
  useEffect(() => {
    if (!open) return;
    if (initialSessionId && BOOKING_SESSIONS.some((s) => s.id === initialSessionId)) {
      setDraft((prev) => ({ ...prev, sessionId: initialSessionId }));
    }
  }, [open, initialSessionId]);

  /* scroll lock + focus trap + Esc, all restored on close */
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusFirst = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 30);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const root = panelRef.current;
      if (!root) return;

      const nodes = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el.getAttribute("type") === "radio");

      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.clearTimeout(focusFirst);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown, true);
      previousActive?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const session = findSession(draft.sessionId);
  const price = priceBreakdown(session.rate, draft.hours, draft.extras);

  const validate = (current: number): boolean => {
    const next: Record<string, string> = {};

    if (current === 1 && !draft.sessionId) {
      next.session = "Pick a session to continue.";
    }

    if (current === 2) {
      if (!draft.date) next.date = "Choose a day.";
      if (!draft.startHour) next.start = "Choose a start time.";
    }

    if (current === 4) {
      if (draft.name.trim().length < 2) next.name = "Please enter your full name.";
      if (!emailOk(draft.email)) next.email = "That email doesn't look right.";
      if (!phoneOk(draft.phone)) next.phone = "Add a phone number we can reach you on.";
      if (!draft.firstTime) next.firstTime = "Let us know so we can prep the room.";
      if (!draft.terms) next.terms = "Please accept the studio terms to continue.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, 5));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const pay = (method: string) => {
    setProcessing(true);
    window.setTimeout(() => {
      const booking = createBooking(draft, method);
      setProcessing(false);
      setDone(booking);
    }, 1700);
  };

  const restart = () => {
    setDraft(emptyDraft(BOOKING_SESSIONS[0].id));
    setStep(1);
    setErrors({});
    setDone(null);
    setSummaryOpen(false);
  };

  let body: ReactNode = null;

  if (step === 1) {
    body = <SessionStep draft={draft} update={update} errors={errors} />;
  } else if (step === 2) {
    body = <DateTimeStep draft={draft} update={update} errors={errors} />;
  } else if (step === 3) {
    body = <ExtrasStep draft={draft} update={update} errors={errors} />;
  } else if (step === 4) {
    body = <DetailsStep draft={draft} update={update} errors={errors} />;
  } else {
    body = (
      <DepositStep
        draft={draft}
        processing={processing}
        total={price.total}
        deposit={price.deposit}
        onPay={pay}
      />
    );
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Book a session"
      tabIndex={-1}
      className="panel-enter fixed inset-0 z-[100] overflow-y-auto bg-background-50 outline-none"
    >
      <div className="min-h-full pb-28 lg:pb-0">
        {/* header */}
        <div className="sticky top-0 z-30 border-b border-white/[0.08] bg-background-50/95 backdrop-blur-xl">
          <div className="content-shell py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-primary-500">
                  {done ? "Confirmed" : `Step ${step} of 5`}
                </p>
                <h2 className="headline mt-1 truncate text-[clamp(1.1rem,2.4vw,1.5rem)] text-foreground-950">
                  {done ? "Booked" : STEPS[step - 1]}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close the booking panel"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground-700 transition-colors duration-200 hover:bg-background-100 hover:text-foreground-950"
              >
                <Icon name="ri-close-line" className="text-xl" />
              </button>
            </div>

            {!done && (
              <div className="mt-4">
                <div className="h-[2px] w-full overflow-hidden rounded-full bg-background-200">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-[width] duration-500"
                    style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                <ol className="mt-2.5 hidden flex-wrap items-center gap-x-5 gap-y-1 sm:flex">
                  {STEPS.map((label, i) => (
                    <li
                      key={label}
                      className={`text-[11px] uppercase tracking-[0.14em] transition-colors ${
                        i + 1 === step
                          ? "text-primary-500"
                          : i + 1 < step
                            ? "text-foreground-600"
                            : "text-foreground-500"
                      }`}
                    >
                      {label}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* body */}
        <div className="content-shell py-8 md:py-12">
          {done ? (
            <BookingSuccess booking={done} onDone={onClose} onRestart={restart} />
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
              <div className="min-w-0">
                {body}

                {step >= 2 && (
                  <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill border border-white/15 px-5 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-foreground-950 transition-colors duration-200 hover:bg-background-100"
                    >
                      <Icon name="ri-arrow-left-line" className="text-sm" />
                      Back
                    </button>

                    {step < 5 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
                      >
                        Continue
                        <Icon name="ri-arrow-right-line" className="text-sm" />
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div className="mt-10 flex justify-end border-t border-white/[0.08] pt-6">
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
                    >
                      Continue
                      <Icon name="ri-arrow-right-line" className="text-sm" />
                    </button>
                  </div>
                )}
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-32">
                  <BookingSummary draft={draft} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* phones: collapsible summary bar pinned to the bottom */}
      {!done && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.1] bg-background-50/95 backdrop-blur-xl lg:hidden">
          {summaryOpen && (
            <div className="content-shell max-h-[46vh] overflow-y-auto py-4">
              <BookingSummary draft={draft} />
            </div>
          )}
          <div className="content-shell flex items-center gap-3 py-3">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="flex flex-1 cursor-pointer items-center justify-between gap-3 text-left"
              aria-expanded={summaryOpen}
            >
              <span>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-foreground-600">
                  Total
                </span>
                <span className="block font-display text-lg font-bold text-foreground-950">
                  {price.total > 0 ? `CHF ${price.total}` : "CHF —"}
                </span>
              </span>
              <Icon
                name={summaryOpen ? "ri-arrow-down-s-line" : "ri-arrow-up-s-line"}
                className="text-lg text-foreground-600"
              />
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-pill bg-primary-500 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-background-50"
              >
                Continue
              </button>
            ) : (
              <span className="whitespace-nowrap rounded-pill bg-primary-500/15 px-4 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-primary-500">
                Pay below
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
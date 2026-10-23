import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import SiteLayout from "@/components/feature/SiteLayout";
import DateTimeStep from "@/components/booking/steps/DateTimeStep";
import { prettyDate } from "@/components/booking/BookingSummary";
import {
  CANCELLATION_HOURS,
  canChangeOnline,
  findBookingByRef,
  findSession,
  formatCHF,
  formatRange,
  updateBooking,
} from "@/lib/booking";
import type { BookingDraft, StoredBooking } from "@/lib/booking";
import { siteInfo } from "@/mocks/site";

function toDraft(booking: StoredBooking): BookingDraft {
  return {
    sessionId: booking.sessionId,
    date: booking.date,
    startHour: booking.startHour,
    hours: booking.hours,
    extras: booking.extras,
    name: booking.customer.name,
    email: booking.customer.email,
    phone: booking.customer.phone,
    project: booking.customer.project,
    firstTime: booking.customer.firstTime === "yes" ? "yes" : "no",
    notes: booking.customer.notes,
    terms: true,
  };
}

export default function ManageBooking() {
  const { ref = "" } = useParams();
  const [params] = useSearchParams();
  const key = params.get("key") ?? "";

  const [booking, setBooking] = useState<StoredBooking | undefined>(() =>
    findBookingByRef(ref),
  );
  const [mode, setMode] = useState<"view" | "move" | "cancel" | "cancelled" | "moved">("view");
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const notFound = !booking || (booking.key !== key && key !== "");
  const wrongKey = Boolean(booking) && booking?.key !== key;
  const session = booking ? findSession(booking.sessionId) : null;
  const editable = booking ? canChangeOnline(booking) : false;

  const startMove = () => {
    if (!booking) return;
    setDraft(toDraft(booking));
    setMode("move");
  };

  const confirmMove = () => {
    if (!booking || !draft || draft.startHour === null || !draft.date) return;
    updateBooking(booking.ref, {
      date: draft.date,
      startHour: draft.startHour,
      hours: draft.hours,
    });
    setBooking(findBookingByRef(booking.ref));
    setMode("moved");
  };

  const confirmCancel = () => {
    if (!booking) return;
    updateBooking(booking.ref, { status: "cancelled" });
    setBooking(findBookingByRef(booking.ref));
    setMode("cancelled");
  };

  const whatsappUrl = `https://wa.me/${siteInfo.whatsappHref}?text=${encodeURIComponent(
    `Hi Nile Flow House, I need to change booking ${ref}.`,
  )}`;

  return (
    <SiteLayout hideMobileBook>
      <section className="bg-background-50 pb-20 pt-24 md:pt-32">
        <div className="content-shell">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-foreground-600 transition-colors hover:text-primary-500"
          >
            <i className="ri-arrow-left-line text-sm" aria-hidden="true" />
            Back to the site
          </Link>

          {notFound || wrongKey ? (
            <div className="mx-auto mt-10 max-w-[560px] rounded-card border border-white/[0.08] bg-background-100 p-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-200 text-foreground-600">
                <i className="ri-link-unlink text-2xl" aria-hidden="true" />
              </span>
              <h1 className="headline mt-5 text-[clamp(1.6rem,3.4vw,2.2rem)] text-foreground-950">
                We can&apos;t find <em>that booking.</em>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-foreground-700">
                The link may have expired, or it was opened on a different device. Write to{" "}
                <a
                  href={`mailto:${siteInfo.email}`}
                  className="text-primary-500 underline underline-offset-2"
                >
                  {siteInfo.email}
                </a>{" "}
                with your booking reference and we&apos;ll sort it out.
              </p>
            </div>
          ) : (
            booking && (
              <div className="mx-auto mt-8 max-w-[760px]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-primary-500">
                  Booking {booking.ref}
                </p>
                <h1 className="headline mt-3 text-[clamp(2rem,5vw,3.4rem)] text-foreground-950">
                  {mode === "cancelled" ? (
                    <>
                      Booking <em>cancelled.</em>
                    </>
                  ) : mode === "moved" ? (
                    <>
                      Booking <em>moved.</em>
                    </>
                  ) : (
                    <>
                      Your <em>session.</em>
                    </>
                  )}
                </h1>

                <div className="mt-7 overflow-hidden rounded-card border border-white/[0.08] bg-background-100">
                  <dl className="divide-y divide-white/[0.08]">
                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                        Session
                      </dt>
                      <dd className="text-sm text-foreground-950">{booking.sessionName}</dd>
                    </div>
                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                        Day
                      </dt>
                      <dd className="text-sm text-foreground-950">{prettyDate(booking.date)}</dd>
                    </div>
                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                        Time
                      </dt>
                      <dd className="text-sm text-foreground-950">
                        {formatRange(booking.startHour, booking.hours)}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                        Total
                      </dt>
                      <dd className="text-sm text-foreground-950">
                        {formatCHF(booking.total)}{" "}
                        <span className="text-foreground-600">
                          · {session?.rate ? `${formatCHF(session.rate)}/hr` : ""}
                        </span>
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                        Status
                      </dt>
                      <dd className="text-sm capitalize text-foreground-950">{booking.status}</dd>
                    </div>
                  </dl>
                </div>

                {mode === "moved" && (
                  <div className="mt-5 flex items-start gap-3 rounded-card border border-primary-500/30 bg-primary-500/[0.07] p-4">
                    <i
                      className="ri-calendar-check-line mt-0.5 text-lg text-primary-500"
                      aria-hidden="true"
                    />
                    <p className="text-[13px] leading-relaxed text-foreground-800">
                      Moved to {prettyDate(booking.date)}, {formatRange(booking.startHour, booking.hours)}.
                      You&apos;ll get an updated confirmation by email.
                    </p>
                  </div>
                )}

                {mode === "cancelled" && (
                  <div className="mt-5 flex items-start gap-3 rounded-card border border-primary-500/30 bg-primary-500/[0.07] p-4">
                    <i className="ri-refund-2-line mt-0.5 text-lg text-primary-500" aria-hidden="true" />
                    <p className="text-[13px] leading-relaxed text-foreground-800">
                      Cancelled. Your deposit of {formatCHF(booking.deposit)} is refunded within five
                      working days.
                    </p>
                  </div>
                )}

                {booking.status === "cancelled" && mode !== "cancelled" && (
                  <p className="mt-5 rounded-card border border-white/[0.08] bg-background-100 p-4 text-[13px] text-foreground-700">
                    This booking was cancelled. Need the room again?{" "}
                    <Link to="/book" className="text-primary-500 underline underline-offset-2">
                      Book a new session
                    </Link>
                    .
                  </p>
                )}

                {/* move panel */}
                {mode === "move" && draft && (
                  <div className="mt-6 rounded-card border border-white/[0.08] bg-background-100/60 p-5">
                    <h2 className="headline text-[1.3rem] text-foreground-950">
                      New date and <em>time.</em>
                    </h2>
                    <div className="mt-5">
                      <DateTimeStep draft={draft} update={(patch) => setDraft((d) => (d ? { ...d, ...patch } : d))} errors={{}} />
                    </div>
                    <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setMode("view")}
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-pill border border-white/15 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-foreground-950 transition-colors hover:bg-background-100"
                      >
                        Keep current time
                      </button>
                      <button
                        type="button"
                        onClick={confirmMove}
                        disabled={draft.startHour === null}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-background-50 transition-colors hover:bg-primary-400 disabled:opacity-50"
                      >
                        Confirm new time
                        <i className="ri-arrow-right-up-line text-sm" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* cancel confirm */}
                {mode === "cancel" && (
                  <div className="mt-6 rounded-card border border-accent-500/30 bg-accent-500/[0.06] p-5">
                    <h2 className="headline text-[1.3rem] text-foreground-950">
                      Cancel this <em>booking?</em>
                    </h2>
                    <p className="mt-3 text-[13px] leading-relaxed text-foreground-700">
                      You&apos;re more than {CANCELLATION_HOURS} hours before the start time, so your
                      deposit of {formatCHF(booking.deposit)} is refunded in full within five working
                      days. The room will be released.
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setMode("view")}
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-pill border border-white/15 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-foreground-950 transition-colors hover:bg-background-100"
                      >
                        Keep the booking
                      </button>
                      <button
                        type="button"
                        onClick={confirmCancel}
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-pill bg-accent-500 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.12em] text-foreground-950 transition-colors hover:bg-accent-600"
                      >
                        Yes, cancel it
                      </button>
                    </div>
                  </div>
                )}

                {/* actions */}
                {mode === "view" && booking.status === "confirmed" && (
                  <>
                    {editable ? (
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={startMove}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors hover:bg-primary-400"
                        >
                          Move booking
                          <i className="ri-calendar-line text-sm" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode("cancel")}
                          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-pill border border-white/15 px-6 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-foreground-950 transition-colors hover:bg-background-100"
                        >
                          Cancel booking
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 rounded-card border border-white/[0.08] bg-background-100 p-5">
                        <p className="text-[13px] leading-relaxed text-foreground-700">
                          This booking starts in less than {CANCELLATION_HOURS} hours, so it
                          can&apos;t be changed online. Message us on{" "}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary-500 underline underline-offset-2"
                          >
                            <i className="ri-whatsapp-line text-sm" aria-hidden="true" />
                            WhatsApp
                          </a>{" "}
                          and we&apos;ll sort it out.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
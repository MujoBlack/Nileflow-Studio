import { Link } from "react-router-dom";
import { formatCHF, formatRange, fromISODate } from "@/lib/booking";
import type { StoredBooking } from "@/lib/booking";
import { prettyDate } from "@/components/booking/BookingSummary";
import { siteInfo } from "@/mocks/site";
import Icon from "@/components/base/Icon";

interface BookingSuccessProps {
  booking: StoredBooking;
  onDone: () => void;
  onRestart: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

function stamps(booking: StoredBooking) {
  const day = fromISODate(booking.date);
  const start = new Date(day);
  start.setHours(booking.startHour, 0, 0, 0);
  const end = new Date(start.getTime() + booking.hours * 3_600_000);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(
      d.getMinutes(),
    )}00`;

  return { start, end, startStamp: fmt(start), endStamp: fmt(end) };
}

const BRING = [
  "Your lyrics, on paper or on your phone",
  "Two or three reference tracks you love",
  "Any instrument you want to play",
];

export default function BookingSuccess({ booking, onDone, onRestart }: BookingSuccessProps) {
  const { start, startStamp, endStamp } = stamps(booking);
  const summary = `${booking.sessionName} at ${siteInfo.name}`;
  const location = `${siteInfo.addressLine1}, ${siteInfo.addressLine2}`;
  const details = `Booking ${booking.ref}. Total ${formatCHF(booking.total)}, deposit paid ${formatCHF(
    booking.deposit,
  )}.`;

  const googleUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(summary)}` +
    `&dates=${startStamp}/${endStamp}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`;

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nile Flow House//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${booking.ref}@nileflowhouse.com`,
      `DTSTAMP:${startStamp}`,
      `DTSTART:${startStamp}`,
      `DTEND:${endStamp}`,
      `SUMMARY:${summary}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${details}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nile-flow-house-${booking.ref}.ics`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const whatsappText = `My Nile Flow House session — ${booking.ref}: ${booking.sessionName}, ${prettyDate(
    booking.date,
  )}, ${formatRange(booking.startHour, booking.hours)}.`;

  const whatsappUrl = `https://wa.me/${siteInfo.whatsappHref}?text=${encodeURIComponent(
    whatsappText,
  )}`;

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-background-50">
          <Icon name="ri-check-line" className="text-3xl" />
        </span>
        <h2 className="headline mt-6 text-[clamp(2rem,5vw,3.4rem)] text-foreground-950">
          You&apos;re <em>booked.</em>
        </h2>
        <p className="mt-3 max-w-[440px] text-sm leading-relaxed text-foreground-700">
          The room is yours. We&apos;ve sent a confirmation to{" "}
          <span className="text-foreground-950">{booking.customer.email}</span>.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-card border border-white/[0.08] bg-background-100">
        <div className="flex flex-col items-center gap-1 border-b border-white/[0.08] px-5 py-4 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-600">
            Booking reference
          </span>
          <span className="font-display text-2xl font-bold tracking-[0.08em] text-primary-500">
            {booking.ref}
          </span>
        </div>

        <dl className="divide-y divide-white/[0.08]">
          <div className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">Session</dt>
            <dd className="text-sm text-foreground-950">{booking.sessionName}</dd>
          </div>
          <div className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">Day</dt>
            <dd className="text-sm text-foreground-950">{prettyDate(booking.date)}</dd>
          </div>
          <div className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">Time</dt>
            <dd className="text-sm text-foreground-950">
              {formatRange(booking.startHour, booking.hours)}
            </dd>
          </div>
          <div className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
              Deposit paid
            </dt>
            <dd className="text-sm text-foreground-950">
              {formatCHF(booking.deposit)}{" "}
              <span className="text-foreground-600">
                · {formatCHF(booking.total - booking.deposit)} at the studio
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill border border-white/[0.15] px-4 py-3 font-display text-[11px] uppercase tracking-[0.12em] text-foreground-950 transition-colors duration-200 hover:bg-background-100"
        >
          <Icon name="ri-calendar-line" className="text-sm" />
          Google
        </a>
        <button
          type="button"
          onClick={downloadIcs}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill border border-white/[0.15] px-4 py-3 font-display text-[11px] uppercase tracking-[0.12em] text-foreground-950 transition-colors duration-200 hover:bg-background-100"
        >
          <Icon name="ri-download-2-line" className="text-sm" />
          .ics file
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill border border-white/[0.15] px-4 py-3 font-display text-[11px] uppercase tracking-[0.12em] text-foreground-950 transition-colors duration-200 hover:bg-background-100"
        >
          <Icon name="ri-whatsapp-line" className="text-sm" />
          WhatsApp
        </a>
      </div>

      <div className="mt-8 rounded-card border border-white/[0.08] bg-background-100 p-5">
        <h3 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground-950">
          What to bring
        </h3>
        <ul className="mt-3 space-y-2">
          {BRING.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] text-foreground-700">
              <Icon name="ri-check-line" className="mt-0.5 text-[13px] text-primary-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 flex items-start gap-2.5 rounded-card border border-primary-500/20 bg-primary-500/[0.06] p-4 text-[12.5px] leading-relaxed text-foreground-700">
        <Icon name="ri-mail-check-line" className="mt-0.5 text-base text-primary-500" />
        We&apos;ve emailed your confirmation. Use the link in it to move or cancel your booking.
      </p>

      <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          to={`/booking/${booking.ref}?key=${booking.key}`}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
        >
          Manage this booking
          <Icon name="ri-arrow-right-up-line" className="text-sm" />
        </Link>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-pill border border-white/[0.15] px-6 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-foreground-950 transition-colors duration-200 hover:bg-background-100"
        >
          Back to the site
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap px-3 py-3 text-[12px] uppercase tracking-[0.12em] text-foreground-600 transition-colors duration-200 hover:text-foreground-950"
        >
          Book another
        </button>
      </div>

      {start.getTime() < Date.now() && (
        <p className="mt-4 text-center text-[12px] text-foreground-500">
          This session has already started or passed. Call us on {siteInfo.phone} if you need help.
        </p>
      )}
    </div>
  );
}
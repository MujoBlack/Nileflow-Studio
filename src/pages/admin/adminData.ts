/* Demo data for the admin dashboard mockup. Everything here is sample data
   until the backend (Supabase, Stripe, Resend) is connected. */

export type AdminRole = "Owner" | "Engineer" | "Viewer";

export interface AdminUser {
  name: string;
  email: string;
  role: AdminRole;
  lastActive: string;
}

export const ADMINS: AdminUser[] = [
  { name: "Calvin", email: "calvin@nileflowhouse.com", role: "Owner", lastActive: "Now" },
  { name: "Tom Luska", email: "tom@nileflowhouse.com", role: "Engineer", lastActive: "2 hours ago" },
  { name: "Jenva Music", email: "jenva@nileflowhouse.com", role: "Engineer", lastActive: "Yesterday" },
];

export const ROLE_RIGHTS: Record<AdminRole, string> = {
  Owner: "Everything, including payments, refunds, prices and the team",
  Engineer: "Calendar, bookings, reserving the studio and customer notes",
  Viewer: "Can look at the calendar and bookings, can't change anything",
};

export function findAdmin(email: string): AdminUser | undefined {
  return ADMINS.find((a) => a.email === email.trim().toLowerCase());
}

/* ------------------------------------------------------------------ */

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";

export interface Payment {
  id: string;
  ref: string;
  customer: string;
  what: string;
  kind: "Deposit" | "Balance" | "Bundle" | "Refund";
  amount: number;
  method: "Card" | "TWINT" | "Cash";
  status: PaymentStatus;
  date: string;
}

export const PAYMENTS: Payment[] = [
  { id: "p1", ref: "NF-1234", customer: "Lena Brandt", what: "Recording session · 3h", kind: "Deposit", amount: 53, method: "Card", status: "paid", date: daysFromNow(-1) },
  { id: "p2", ref: "NF-1235", customer: "Marco Rossi", what: "Dry hire · 4h", kind: "Deposit", amount: 54, method: "TWINT", status: "paid", date: daysFromNow(-2) },
  { id: "p3", ref: "NF-1219", customer: "Aya Mensah", what: "Full Song Bundle", kind: "Bundle", amount: 400, method: "Card", status: "paid", date: daysFromNow(-3) },
  { id: "p4", ref: "NF-1221", customer: "Jonas Keller", what: "Recording session · 2h", kind: "Deposit", amount: 27, method: "Card", status: "failed", date: daysFromNow(-3) },
  { id: "p5", ref: "NF-1208", customer: "Sara Lopez", what: "Podcast · 2h", kind: "Refund", amount: -36, method: "TWINT", status: "refunded", date: daysFromNow(-5) },
  { id: "p6", ref: "NF-1202", customer: "Aya Mensah", what: "Recording session · 3h", kind: "Balance", amount: 95, method: "Cash", status: "paid", date: daysFromNow(-6) },
  { id: "p7", ref: "NF-1240", customer: "Noah Weber", what: "Mix/Master Bundle", kind: "Bundle", amount: 150, method: "Card", status: "pending", date: daysFromNow(0) },
];

/* ------------------------------------------------------------------ */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: number;
  spent: number;
  noShows: number;
  lastVisit: string;
  note?: string;
}

export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Aya Mensah", email: "aya@example.com", phone: "+41 79 111 22 33", bookings: 6, spent: 1120, noShows: 0, lastVisit: daysFromNow(-3), note: "Regular. Likes the warm vocal chain." },
  { id: "c2", name: "Lena Brandt", email: "lena@example.com", phone: "+41 79 000 11 22", bookings: 2, spent: 188, noShows: 0, lastVisit: daysFromNow(-1) },
  { id: "c3", name: "Marco Rossi", email: "marco@example.com", phone: "+41 76 555 44 33", bookings: 3, spent: 420, noShows: 0, lastVisit: daysFromNow(-2) },
  { id: "c4", name: "Jonas Keller", email: "jonas@example.com", phone: "+41 78 222 99 88", bookings: 4, spent: 135, noShows: 2, lastVisit: daysFromNow(-12), note: "Two no-shows in October." },
  { id: "c5", name: "Sara Lopez", email: "sara@example.com", phone: "+41 79 333 66 77", bookings: 1, spent: 0, noShows: 0, lastVisit: daysFromNow(-5) },
  { id: "c6", name: "Dee Ramone", email: "dee.r@example.com", phone: "+41 77 888 00 11", bookings: 2, spent: 90, noShows: 1, lastVisit: daysFromNow(-30) },
];

export interface Ban {
  customerId: string;
  reason: string;
  until: string;
  by: string;
}

export const DEFAULT_BANS: Ban[] = [
  { customerId: "c6", reason: "Damaged a headphone set and didn't pay for it", until: "Permanent", by: "Calvin" },
];

const BAN_KEY = "nfh.admin.bans.v1";

export function readBans(): Ban[] {
  try {
    const raw = window.localStorage.getItem(BAN_KEY);
    return raw ? (JSON.parse(raw) as Ban[]) : DEFAULT_BANS;
  } catch {
    return DEFAULT_BANS;
  }
}

export function writeBans(bans: Ban[]): void {
  try {
    window.localStorage.setItem(BAN_KEY, JSON.stringify(bans));
  } catch {
    // preview only
  }
}

/* ------------------------------------------------------------------ */

export type AlertLevel = "urgent" | "info" | "money";

export interface AdminAlert {
  id: string;
  level: AlertLevel;
  title: string;
  body: string;
  when: string;
}

export const ALERTS: AdminAlert[] = [
  { id: "a1", level: "urgent", title: "Deposit failed", body: "Jonas Keller's card was declined for NF-1221. The slot is held for 2 more hours.", when: "12 min ago" },
  { id: "a2", level: "urgent", title: "Banned customer tried to book", body: "dee.r@example.com tried to book Saturday 14:00. The booking was blocked.", when: "1 hour ago" },
  { id: "a3", level: "info", title: "New booking", body: "Lena Brandt booked a Recording session, 3h, deposit paid.", when: "Yesterday" },
  { id: "a4", level: "money", title: "Bundle paid", body: "Aya Mensah paid CHF 400 for the Full Song Bundle.", when: "3 days ago" },
  { id: "a5", level: "info", title: "Cancellation inside 48h", body: "Sara Lopez cancelled a Podcast session 30 hours before. Deposit kept by policy, refunded by Calvin as a goodwill.", when: "5 days ago" },
  { id: "a6", level: "info", title: "New quote request", body: "\"Something else?\": a 6-track EP mix with two features. Reply within a day.", when: "5 days ago" },
];

export const ALERT_RULES = [
  { id: "new-booking", label: "New booking", email: true, whatsapp: true },
  { id: "cancel", label: "Cancellation or change", email: true, whatsapp: true },
  { id: "payment-failed", label: "Payment failed", email: true, whatsapp: true },
  { id: "quote", label: "New quote request", email: true, whatsapp: false },
  { id: "banned", label: "Banned customer tries to book", email: true, whatsapp: false },
  { id: "daily", label: "Daily summary at 08:00", email: true, whatsapp: false },
];

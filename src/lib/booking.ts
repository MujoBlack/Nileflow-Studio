import { sessions } from "@/mocks/sessions";

/* ------------------------------------------------------------------ *
 * Session types and rates
 * ------------------------------------------------------------------ */

export interface BookingSession {
  id: string;
  name: string;
  rate: number;
  blurb: string;
  note: string;
  icon: string;
}

export const BOOKING_SESSIONS: BookingSession[] = sessions.map((s) => ({
  id: s.id,
  name: s.name,
  rate: s.pricePerHour,
  blurb: s.blurb,
  note: s.accentNote,
  icon: s.icon,
}));

export function findSession(id: string): BookingSession {
  return BOOKING_SESSIONS.find((s) => s.id === id) ?? BOOKING_SESSIONS[0];
}

/* ------------------------------------------------------------------ *
 * Extras
 * ------------------------------------------------------------------ */

export interface BookingExtra {
  id: string;
  name: string;
  price: number;
  unit: string;
  note?: string;
}

export const BOOKING_EXTRAS: BookingExtra[] = [
  { id: "rough-mix", name: "Rough mix to take home", price: 30, unit: "per session" },
  { id: "tuning", name: "Same-day vocal tuning", price: 40, unit: "per song" },
  { id: "stems", name: "Extra stems export", price: 20, unit: "per session" },
  {
    id: "musician",
    name: "Session musician",
    price: 0,
    unit: "on request",
    note: "We'll confirm if a player is free.",
  },
];

export function findExtra(id: string): BookingExtra | undefined {
  return BOOKING_EXTRAS.find((e) => e.id === id);
}

/* ------------------------------------------------------------------ *
 * Opening hours, lengths, money
 * ------------------------------------------------------------------ */

export const DEPOSIT_RATE = 0.3;
export const CANCELLATION_HOURS = 48;
export const LENGTHS = [2, 3, 4, 6, 8];
export const MIN_HOURS = 2;

/** 0 = Sunday … 6 = Saturday. null means closed. */
export const OPEN_HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 10, close: 22 },
  2: { open: 10, close: 22 },
  3: { open: 10, close: 22 },
  4: { open: 10, close: 22 },
  5: { open: 10, close: 22 },
  6: { open: 10, close: 20 },
};

export function formatCHF(value: number): string {
  return `CHF ${Math.round(value).toLocaleString("de-CH").replace(/\u2019/g, "'")}`;
}

export function formatHour(hour: number): string {
  return `${String(Math.floor(hour)).padStart(2, "0")}:00`;
}

export function formatRange(startHour: number, hours: number): string {
  return `${formatHour(startHour)} – ${formatHour(startHour + hours)}`;
}

/** YYYY-MM-DD in local time (never shifts a day across a timezone). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parsed at midday so daylight-saving changes can't move the day. */
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

export function weekdayOf(iso: string): number {
  return fromISODate(iso).getDay();
}

export function isClosed(iso: string): boolean {
  return OPEN_HOURS[weekdayOf(iso)] === null;
}

export function isPast(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return fromISODate(iso).getTime() < today.getTime();
}

/* ------------------------------------------------------------------ *
 * Mock availability
 *
 * Deterministic on purpose: the same day always shows the same busy slots,
 * so the flow stays believable across reloads without any backend.
 * ------------------------------------------------------------------ */

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) % 1000003;
  }
  return h;
}

/** Roughly one start time in three is already taken. */
export function isSlotTaken(iso: string, hour: number): boolean {
  return hash(`${iso}:${hour}`) % 100 < 33;
}

/** Start times that still leave room for the chosen session length. */
export function startTimes(iso: string, hours: number): number[] {
  const day = OPEN_HOURS[weekdayOf(iso)];
  if (!day) return [];

  const times: number[] = [];
  for (let hour = day.open; hour + hours <= day.close; hour += 1) {
    times.push(hour);
  }
  return times;
}

export function isStartTaken(iso: string, hour: number, hours: number): boolean {
  // a slot is busy if any hour in the booked block is taken
  for (let i = 0; i < hours; i += 1) {
    if (isSlotTaken(iso, hour + i)) return true;
  }
  return false;
}

/* ------------------------------------------------------------------ *
 * Pricing
 * ------------------------------------------------------------------ */

export interface PriceBreakdown {
  base: number;
  extras: number;
  total: number;
  deposit: number;
  onSite: number;
}

export function priceBreakdown(
  rate: number,
  hours: number,
  extraIds: string[],
): PriceBreakdown {
  const base = rate * hours;
  const extras = extraIds.reduce((sum, id) => sum + (findExtra(id)?.price ?? 0), 0);
  const total = base + extras;
  const deposit = Math.round(total * DEPOSIT_RATE);
  return { base, extras, total, deposit, onSite: total - deposit };
}

/* ------------------------------------------------------------------ *
 * Draft + stored bookings
 * ------------------------------------------------------------------ */

export interface BookingDraft {
  sessionId: string;
  date: string;
  startHour: number | null;
  hours: number;
  extras: string[];
  name: string;
  email: string;
  phone: string;
  project: string;
  firstTime: "yes" | "no" | "";
  notes: string;
  terms: boolean;
}

export function emptyDraft(sessionId = BOOKING_SESSIONS[0].id): BookingDraft {
  return {
    sessionId,
    date: "",
    startHour: null,
    hours: 2,
    extras: [],
    name: "",
    email: "",
    phone: "+41 ",
    project: "",
    firstTime: "",
    notes: "",
    terms: false,
  };
}

export interface StoredBooking {
  ref: string;
  key: string;
  sessionId: string;
  sessionName: string;
  date: string;
  startHour: number;
  hours: number;
  extras: string[];
  total: number;
  deposit: number;
  /** "confirmed" | "cancelled" | "completed" */
  status: string;
  paymentMethod: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    project: string;
    firstTime: string;
    notes: string;
  };
  createdAt: string;
}

const STORAGE_KEY = "nfh.bookings.v1";

function readAll(): StoredBooking[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredBooking[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(bookings: StoredBooking[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // storage full or blocked — the flow still shows its success screen
  }
}

function makeRef(existing: StoredBooking[]): string {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidate = `NF-${1000 + Math.floor(Math.random() * 9000)}`;
    if (!existing.some((b) => b.ref === candidate)) return candidate;
  }
  return `NF-${Date.now().toString().slice(-4)}`;
}

function makeKey(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

export function listBookings(): StoredBooking[] {
  return readAll().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function createBooking(
  draft: BookingDraft,
  paymentMethod: string,
): StoredBooking {
  const existing = readAll();
  const session = findSession(draft.sessionId);
  const price = priceBreakdown(session.rate, draft.hours, draft.extras);

  const booking: StoredBooking = {
    ref: makeRef(existing),
    key: makeKey(),
    sessionId: session.id,
    sessionName: session.name,
    date: draft.date,
    startHour: draft.startHour ?? 10,
    hours: draft.hours,
    extras: draft.extras,
    total: price.total,
    deposit: price.deposit,
    status: "confirmed",
    paymentMethod,
    customer: {
      name: draft.name,
      email: draft.email,
      phone: draft.phone,
      project: draft.project,
      firstTime: draft.firstTime,
      notes: draft.notes,
    },
    createdAt: new Date().toISOString(),
  };

  writeAll([...existing, booking]);
  return booking;
}

export function findBookingByRef(ref: string): StoredBooking | undefined {
  return readAll().find((b) => b.ref.toLowerCase() === ref.toLowerCase());
}

export function updateBooking(ref: string, patch: Partial<StoredBooking>): void {
  const all = readAll();
  writeAll(all.map((b) => (b.ref === ref ? { ...b, ...patch } : b)));
}

/** Hours between now and the session start. Negative if already started. */
export function hoursUntil(booking: StoredBooking): number {
  const start = fromISODate(booking.date);
  start.setHours(booking.startHour, 0, 0, 0);
  return (start.getTime() - Date.now()) / 3_600_000;
}

export function canChangeOnline(booking: StoredBooking): boolean {
  return hoursUntil(booking) > CANCELLATION_HOURS && booking.status === "confirmed";
}

/** Example booking used by /admin in demo mode. */
export function seedDemoBooking(): void {
  if (readAll().length > 0) return;
  const soon = new Date();
  soon.setDate(soon.getDate() + 4);
  const later = new Date();
  later.setDate(later.getDate() + 9);
  const demo: StoredBooking[] = [
    {
      ref: "NF-1234",
      key: "demo",
      sessionId: "vocal",
      sessionName: "Vocal session",
      date: toISODate(soon),
      startHour: 14,
      hours: 3,
      extras: ["rough-mix"],
      total: 240,
      deposit: 72,
      status: "confirmed",
      paymentMethod: "card",
      customer: {
        name: "Lena Brandt",
        email: "lena@example.com",
        phone: "+41 79 000 11 22",
        project: "Second single",
        firstTime: "yes",
        notes: "Two verses and a hook, tuned reference ready.",
      },
      createdAt: new Date().toISOString(),
    },
    {
      ref: "NF-1235",
      key: "demo",
      sessionId: "production",
      sessionName: "Production session",
      date: toISODate(later),
      startHour: 11,
      hours: 4,
      extras: ["stems"],
      total: 380,
      deposit: 114,
      status: "confirmed",
      paymentMethod: "twint",
      customer: {
        name: "Marc Dorn",
        email: "marc@example.com",
        phone: "+41 78 222 33 44",
        project: "Beats for an EP",
        firstTime: "no",
        notes: "Wants a boom-bap feel, 90 BPM.",
      },
      createdAt: new Date().toISOString(),
    },
  ];
  writeAll(demo);
}
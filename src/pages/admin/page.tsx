import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import OverviewPanel from "@/pages/admin/components/OverviewPanel";
import CalendarPanel from "@/pages/admin/components/CalendarPanel";
import BookingsPanel from "@/pages/admin/components/BookingsPanel";
import SettingsPanel from "@/pages/admin/components/SettingsPanel";
import { listBookings, seedDemoBooking } from "@/lib/booking";
import type { StoredBooking } from "@/lib/booking";

const TABS = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
  { id: "calendar", label: "Calendar", icon: "ri-calendar-2-line" },
  { id: "bookings", label: "Bookings", icon: "ri-list-check-2" },
  { id: "quotes", label: "Quote requests", icon: "ri-mail-line" },
  { id: "prices", label: "Prices", icon: "ri-price-tag-3-line" },
  { id: "settings", label: "Settings", icon: "ri-settings-3-line" },
];

const ADMIN_EMAIL = "admin@nileflowhouse.com";
const ADMIN_PASSWORD = "nile-flow-admin";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [bookings, setBookings] = useState<StoredBooking[]>([]);

  useEffect(() => {
    seedDemoBooking();
  }, []);

  useEffect(() => {
    if (!authed) return;
    setBookings(listBookings());
  }, [authed, tab]);

  const refresh = () => setBookings(listBookings());

  const weekDeposits = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const weekEnd = new Date(now.getTime() + 7 * 86_400_000);
    return bookings
      .filter((b) => {
        const d = new Date(`${b.date}T12:00:00`);
        return b.status !== "cancelled" && d >= now && d < weekEnd;
      })
      .reduce((sum, b) => sum + b.deposit, 0);
  }, [bookings]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setLoginError("");
      return;
    }
    setLoginError("That email and password don't match an admin account.");
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-50 px-4">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-background-100">
              <i className="ri-water-flash-line text-base text-primary-500" aria-hidden="true" />
            </span>
            <span className="font-heading text-[15px] font-semibold text-foreground-950">
              Nile Flow House
            </span>
          </div>

          <h1 className="headline mt-8 text-[clamp(1.8rem,4vw,2.4rem)] text-foreground-950">
            Studio <em>admin.</em>
          </h1>

          <form onSubmit={handleLogin} className="mt-7 space-y-4" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600"
              >
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full box-border rounded-[10px] border border-white/[0.12] bg-background-100 px-3.5 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none"
                placeholder="admin@nileflowhouse.com"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600"
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full box-border rounded-[10px] border border-white/[0.12] bg-background-100 px-3.5 py-3 text-sm text-foreground-950 focus:border-primary-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {loginError && <p className="text-[13px] text-accent-500">{loginError}</p>}

            <button
              type="submit"
              className="w-full cursor-pointer rounded-pill bg-primary-500 px-5 py-3.5 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors hover:bg-primary-400"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 rounded-card border border-white/[0.08] bg-background-100 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-foreground-600">
              Preview access
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-foreground-700">
              {ADMIN_EMAIL} · {ADMIN_PASSWORD}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">
              This gate is a front-end preview only. Real sign-in and stored bookings need Readdy
              Backend or SaaS Supabase connected.
            </p>
          </div>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-foreground-600 transition-colors hover:text-primary-500"
          >
            <i className="ri-arrow-left-line text-sm" aria-hidden="true" />
            Back to the site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row">
        {/* sidebar */}
        <aside className="shrink-0 border-b border-white/[0.08] lg:min-h-screen lg:w-[248px] lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-background-100">
              <i className="ri-water-flash-line text-sm text-primary-500" aria-hidden="true" />
            </span>
            <span className="font-heading text-[14px] font-semibold text-foreground-950">
              Studio admin
            </span>
          </div>

          <nav
            aria-label="Admin sections"
            className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6"
          >
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-[10px] px-3 py-2.5 text-[13px] transition-colors duration-200 ${
                    active
                      ? "bg-primary-500/[0.12] text-primary-500"
                      : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
                  }`}
                >
                  <i className={`${item.icon} text-base`} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden px-5 pb-6 lg:mt-auto lg:block">
            <div className="rounded-card border border-white/[0.08] bg-background-100 p-3.5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-foreground-600">
                Demo data
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-foreground-600">
                Bookings live in this browser only until a backend is connected.
              </p>
            </div>
          </div>
        </aside>

        {/* content */}
        <main className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary-500">
                {TABS.find((t) => t.id === tab)?.label}
              </p>
              <h1 className="headline mt-2 text-[clamp(1.6rem,3.4vw,2.3rem)] text-foreground-950">
                {tab === "overview" && (
                  <>
                    Today at <em>the studio.</em>
                  </>
                )}
                {tab === "calendar" && (
                  <>
                    The <em>week.</em>
                  </>
                )}
                {tab === "bookings" && (
                  <>
                    All <em>bookings.</em>
                  </>
                )}
                {tab === "quotes" && (
                  <>
                    Quote <em>requests.</em>
                  </>
                )}
                {tab === "prices" && (
                  <>
                    Rates and <em>extras.</em>
                  </>
                )}
                {tab === "settings" && (
                  <>
                    Studio <em>settings.</em>
                  </>
                )}
              </h1>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-pill border border-white/[0.12] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-foreground-700 transition-colors hover:bg-background-100"
            >
              <i className="ri-refresh-line text-sm" aria-hidden="true" />
              Refresh
            </button>
          </div>

          <div className="mt-7">
            {tab === "overview" && <OverviewPanel bookings={bookings} deposits={weekDeposits} />}
            {tab === "calendar" && <CalendarPanel bookings={bookings} />}
            {tab === "bookings" && <BookingsPanel bookings={bookings} onChange={refresh} />}
            {tab === "quotes" && <SettingsPanel section="quotes" />}
            {tab === "prices" && <SettingsPanel section="prices" />}
            {tab === "settings" && <SettingsPanel section="settings" />}
          </div>
        </main>
      </div>
    </div>
  );
}
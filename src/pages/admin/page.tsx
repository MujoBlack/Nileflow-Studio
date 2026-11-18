import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import OverviewPanel from "@/pages/admin/components/OverviewPanel";
import CalendarPanel from "@/pages/admin/components/CalendarPanel";
import BookingsPanel from "@/pages/admin/components/BookingsPanel";
import SettingsPanel from "@/pages/admin/components/SettingsPanel";
import ReservePanel from "@/pages/admin/components/ReservePanel";
import PaymentsPanel from "@/pages/admin/components/PaymentsPanel";
import CustomersPanel from "@/pages/admin/components/CustomersPanel";
import AlertsPanel from "@/pages/admin/components/AlertsPanel";
import TeamPanel from "@/pages/admin/components/TeamPanel";
import { ADMINS, ALERTS, findAdmin } from "@/pages/admin/adminData";
import type { AdminUser } from "@/pages/admin/adminData";
import { listBookings, seedDemoBooking } from "@/lib/booking";
import type { StoredBooking } from "@/lib/booking";
import Icon from "@/components/base/Icon";

const TAB_GROUPS = [
  {
    label: "Studio",
    tabs: [
      { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
      { id: "calendar", label: "Calendar", icon: "ri-calendar-2-line" },
      { id: "reserve", label: "Reserve studio", icon: "ri-calendar-event-line" },
      { id: "bookings", label: "Bookings", icon: "ri-list-check-2" },
      { id: "quotes", label: "Quote requests", icon: "ri-mail-line" },
    ],
  },
  {
    label: "Money and people",
    tabs: [
      { id: "payments", label: "Payments", icon: "ri-wallet-3-line", ownerOnly: true },
      { id: "customers", label: "Customers and bans", icon: "ri-user-voice-line" },
      { id: "alerts", label: "Alerts", icon: "ri-notification-3-line" },
    ],
  },
  {
    label: "Setup",
    tabs: [
      { id: "prices", label: "Prices", icon: "ri-price-tag-3-line", ownerOnly: true },
      { id: "team", label: "Team and roles", icon: "ri-team-line" },
      { id: "settings", label: "Settings", icon: "ri-settings-3-line", ownerOnly: true },
    ],
  },
];

const TABS = TAB_GROUPS.flatMap((g) => g.tabs);

const HEADINGS: Record<string, [string, string]> = {
  overview: ["Today at", "the studio."],
  calendar: ["The", "week."],
  reserve: ["Hold the", "room."],
  bookings: ["All", "bookings."],
  quotes: ["Quote", "requests."],
  payments: ["Money", "in and out."],
  customers: ["Customers and", "bans."],
  alerts: ["What needs", "you."],
  prices: ["Rates and", "extras."],
  team: ["Who has", "access."],
  settings: ["Studio", "settings."],
};

export default function Admin() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const authed = admin !== null;
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
    const match = findAdmin(email);
    if (match && password.length > 0) {
      setAdmin(match);
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
              <Icon name="ri-water-flash-line" className="text-base text-primary-500" />
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
                placeholder="you@nileflowhouse.com"
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

            {loginError && <p className="text-[13px] text-rose-400">{loginError}</p>}

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
              Pick an account, or type its email with any password.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ADMINS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => setAdmin(a)}
                  className="cursor-pointer rounded-pill border border-white/[0.12] px-3 py-1.5 text-[11.5px] text-foreground-700 transition-colors hover:border-primary-500/50 hover:text-primary-500"
                >
                  {a.name} · {a.role}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-foreground-500">
              Mockup only. The real version signs each admin in with their own email and a one-time
              code, once the backend is connected.
            </p>
          </div>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-foreground-600 transition-colors hover:text-primary-500"
          >
            <Icon name="ri-arrow-left-line" className="text-sm" />
            Back to the site
          </a>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  const isOwner = admin.role === "Owner";
  const unreadAlerts = ALERTS.filter((a) => a.level === "urgent").length;
  const urgent = ALERTS.filter((a) => a.level === "urgent");
  const [lead, accent] = HEADINGS[tab];
  const locked = TABS.find((t) => t.id === tab)?.ownerOnly && !isOwner;

  return (
    <div className="min-h-screen bg-background-50">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row">
        {/* sidebar */}
        <aside className="shrink-0 border-b border-white/[0.08] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[252px] lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-background-100">
              <Icon name="ri-water-flash-line" className="text-sm text-primary-500" />
            </span>
            <span className="font-heading text-[14px] font-semibold text-foreground-950">
              Studio admin
            </span>
          </div>

          <nav
            aria-label="Admin sections"
            className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:pb-4"
          >
            {TAB_GROUPS.map((group) => (
              <div key={group.label} className="contents lg:mb-3 lg:block">
                <p className="hidden px-3 pb-1.5 pt-2 text-[9.5px] uppercase tracking-[0.18em] text-foreground-500 lg:block">
                  {group.label}
                </p>
                {group.tabs.map((item) => {
                  const active = tab === item.id;
                  const isLocked = item.ownerOnly && !isOwner;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={`flex shrink-0 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-[10px] px-3 py-2.5 text-[13px] transition-colors duration-200 lg:w-full ${
                        active
                          ? "bg-primary-500/[0.12] text-primary-500"
                          : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
                      } ${isLocked ? "opacity-50" : ""}`}
                    >
                      <Icon name={item.icon} className="text-base" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.id === "alerts" && unreadAlerts > 0 && (
                        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-400 px-1 text-[10px] font-semibold text-white">
                          {unreadAlerts}
                        </span>
                      )}
                      {isLocked && <Icon name="ri-lock-2-line" className="text-xs" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="hidden border-t border-white/[0.08] px-4 py-4 lg:block">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/[0.14] font-display text-[13px] text-primary-500">
                {admin.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-foreground-950">{admin.name}</p>
                <p className="text-[11px] text-foreground-600">{admin.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setAdmin(null)}
                aria-label="Sign out"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-600 transition-colors hover:bg-background-100 hover:text-foreground-950"
              >
                <Icon name="ri-logout-box-line" className="text-base" />
              </button>
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
                {lead} <em>{accent}</em>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tab !== "reserve" && (
                <button
                  type="button"
                  onClick={() => setTab("reserve")}
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-4 py-2 font-display text-[11px] uppercase tracking-[0.12em] text-background-50 transition-colors hover:bg-primary-400"
                >
                  <Icon name="ri-calendar-event-line" className="text-sm" />
                  Reserve studio
                </button>
              )}
              <button
                type="button"
                onClick={refresh}
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-pill border border-white/[0.12] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-foreground-700 transition-colors hover:bg-background-100"
              >
                <Icon name="ri-refresh-line" className="text-sm" />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-7">
            {locked ? (
              <div className="rounded-card border border-white/[0.08] bg-background-100 p-8 text-center">
                <Icon name="ri-lock-2-line" className="text-2xl text-foreground-500" />
                <p className="mt-3 text-[13px] text-foreground-700">
                  Only the owner can open this section. Ask Calvin if you need access.
                </p>
              </div>
            ) : (
              <>
                {tab === "overview" && (
                  <>
                    {urgent.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setTab("alerts")}
                        className="mb-5 flex w-full cursor-pointer items-start gap-3 rounded-card border border-rose-400/30 bg-rose-400/[0.06] p-4 text-left transition-colors hover:bg-rose-400/[0.1]"
                      >
                        <Icon name="ri-alarm-warning-line" className="mt-0.5 text-base text-rose-400" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] text-foreground-950">
                            {urgent.length} things need you
                          </span>
                          <span className="mt-0.5 block truncate text-[12px] text-foreground-700">
                            {urgent.map((a) => a.title).join(" · ")}
                          </span>
                        </span>
                        <Icon name="ri-arrow-right-s-line" className="mt-0.5 text-base text-foreground-600" />
                      </button>
                    )}
                    <OverviewPanel bookings={bookings} deposits={weekDeposits} />
                  </>
                )}
                {tab === "calendar" && <CalendarPanel bookings={bookings} />}
                {tab === "reserve" && <ReservePanel admin={admin} bookings={bookings} onChange={refresh} />}
                {tab === "bookings" && <BookingsPanel bookings={bookings} onChange={refresh} />}
                {tab === "quotes" && <SettingsPanel section="quotes" />}
                {tab === "payments" && <PaymentsPanel canRefund={isOwner} />}
                {tab === "customers" && <CustomersPanel admin={admin} />}
                {tab === "alerts" && <AlertsPanel />}
                {tab === "prices" && <SettingsPanel section="prices" />}
                {tab === "team" && <TeamPanel admin={admin} />}
                {tab === "settings" && <SettingsPanel section="settings" />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

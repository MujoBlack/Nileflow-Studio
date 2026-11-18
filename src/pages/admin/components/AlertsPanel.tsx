import { useState } from "react";
import { ALERTS, ALERT_RULES } from "@/pages/admin/adminData";
import type { AlertLevel } from "@/pages/admin/adminData";
import Icon from "@/components/base/Icon";
import { Card, ghostButton } from "@/pages/admin/components/ui";

const LEVEL: Record<AlertLevel, { icon: string; color: string }> = {
  urgent: { icon: "ri-alarm-warning-line", color: "bg-rose-400/[0.14] text-rose-400" },
  money: { icon: "ri-wallet-3-line", color: "bg-primary-500/[0.14] text-primary-500" },
  info: { icon: "ri-notification-3-line", color: "bg-white/[0.06] text-foreground-700" },
};

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${on ? "bg-primary-500" : "bg-background-300"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

export default function AlertsPanel() {
  const [read, setRead] = useState<Record<string, boolean>>({ a3: true, a4: true, a5: true, a6: true });
  const [rules, setRules] = useState(ALERT_RULES);

  const flip = (id: string, channel: "email" | "whatsapp") =>
    setRules((list) => list.map((r) => (r.id === id ? { ...r, [channel]: !r[channel] } : r)));

  const unread = ALERTS.filter((a) => !read[a.id]).length;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <Card
        title={`Alerts${unread ? ` · ${unread} new` : ""}`}
        action={
          unread > 0 && (
            <button type="button" onClick={() => setRead(Object.fromEntries(ALERTS.map((a) => [a.id, true])))} className={ghostButton}>
              Mark all read
            </button>
          )
        }
      >
        <ul className="space-y-2">
          {ALERTS.map((a) => {
            const lv = LEVEL[a.level];
            const isNew = !read[a.id];
            return (
              <li
                key={a.id}
                className={`flex items-start gap-3 rounded-[12px] border p-3.5 transition-colors ${
                  isNew ? "border-white/[0.12] bg-background-50" : "border-transparent"
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${lv.color}`}>
                  <Icon name={lv.icon} className="text-sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[13px] text-foreground-950">
                    {a.title}
                    {isNew && <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-label="New" />}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-foreground-700">{a.body}</p>
                </div>
                <span className="shrink-0 text-[11px] text-foreground-500">{a.when}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card title="Send me alerts for">
        <div className="mb-2 grid grid-cols-[1fr_52px_68px] gap-2 text-[10px] uppercase tracking-[0.14em] text-foreground-600">
          <span />
          <span className="text-center">Email</span>
          <span className="text-center">WhatsApp</span>
        </div>
        <ul className="divide-y divide-white/[0.08]">
          {rules.map((r) => (
            <li key={r.id} className="grid grid-cols-[1fr_52px_68px] items-center gap-2 py-2.5">
              <span className="text-[12.5px] text-foreground-900">{r.label}</span>
              <span className="flex justify-center"><Toggle on={r.email} onChange={() => flip(r.id, "email")} label={`${r.label} by email`} /></span>
              <span className="flex justify-center"><Toggle on={r.whatsapp} onChange={() => flip(r.id, "whatsapp")} label={`${r.label} on WhatsApp`} /></span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11.5px] leading-relaxed text-foreground-600">
          Each admin picks their own alerts. Emails come from bookings@nileflowhouse.com.
        </p>
      </Card>
    </div>
  );
}

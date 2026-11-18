import { useState } from "react";
import { ADMINS, ROLE_RIGHTS } from "@/pages/admin/adminData";
import type { AdminRole, AdminUser } from "@/pages/admin/adminData";
import { Card, Pill, inputClass, labelClass, primaryButton } from "@/pages/admin/components/ui";

const ROLES: AdminRole[] = ["Owner", "Engineer", "Viewer"];

export default function TeamPanel({ admin }: { admin: AdminUser }) {
  const [team, setTeam] = useState<AdminUser[]>(ADMINS);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("Engineer");
  const isOwner = admin.role === "Owner";

  const invite = () => {
    const clean = email.trim().toLowerCase();
    if (!clean.includes("@") || team.some((t) => t.email === clean)) return;
    setTeam([...team, { name: clean.split("@")[0], email: clean, role, lastActive: "Invite sent" }]);
    setEmail("");
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <Card title={`Admins (${team.length})`}>
        <ul className="divide-y divide-white/[0.08]">
          {team.map((t) => (
            <li key={t.email} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/[0.14] font-display text-[13px] text-primary-500">
                  {t.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-foreground-950">
                    {t.name} {t.email === admin.email && <span className="text-foreground-500">(you)</span>}
                  </p>
                  <p className="truncate text-[11.5px] text-foreground-600">{t.email} · {t.lastActive}</p>
                </div>
              </div>
              {isOwner && t.email !== admin.email ? (
                <select
                  value={t.role}
                  onChange={(e) => setTeam(team.map((x) => (x.email === t.email ? { ...x, role: e.target.value as AdminRole } : x)))}
                  className={`${inputClass} !mt-0 !w-[130px] !py-1.5`}
                >
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              ) : (
                <Pill tone={t.role === "Owner" ? "teal" : "grey"}>{t.role}</Pill>
              )}
            </li>
          ))}
        </ul>

        {isOwner && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/[0.08] pt-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
            <label className="block">
              <span className={labelClass}>Invite by email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@nileflowhouse.com" className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value as AdminRole)} className={inputClass}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <button type="button" onClick={invite} className={primaryButton}>Send invite</button>
          </div>
        )}
      </Card>

      <Card title="What each role can do">
        <ul className="space-y-3">
          {ROLES.map((r) => (
            <li key={r}>
              <Pill tone={r === "Owner" ? "teal" : "grey"}>{r}</Pill>
              <p className="mt-1.5 text-[12px] leading-relaxed text-foreground-700">{ROLE_RIGHTS[r]}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-white/[0.08] pt-3 text-[11.5px] leading-relaxed text-foreground-600">
          Admins sign in with their own email and a one-time code. Every reservation, refund and ban
          is logged with who did it.
        </p>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { formatCHF } from "@/lib/booking";
import { CUSTOMERS, readBans, writeBans } from "@/pages/admin/adminData";
import type { AdminUser, Ban } from "@/pages/admin/adminData";
import Icon from "@/components/base/Icon";
import { Card, Pill, ghostButton, inputClass, labelClass, primaryButton } from "@/pages/admin/components/ui";

const BAN_LENGTHS = ["1 month", "3 months", "6 months", "Permanent"];

export default function CustomersPanel({ admin }: { admin: AdminUser }) {
  const [bans, setBans] = useState<Ban[]>(() => readBans());
  const [query, setQuery] = useState("");
  const [banning, setBanning] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [until, setUntil] = useState(BAN_LENGTHS[0]);

  const banFor = (id: string) => bans.find((b) => b.customerId === id);
  const save = (next: Ban[]) => {
    setBans(next);
    writeBans(next);
  };

  const confirmBan = (id: string) => {
    if (!reason.trim()) return;
    save([...bans.filter((b) => b.customerId !== id), { customerId: id, reason: reason.trim(), until, by: admin.name }]);
    setBanning(null);
    setReason("");
  };

  const q = query.trim().toLowerCase();
  const list = CUSTOMERS.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.email.includes(q) || c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")),
  );
  const banned = CUSTOMERS.filter((c) => banFor(c.id));

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
      <Card
        title={`Customers (${CUSTOMERS.length})`}
        action={
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or phone"
            className={`${inputClass} !mt-0 !w-[230px] !py-2`}
          />
        }
      >
        <ul className="divide-y divide-white/[0.08]">
          {list.map((c) => {
            const ban = banFor(c.id);
            return (
              <li key={c.id} className="py-3.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-[13px] text-foreground-950">
                      {c.name}
                      {ban && <Pill tone="red">Banned</Pill>}
                      {!ban && c.noShows >= 2 && <Pill tone="amber">{c.noShows} no-shows</Pill>}
                      {c.bookings >= 5 && <Pill tone="teal">Regular</Pill>}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-foreground-600">
                      {c.email} · {c.phone}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-foreground-600">
                      {c.bookings} bookings · {formatCHF(c.spent)} spent · last visit {c.lastVisit}
                    </p>
                    {c.note && <p className="mt-1 text-[11.5px] italic text-foreground-500">{c.note}</p>}
                  </div>
                  {ban ? (
                    <button type="button" onClick={() => save(bans.filter((b) => b.customerId !== c.id))} className={ghostButton}>
                      Lift ban
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setBanning(banning === c.id ? null : c.id);
                        setReason("");
                      }}
                      className={`${ghostButton} hover:!border-rose-400/50 hover:!text-rose-400`}
                    >
                      <Icon name="ri-forbid-line" className="text-[13px]" />
                      Ban
                    </button>
                  )}
                </div>

                {banning === c.id && (
                  <div className="mt-3 grid grid-cols-1 gap-3 rounded-[12px] border border-rose-400/30 bg-rose-400/[0.05] p-3.5 sm:grid-cols-[1fr_150px_auto] sm:items-end">
                    <label className="block">
                      <span className={labelClass}>Reason (only the team sees this)</span>
                      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Three no-shows" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>For</span>
                      <select value={until} onChange={(e) => setUntil(e.target.value)} className={inputClass}>
                        {BAN_LENGTHS.map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </label>
                    <button type="button" disabled={!reason.trim()} onClick={() => confirmBan(c.id)} className={`${primaryButton} !bg-rose-400`}>
                      Ban customer
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="space-y-5">
        <Card title={`Banned (${banned.length})`}>
          {banned.length === 0 ? (
            <p className="text-[13px] text-foreground-600">Nobody is banned.</p>
          ) : (
            <ul className="space-y-3">
              {banned.map((c) => {
                const ban = banFor(c.id)!;
                return (
                  <li key={c.id} className="rounded-[12px] border border-white/[0.08] bg-background-50 p-3">
                    <p className="text-[13px] text-foreground-950">{c.name}</p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-foreground-700">{ban.reason}</p>
                    <p className="mt-1.5 text-[11px] text-foreground-500">
                      {ban.until} · banned by {ban.by}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card title="How a ban works">
          <ul className="space-y-2 text-[12px] leading-relaxed text-foreground-700">
            <li>The email and phone number can't book or send quote requests.</li>
            <li>They see a polite message asking them to contact the studio.</li>
            <li>You get an alert if they try to book.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

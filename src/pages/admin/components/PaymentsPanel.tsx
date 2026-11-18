import { useState } from "react";
import { formatCHF } from "@/lib/booking";
import { PAYMENTS } from "@/pages/admin/adminData";
import type { Payment, PaymentStatus } from "@/pages/admin/adminData";
import { Card, Pill, Stat, ghostButton } from "@/pages/admin/components/ui";

const TONE: Record<PaymentStatus, "teal" | "red" | "grey" | "amber"> = {
  paid: "teal",
  pending: "amber",
  refunded: "grey",
  failed: "red",
};

export default function PaymentsPanel({ canRefund }: { canRefund: boolean }) {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");

  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const refunded = payments.filter((p) => p.status === "refunded").reduce((s, p) => s + Math.abs(p.amount), 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const failed = payments.filter((p) => p.status === "failed").length;
  const visible = filter === "all" ? payments : payments.filter((p) => p.status === filter);

  const refund = (id: string) =>
    setPayments((list) => list.map((p) => (p.id === id ? { ...p, status: "refunded" } : p)));

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Received, last 7 days" value={formatCHF(paid)} note="Card, TWINT and cash" tone="good" />
        <Stat label="Waiting" value={formatCHF(pending)} note="Bundles not paid yet" />
        <Stat label="Refunded" value={formatCHF(refunded)} note="Last 7 days" />
        <Stat label="Failed" value={String(failed)} note="Needs a follow-up" tone={failed ? "bad" : "default"} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "paid", "pending", "failed", "refunded"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`cursor-pointer rounded-pill border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] capitalize transition-colors ${
                filter === value
                  ? "border-primary-500 bg-primary-500 text-background-50"
                  : "border-white/[0.12] text-foreground-700 hover:bg-background-100"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <span className="text-[11.5px] text-foreground-600">Payouts go to the studio account every Monday (Stripe)</span>
      </div>

      <Card className="mt-4 !p-0 overflow-hidden">
        <div className="hidden grid-cols-[80px_1.1fr_1.3fr_90px_80px_100px_110px] gap-3 border-b border-white/[0.08] px-4 py-2.5 lg:grid">
          {["Date", "Customer", "For", "Type", "Method", "Amount", "Status"].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-[0.14em] text-foreground-600">{h}</span>
          ))}
        </div>
        {visible.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-2 items-center gap-x-3 gap-y-1 border-b border-white/[0.08] px-4 py-3 last:border-b-0 lg:grid-cols-[70px_1fr_1.3fr_80px_70px_90px_160px]"
          >
            <span className="text-[12px] text-foreground-600">{p.date}</span>
            <span className="truncate text-[12.5px] text-foreground-950">{p.customer}</span>
            <span className="truncate text-[12px] text-foreground-700">
              {p.what} <span className="text-foreground-500">· {p.ref}</span>
            </span>
            <span className="text-[12px] text-foreground-700">{p.kind}</span>
            <span className="text-[12px] text-foreground-700">{p.method}</span>
            <span className={`text-[12.5px] ${p.amount < 0 ? "text-foreground-600" : "text-foreground-950"}`}>
              {p.amount < 0 ? `− ${formatCHF(-p.amount)}` : formatCHF(p.amount)}
            </span>
            <span className="flex items-center gap-2">
              <Pill tone={TONE[p.status]}>{p.status}</Pill>
              {canRefund && p.status === "paid" && p.kind !== "Refund" && (
                <button type="button" onClick={() => refund(p.id)} className={`${ghostButton} !px-2 !py-0.5 !text-[10px]`}>
                  Refund
                </button>
              )}
              {p.status === "failed" && (
                <button type="button" className={`${ghostButton} !px-2 !py-0.5 !text-[10px]`}>Send link</button>
              )}
            </span>
          </div>
        ))}
      </Card>
      {!canRefund && (
        <p className="mt-3 text-[11.5px] text-foreground-600">Only the owner can issue refunds.</p>
      )}
    </div>
  );
}

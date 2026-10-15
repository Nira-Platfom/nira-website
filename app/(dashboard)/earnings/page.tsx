"use client";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, ShoppingBag, Sparkles, Wallet, Flag } from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "@/lib/api";
import { Badge, Button, Card, EmptyState, Modal, StatCard, Switch, Input, LoadingSpinner } from "@/components/ui";
import { formatTZS, formatDate } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";

interface Impact {
  days: number;
  nira_bookings: number;
  nira_bookings_completed: number;
  nira_orders: number;
  nira_orders_delivered: number;
  revenue_generated: number;
  commission: number;
  this_month: { month: string; transactions: number; gross_revenue: number; commission_owed: number; disputed_count: number };
  rates: { booking: number; order: number };
}
interface Entry {
  id: string;
  kind: "booking" | "order";
  nira_ref: string | null;
  gross_amount: number;
  rate: number;
  commission_amount: number;
  status: string;
  dispute_reason: string | null;
  resolution_note: string | null;
  created_at: string;
}
interface Statement {
  month: string;
  transactions: number;
  gross_revenue: number;
  commission_owed: number;
  commission_paid: number;
  disputed_count: number;
  entries: Entry[];
}
interface AgentSettings {
  booking_capacity: number;
  deposit_percent: number;
  accepts_online_payment: boolean;
  online_payments_live: boolean;
  is_marketplace: boolean;
}

const pct = (r: number) => `${(r * 100).toFixed(r * 100 % 1 ? 1 : 0)}%`;

function lastMonths(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    d.setMonth(d.getMonth() - 1);
  }
  return out;
}

export default function EarningsPage() {
  const { can } = usePermissions();
  const [impact, setImpact] = useState<Impact | null>(null);
  const [statement, setStatement] = useState<Statement | null>(null);
  const [month, setMonth] = useState(lastMonths(1)[0]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [disputing, setDisputing] = useState<Entry | null>(null);
  const [reason, setReason] = useState("");
  const months = useMemo(() => lastMonths(6), []);

  useEffect(() => {
    api.get(`/nira/impact?days=${days}`).then(({ data }) => setImpact(data)).catch(() => toast.error("Couldn't load Nira impact"));
  }, [days]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/nira/statement?month=${month}`)
      .then(({ data }) => setStatement(data))
      .catch(() => toast.error("Couldn't load statement"))
      .finally(() => setLoading(false));
  }, [month]);

  const submitDispute = async () => {
    if (!disputing || reason.trim().length < 3) return;
    try {
      const { data } = await api.post(`/nira/ledger/${disputing.id}/dispute`, { reason: reason.trim() });
      setStatement((s) => s && { ...s, entries: s.entries.map((e) => (e.id === data.id ? data : e)) });
      toast.success("Dispute sent — the Nira team will review it");
      setDisputing(null);
      setReason("");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't send dispute"));
    }
  };

  const noCommission = impact && impact.rates.booking === 0 && impact.rates.order === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-[26px] text-charcoal leading-tight">What Nira brought you</h2>
          <p className="text-sm text-slate-500 mt-1">
            Bookings and orders the Nira agent created on WhatsApp and the web. You only pay commission on ones that were completed.
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-white border border-slate-200 p-1 self-start">
          {[30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`h-9 px-4 rounded-full text-[13px] font-medium ${days === d ? "bg-coral text-white" : "text-slate-600"}`}
            >
              {d === 365 ? "12 months" : `${d} days`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} label="Revenue from Nira" value={impact ? formatTZS(impact.revenue_generated) : "—"} sub="completed & delivered" icon={Sparkles} color="coral" loading={!impact} />
        <StatCard index={1} label="Nira bookings" value={impact?.nira_bookings ?? "—"} sub={impact ? `${impact.nira_bookings_completed} completed` : undefined} icon={CalendarCheck} color="lavender" loading={!impact} />
        <StatCard index={2} label="Nira orders" value={impact?.nira_orders ?? "—"} sub={impact ? `${impact.nira_orders_delivered} delivered` : undefined} icon={ShoppingBag} color="mint" loading={!impact} />
        <StatCard index={3} label="Commission" value={impact ? formatTZS(impact.commission) : "—"} sub={impact ? `bookings ${pct(impact.rates.booking)} · orders ${pct(impact.rates.order)}` : undefined} icon={Wallet} color="amber" loading={!impact} />
      </div>

      {noCommission && (
        <Card className="bg-mint-light/50 border-mint/30">
          <p className="text-sm text-mint-deep">
            You&apos;re on the pilot: no commission is charged right now. Nira still tracks what it brings you so you can see the value.
          </p>
        </Card>
      )}

      <Card
        title="Monthly statement"
        action={
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 rounded-input border border-slate-200 bg-white px-3 text-sm text-charcoal"
            aria-label="Statement month"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {new Date(`${m}-01T00:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </option>
            ))}
          </select>
        }
      >
        {loading ? (
          <LoadingSpinner />
        ) : !statement || statement.entries.length === 0 ? (
          <EmptyState icon={Sparkles} title="Nothing this month yet" description="Completed Nira bookings and delivered Nira orders will appear here." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                ["Transactions", String(statement.transactions)],
                ["Gross revenue", formatTZS(statement.gross_revenue)],
                ["Commission owed", formatTZS(statement.commission_owed)],
                ["Paid", formatTZS(statement.commission_paid)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-[11px] uppercase text-slate-500 font-medium">{label}</div>
                  <div className="font-serif text-xl text-charcoal">{value}</div>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase text-slate-500">
                    <th className="py-2 pr-3 font-medium">Reference</th>
                    <th className="py-2 pr-3 font-medium">Type</th>
                    <th className="py-2 pr-3 font-medium">Date</th>
                    <th className="py-2 pr-3 font-medium text-right">Value</th>
                    <th className="py-2 pr-3 font-medium text-right">Commission</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {statement.entries.map((e) => (
                    <tr key={e.id}>
                      <td className="py-3 pr-3 font-medium text-charcoal">{e.nira_ref || "—"}</td>
                      <td className="py-3 pr-3 capitalize text-slate-600">{e.kind}</td>
                      <td className="py-3 pr-3 text-slate-600">{formatDate(e.created_at)}</td>
                      <td className="py-3 pr-3 text-right">{formatTZS(e.gross_amount)}</td>
                      <td className="py-3 pr-3 text-right">
                        {formatTZS(e.commission_amount)} <span className="text-slate-400">({pct(e.rate)})</span>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge status={e.status} />
                        {e.dispute_reason && <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">“{e.dispute_reason}”</p>}
                        {e.resolution_note && <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">Nira: {e.resolution_note}</p>}
                      </td>
                      <td className="py-3 text-right">
                        {can("manage_business") && ["accrued", "invoiced"].includes(e.status) && (
                          <button
                            onClick={() => setDisputing(e)}
                            className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[12px] text-slate-500 hover:text-coral hover:bg-coral-light"
                          >
                            <Flag size={13} /> Dispute
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {can("manage_business") && <AgentSettingsCard />}

      <Modal
        open={!!disputing}
        onClose={() => setDisputing(null)}
        title={`Dispute ${disputing?.nira_ref ?? "charge"}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDisputing(null)}>Cancel</Button>
            <Button onClick={submitDispute} disabled={reason.trim().length < 3}>Send dispute</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 mb-3">
          Tell us what&apos;s wrong — e.g. the customer never came, or the order was returned. This charge is paused until the Nira team reviews it.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          rows={4}
          className="w-full rounded-input border border-slate-200 p-3 text-sm outline-none focus:border-coral"
          placeholder="Reason"
        />
      </Modal>
    </div>
  );
}

function AgentSettingsCard() {
  const [s, setS] = useState<AgentSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/nira/settings").then(({ data }) => setS(data)).catch(() => {});
  }, []);

  const save = async (patch: Partial<AgentSettings>) => {
    if (!s) return;
    setSaving(true);
    try {
      const { data } = await api.put("/nira/settings", patch);
      setS(data);
      toast.success("Saved");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't save"));
    } finally {
      setSaving(false);
    }
  };

  if (!s) return null;
  return (
    <Card title="How the Nira agent works for you">
      <div className="space-y-5">
        <Row
          title="Show my business in the Nira marketplace"
          desc="Customers searching on Nira can discover and book you. Turn off to only serve people who use your own link."
          control={<Switch checked={s.is_marketplace} onChange={(v: boolean) => save({ is_marketplace: v })} disabled={saving} />}
        />
        <Row
          title="Clients you can serve at the same time"
          desc="Chairs or therapists. Nira never books more people into one hour than this."
          control={
            <Input
              type="number"
              min={1}
              max={50}
              defaultValue={s.booking_capacity}
              className="w-24"
              onBlur={(e) => {
                const v = Number(e.target.value);
                if (v >= 1 && v <= 50 && v !== s.booking_capacity) save({ booking_capacity: v });
              }}
            />
          }
        />
        <Row
          title="Deposit when booking (%)"
          desc="0 = customers pay at the salon. Above 0, Nira asks for this deposit by mobile money once online payments are live."
          control={
            <Input
              type="number"
              min={0}
              max={100}
              defaultValue={s.deposit_percent}
              className="w-24"
              onBlur={(e) => {
                const v = Number(e.target.value);
                if (v >= 0 && v <= 100 && v !== s.deposit_percent) save({ deposit_percent: v });
              }}
            />
          }
        />
        <Row
          title="Let customers pay through Nira"
          desc={s.online_payments_live ? "M-Pesa, Airtel Money, Mixx and Halopesa via Snippe." : "Online payments are coming soon — customers pay you directly for now."}
          control={<Switch checked={s.accepts_online_payment} onChange={(v: boolean) => save({ accepts_online_payment: v })} disabled={saving} />}
        />
      </div>
    </Card>
  );
}

function Row({ title, desc, control }: { title: string; desc: string; control: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-charcoal">{title}</p>
        <p className="text-[13px] text-slate-500 mt-0.5 max-w-xl">{desc}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

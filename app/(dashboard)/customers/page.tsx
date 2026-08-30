"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Users, MessageCircle, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { DataTable, Badge, EmptyState, Modal, Button, Avatar } from "@/components/ui";
import { formatTZS, timeAgo, formatDate, cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string | null;
  phone: string;
  language: string;
  total_bookings: number;
  total_orders: number;
  last_interaction: string | null;
  needs_human: boolean;
  skin_type?: string;
  hair_type?: string;
  city_area?: string;
}

interface AnalyticsSummary {
  total_customers: number;
  new_this_month: number;
  returning: number;
  needs_attention: number;
  top_customers: { customer_id: string; total_spent: number }[];
}

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersPageInner />
    </Suspense>
  );
}

function CustomersPageInner() {
  const params = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlyAttention, setOnlyAttention] = useState(params.get("needs_human") === "true");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const spendMap = useMemo(() => {
    const m = new Map<string, number>();
    analytics?.top_customers.forEach((c) => m.set(c.customer_id, c.total_spent));
    return m;
  }, [analytics]);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: custs }, { data: an }] = await Promise.all([
        api.get("/customers", onlyAttention ? { params: { needs_human: true } } : undefined),
        api.get("/analytics/customers"),
      ]);
      setCustomers(custs);
      setAnalytics(an);
    } catch {
      toast.error("Couldn't load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyAttention]);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.original.name || row.original.phone} size={32} color={row.original.needs_human ? "coral" : "lavender"} />
          <div className="min-w-0">
            <p className="font-medium text-charcoal truncate">{row.original.name || "Unnamed"}</p>
            <p className="text-[12px] text-slate-500">{row.original.phone}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "last_interaction",
      header: "Last Activity",
      cell: ({ row }) => (row.original.last_interaction ? timeAgo(row.original.last_interaction) : "—"),
    },
    {
      id: "activity",
      header: "Bookings / Orders",
      cell: ({ row }) => `${row.original.total_bookings} / ${row.original.total_orders}`,
    },
    {
      id: "spend",
      header: "Total Spent",
      cell: ({ row }) => <span className="font-serif text-coral">{formatTZS(spendMap.get(row.original.id) || 0)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (row.original.needs_human ? <Badge status="pending" /> : <Badge status="active" />),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <StatChip label="Total" value={analytics?.total_customers} />
        <StatChip label="New this month" value={analytics?.new_this_month} />
        <StatChip label="Returning" value={analytics?.returning} />
        <button onClick={() => setOnlyAttention((v) => !v)}>
          <StatChip label="Need Attention" value={analytics?.needs_attention} active={onlyAttention} accent />
        </button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        onRowClick={(c) => setSelectedId(c.id)}
        emptyState={<EmptyState icon={Users} title="No customers yet" description="Customers who message your WhatsApp bot will show up here." />}
      />

      <CustomerDetail id={selectedId} onClose={() => setSelectedId(null)} onChanged={load} />
    </div>
  );
}

function StatChip({ label, value, active, accent }: { label: string; value?: number; active?: boolean; accent?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm",
        active ? "bg-coral text-white border-coral" : accent ? "bg-coral-light text-coral-deep border-coral-light" : "bg-white border-slate-100 text-charcoal"
      )}
    >
      <span className="font-serif text-lg">{value ?? "—"}</span>
      <span className="text-[12px] opacity-80">{label}</span>
    </div>
  );
}

function CustomerDetail({ id, onClose, onChanged }: { id: string | null; onClose: () => void; onChanged: () => void }) {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<{ available: boolean; summary?: string; reason?: string } | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setCustomer(null);
      setInsights(null);
      return;
    }
    setLoading(true);
    api
      .get(`/customers/${id}`)
      .then(({ data }) => setCustomer(data))
      .catch(() => toast.error("Couldn't load customer"))
      .finally(() => setLoading(false));
  }, [id]);

  const getInsights = async () => {
    if (!id) return;
    setInsightsLoading(true);
    try {
      const { data } = await api.get(`/customers/${id}/insights`);
      setInsights(data);
    } catch {
      setInsights({ available: false, reason: "Couldn't generate insights" });
    } finally {
      setInsightsLoading(false);
    }
  };

  const clearNeedsHuman = async () => {
    if (!id) return;
    try {
      await api.put(`/customers/${id}/tags`, { tags: { needs_human: false } });
      toast.success("Marked as resolved");
      onChanged();
      onClose();
    } catch {
      toast.error("Couldn't update customer");
    }
  };

  return (
    <Modal open={!!id} onClose={onClose} title={customer?.name || "Customer"}>
      {loading || !customer ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded shimmer animate-dash-shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar name={customer.name || customer.phone} size={56} color={customer.tags?.needs_human ? "coral" : "lavender"} />
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-medium text-charcoal truncate">{customer.name || "Unnamed"}</p>
              <p className="text-sm text-slate-500">{customer.phone}</p>
            </div>
            <a
              href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center text-mint-deep bg-mint-light hover:opacity-80"
            >
              <MessageCircle size={18} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center border-y border-slate-100 py-3">
            <div>
              <div className="font-serif text-xl text-charcoal">{customer.total_bookings}</div>
              <div className="text-[11px] text-slate-500">Bookings</div>
            </div>
            <div>
              <div className="font-serif text-xl text-charcoal">{customer.total_orders}</div>
              <div className="text-[11px] text-slate-500">Orders</div>
            </div>
            <div>
              <div className="font-serif text-xl text-charcoal">{customer.language?.toUpperCase() || "—"}</div>
              <div className="text-[11px] text-slate-500">Language</div>
            </div>
          </div>

          {customer.tags?.needs_human && (
            <div className="flex items-center justify-between bg-coral-light rounded-lg px-4 py-3">
              <span className="flex items-center gap-2 text-[13px] text-coral-deep font-medium">
                <AlertCircle size={15} /> Needs a human reply
              </span>
              <Button size="sm" variant="secondary" onClick={clearNeedsHuman}>
                Mark resolved
              </Button>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[12px] uppercase tracking-wide text-slate-500 font-medium">AI Insights</h4>
              {!insights && (
                <button onClick={getInsights} disabled={insightsLoading} className="text-[12px] text-coral font-medium flex items-center gap-1">
                  <Sparkles size={12} /> {insightsLoading ? "Thinking…" : "Generate"}
                </button>
              )}
            </div>
            {insights && (
              <p className="text-sm text-slate-600 bg-page rounded-lg p-3">
                {insights.available ? insights.summary : "Insights aren't available right now."}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-[12px] uppercase tracking-wide text-slate-500 font-medium mb-2">Activity</h4>
            <div className="space-y-3">
              {(customer.conversations || []).slice(0, 15).map((c: any) => (
                <div key={c.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-charcoal">{c.direction === "inbound" ? "Customer" : "Bot"}</span>
                    <span className="text-[11px] text-slate-400">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-slate-500 text-[13px] line-clamp-2">{c.message}</p>
                </div>
              ))}
              {(!customer.conversations || customer.conversations.length === 0) && (
                <p className="text-sm text-slate-400">No conversations yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

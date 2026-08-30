"use client";
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Search, Download, ShoppingBag, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, DataTable, Badge, EmptyState, Modal, Button, Avatar, PillTabs } from "@/components/ui";
import { formatTZS, formatDate, cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
interface Order {
  id: string;
  customer_id: string;
  customer_name: string | null;
  customer_phone: string;
  status: string;
  delivery_location: string | null;
  delivery_phone: string | null;
  total_amount: number;
  notes: string | null;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
}

const STATUS_OPTIONS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "In Progress" },
  { value: "delivered", label: "Delivered" },
] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch {
      toast.error("Couldn't load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => {
        if (filter === "all") return true;
        if (filter === "preparing") return ["preparing", "confirmed", "out_for_delivery"].includes(o.status);
        return o.status === filter;
      })
      .filter((o) => !search || (o.customer_name || o.customer_phone || "").toLowerCase().includes(search.toLowerCase()));
  }, [orders, filter, search]);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inProgressCount = orders.filter((o) => ["confirmed", "preparing", "out_for_delivery"].includes(o.status)).length;
  const deliveredToday = orders.filter(
    (o) => o.status === "delivered" && new Date(o.created_at).toDateString() === new Date().toDateString()
  ).length;

  const exportCsv = () => {
    const rows = [
      ["Order #", "Customer", "Items", "Total", "Status", "Date"],
      ...filtered.map((o) => [
        o.id.slice(-6).toUpperCase(),
        o.customer_name || o.customer_phone,
        String(o.items.length),
        String(o.total_amount),
        o.status,
        formatDate(o.created_at),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order #",
      cell: ({ row }) => <span className="font-medium text-charcoal">#{row.original.id.slice(-6).toUpperCase()}</span>,
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.original.customer_name || row.original.customer_phone} size={28} />
          <span className="truncate">{row.original.customer_name || row.original.customer_phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => <span className="text-slate-500">{row.original.items.length} item{row.original.items.length === 1 ? "" : "s"}</span>,
    },
    {
      accessorKey: "total_amount",
      header: "Total",
      cell: ({ row }) => <span className="font-serif text-[15px] text-coral">{formatTZS(row.original.total_amount)}</span>,
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge status={row.original.status} /> },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => <span className="text-slate-500">{formatDate(row.original.created_at)}</span>,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-amber py-4 px-5">
          <div className="text-[11px] uppercase text-slate-500 font-medium mb-1">Pending</div>
          <div className="font-serif text-2xl text-charcoal">{pendingCount}</div>
        </Card>
        <Card className="border-l-4 border-l-lavender py-4 px-5">
          <div className="text-[11px] uppercase text-slate-500 font-medium mb-1">In Progress</div>
          <div className="font-serif text-2xl text-charcoal">{inProgressCount}</div>
        </Card>
        <Card className="border-l-4 border-l-mint py-4 px-5">
          <div className="text-[11px] uppercase text-slate-500 font-medium mb-1">Delivered Today</div>
          <div className="font-serif text-2xl text-charcoal">{deliveredToday}</div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <PillTabs options={FILTERS as any} value={filter} onChange={setFilter as any} />
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer…"
              className="w-48 h-9 pl-8 pr-3 rounded-input bg-page border border-slate-200 text-charcoal text-sm outline-none focus:border-coral"
            />
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={exportCsv}>
          Export
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        onRowClick={(o) => setSelected(o)}
        emptyState={<EmptyState icon={ShoppingBag} title="No orders yet" description="Orders placed through WhatsApp will show up here." />}
      />

      <OrderDetailSheet
        order={selected}
        onClose={() => setSelected(null)}
        onUpdated={(updated) => {
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          setSelected(updated);
        }}
      />
    </div>
  );
}

function OrderDetailSheet({
  order,
  onClose,
  onUpdated,
}: {
  order: Order | null;
  onClose: () => void;
  onUpdated: (o: Order) => void;
}) {
  const [saving, setSaving] = useState(false);

  if (!order) return null;

  const updateStatus = async (newStatus: string) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/orders/${order.id}/status`, { status: newStatus });
      toast.success("Order updated");
      onUpdated(data);
    } catch {
      toast.error("Couldn't update order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={!!order} onClose={onClose} title={`Order #${order.id.slice(-6).toUpperCase()}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge status={order.status} />
          <span className="text-[12px] text-slate-400">{formatDate(order.created_at)}</span>
        </div>

        <div>
          <h4 className="text-[12px] uppercase tracking-wide text-slate-500 font-medium mb-2">Customer</h4>
          <div className="flex items-center gap-3">
            <Avatar name={order.customer_name || order.customer_phone} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">{order.customer_name || "Unnamed"}</p>
              <p className="text-[12px] text-slate-500">{order.customer_phone}</p>
            </div>
            <a href={`tel:${order.customer_phone}`} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-page">
              <Phone size={15} />
            </a>
            <a
              href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-mint-deep hover:bg-mint-light"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] uppercase tracking-wide text-slate-500 font-medium mb-2">Items</h4>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-page">
                <tr>
                  <th className="text-left font-medium text-slate-500 text-[12px] px-3 py-2">Product</th>
                  <th className="text-center font-medium text-slate-500 text-[12px] px-3 py-2">Qty</th>
                  <th className="text-right font-medium text-slate-500 text-[12px] px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-50">
                    <td className="px-3 py-2 text-charcoal">{item.product_name}</td>
                    <td className="px-3 py-2 text-center text-slate-500">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-charcoal">{formatTZS(item.subtotal)}</td>
                  </tr>
                ))}
                <tr className="border-t border-slate-100 font-medium">
                  <td className="px-3 py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="px-3 py-2 text-right text-coral font-serif">{formatTZS(order.total_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {order.delivery_location && (
          <div>
            <h4 className="text-[12px] uppercase tracking-wide text-slate-500 font-medium mb-2">Delivery</h4>
            <p className="text-sm text-charcoal">{order.delivery_location}</p>
            {order.delivery_phone && <p className="text-[12px] text-slate-500">{order.delivery_phone}</p>}
          </div>
        )}

        {order.notes && (
          <div>
            <h4 className="text-[12px] uppercase tracking-wide text-slate-500 font-medium mb-2">Notes</h4>
            <p className="text-sm text-slate-600">{order.notes}</p>
          </div>
        )}

        <div>
          <h4 className="text-[12px] uppercase tracking-wide text-slate-500 font-medium mb-2">Update Status</h4>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                disabled={saving || s === order.status}
                onClick={() => updateStatus(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors capitalize disabled:cursor-default",
                  s === order.status ? "bg-charcoal text-white border-charcoal" : "border-slate-200 text-slate-600 hover:border-coral hover:text-coral"
                )}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

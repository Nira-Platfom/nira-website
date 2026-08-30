"use client";
import { useEffect, useRef, useState } from "react";
import { Plus, Megaphone, Tag, Send, Trash2, Pencil, Repeat } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, Button, EmptyState, Modal, Input, Textarea, Switch, PillTabs } from "@/components/ui";
import { formatDate, toLocalISODate, cn } from "@/lib/utils";

type Tab = "promotions" | "broadcasts";

export default function MarketingPage() {
  const [tab, setTab] = useState<Tab>("promotions");
  const [newPromoOpen, setNewPromoOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PillTabs
          options={[
            { value: "promotions", label: "Promotions" },
            { value: "broadcasts", label: "Broadcasts" },
          ]}
          value={tab}
          onChange={setTab as any}
        />
        {tab === "promotions" && (
          <Button icon={<Plus size={16} />} onClick={() => setNewPromoOpen(true)}>
            New Promotion
          </Button>
        )}
      </div>
      {tab === "promotions" ? (
        <PromotionsTab open={newPromoOpen} setOpen={setNewPromoOpen} />
      ) : (
        <BroadcastsTab />
      )}
    </div>
  );
}

const DISCOUNT_TYPES = [
  { value: "percentage", label: "% Off" },
  { value: "fixed_amount", label: "Fixed Amount" },
];
const APPLIES_TO = [
  { value: "entire_order", label: "Entire order" },
  { value: "all_services", label: "All services" },
  { value: "all_products", label: "All products" },
];
const TARGETS = [
  { value: "all", label: "All customers" },
  { value: "returning", label: "Returning" },
  { value: "inactive", label: "Inactive" },
];

function PromotionsTab({ open: sheetOpen, setOpen: setSheetOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    applies_to: "entire_order",
    target_type: "all",
    valid_from: toLocalISODate(new Date()),
    valid_until: toLocalISODate(new Date(Date.now() + 30 * 86400000)),
    max_uses: "",
    is_broadcast: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/marketing/promotions");
      setPromotions(data);
    } catch {
      toast.error("Couldn't load promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.title || !form.discount_value) {
      toast.error("Title and discount value are required");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post("/marketing/promotions", {
        title: form.title,
        description: form.description || undefined,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        applies_to: form.applies_to,
        target_type: form.target_type,
        valid_from: new Date(form.valid_from).toISOString(),
        valid_until: new Date(form.valid_until).toISOString(),
        max_uses: form.max_uses ? parseInt(form.max_uses, 10) : undefined,
        is_broadcast: form.is_broadcast,
      });
      if (data.broadcast) {
        toast.success(`Promotion created and sent to ${data.broadcast.delivered_count} customer(s) on WhatsApp`);
      } else {
        toast.success("Promotion created");
      }
      setSheetOpen(false);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't create promotion");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: any) => {
    try {
      await api.put(`/marketing/promotions/${p.id}`, { is_active: !p.is_active });
      setPromotions((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
    } catch {
      toast.error("Couldn't update promotion");
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/marketing/promotions/${id}`);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Couldn't delete promotion");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-card shimmer animate-dash-shimmer" />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <Card>
          <EmptyState icon={Tag} title="No promotions yet" description="Create a discount to bring customers back." action={{ label: "New Promotion", onClick: () => setSheetOpen(true) }} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {promotions.map((p) => (
            <Card key={p.id} className={!p.is_active || p.is_expired ? "opacity-60" : ""}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[15px] font-medium text-charcoal">{p.title}</h3>
                <span className="text-[11px] bg-coral-light text-coral-deep rounded-full px-2 py-0.5 whitespace-nowrap">
                  {p.discount_type === "percentage" ? `${p.discount_value}% off` : `TZS ${p.discount_value} off`}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mb-3">
                {formatDate(p.valid_from)} – {formatDate(p.valid_until)}
              </p>
              {p.max_uses && (
                <div className="mb-3">
                  <div className="h-1.5 bg-page rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-lavender rounded-full" style={{ width: `${Math.min(100, (p.used_count / p.max_uses) * 100)}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {p.used_count} / {p.max_uses} used
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-coral">
                  <Trash2 size={15} />
                </button>
                <Switch checked={p.is_active} onChange={() => toggleActive(p)} disabled={p.is_expired} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="New Promotion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} loading={saving}>
              Create Promotion
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="End of month special" />
          <Textarea label="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div>
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Discount type</label>
            <div className="grid grid-cols-2 gap-2">
              {DISCOUNT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm({ ...form, discount_type: t.value })}
                  className={cn(
                    "h-11 rounded-input border text-sm font-medium",
                    form.discount_type === t.value ? "border-coral bg-coral-light text-coral" : "border-slate-200 text-slate-600"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label={form.discount_type === "percentage" ? "Discount (%)" : "Discount (TZS)"}
            type="number"
            value={form.discount_value}
            onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
          />

          <div>
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Applies to</label>
            <select
              value={form.applies_to}
              onChange={(e) => setForm({ ...form, applies_to: e.target.value })}
              className="w-full h-12 rounded-input bg-page border border-slate-200 text-charcoal px-4 text-[15px] outline-none focus:border-coral"
            >
              {APPLIES_TO.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Target audience</label>
            <div className="flex flex-wrap gap-2">
              {TARGETS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm({ ...form, target_type: t.value })}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[13px] font-medium border",
                    form.target_type === t.value ? "bg-charcoal text-white border-charcoal" : "border-slate-200 text-slate-600"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Valid from" type="date" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} />
            <Input label="Valid until" type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
          </div>
          <Input label="Max uses (optional)" type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} />

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-sm font-medium text-charcoal block">Send as broadcast now</span>
              <span className="text-[12px] text-slate-400">Also messages this to all your customers on WhatsApp right away</span>
            </div>
            <Switch checked={form.is_broadcast} onChange={(v) => setForm({ ...form, is_broadcast: v })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function BroadcastsTab() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sending, setSending] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/marketing/broadcasts");
      setBroadcasts(data);
    } catch {
      toast.error("Couldn't load broadcasts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post("/marketing/broadcast", { message, target_audience: audience });
      toast.success(`Sent to ${data.delivered_count} customer(s)`);
      setMessage("");
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't send broadcast");
    } finally {
      setSending(false);
    }
  };

  const editIntoComposer = (b: any) => {
    setMessage(b.message);
    setAudience(b.target_audience);
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    composerRef.current?.focus();
    toast.info("Loaded into composer — edit and send when ready");
  };

  const resend = async (b: any) => {
    setResendingId(b.id);
    try {
      const { data } = await api.post("/marketing/broadcast", { message: b.message, target_audience: b.target_audience });
      toast.success(`Resent to ${data.delivered_count} customer(s)`);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't resend broadcast");
    } finally {
      setResendingId(null);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/marketing/broadcasts/${id}`);
      setBroadcasts((prev) => prev.filter((b) => b.id !== id));
      toast.success("Broadcast deleted");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't delete broadcast");
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <textarea
          ref={composerRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Write your message to customers…"
          className="w-full rounded-input bg-page border border-slate-200 text-charcoal px-4 py-3 text-[15px] outline-none focus:border-coral resize-none mb-3"
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="h-10 rounded-input bg-page border border-slate-200 text-charcoal px-3 text-sm outline-none focus:border-coral"
            >
              <option value="all">All customers</option>
              <option value="active_30d">Active last 30 days</option>
              <option value="had_bookings">Had bookings</option>
              <option value="had_orders">Had orders</option>
            </select>
            <span className="text-[12px] text-slate-400">{message.length}/1000</span>
          </div>
          <Button icon={<Send size={15} />} onClick={send} loading={sending} disabled={!message.trim()}>
            Send Broadcast
          </Button>
        </div>
      </Card>

      <Card noPadding>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded shimmer animate-dash-shimmer" />
            ))}
          </div>
        ) : broadcasts.length === 0 ? (
          <EmptyState icon={Megaphone} title="No broadcasts sent" description="Broadcasts you send will appear here." />
        ) : (
          <div className="divide-y divide-slate-50">
            {broadcasts.map((b) => (
              <div key={b.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-charcoal line-clamp-2 flex-1">{b.message}</p>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{formatDate(b.created_at)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4 text-[12px] text-slate-500">
                    <span className="capitalize">{b.target_audience.replace(/_/g, " ")}</span>
                    <span>{b.delivered_count} delivered</span>
                    <span className="capitalize">{b.status}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      title="Edit and resend"
                      onClick={() => editIntoComposer(b)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-page hover:text-charcoal transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      title="Resend as-is"
                      onClick={() => resend(b)}
                      disabled={resendingId === b.id}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-page hover:text-mint-deep transition-colors disabled:opacity-50"
                    >
                      <Repeat size={14} className={resendingId === b.id ? "animate-spin" : ""} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => remove(b.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-page hover:text-coral transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

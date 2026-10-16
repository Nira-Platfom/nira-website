"use client";
import { useEffect, useRef, useState } from "react";
import {
  CalendarClock, CheckCircle2, Clock, Megaphone, Pencil, Plus, Repeat, Send, Tag, Trash2, Users, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, EmptyState, Modal, Input, Textarea, Switch, PillTabs, Badge } from "@/components/ui";
import { formatDate, toLocalISODate, cn } from "@/lib/utils";

type Tab = "promotions" | "broadcasts";

const DAY = 86400000;

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Tag; label: string; value: string | number; tone: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-card sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3.5">
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10", tone)}>
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="font-serif text-[22px] leading-none text-charcoal">{value}</p>
        <p className="mt-1 text-[11px] leading-tight text-slate-500 sm:text-[12px]">{label}</p>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  const [tab, setTab] = useState<Tab>("promotions");
  const [newPromoOpen, setNewPromoOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[20px] font-medium text-charcoal">{tab === "promotions" ? "Promotions" : "Broadcasts"}</h2>
          <p className="mt-0.5 text-[14px] text-slate-500">
            {tab === "promotions"
              ? "Discounts Nira can mention to customers while they're active."
              : "Send a WhatsApp message to your customers — now or scheduled."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
              <span className="hidden sm:inline">New promotion</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}
        </div>
      </div>
      {tab === "promotions" ? <PromotionsTab open={newPromoOpen} setOpen={setNewPromoOpen} /> : <BroadcastsTab />}
    </div>
  );
}

// ── Promotions ───────────────────────────────────────────────────────────────

const DISCOUNT_TYPES = [
  { value: "percentage", label: "% Off" },
  { value: "fixed_amount", label: "Fixed Amount" },
];
const APPLIES_TO = [
  { value: "entire_order", label: "Entire order" },
  { value: "all_services", label: "All services" },
  { value: "all_products", label: "All products" },
];
const APPLIES_LABEL: Record<string, string> = {
  entire_order: "Entire order",
  all_services: "All services",
  all_products: "All products",
  specific_service: "One service",
  specific_product: "One product",
};
const TARGETS = [
  { value: "all", label: "All customers" },
  { value: "returning", label: "Returning" },
  { value: "inactive", label: "Inactive" },
];
const TARGET_LABEL: Record<string, string> = Object.fromEntries(TARGETS.map((t) => [t.value, t.label]));

function promoStatus(p: any): { label: string; dot: string; text: string } {
  const now = Date.now();
  if (p.is_expired || new Date(p.valid_until).getTime() < now) return { label: "Ended", dot: "bg-slate-300", text: "text-slate-500" };
  if (new Date(p.valid_from).getTime() > now) {
    const days = Math.ceil((new Date(p.valid_from).getTime() - now) / DAY);
    return { label: `Starts in ${days} day${days === 1 ? "" : "s"}`, dot: "bg-lavender", text: "text-lavender-deep" };
  }
  if (!p.is_active) return { label: "Paused", dot: "bg-amber", text: "text-amber-deep" };
  return { label: "Live", dot: "bg-mint", text: "text-mint-deep" };
}

function PromotionCard({ p, onToggle, onRemove }: { p: any; onToggle: () => void; onRemove: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const status = promoStatus(p);
  const start = new Date(p.valid_from).getTime();
  const end = new Date(p.valid_until).getTime();
  const elapsed = Math.min(100, Math.max(0, ((Date.now() - start) / Math.max(end - start, 1)) * 100));
  const daysLeft = Math.max(0, Math.ceil((end - Date.now()) / DAY));
  const ended = status.label === "Ended";
  const value = Number(p.discount_value);
  const discount = p.discount_type === "percentage"
    ? `${value}%`
    : value >= 1000 ? `${+(value / 1000).toFixed(1)}K` : `${value}`;
  const discountUnit = p.discount_type === "percentage" ? "off" : "TZS off";

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        ended && "opacity-70"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-coral-light text-coral-deep">
          <span className="font-serif text-[18px] leading-none">{discount}</span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider">{discountUnit}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-medium text-charcoal">{p.title}</h3>
          {p.description ? (
            <p className="mt-0.5 line-clamp-2 text-[13px] text-slate-500">{p.description}</p>
          ) : (
            <p className="mt-0.5 text-[13px] text-slate-400">No description</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-page px-2.5 py-1 text-[11px] font-medium text-slate-600">{APPLIES_LABEL[p.applies_to] || p.applies_to}</span>
        <span className="rounded-full bg-page px-2.5 py-1 text-[11px] font-medium text-slate-600">{TARGET_LABEL[p.target_type] || "All customers"}</span>
        {p.is_broadcast && <span className="rounded-full bg-lavender-light px-2.5 py-1 text-[11px] font-medium text-lavender-deep">Broadcast</span>}
      </div>

      <div className="mb-4 mt-4">
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <span>{formatDate(p.valid_from)} – {formatDate(p.valid_until)}</span>
          {!ended && <span className="font-medium text-charcoal">{daysLeft} day{daysLeft === 1 ? "" : "s"} left</span>}
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-page">
          <div className="h-full rounded-full bg-gradient-to-r from-coral to-lavender transition-all" style={{ width: `${elapsed}%` }} />
        </div>
        {p.max_uses ? (
          <p className="mt-2 text-[12px] text-slate-500">
            <span className="font-medium text-charcoal">{p.used_count}</span> of {p.max_uses} uses
          </p>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", status.text)}>
          <span className={cn("h-2 w-2 rounded-full", status.dot)} />
          {status.label}
        </span>
        <div className="flex items-center gap-2">
          {confirming ? (
            <span className="flex items-center gap-1">
              <button onClick={onRemove} className="rounded-lg bg-coral px-2.5 py-1 text-[12px] font-medium text-white">Delete</button>
              <button onClick={() => setConfirming(false)} className="rounded-lg px-2 py-1 text-[12px] text-slate-500 hover:bg-page">Keep</button>
            </span>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-70 transition-all hover:bg-coral-light hover:text-coral group-hover:opacity-100"
              aria-label="Delete promotion"
            >
              <Trash2 size={15} />
            </button>
          )}
          <Switch checked={p.is_active} onChange={onToggle} disabled={ended} />
        </div>
      </div>
    </article>
  );
}

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
    valid_until: toLocalISODate(new Date(Date.now() + 30 * DAY)),
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
      toast.error(apiErrorMessage(e, "Couldn't create promotion"));
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
      toast.success("Promotion deleted");
    } catch {
      toast.error("Couldn't delete promotion");
    }
  };

  const counts = promotions.reduce(
    (acc, p) => {
      const s = promoStatus(p).label;
      if (s === "Live") acc.live += 1;
      else if (s === "Ended") acc.ended += 1;
      else acc.other += 1;
      return acc;
    },
    { live: 0, other: 0, ended: 0 }
  );

  return (
    <div>
      {!loading && promotions.length > 0 && (
        <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
          <Stat icon={CheckCircle2} label="Live now" value={counts.live} tone="bg-mint-light text-mint-deep" />
          <Stat icon={CalendarClock} label="Upcoming or paused" value={counts.other} tone="bg-lavender-light text-lavender-deep" />
          <Stat icon={XCircle} label="Ended" value={counts.ended} tone="bg-slate-100 text-slate-500" />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-60 rounded-2xl shimmer animate-dash-shimmer" />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
          <EmptyState icon={Tag} title="No promotions yet" description="Create a discount to bring customers back." action={{ label: "New promotion", onClick: () => setSheetOpen(true) }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {promotions.map((p) => (
            <PromotionCard key={p.id} p={p} onToggle={() => toggleActive(p)} onRemove={() => remove(p.id)} />
          ))}
          <button
            onClick={() => setSheetOpen(true)}
            className="group flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 transition-all hover:border-coral hover:bg-coral-light/30 hover:text-coral"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-page transition-colors group-hover:bg-white">
              <Plus size={20} />
            </span>
            <span className="text-[14px] font-medium">New promotion</span>
          </button>
        </div>
      )}

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="New promotion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button onClick={submit} loading={saving}>Create promotion</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="End of month special" />
          <Textarea label="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Discount type</label>
              <div className="grid grid-cols-2 gap-1 rounded-input border border-slate-200 bg-page p-1">
                {DISCOUNT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setForm({ ...form, discount_type: t.value })}
                    className={cn(
                      "h-10 rounded-lg text-[13px] font-medium transition-colors",
                      form.discount_type === t.value ? "bg-white text-coral shadow-card" : "text-slate-500"
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Applies to</label>
              <select
                value={form.applies_to}
                onChange={(e) => setForm({ ...form, applies_to: e.target.value })}
                className="h-12 w-full rounded-input border border-slate-200 bg-page px-4 text-[15px] text-charcoal outline-none focus:border-coral"
              >
                {APPLIES_TO.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <Input label="Max uses (optional)" type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Who it&apos;s for</label>
            <div className="flex flex-wrap gap-2">
              {TARGETS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm({ ...form, target_type: t.value })}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                    form.target_type === t.value ? "border-charcoal bg-charcoal text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"
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

          <div className="flex items-center justify-between rounded-xl bg-page px-4 py-3">
            <div>
              <span className="block text-sm font-medium text-charcoal">Also send as a broadcast now</span>
              <span className="text-[12px] text-slate-500">Messages this to your customers on WhatsApp right away</span>
            </div>
            <Switch checked={form.is_broadcast} onChange={(v) => setForm({ ...form, is_broadcast: v })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Broadcasts ───────────────────────────────────────────────────────────────

const AUDIENCE_LABELS: Record<string, string> = {
  all: "All customers",
  active_30d: "Active last 30 days",
  had_bookings: "Had bookings",
  had_orders: "Had orders",
};

function toLocalISOMinute(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function BroadcastsTab() {
  const { business } = useAuth();
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sending, setSending] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(() => toLocalISOMinute(new Date(Date.now() + 3600000)));
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
    if (isScheduled && new Date(scheduledAt).getTime() <= Date.now()) {
      toast.error("Pick a time in the future");
      return;
    }
    setSending(true);
    try {
      const { data } = await api.post("/marketing/broadcast", {
        message,
        target_audience: audience,
        scheduled_at: isScheduled ? new Date(scheduledAt).toISOString() : undefined,
      });
      if (isScheduled) toast.success(`Scheduled for ${formatDate(data.scheduled_at || scheduledAt)}`);
      else toast.success(`Sent to ${data.delivered_count} customer(s)`);
      setMessage("");
      load();
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Couldn't send broadcast"));
    } finally {
      setSending(false);
    }
  };

  const editIntoComposer = (b: any) => {
    setMessage(b.message);
    setAudience(b.target_audience);
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    composerRef.current?.focus();
    toast.info("Loaded into the composer — edit and send when ready");
  };

  const resend = async (b: any) => {
    setResendingId(b.id);
    try {
      const { data } = await api.post("/marketing/broadcast", { message: b.message, target_audience: b.target_audience });
      toast.success(`Resent to ${data.delivered_count} customer(s)`);
      load();
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Couldn't resend broadcast"));
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
      toast.error(apiErrorMessage(e, "Couldn't delete broadcast"));
    }
  };

  const totalDelivered = broadcasts.reduce((sum, b) => sum + (b.delivered_count || 0), 0);
  const scheduledCount = broadcasts.filter((b) => b.status === "scheduled").length;

  return (
    <div className="space-y-5">
      {!loading && broadcasts.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Stat icon={Megaphone} label="Broadcasts sent" value={broadcasts.length - scheduledCount} tone="bg-coral-light text-coral" />
          <Stat icon={Users} label="Messages delivered" value={totalDelivered.toLocaleString()} tone="bg-mint-light text-mint-deep" />
          <Stat icon={Clock} label="Scheduled" value={scheduledCount} tone="bg-lavender-light text-lavender-deep" />
        </div>
      )}

      {/* Composer + live preview */}
      <section className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card lg:grid-cols-[1.4fr_1fr]">
        <div className="p-5">
          <p className="text-[15px] font-medium text-charcoal">New broadcast</p>
          <textarea
            ref={composerRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Write your message to customers…"
            className="mt-3 w-full resize-none rounded-input border border-slate-200 bg-page px-4 py-3 text-[15px] text-charcoal outline-none transition-colors focus:border-coral"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setAudience(value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                  audience === value ? "border-charcoal bg-charcoal text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >
                {label}
              </button>
            ))}
            <span className={cn("ml-auto text-[12px]", message.length > 900 ? "font-medium text-coral" : "text-slate-400")}>
              {message.length}/1000
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Switch checked={isScheduled} onChange={setIsScheduled} />
              <span className="text-sm text-charcoal">Schedule for later</span>
              {isScheduled && (
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  min={toLocalISOMinute(new Date())}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="h-10 rounded-input border border-slate-200 bg-page px-3 text-sm text-charcoal outline-none focus:border-coral"
                />
              )}
            </div>
            <Button icon={<Send size={15} />} onClick={send} loading={sending} disabled={!message.trim()}>
              {isScheduled ? "Schedule" : "Send now"}
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col justify-center bg-[#ECE5DD] p-5 lg:border-l lg:border-slate-100">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">Preview on WhatsApp</p>
          <div className="max-w-[300px] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm">
            <p className="text-[13px] font-semibold text-charcoal">📢 {business?.name || "Your business"}</p>
            <p className="mt-1.5 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-charcoal">
              {message.trim() || <span className="text-slate-400">Your message will appear here.</span>}
            </p>
            <p className="mt-1 text-right text-[10px] text-slate-400">now</p>
          </div>
          <p className="mt-3 text-[12px] text-slate-600">
            Goes to {AUDIENCE_LABELS[audience].toLowerCase()} who messaged you in the last 24 hours (WhatsApp&apos;s rule).
          </p>
        </div>
      </section>

      {/* History */}
      <section className="rounded-2xl border border-slate-100 bg-white shadow-card">
        <header className="flex items-center justify-between px-5 pt-5">
          <p className="text-[15px] font-medium text-charcoal">History</p>
          {broadcasts.length > 0 && <span className="text-[12px] text-slate-500">{broadcasts.length} total</span>}
        </header>
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl shimmer animate-dash-shimmer" />
            ))}
          </div>
        ) : broadcasts.length === 0 ? (
          <EmptyState icon={Megaphone} title="No broadcasts yet" description="Messages you send will appear here." />
        ) : (
          <div className="mt-3 divide-y divide-slate-50">
            {broadcasts.map((b) => (
              <div key={b.id} className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-page/50 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[14px] leading-relaxed text-charcoal">{b.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge status={b.status} />
                    <span className="rounded-full bg-page px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                      {AUDIENCE_LABELS[b.target_audience] || b.target_audience.replace(/_/g, " ")}
                    </span>
                    <span className="text-[12px] text-slate-500">
                      {b.status === "scheduled" && b.scheduled_at ? (
                        <>Sends {formatDate(b.scheduled_at)}</>
                      ) : (
                        <>
                          <strong className="font-medium text-charcoal">{b.delivered_count}</strong> delivered
                          {b.recipient_count > b.delivered_count && ` of ${b.recipient_count}`} · {formatDate(b.created_at)}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 sm:opacity-60 sm:transition-opacity sm:group-hover:opacity-100">
                  <button title="Edit and resend" onClick={() => editIntoComposer(b)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-white hover:text-charcoal hover:shadow-card">
                    <Pencil size={15} />
                  </button>
                  <button title="Resend as-is" onClick={() => resend(b)} disabled={resendingId === b.id}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-white hover:text-mint-deep hover:shadow-card disabled:opacity-50">
                    <Repeat size={15} className={resendingId === b.id ? "animate-spin" : ""} />
                  </button>
                  <button title="Delete" onClick={() => remove(b.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-coral-light hover:text-coral">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

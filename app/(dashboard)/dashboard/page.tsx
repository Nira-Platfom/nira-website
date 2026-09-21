"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  Clock,
  Users,
  ShoppingBag,
  Zap,
  AlertCircle,
  MessageCircle,
  ShoppingBag as OrderIcon,
  Copy,
  Share2,
  CheckCircle2,
  Circle,
  Sparkles,
  MessageSquareText,
  Star,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { StatCard, Card, Badge, Button } from "@/components/ui";
import { formatTZS, timeAgo, cn } from "@/lib/utils";

interface ActivityItem {
  type: "conversation" | "booking" | "order";
  id: string;
  customer_name: string;
  preview?: string;
  service_name?: string;
  order_number?: string;
  item_count?: number;
  status?: string;
  time: string;
}

interface Summary {
  messages_today: number;
  active_customers_7d: number;
  needs_attention_count: number;
  bot_active: boolean;
  business_phone: string;
  recent_activity: ActivityItem[];
  bookings_today?: number;
  pending_bookings?: number;
  orders_today?: number;
  pending_orders?: number;
}

interface VsPreviousPeriod {
  revenue_total: number;
  bookings?: number;
  orders?: number;
  new_customers: number;
}

interface AnalyticsSummary {
  revenue_total: number;
  bookings_this_month?: number;
  orders_this_month?: number;
  total_customers: number;
  new_customers_this_month: number;
  messages_this_month: number;
  vs_previous_period: VsPreviousPeriod;
}

interface Performer {
  product_id?: string;
  service_id?: string;
  product_name?: string;
  service_name?: string;
  units_sold?: number;
  bookings_count?: number;
  revenue: number;
  percentage: number;
}

interface IntentRow {
  intent: string;
  count: number;
  percentage: number;
}

type Trend = { pct: string; direction: "up" | "down" | "neutral" };

function trendFrom(current: number, previous: number): Trend | undefined {
  if (previous === 0 && current === 0) return undefined;
  if (previous === 0) return { pct: "New", direction: "up" };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 1) return { pct: "0", direction: "neutral" };
  return { pct: `${Math.abs(Math.round(change))}`, direction: change > 0 ? "up" : "down" };
}

const INTENT_LABELS: Record<string, string> = {
  BOOKING: "Booking appointments",
  BOOKING_STATUS: "Checking bookings",
  DISCOVERY_SALON: "Finding a salon",
  DISCOVERY_PRODUCT: "Finding a product",
  DISCOVERY_ARTIST: "Finding a specialist",
  ORDER_PRODUCT: "Ordering products",
  ORDER_STATUS: "Order status",
  ADVICE_SKIN: "Skin advice",
  ADVICE_HAIR: "Hair advice",
  ADVICE_PRODUCT: "Product questions",
  ADVICE_INGREDIENT: "Ingredient questions",
  PAYMENT: "Payment questions",
  REVIEW: "Leaving reviews",
  COMPLAINT: "Complaints",
  HUMAN_REQUEST: "Wanting a human",
  GREETING: "Just saying hi",
  OTHER: "Other",
};

export default function OverviewPage() {
  const { user, business } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [intents, setIntents] = useState<IntentRow[]>([]);
  const [catalogCount, setCatalogCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const isSalon = business?.type === "salon_spa";

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/home/summary");
        if (alive) setSummary(data);
      } catch {
        toast.error("Couldn't load your dashboard");
      } finally {
        if (alive) setLoading(false);
      }
      try {
        const { data } = await api.get("/analytics/summary", { params: { period: "month" } });
        if (alive) setAnalytics(data);
      } catch {
        /* analytics optional on overview */
      }
      try {
        const { data } = await api.get(isSalon ? "/analytics/top-services" : "/analytics/top-products");
        if (alive) setPerformers(data);
      } catch {
        /* optional */
      }
      try {
        const { data } = await api.get("/analytics/intent-breakdown");
        if (alive) setIntents(data.slice(0, 5));
      } catch {
        /* optional */
      }
      try {
        const { data } = await api.get(isSalon ? "/services" : "/products");
        if (alive) setCatalogCount(Array.isArray(data) ? data.length : 0);
      } catch {
        /* optional */
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSalon]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || "";

  const copyLink = () => {
    if (business?.whatsapp_link) {
      navigator.clipboard.writeText(business.whatsapp_link);
      toast.success("Bot link copied");
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const revenueThisMonth = analytics?.revenue_total ?? 0;
  const revenueTrend = analytics ? trendFrom(revenueThisMonth, analytics.vs_previous_period.revenue_total) : undefined;
  const activityCount = isSalon ? analytics?.bookings_this_month : analytics?.orders_this_month;
  const activityTrend =
    analytics && activityCount !== undefined
      ? trendFrom(activityCount, (isSalon ? analytics.vs_previous_period.bookings : analytics.vs_previous_period.orders) ?? 0)
      : undefined;
  const customerTrend = analytics
    ? trendFrom(analytics.new_customers_this_month, analytics.vs_previous_period.new_customers)
    : undefined;

  const checklist = [
    { done: !!business?.bot_active, label: "Activate your WhatsApp bot", href: "/settings" },
    { done: (catalogCount ?? 0) > 0, label: isSalon ? "Add your first service" : "Add your first product", href: isSalon ? "/services" : "/products" },
    { done: (analytics?.total_customers ?? 0) > 0, label: "Get your first customer message", href: "/customers" },
  ];
  const checklistDone = checklist.filter((c) => c.done).length;
  const showChecklist = !loading && checklistDone < checklist.length;

  return (
    <div>
      {/* Greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-[28px] text-charcoal leading-tight">
            {greeting}, {firstName}! {hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{business?.name}</p>
        </div>
      </div>

      {/* Getting started checklist — only for accounts still ramping up */}
      {showChecklist && (
        <Card className="mb-6 border-l-4 border-l-lavender bg-gradient-to-br from-lavender-light/40 to-white">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-lavender-light text-lavender-deep flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-charcoal">Get your bot ready for customers</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">
                {checklistDone} of {checklist.length} done — a few quick steps and you're live.
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            {checklist.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors",
                  item.done ? "text-slate-400" : "text-charcoal hover:bg-white bg-white/60"
                )}
              >
                {item.done ? (
                  <CheckCircle2 size={16} className="text-mint-deep shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-300 shrink-0" />
                )}
                <span className={cn("flex-1", item.done && "line-through")}>{item.label}</span>
                {!item.done && <ArrowRight size={13} className="text-slate-300 shrink-0" />}
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard
          index={0}
          label="Revenue"
          value={formatTZS(revenueThisMonth)}
          sub="this month"
          trend={revenueTrend}
          icon={TrendingUp}
          color="mint"
          loading={loading}
        />
        {isSalon ? (
          <>
            <StatCard index={1} label="Bookings Today" value={summary?.bookings_today ?? 0} icon={Calendar} color="lavender" loading={loading} />
            <StatCard
              index={2}
              label="Bookings This Month"
              value={analytics?.bookings_this_month ?? 0}
              trend={activityTrend}
              sub={`${summary?.pending_bookings ?? 0} pending`}
              icon={Clock}
              color="amber"
              loading={loading}
            />
          </>
        ) : (
          <>
            <StatCard index={1} label="Orders Today" value={summary?.orders_today ?? 0} icon={ShoppingBag} color="lavender" loading={loading} />
            <StatCard
              index={2}
              label="Orders This Month"
              value={analytics?.orders_this_month ?? 0}
              trend={activityTrend}
              sub={`${summary?.pending_orders ?? 0} pending`}
              icon={Clock}
              color="amber"
              loading={loading}
            />
          </>
        )}
        <StatCard
          index={3}
          label="Active Customers"
          value={summary?.active_customers_7d ?? 0}
          sub="last 7 days"
          trend={customerTrend}
          icon={Users}
          color="coral"
          loading={loading}
        />
      </div>

      {/* Bot status banner */}
      {!loading && summary && (
        <Card
          className={summary.bot_active ? "border-l-4 border-l-mint mb-6" : "border-l-4 border-l-coral mb-6"}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              {summary.bot_active ? (
                <Zap size={20} className="text-mint-deep shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-coral shrink-0" />
              )}
              <p className="text-sm text-charcoal">
                {summary.bot_active
                  ? "Your WhatsApp bot is active and serving customers"
                  : "Your bot is inactive — customers cannot reach you"}
              </p>
            </div>
            {summary.bot_active ? (
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm text-slate-500">{summary.messages_today} messages today</span>
                <Link href="/customers" className="text-sm text-coral font-medium hover:underline">
                  View conversations →
                </Link>
              </div>
            ) : (
              <Button size="sm" variant="primary" className="shrink-0" onClick={() => (window.location.href = "/settings")}>
                Activate Bot
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Needs Attention — surfaced early, it's time-sensitive */}
      {!loading && summary && summary.needs_attention_count > 0 && (
        <Card className="border-l-4 border-l-coral mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-medium text-charcoal mb-1">Needs Attention</h3>
              <p className="text-sm text-slate-500">
                {summary.needs_attention_count} customer{summary.needs_attention_count === 1 ? "" : "s"} waiting for a human response
              </p>
            </div>
            <Link href="/customers?needs_human=true">
              <Button size="sm" variant="secondary">View customers</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Conversion funnel — how WhatsApp conversations turned into revenue */}
      {!loading && analytics && (
        <Card className="mb-6">
          <div className="mb-5">
            <h3 className="text-[15px] font-medium text-charcoal">This Month&apos;s Impact</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">How WhatsApp conversations turned into {isSalon ? "bookings" : "orders"} and revenue</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <FunnelStep label="Conversations" value={analytics.messages_this_month.toLocaleString()} icon={MessageSquareText} color="lavender" />
            <ArrowRight size={18} className="hidden sm:block text-slate-300 shrink-0" />
            <FunnelStep
              label={isSalon ? "Bookings" : "Orders"}
              value={(activityCount ?? 0).toLocaleString()}
              icon={isSalon ? Calendar : ShoppingBag}
              color="amber"
            />
            <ArrowRight size={18} className="hidden sm:block text-slate-300 shrink-0" />
            <FunnelStep label="Revenue" value={formatTZS(revenueThisMonth)} icon={TrendingUp} color="mint" />
          </div>
          {analytics.messages_this_month > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-100 text-center">
              <span className="text-[13px] text-slate-500">
                <strong className="text-charcoal font-medium">
                  {Math.round(((activityCount ?? 0) / analytics.messages_this_month) * 100)}%
                </strong>{" "}
                of conversations turned into a {isSalon ? "booking" : "order"} this month
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card title="Revenue Overview">
            <RevenueChart />
          </Card>

          <Card title={isSalon ? "Top Services" : "Top Products"} action={<Link href="/analytics" className="text-[13px] text-coral font-medium hover:underline">View analytics →</Link>}>
            <TopPerformers performers={performers} loading={loading} isSalon={isSalon} />
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Recent Activity"
            action={
              <Link href="/customers" className="text-[13px] text-coral font-medium hover:underline">
                See all →
              </Link>
            }
          >
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 rounded shimmer animate-dash-shimmer" />
                ))}
              </div>
            ) : !summary || summary.recent_activity.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No activity yet</p>
            ) : (
              <div className="space-y-1">
                {summary.recent_activity.map((item) => (
                  <ActivityRow key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            )}
          </Card>

          {intents.length > 0 && (
            <Card title="What Customers Ask">
              <div className="space-y-3">
                {intents.map((row) => (
                  <div key={row.intent} className="flex items-center gap-3">
                    <MessageSquareText size={14} className="text-lavender-deep shrink-0" />
                    <span className="text-[13px] text-charcoal flex-1 min-w-0 truncate">
                      {INTENT_LABELS[row.intent] || row.intent}
                    </span>
                    <div className="w-20 h-1.5 rounded-full bg-page overflow-hidden shrink-0">
                      <div className="h-full bg-lavender rounded-full" style={{ width: `${row.percentage}%` }} />
                    </div>
                    <span className="text-[12px] text-slate-400 w-9 text-right shrink-0">{row.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card title="Share Your Bot">
            <div className="text-center py-2">
              <div className="font-serif text-[28px] text-coral mb-1">{business?.bot_code || "—"}</div>
              <p className="text-[13px] text-slate-500 font-mono break-all mb-4">{business?.whatsapp_link}</p>
              <div className="flex gap-3 justify-center">
                <Button size="sm" variant="secondary" icon={<Copy size={14} />} onClick={copyLink}>
                  Copy Link
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Share2 size={14} />}
                  onClick={() => {
                    if (navigator.share && business?.whatsapp_link) {
                      navigator.share({ url: business.whatsapp_link, title: business.name });
                    } else {
                      copyLink();
                    }
                  }}
                >
                  Share
                </Button>
              </div>
            </div>

            {(business?.booking_link || business?.order_link) && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-left">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Direct Links
                </p>
                <p className="text-[12px] text-slate-500 mb-3">
                  Skip the bot code — these open straight to {isSalon ? "booking" : "ordering"}. Good for your
                  Instagram bio or WhatsApp status.
                </p>
                {business.booking_link && (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-page px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-charcoal">Booking link</p>
                      <p className="text-[11px] text-slate-500 truncate font-mono">{business.booking_link}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Copy size={13} />}
                      onClick={() => copyText(business.booking_link!, "Booking link")}
                    >
                      Copy
                    </Button>
                  </div>
                )}
                {business.order_link && (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-page px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-charcoal">Order link</p>
                      <p className="text-[11px] text-slate-500 truncate font-mono">{business.order_link}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Copy size={13} />}
                      onClick={() => copyText(business.order_link!, "Order link")}
                    >
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function FunnelStep({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: "lavender" | "amber" | "mint";
}) {
  const bg = { lavender: "bg-lavender-light text-lavender-deep", amber: "bg-amber-light text-amber-deep", mint: "bg-mint-light text-mint-deep" }[color];
  return (
    <div className="flex-1 flex items-center gap-3 bg-page rounded-lg px-4 py-3">
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", bg)}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="font-serif text-[18px] text-charcoal leading-tight truncate">{value}</p>
        <p className="text-[11px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function TopPerformers({ performers, loading, isSalon }: { performers: Performer[]; loading: boolean; isSalon: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 rounded shimmer animate-dash-shimmer" />
        ))}
      </div>
    );
  }
  if (performers.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-6 text-center">
        {isSalon ? "No bookings yet this month" : "No orders yet this month"}
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {performers.slice(0, 5).map((p, i) => {
        const name = p.service_name || p.product_name || "—";
        const count = p.bookings_count ?? p.units_sold ?? 0;
        return (
          <div key={p.service_id || p.product_id || name} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-light text-amber-deep flex items-center justify-center shrink-0 text-[11px] font-medium">
              {i === 0 ? <Star size={12} /> : i + 1}
            </div>
            <span className="text-[13px] text-charcoal flex-1 min-w-0 truncate">{name}</span>
            <span className="text-[12px] text-slate-400 shrink-0">
              {count} {isSalon ? "booking" + (count === 1 ? "" : "s") : "sold"}
            </span>
            <span className="text-[13px] font-medium text-charcoal shrink-0 w-24 text-right">{formatTZS(p.revenue)}</span>
          </div>
        );
      })}
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const meta = {
    conversation: { icon: MessageCircle, color: "bg-lavender-light text-lavender-deep", text: item.preview },
    booking: { icon: Calendar, color: "bg-lavender-light text-lavender-deep", text: item.service_name },
    order: { icon: OrderIcon, color: "bg-coral-light text-coral", text: `${item.item_count} item(s)` },
  }[item.type];
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-charcoal truncate">{item.customer_name || "Customer"}</p>
        <p className="text-[12px] text-slate-500 truncate">{meta.text}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[11px] text-slate-400">{timeAgo(item.time)}</p>
        {item.status && <Badge status={item.status} className="mt-1" />}
      </div>
    </div>
  );
}

function RevenueChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    import("recharts").then(setChart);
    api
      .get("/analytics/revenue-chart", { params: { period: "30d" } })
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !Chart) {
    return <div className="h-[280px] rounded shimmer animate-dash-shimmer" />;
  }

  const hasRevenue = data.some((d) => (d.total ?? 0) > 0);
  if (!hasRevenue) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center text-center px-6">
        <TrendingUp size={28} className="text-slate-300 mb-3" />
        <p className="text-sm text-slate-500">No revenue yet in the last 30 days</p>
        <p className="text-[12px] text-slate-400 mt-1 max-w-xs">
          Once orders or bookings come in, you&apos;ll see the trend here.
        </p>
      </div>
    );
  }

  const { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } = Chart;

  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -10, right: 10, top: 10 }}>
          <defs>
            <linearGradient id="coralFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatTZS(v)} width={70} />
          <Tooltip
            formatter={(v: number) => formatTZS(v)}
            contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 13 }}
          />
          <Area type="monotone" dataKey="total" stroke="#FF6B6B" strokeWidth={2} fill="url(#coralFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

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
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { StatCard, Card, Badge, Button } from "@/components/ui";
import { formatTZS, timeAgo } from "@/lib/utils";

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

export default function OverviewPage() {
  const { user, business } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [revenueToday, setRevenueToday] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
        const { data } = await api.get("/analytics/summary");
        if (alive) {
          const today = data.this_month_revenue ?? data.revenue_total ?? 0;
          setRevenueToday(today);
        }
      } catch {
        /* analytics optional on overview */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const isSalon = business?.type === "salon_spa";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || "";

  const copyLink = () => {
    if (business?.whatsapp_link) {
      navigator.clipboard.writeText(business.whatsapp_link);
      toast.success("Bot link copied");
    }
  };

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

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Revenue"
          value={revenueToday !== null ? formatTZS(revenueToday) : "—"}
          sub="this month"
          icon={TrendingUp}
          color="mint"
          loading={loading}
        />
        {isSalon ? (
          <>
            <StatCard label="Bookings Today" value={summary?.bookings_today ?? 0} icon={Calendar} color="lavender" loading={loading} />
            <StatCard label="Pending Bookings" value={summary?.pending_bookings ?? 0} icon={Clock} color="amber" loading={loading} />
          </>
        ) : (
          <>
            <StatCard label="Orders Today" value={summary?.orders_today ?? 0} icon={ShoppingBag} color="lavender" loading={loading} />
            <StatCard label="Pending Orders" value={summary?.pending_orders ?? 0} icon={Clock} color="amber" loading={loading} />
          </>
        )}
        <StatCard label="Active Customers" value={summary?.active_customers_7d ?? 0} sub="last 7 days" icon={Users} color="coral" loading={loading} />
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

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card title="Revenue Overview">
            <RevenueChart />
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
          </Card>
        </div>
      </div>

      {!loading && summary && summary.needs_attention_count > 0 && (
        <Card className="border-l-4 border-l-coral mt-6">
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

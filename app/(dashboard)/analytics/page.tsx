"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Calendar, Users, ShoppingBag, Download } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, StatCard, PillTabs, Button, DataTable } from "@/components/ui";
import { formatTZS, formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

const COLORS = { coral: "#FF6B6B", lavender: "#B8A9E0", mint: "#6BCFB8" };
const REPORT_PERIODS = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
] as const;

export default function AnalyticsPage() {
  const { business } = useAuth();
  const isSalon = business?.type === "salon_spa";
  const [summary, setSummary] = useState<any>(null);
  const [customersData, setCustomersData] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState<(typeof REPORT_PERIODS)[number]["value"]>("month");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const calls = [api.get("/analytics/summary"), api.get("/analytics/customers"), api.get("/analytics/top-products", { params: { limit: 8 } })];
        if (isSalon) calls.push(api.get("/analytics/top-services", { params: { limit: 5 } }));
        const results = await Promise.all(calls);
        setSummary(results[0].data);
        setCustomersData(results[1].data);
        setTopProducts(results[2].data);
        if (isSalon) setTopServices(results[3].data);
      } catch {
        toast.error("Couldn't load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSalon]);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const res = await api.get("/analytics/report", { params: { period: reportPeriod, format: "csv" }, responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nira-report-${reportPeriod}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't generate report");
    } finally {
      setDownloading(false);
    }
  };

  const revenueBookings = summary?.revenue_from_bookings ?? 0;
  const revenueOrders = summary?.revenue_from_orders ?? 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <PillTabs options={REPORT_PERIODS as any} value={reportPeriod} onChange={setReportPeriod as any} />
        <Button variant="secondary" size="sm" icon={<Download size={14} />} loading={downloading} onClick={downloadReport}>
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard label="Revenue" value={formatTZS(summary?.revenue_total ?? 0)} sub={isSalon ? "this month" : "all time"} icon={TrendingUp} color="mint" loading={loading} />
        {isSalon ? (
          <StatCard label="Bookings" value={summary?.bookings_this_month ?? 0} sub="this month" icon={Calendar} color="lavender" loading={loading} />
        ) : (
          <StatCard label="Orders" value={summary?.this_month_orders ?? summary?.orders_this_month ?? 0} sub="this month" icon={ShoppingBag} color="lavender" loading={loading} />
        )}
        <StatCard label="New Customers" value={summary?.new_customers_this_month ?? 0} sub="this month" icon={Users} color="coral" loading={loading} />
        <StatCard label="Total Customers" value={summary?.total_customers ?? 0} icon={Users} color="amber" loading={loading} />
      </div>

      <Card title="Revenue Overview" className="mb-6">
        <RevenueChart isSalon={isSalon} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {isSalon && (
          <Card title="Top Services">
            {loading ? (
              <div className="h-56 rounded shimmer animate-dash-shimmer" />
            ) : topServices.length === 0 ? (
              <p className="text-sm text-slate-400 py-10 text-center">No completed bookings this month yet</p>
            ) : (
              <div className="space-y-3">
                {topServices.map((s) => (
                  <div key={s.service_id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-charcoal font-medium truncate">{s.service_name}</span>
                      <span className="text-slate-500">{formatTZS(s.revenue)}</span>
                    </div>
                    <div className="h-2 bg-page rounded-full overflow-hidden">
                      <div className="h-full bg-lavender rounded-full" style={{ width: `${s.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <Card title="Revenue Breakdown">
          <DonutChart bookings={revenueBookings} orders={revenueOrders} isSalon={isSalon} />
        </Card>
      </div>

      <Card title="Product Performance" className="mb-6">
        <ProductsTable products={topProducts} loading={loading} />
      </Card>

      <Card title="Top Customers">
        {loading ? (
          <div className="h-56 rounded shimmer animate-dash-shimmer" />
        ) : (
          <div className="space-y-1">
            {(customersData?.top_customers || []).map((c: any) => (
              <div key={c.customer_id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0 text-sm">
                <div>
                  <p className="font-medium text-charcoal">{c.name || c.phone}</p>
                  <p className="text-[12px] text-slate-500">{c.last_activity ? `Last visit ${formatDate(c.last_activity)}` : "No visits yet"}</p>
                </div>
                <span className="font-serif text-coral">{formatTZS(c.total_spent)}</span>
              </div>
            ))}
            {(!customersData || customersData.top_customers.length === 0) && (
              <p className="text-sm text-slate-400 py-6 text-center">No customer activity yet</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function ProductsTable({ products, loading }: { products: any[]; loading: boolean }) {
  const columns: ColumnDef<any>[] = [
    { accessorKey: "product_name", header: "Product", cell: ({ row }) => <span className="font-medium text-charcoal">{row.original.product_name}</span> },
    { accessorKey: "units_sold", header: "Units Sold" },
    { accessorKey: "revenue", header: "Revenue", cell: ({ row }) => <span className="font-serif text-coral">{formatTZS(row.original.revenue)}</span> },
  ];
  return <DataTable columns={columns} data={products} loading={loading} />;
}

function RevenueChart({ isSalon }: { isSalon: boolean }) {
  const [period, setPeriod] = useState<"30d" | "90d" | "12m">("30d");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    import("recharts").then(setChart);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/analytics/revenue-chart", { params: { period } })
      .then(({ data }) => setData(data))
      .catch(() => toast.error("Couldn't load revenue chart"))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PillTabs
          options={[
            { value: "30d", label: "30 Days" },
            { value: "90d", label: "90 Days" },
            { value: "12m", label: "12 Months" },
          ]}
          value={period}
          onChange={setPeriod as any}
        />
      </div>
      {loading || !Chart ? (
        <div className="h-[300px] rounded shimmer animate-dash-shimmer" />
      ) : (
        <div style={{ height: 300 }}>
          <Chart.ResponsiveContainer width="100%" height="100%">
            <Chart.AreaChart data={data} margin={{ left: -10, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="coralFill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.coral} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS.coral} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Chart.CartesianGrid vertical={false} stroke="#F1F5F9" />
              <Chart.XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <Chart.YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatTZS(v)} width={70} />
              <Chart.Tooltip formatter={(v: number) => formatTZS(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13 }} />
              <Chart.Area type="monotone" dataKey="total" name="Total" stroke={COLORS.coral} strokeWidth={2} fill="url(#coralFill2)" />
              {isSalon && <Chart.Area type="monotone" dataKey="from_bookings" name="Bookings" stroke={COLORS.lavender} strokeWidth={1.5} strokeDasharray="4 3" fill="none" />}
              {isSalon && <Chart.Area type="monotone" dataKey="from_orders" name="Orders" stroke={COLORS.mint} strokeWidth={1.5} strokeDasharray="2 3" fill="none" />}
            </Chart.AreaChart>
          </Chart.ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function DonutChart({ bookings, orders, isSalon }: { bookings: number; orders: number; isSalon: boolean }) {
  const [Chart, setChart] = useState<any>(null);
  useEffect(() => {
    import("recharts").then(setChart);
  }, []);

  const total = bookings + orders;
  const data = isSalon
    ? [
        { name: "Bookings", value: bookings, color: COLORS.lavender },
        { name: "Orders", value: orders, color: COLORS.mint },
      ]
    : [{ name: "Orders", value: orders || 1, color: COLORS.coral }];

  if (!Chart) return <div className="h-56 rounded shimmer animate-dash-shimmer" />;

  return (
    <div className="relative" style={{ height: 240 }}>
      <Chart.ResponsiveContainer width="100%" height="100%">
        <Chart.PieChart>
          <Chart.Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={2}>
            {data.map((d, i) => (
              <Chart.Cell key={i} fill={d.color} />
            ))}
          </Chart.Pie>
        </Chart.PieChart>
      </Chart.ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-serif text-xl text-charcoal">{formatTZS(total)}</span>
        <span className="text-[11px] text-slate-500">total</span>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5 text-[12px] text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

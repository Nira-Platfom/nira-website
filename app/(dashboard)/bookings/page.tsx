"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search, Check, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, Button, Badge, EmptyState, Modal, PillTabs, Input } from "@/components/ui";
import { formatDateLong, toLocalISODate, cn } from "@/lib/utils";
import { Calendar as CalIcon } from "lucide-react";

interface Booking {
  id: string;
  customer_id: string;
  customer_name: string | null;
  customer_phone: string;
  service_id: string;
  service_name: string;
  duration_minutes: number;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

const toISODate = toLocalISODate;

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
] as const;

export default function BookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]["value"]>("all");
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: bookings }, { data: svcs }] = await Promise.all([api.get("/bookings"), api.get("/services")]);
      setAllBookings(bookings);
      setServices(svcs);
    } catch {
      toast.error("Couldn't load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of allBookings) {
      const arr = map.get(b.booking_date) || [];
      arr.push(b);
      map.set(b.booking_date, arr);
    }
    return map;
  }, [allBookings]);

  const selectedISO = toISODate(selectedDate);
  const dayBookings = (bookingsByDate.get(selectedISO) || [])
    .filter((b) => statusFilter === "all" || b.status === statusFilter)
    .filter((b) => !search || (b.customer_name || b.customer_phone).toLowerCase().includes(search.toLowerCase()));

  const todayISO = toISODate(new Date());
  const thisWeekCount = allBookings.filter((b) => {
    const d = new Date(b.booking_date);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return d >= weekAgo && d <= now;
  }).length;
  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const todayCount = (bookingsByDate.get(todayISO) || []).length;

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success("Booking updated");
      load();
    } catch {
      toast.error("Couldn't update booking");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-[340px] shrink-0 space-y-4">
        <MiniCalendar
          month={month}
          setMonth={setMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          bookingsByDate={bookingsByDate}
        />
        <Card>
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div>
              <div className="font-serif text-2xl text-charcoal">{todayCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Today</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-charcoal">{thisWeekCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">This week</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-amber-deep">{pendingCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Pending</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-[17px] font-medium text-charcoal">{formatDateLong(selectedDate)}</h2>
          <Button icon={<Plus size={16} />} onClick={() => setSheetOpen(true)}>
            Add Booking
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <PillTabs options={STATUS_FILTERS as any} value={statusFilter} onChange={setStatusFilter as any} />
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer…"
              className="w-full h-9 pl-8 pr-3 rounded-input bg-page border border-slate-200 text-charcoal text-sm outline-none focus:border-coral"
            />
          </div>
        </div>

        <Card noPadding>
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded shimmer animate-dash-shimmer" />
              ))}
            </div>
          ) : dayBookings.length === 0 ? (
            <EmptyState
              icon={CalIcon}
              title="No bookings this day"
              description="Add a booking or pick another date on the calendar."
              action={{ label: "Add Booking", onClick: () => setSheetOpen(true) }}
            />
          ) : (
            <div className="divide-y divide-slate-50">
              {dayBookings
                .sort((a, b) => a.booking_time.localeCompare(b.booking_time))
                .map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4">
                    <div className="w-16 shrink-0 text-[13px] font-medium text-slate-500">{b.booking_time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{b.customer_name || b.customer_phone}</p>
                      <p className="text-[12px] text-slate-500 truncate">
                        {b.service_name} · {b.duration_minutes}min
                      </p>
                    </div>
                    <Badge status={b.status} />
                    <div className="flex items-center gap-1 shrink-0">
                      {b.status !== "completed" && b.status !== "cancelled" && (
                        <>
                          <button
                            title="Mark complete"
                            onClick={() => updateStatus(b.id, "completed")}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-mint-deep hover:bg-mint-light"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            title="Cancel"
                            onClick={() => updateStatus(b.id, "cancelled")}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-coral hover:bg-coral-light"
                          >
                            <XIcon size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>

      <AddBookingSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        services={services}
        defaultDate={selectedISO}
        onSaved={() => {
          setSheetOpen(false);
          load();
        }}
      />
    </div>
  );
}

function MiniCalendar({
  month,
  setMonth,
  selectedDate,
  setSelectedDate,
  bookingsByDate,
}: {
  month: Date;
  setMonth: (d: Date) => void;
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  bookingsByDate: Map<string, Booking[]>;
}) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-start
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const todayISO = toISODate(new Date());

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, (): Date | null => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, m, i + 1)),
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMonth(new Date(year, m - 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-page text-slate-500">
          <ChevronLeft size={16} />
        </button>
        <span className="text-[14px] font-medium text-charcoal">
          {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </span>
        <button onClick={() => setMonth(new Date(year, m + 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-page text-slate-500">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="text-[11px] text-slate-400 font-medium">
            {d}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const iso = toISODate(date);
          const isSelected = iso === toISODate(selectedDate);
          const isToday = iso === todayISO;
          const hasBookings = bookingsByDate.has(iso);
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-full text-[13px] relative transition-colors",
                isSelected ? "bg-coral text-white font-medium" : isToday ? "border border-coral text-coral" : "text-charcoal hover:bg-page"
              )}
            >
              {date.getDate()}
              {hasBookings && !isSelected && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-coral" />}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function AddBookingSheet({
  open,
  onClose,
  services,
  defaultDate,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  services: Service[];
  defaultDate: string;
  onSaved: () => void;
}) {
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("10:00");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDate(defaultDate);
      setServiceId(services[0]?.id || "");
    }
  }, [open, defaultDate, services]);

  const submit = async () => {
    if (!serviceId || !customerPhone || !date || !time) {
      toast.error("Fill in service, date, time and phone");
      return;
    }
    setSaving(true);
    try {
      await api.post("/bookings", {
        service_id: serviceId,
        customer_phone: customerPhone,
        customer_name: customerName || undefined,
        booking_date: date,
        booking_time: time,
        notes: notes || undefined,
      });
      toast.success("Booking created");
      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      onSaved();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't create booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Booking"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} loading={saving}>
            Save Booking
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Service</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full h-12 rounded-input bg-page border border-slate-200 text-charcoal px-4 text-[15px] outline-none focus:border-coral"
          >
            {services.length === 0 && <option value="">No services yet</option>}
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.duration_minutes}min
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <Input label="Customer name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Grace Mwakasege" />
        <Input label="WhatsApp phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+255 7xx xxx xxx" />
        <div>
          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-input bg-page border border-slate-200 text-charcoal px-4 py-3 text-[15px] outline-none focus:border-coral resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}

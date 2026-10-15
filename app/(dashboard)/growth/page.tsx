"use client";
import { useEffect, useState } from "react";
import { CalendarClock, Rocket, Send, XCircle } from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "@/lib/api";
import { Badge, Button, Card, EmptyState, Input, LoadingSpinner, Modal } from "@/components/ui";
import { formatTZS, toLocalISODate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceGap {
  service_id: string;
  service: string;
  price: number;
  duration_minutes: number;
  open_slots: string[];
  open_count: number;
}
interface EmptySlots {
  date: string;
  weekday: string;
  closed: boolean;
  capacity_per_slot: number;
  bookings: number;
  free_hour_count: number;
  services: ServiceGap[];
}
interface SlotPromo {
  id: string;
  service: string | null;
  target_date: string;
  discount_percent: number;
  max_slots: number;
  booked_count: number;
  sent_count: number;
  skipped_count: number;
  revenue: number;
  status: string;
}

export default function GrowthPage() {
  const { business } = useAuth();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [day, setDay] = useState(toLocalISODate(tomorrow));
  const [gaps, setGaps] = useState<EmptySlots | null>(null);
  const [promos, setPromos] = useState<SlotPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<{ service?: ServiceGap; discount: number; maxSlots: number; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const loadPromos = () => api.get("/nira/growth/promotions").then(({ data }) => setPromos(data.promotions)).catch(() => {});

  useEffect(() => {
    loadPromos();
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/nira/growth/empty-slots?date=${day}`)
      .then(({ data }) => setGaps(data))
      .catch((e) => toast.error(apiErrorMessage(e, "Couldn't load your calendar")))
      .finally(() => setLoading(false));
  }, [day]);

  if (business && business.type !== "salon_spa") {
    return (
      <EmptyState icon={Rocket} title="Slot promotions are for salons & spas" description="Use Marketing to promote products to your customers." />
    );
  }

  const createAndSend = async () => {
    if (!draft) return;
    setBusy(true);
    try {
      const { data: promo } = await api.post("/nira/growth/promotions", {
        target_date: day,
        service_id: draft.service?.service_id ?? null,
        discount_percent: draft.discount,
        max_slots: draft.maxSlots,
        message: draft.message.trim() || null,
      });
      const { data } = await api.post(`/nira/growth/promotions/${promo.id}/approve`, { send_now: true, reach: "own_and_nearby" });
      const r = data.send_result;
      toast.success(
        r ? `Approved — sent to ${r.sent} customer${r.sent === 1 ? "" : "s"}${r.skipped_outside_window ? `, ${r.skipped_outside_window} not reachable right now` : ""}` : "Approved"
      );
      setDraft(null);
      loadPromos();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't start the promotion"));
    } finally {
      setBusy(false);
    }
  };

  const cancel = async (id: string) => {
    try {
      await api.post(`/nira/growth/promotions/${id}/cancel`);
      loadPromos();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't cancel"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-[26px] text-charcoal leading-tight">Fill your empty slots</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Pick a day, choose a discount you&apos;re happy with, and Nira tells customers who opted in to offers. When they reply, Nira books them
          into the free slots at your discount — never more slots than you allow, and never a discount you didn&apos;t approve.
        </p>
      </div>

      <Card
        title="Free time"
        action={
          <input
            type="date"
            value={day}
            min={toLocalISODate(new Date())}
            onChange={(e) => setDay(e.target.value)}
            className="h-10 rounded-input border border-slate-200 bg-white px-3 text-sm text-charcoal"
            aria-label="Day"
          />
        }
      >
        {loading || !gaps ? (
          <LoadingSpinner />
        ) : gaps.closed ? (
          <EmptyState icon={CalendarClock} title="You're closed that day" description="Pick another day, or update your hours in Marketplace." />
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-4">
              {gaps.weekday}: {gaps.bookings} booking{gaps.bookings === 1 ? "" : "s"}, {gaps.free_hour_count} free hour
              {gaps.free_hour_count === 1 ? "" : "s"} (capacity {gaps.capacity_per_slot} per slot).
            </p>
            <div className="divide-y divide-slate-100">
              {gaps.services.map((s) => (
                <div key={s.service_id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal">{s.service}</p>
                    <p className="text-[12px] text-slate-500">
                      {formatTZS(s.price)} · {s.duration_minutes} min ·{" "}
                      {s.open_count ? `${s.open_count} open: ${s.open_slots.slice(0, 6).join(", ")}${s.open_count > 6 ? "…" : ""}` : "fully booked"}
                    </p>
                  </div>
                  {s.open_count > 0 && (
                    <Button size="sm" variant="secondary" icon={<Rocket size={14} />} onClick={() => setDraft({ service: s, discount: 10, maxSlots: Math.min(3, s.open_count), message: "" })}>
                      Promote
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {gaps.free_hour_count > 0 && (
              <Button className="mt-4" size="sm" variant="ghost" onClick={() => setDraft({ discount: 10, maxSlots: 3, message: "" })}>
                Promote any service that day
              </Button>
            )}
          </>
        )}
      </Card>

      <Card title="Your slot promotions">
        {promos.length === 0 ? (
          <EmptyState icon={Rocket} title="No promotions yet" description="Promote a quiet day above — results show up here." />
        ) : (
          <div className="divide-y divide-slate-100">
            {promos.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal">
                    {p.discount_percent}% off {p.service ?? "any service"} ·{" "}
                    {new Date(`${p.target_date}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    Sent to {p.sent_count}
                    {p.skipped_count ? ` (${p.skipped_count} not reachable)` : ""} · booked {p.booked_count}/{p.max_slots} · {formatTZS(p.revenue)} revenue
                  </p>
                </div>
                <Badge status={p.status} />
                {["draft", "approved", "running"].includes(p.status) && (
                  <button onClick={() => cancel(p.id)} className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[12px] text-slate-500 hover:text-coral hover:bg-coral-light">
                    <XCircle size={14} /> Stop
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={`Promote ${draft?.service?.service ?? "any service"}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button icon={<Send size={14} />} onClick={createAndSend} loading={busy}>Approve &amp; send</Button>
          </div>
        }
      >
        {draft && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Discount (%)" type="number" min={1} max={70} value={draft.discount}
                onChange={(e) => setDraft({ ...draft, discount: Number(e.target.value) })} />
              <Input label="Max discounted slots" type="number" min={1} max={50} value={draft.maxSlots}
                onChange={(e) => setDraft({ ...draft, maxSlots: Number(e.target.value) })} />
            </div>
            {draft.service && (
              <p className="text-sm text-slate-600">
                Customers pay {formatTZS(draft.service.price * (1 - draft.discount / 100))} instead of {formatTZS(draft.service.price)}.
              </p>
            )}
            <div>
              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Your message (optional)</label>
              <textarea
                value={draft.message}
                onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                maxLength={600}
                rows={3}
                placeholder="Leave empty and Nira writes it in each customer's language."
                className="w-full rounded-input border border-slate-200 p-3 text-sm outline-none focus:border-coral"
              />
            </div>
            <p className="text-[12px] text-slate-500">
              Only customers who agreed to receive offers are messaged, with an opt-out. On WhatsApp, Nira can only message people who chatted in
              the last 24 hours, so some may not be reachable.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

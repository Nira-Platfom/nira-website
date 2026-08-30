"use client";
import { useEffect, useState } from "react";
import { Plus, Scissors, Pencil, Clock } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, Button, EmptyState, Modal, Input, Textarea, Switch, ImageUpload } from "@/components/ui";
import { formatTZS } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  description: string | null;
  is_active: boolean;
  image_url?: string | null;
}

const empty = { name: "", price: "", duration_minutes: "30", description: "" };

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/services");
      setServices(data);
    } catch {
      toast.error("Couldn't load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setSheetOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, price: String(s.price), duration_minutes: String(s.duration_minutes), description: s.description || "" });
    setSheetOpen(true);
  };

  const submit = async () => {
    if (!form.name || !form.price || !form.duration_minutes) {
      toast.error("Name, price and duration are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        price: parseFloat(form.price),
        duration_minutes: parseInt(form.duration_minutes, 10),
        description: form.description || undefined,
      };
      if (editing) {
        const { data: updated } = await api.put(`/services/${editing.id}`, body);
        toast.success("Service updated");
        setSheetOpen(false);
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const { data: created } = await api.post("/services", body);
        toast.success("Service added — add a photo below, or close when you're done");
        setEditing(created);
        setServices((prev) => [created, ...prev]);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't save service");
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!editing) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data: updated } = await api.post(`/services/${editing.id}/photo`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditing(updated);
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't upload photo");
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      await api.put(`/services/${s.id}`, { is_active: !s.is_active });
      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: !x.is_active } : x)));
    } catch {
      toast.error("Couldn't update service");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{services.length} service{services.length === 1 ? "" : "s"}</p>
        <Button icon={<Plus size={16} />} onClick={openNew}>
          Add Service
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 rounded-card shimmer animate-dash-shimmer" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card>
          <EmptyState icon={Scissors} title="No services yet" description="Add the services your business offers so customers can book them." action={{ label: "Add Service", onClick: openNew }} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.id} className={`group relative bg-white rounded-card shadow-card border border-slate-100 overflow-hidden ${!s.is_active ? "opacity-60" : ""}`}>
              <div className="h-28 relative overflow-hidden">
                {s.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-lavender-light to-coral-light flex items-center justify-center">
                    <Scissors size={28} className="text-white/70" />
                  </div>
                )}
                <button
                  onClick={() => openEdit(s)}
                  className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Pencil size={18} className="text-white" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-[15px] font-medium text-charcoal mb-1">{s.name}</h3>
                <div className="flex items-center gap-1 text-[12px] text-slate-500 mb-3">
                  <Clock size={12} />
                  {s.duration_minutes} min
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg text-coral">{formatTZS(s.price)}</span>
                  <Switch checked={s.is_active} onChange={() => toggleActive(s)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? "Edit Service" : "Add Service"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>
              {editing ? "Done" : "Cancel"}
            </Button>
            <Button onClick={submit} loading={saving}>
              {editing ? "Save Changes" : "Add Service"}
            </Button>
          </>
        }
      >
        <ImageUpload
          className="mb-5"
          imageUrl={editing?.image_url}
          onUpload={uploadPhoto}
          disabled={!editing}
          disabledHint="Add the service first — then you can add a photo here."
        />
        <div className="space-y-4">
          <Input label="Service name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Gel Manicure" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (TZS)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Duration (minutes)" type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
          </div>
          <Textarea label="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}

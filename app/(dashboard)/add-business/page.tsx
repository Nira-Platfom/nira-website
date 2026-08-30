"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Package } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function AddBusinessPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ business_name: "", business_type: "salon_spa", business_phone: "", business_city: "" });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.business_name || !form.business_phone || !form.business_city) {
      toast.error("Fill in all fields");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post("/businesses/add", form);
      await login(data.access_token);
      toast.success("Business added");
      router.push("/dashboard");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't add business");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card title="Add a Business">
        <div className="space-y-4">
          <Input label="Business name" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />

          <div>
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Business type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "salon_spa", label: "Salon & Spa", icon: Scissors },
                { value: "cosmetic_shop", label: "Cosmetic Shop", icon: Package },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm({ ...form, business_type: t.value })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                    form.business_type === t.value ? "border-coral bg-coral-light" : "border-slate-200"
                  )}
                >
                  <t.icon size={22} className={form.business_type === t.value ? "text-coral" : "text-slate-400"} />
                  <span className={cn("text-[13px] font-medium", form.business_type === t.value ? "text-coral" : "text-slate-600")}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Input label="City" value={form.business_city} onChange={(e) => setForm({ ...form, business_city: e.target.value })} placeholder="Dar es Salaam" />
          <Input label="WhatsApp phone" value={form.business_phone} onChange={(e) => setForm({ ...form, business_phone: e.target.value })} placeholder="+255 7xx xxx xxx" />

          <Button className="w-full" loading={saving} onClick={submit}>
            Create Business
          </Button>
        </div>
      </Card>
    </div>
  );
}

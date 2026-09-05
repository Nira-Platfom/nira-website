"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Scissors, Package } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/ui";
import NiraWordmark from "@/components/NiraWordmark";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    business_name: "",
    business_type: "salon_spa",
    business_city: "",
    business_phone: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password || !form.business_name || !form.business_city || !form.business_phone) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      await login(data.access_token);
      router.push("/dashboard");
    } catch (e: any) {
      if (e?.response?.data?.detail) {
        toast.error(e.response.data.detail);
      } else if (e?.code === "ECONNABORTED") {
        toast.error("The server took too long to respond. Please try again.");
      } else if (!e?.response) {
        toast.error("Couldn't reach the server. Check your connection and try again.");
      } else {
        toast.error("Couldn't create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="lg:hidden mb-6 flex justify-center">
        <NiraWordmark size="lg" />
      </div>

      <h1 className="font-serif text-[28px] text-charcoal mb-1">Get started free</h1>
      <p className="text-sm text-slate-500 mb-6">30-day Pro trial, no card needed</p>

      <form onSubmit={submit} className="space-y-4">
        <Input label="Full name" icon={User} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Grace Mwakasege" />
        <Input label="Email" type="email" icon={Mail} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" autoComplete="email" autoCapitalize="none" autoCorrect="off" />
        <Input label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => set("password", e.target.value)} />

        <div className="flex items-center gap-3 pt-2">
          <div className="h-px bg-slate-100 flex-1" />
          <span className="text-[12px] text-slate-400 font-medium">Your Business</span>
          <div className="h-px bg-slate-100 flex-1" />
        </div>

        <Input label="Business name" value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="Grace Beauty Salon" />

        <div>
          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Business type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "salon_spa", label: "Salon & Spa", desc: "Bookings & services", icon: Scissors },
              { value: "cosmetic_shop", label: "Cosmetic Shop", desc: "Products & orders", icon: Package },
            ].map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => set("business_type", t.value)}
                className={cn(
                  "flex flex-col items-center text-center gap-2 p-4 rounded-lg border-2 transition-colors",
                  form.business_type === t.value ? "border-coral bg-coral-light" : "border-slate-200"
                )}
              >
                <t.icon size={22} className={form.business_type === t.value ? "text-coral" : "text-slate-400"} />
                <span className={cn("text-[13px] font-medium", form.business_type === t.value ? "text-coral" : "text-slate-600")}>{t.label}</span>
                <span className="text-[11px] text-slate-400">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <Input label="City" value={form.business_city} onChange={(e) => set("business_city", e.target.value)} placeholder="Dar es Salaam" />
        <Input label="Phone number (WhatsApp)" value={form.business_phone} onChange={(e) => set("business_phone", e.target.value)} placeholder="+255 7xx xxx xxx" />

        <p className="text-[11px] text-slate-400 pt-1">
          By creating an account you agree to Nira&rsquo;s Terms of Service and Privacy Policy.
        </p>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="flex items-center gap-2 mt-6 justify-center text-[13px]">
        <span className="text-slate-500">Already have an account?</span>
        <Link href="/login" className="text-coral font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Scissors, Package, Store, MapPin, Phone, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/ui";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animations";
import AuthCoverReveal from "@/components/AuthCoverReveal";
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
  const [showPassword, setShowPassword] = useState(false);

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
      toast.error(apiErrorMessage(e, "Couldn't create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCoverReveal
      title="Get Started Free"
      tagline="Join 500+ beauty businesses growing with Nira on WhatsApp."
      ctaLabel="Get Started"
      switchLabel="Sign in"
      switchHref="/login"
    >
      <FadeUp>
        <h1 className="font-serif text-[28px] text-charcoal mb-1">Get started free</h1>
        <p className="text-sm text-slate-500 mb-6">3-month Pro trial, no card needed</p>
      </FadeUp>

      <StaggerContainer>
        <form onSubmit={submit} className="space-y-4">
          <StaggerItem>
            <Input label="Full name" icon={User} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Grace Mwakasege" />
          </StaggerItem>
          <StaggerItem>
            <Input label="Email" type="email" icon={Mail} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" autoComplete="email" autoCapitalize="none" autoCorrect="off" />
          </StaggerItem>
          <StaggerItem>
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                autoComplete="new-password"
                hint="At least 8 characters, with a letter and a number"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-coral transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[12px] text-slate-400 font-medium">Your Business</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
          </StaggerItem>

          <StaggerItem>
            <Input label="Business name" icon={Store} value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="Grace Beauty Salon" />
          </StaggerItem>

          <StaggerItem>
            <div>
              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Business type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "salon_spa", label: "Salon & Spa", desc: "Bookings & services", icon: Scissors },
                  { value: "cosmetic_shop", label: "Cosmetic Shop", desc: "Products & orders", icon: Package },
                ].map((t) => {
                  const selected = form.business_type === t.value;
                  return (
                    <motion.button
                      type="button"
                      key={t.value}
                      onClick={() => set("business_type", t.value)}
                      whileTap={{ scale: 0.96 }}
                      animate={{ scale: selected ? 1.02 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={cn(
                        "relative flex flex-col items-center text-center gap-2 p-4 rounded-lg border-2 transition-colors",
                        selected ? "border-coral bg-coral-light" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {selected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-coral flex items-center justify-center shadow-sm"
                        >
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </motion.span>
                      )}
                      <t.icon size={22} className={selected ? "text-coral" : "text-slate-400"} />
                      <span className={cn("text-[13px] font-medium", selected ? "text-coral" : "text-slate-600")}>{t.label}</span>
                      <span className="text-[11px] text-slate-400">{t.desc}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <Input label="City" icon={MapPin} value={form.business_city} onChange={(e) => set("business_city", e.target.value)} placeholder="Dar es Salaam" />
          </StaggerItem>
          <StaggerItem>
            <Input label="Phone number (WhatsApp)" icon={Phone} value={form.business_phone} onChange={(e) => set("business_phone", e.target.value)} placeholder="+255 7xx xxx xxx" />
          </StaggerItem>

          <StaggerItem>
            <p className="text-[11px] text-slate-400 pt-1">
              By creating an account you agree to Nira&rsquo;s Terms of Service and Privacy Policy.
            </p>

            <Button type="submit" className="w-full mt-4" size="lg" loading={loading}>
              Create Account
            </Button>
          </StaggerItem>
        </form>
      </StaggerContainer>

      <FadeUp delay={0.3}>
        <div className="flex items-center gap-2 mt-6 justify-center text-[13px]">
          <span className="text-slate-500">Already have an account?</span>
          <Link href="/login" className="text-coral font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </FadeUp>
    </AuthCoverReveal>
  );
}

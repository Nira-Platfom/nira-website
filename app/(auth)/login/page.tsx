"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/ui";
import NiraWordmark from "@/components/NiraWordmark";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await login(data.access_token);
      router.push("/dashboard");
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="lg:hidden mb-8 flex justify-center">
        <NiraWordmark size="lg" />
      </div>

      <h1 className="font-serif text-[28px] text-charcoal mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-8">Sign in to your dashboard</p>

      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" autoComplete="email" autoCapitalize="none" autoCorrect="off" />
        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-[38px] text-slate-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="text-right mt-1.5">
            <Link href="#" className="text-[13px] text-coral font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-slate-100 flex-1" />
        <span className="text-[13px] text-slate-400">Don&rsquo;t have an account?</span>
        <div className="h-px bg-slate-100 flex-1" />
      </div>

      <Link href="/register">
        <Button variant="secondary" className="w-full" size="lg">
          Create account
        </Button>
      </Link>
    </div>
  );
}

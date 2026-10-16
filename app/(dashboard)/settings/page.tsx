"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api, { apiErrorMessage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { Button, Input, Switch, Avatar, Modal } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import {
  AlertTriangle, ArrowUpRight, Bell, Building2, Copy, Crown, Download, ExternalLink, Globe, KeyRound, MessageCircle,
  Receipt, Share2, Sparkles, Trash2, User, UserPlus, Users as UsersIcon, Wallet,
} from "lucide-react";
import { getPushPermissionState, isCurrentlySubscribed, isPushSupported, subscribeToPush, unsubscribeFromPush } from "@/lib/webPush";

type Section = "profile" | "general" | "bot" | "team" | "subscription";

const SECTIONS: { id: Section; label: string; hint: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", hint: "Your account & security", icon: User },
  { id: "general", label: "Business", hint: "Name, location, contact", icon: Building2 },
  { id: "bot", label: "Nira Assistant", hint: "WhatsApp & web chat", icon: Sparkles },
  { id: "team", label: "Team", hint: "Members & invitations", icon: UsersIcon },
  { id: "subscription", label: "Plan & fees", hint: "How you pay Nira", icon: Wallet },
];

// ── Shared building blocks ───────────────────────────────────────────────────

function Panel({
  title, description, action, children, className, footer,
}: {
  title?: string; description?: string; action?: React.ReactNode; children: React.ReactNode; className?: string; footer?: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-100 bg-white shadow-card", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            {title && <h3 className="text-[15px] font-medium text-charcoal">{title}</h3>}
            {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && <footer className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-3.5">{footer}</footer>}
    </section>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-[20px] font-medium text-charcoal">{title}</h2>
      <p className="mt-0.5 text-[14px] text-slate-500">{description}</p>
    </div>
  );
}

function Shimmer({ h = "h-64" }: { h?: string }) {
  return <div className={cn(h, "rounded-2xl shimmer animate-dash-shimmer")} />;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageInner />
    </Suspense>
  );
}

function SettingsPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { isOwner } = usePermissions();

  const requested = params.get("section") as Section | null;
  const section: Section = requested && SECTIONS.some((s) => s.id === requested) ? requested : "profile";
  const setSection = (id: Section) => router.push(`/settings?section=${id}`);
  const visibleSections = SECTIONS.filter((s) => s.id !== "subscription" || isOwner());

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <nav className="shrink-0 lg:w-64">
        <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-card lg:sticky lg:top-6 lg:flex-col">
          {visibleSections.map((s) => {
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  active ? "bg-coral-light" : "hover:bg-page"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    active ? "bg-coral text-white" : "bg-page text-slate-500 group-hover:text-charcoal"
                  )}
                >
                  <s.icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className={cn("block whitespace-nowrap text-[14px] font-medium", active ? "text-coral-deep" : "text-charcoal")}>{s.label}</span>
                  <span className="hidden text-[12px] text-slate-500 lg:block">{s.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      <div className="min-w-0 flex-1">
        {section === "profile" && <ProfileSection />}
        {section === "general" && <GeneralSection />}
        {section === "bot" && <BotSection />}
        {section === "team" && <TeamSection />}
        {section === "subscription" && <PlanSection />}
      </div>
    </div>
  );
}

// ── Profile ──────────────────────────────────────────────────────────────────

function NotificationsPanel() {
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const supportedNow = isPushSupported();
      setSupported(supportedNow);
      if (supportedNow) {
        setPermission(await getPushPermissionState());
        setEnabled(await isCurrentlySubscribed());
      }
      setChecked(true);
    })();
  }, []);

  const toggle = async (next: boolean) => {
    setBusy(true);
    try {
      if (next) {
        await subscribeToPush();
        setEnabled(true);
        setPermission("granted");
        toast.success("Notifications enabled");
      } else {
        await unsubscribeFromPush();
        setEnabled(false);
        toast.success("Notifications turned off");
      }
    } catch (e: any) {
      toast.error(e?.message || "Couldn't update notification settings");
    } finally {
      setBusy(false);
    }
  };

  if (!checked) return null;

  return (
    <Panel>
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral-light text-coral">
          <Bell size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-charcoal">Push notifications on this device</p>
          <p className="text-[13px] text-slate-500">
            {!supported
              ? "This browser doesn't support push — install Nira to your home screen for the best experience."
              : permission === "denied"
              ? "Notifications are blocked for this site in your browser settings — enable them there first."
              : "Get notified the moment a new order, booking, or customer needing attention comes in."}
          </p>
        </div>
        <Switch checked={enabled} onChange={toggle} disabled={busy || !supported || permission === "denied"} />
      </div>
    </Panel>
  );
}

function ProfileSection() {
  const { user, logout, refreshUser } = useAuth();
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || "", email: user.email || "" });
  }, [user]);

  const profileUnchanged = user && form.full_name === user.full_name && form.email === user.email;

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.put("/auth/me", form);
      toast.success("Profile updated");
      await refreshUser();
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Couldn't save changes"));
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("/auth/change-password", { current_password: pwForm.current_password, new_password: pwForm.new_password });
      toast.success("Password changed");
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Couldn't change password"));
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/auth/account");
      toast.success("Account deleted");
      logout();
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Couldn't delete your account"));
      setDeleting(false);
    }
  };

  return (
    <div>
      <SectionIntro title="Profile" description="Your personal account, sign-in and notifications." />
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel
            title="Personal info"
            footer={
              <Button size="sm" loading={savingProfile} disabled={!!profileUnchanged} onClick={saveProfile}>
                Save changes
              </Button>
            }
          >
            <div className="mb-5 flex items-center gap-4">
              <Avatar name={user?.full_name} size={52} />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-charcoal">{user?.full_name}</p>
                <p className="truncate text-[13px] text-slate-500">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <Input label="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </Panel>

          <Panel
            title="Password"
            description="Use at least 8 characters."
            action={<KeyRound size={18} className="text-slate-400" />}
            footer={
              <Button
                size="sm"
                loading={savingPassword}
                disabled={!pwForm.current_password || !pwForm.new_password || !pwForm.confirm_password}
                onClick={changePassword}
              >
                Update password
              </Button>
            }
          >
            <div className="space-y-4">
              <Input label="Current password" type="password" value={pwForm.current_password}
                onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="New password" type="password" value={pwForm.new_password}
                  onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} />
                <Input label="Confirm" type="password" value={pwForm.confirm_password}
                  onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })} />
              </div>
            </div>
          </Panel>
        </div>

        <NotificationsPanel />

        <section className="flex flex-col gap-4 rounded-2xl border border-coral/30 bg-coral-light/40 px-6 py-5 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-coral">
            <AlertTriangle size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-charcoal">Delete account</p>
            <p className="text-[13px] text-slate-600">
              Permanently deletes your account. Businesses you own alone are deleted with all their data. This can&apos;t be undone.
            </p>
          </div>
          <Button variant="danger" size="sm" icon={<Trash2 size={15} />} onClick={() => setDeleteOpen(true)}>
            Delete account
          </Button>
        </section>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteConfirmText("");
        }}
        title="Delete your account"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" loading={deleting} disabled={deleteConfirmText !== "DELETE"} onClick={deleteAccount}>
              Delete permanently
            </Button>
          </div>
        }
      >
        <div className="space-y-4 p-6">
          <p className="text-sm text-charcoal">
            This permanently deletes your account and — for any business you own without other active team members — every
            product, service, booking, order, customer, and conversation it has. There is no way to undo this.
          </p>
          <Input label='Type "DELETE" to confirm' value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" />
        </div>
      </Modal>
    </div>
  );
}

// ── Business ─────────────────────────────────────────────────────────────────

function GeneralSection() {
  const { business, refreshUser } = useAuth();
  const [form, setForm] = useState<{ name: string; location: string; city: string; phone: string } | null>(null);
  const [initial, setInitial] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load the saved values first — saving a half-empty form would wipe
    // the business's location and phone.
    api
      .get("/business/profile")
      .then(({ data }) => {
        const f = { name: data.name || "", location: data.location || "", city: data.city || "", phone: data.phone || "" };
        setForm(f);
        setInitial(JSON.stringify(f));
      })
      .catch(() => toast.error("Couldn't load business details"));
  }, []);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await api.put("/business/profile", form);
      toast.success("Business details updated");
      setInitial(JSON.stringify(form));
      refreshUser();
    } catch {
      toast.error("Couldn't save changes");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Shimmer />;
  const unchanged = JSON.stringify(form) === initial;

  return (
    <div>
      <SectionIntro title="Business" description="How your business appears to customers and on your statements." />
      <div className="space-y-5">
        <Panel
          title="Business details"
          footer={<Button size="sm" loading={saving} disabled={unchanged} onClick={save}>Save changes</Button>}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Business name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Business type" value={business?.type === "salon_spa" ? "Salon & Spa" : "Cosmetic Shop"} disabled />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+255 7xx xxx xxx" />
            <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <div className="md:col-span-2">
              <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Street, area — e.g. Haile Selassie Rd, Masaki" />
            </div>
          </div>
        </Panel>

        <Link
          href="/marketplace"
          className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-coral/40"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lavender-light text-lavender-deep">
            <Globe size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-charcoal">Marketplace profile</p>
            <p className="text-[13px] text-slate-500">Photos, opening hours, description and reviews customers see on Nira.</p>
          </div>
          <ArrowUpRight size={18} className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral" />
        </Link>
      </div>
    </div>
  );
}

// ── Nira Assistant (WhatsApp + web) ──────────────────────────────────────────

async function makeQr(text: string) {
  const QRCode = (await import("qrcode")).default;
  return QRCode.toDataURL(text, { width: 320, margin: 1, color: { dark: "#1E293B", light: "#FFFFFF" } });
}

function ChannelCard({
  icon, iconClass, title, subtitle, link, preview, qr, qrName,
}: {
  icon: React.ReactNode; iconClass: string; title: string; subtitle: string; link: string; preview?: React.ReactNode;
  qr: string | null; qrName: string;
}) {
  const copy = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied");
  };
  const share = () => (navigator.share ? navigator.share({ url: link, title }) : copy());
  const download = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = qrName;
    a.click();
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", iconClass)}>{icon}</span>
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-charcoal">{title}</p>
          <p className="text-[13px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      {preview && <div className="mt-4">{preview}</div>}

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-100 bg-page px-3 py-2">
        <span className="min-w-0 flex-1 truncate text-[13px] text-slate-600">{link}</span>
        <button onClick={copy} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-coral" aria-label="Copy link">
          <Copy size={15} />
        </button>
      </div>

      <div className="mt-4 flex flex-1 items-end gap-4">
        {qr && (
          <button onClick={download} className="group relative shrink-0 rounded-xl border border-slate-100 p-1.5 transition-colors hover:border-coral" title="Download QR">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt={`${title} QR code`} width={92} height={92} className="rounded-lg" />
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/85 opacity-0 transition-opacity group-hover:opacity-100">
              <Download size={18} className="text-coral" />
            </span>
          </button>
        )}
        <div className="flex flex-1 flex-wrap gap-2">
          <Button size="sm" variant="secondary" icon={<Share2 size={14} />} onClick={share}>Share</Button>
          <a href={link} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition-colors hover:bg-page hover:text-charcoal">
            <ExternalLink size={14} /> Open
          </a>
          {qr && (
            <button onClick={download}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition-colors hover:bg-page hover:text-charcoal">
              <Download size={14} /> QR
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function BotSection() {
  const [config, setConfig] = useState<any>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [waQr, setWaQr] = useState<string | null>(null);
  const [webQr, setWebQr] = useState<string | null>(null);

  const applyConfig = async (data: any) => {
    setConfig(data);
    setName(data.bot_name || "");
    setWaQr(data.whatsapp_link ? await makeQr(data.whatsapp_link) : null);
    setWebQr(data.chat_link ? await makeQr(data.chat_link) : null);
  };

  useEffect(() => {
    api.get("/business/bot-config").then(({ data }) => applyConfig(data)).catch(() => toast.error("Couldn't load assistant settings"));
  }, []);

  const toggleActive = async () => {
    setToggling(true);
    try {
      const { data } = await api.put("/business/bot-config/toggle", { bot_active: !config.bot_active });
      setConfig((c: any) => ({ ...c, bot_active: data.bot_active }));
      toast.success(data.bot_active ? "Nira is now answering your customers" : "Nira is paused");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't update");
    } finally {
      setToggling(false);
    }
  };

  const saveName = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/business/bot-config", { bot_name: name.trim() || null });
      await applyConfig(data);
      toast.success("Assistant name saved");
    } catch {
      toast.error("Couldn't save the name");
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <Shimmer h="h-96" />;
  const live = config.bot_active;
  const prefilled = `Habari Nira! Ningependa huduma kutoka ${config.display_name}`;

  return (
    <div>
      <SectionIntro
        title="Nira Assistant"
        description="Customers reach you by your name — on WhatsApp or the web. No codes to remember."
      />
      <div className="space-y-5">
        {/* Status */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-card">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-coral/10 blur-2xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coral text-white shadow-btn-coral">
              <Sparkles size={22} />
              {live && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-mint" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[17px] font-medium text-charcoal">{config.display_name}</p>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", live ? "bg-mint-light text-mint-deep" : "bg-slate-100 text-slate-600")}>
                  {live ? "Live" : "Paused"}
                </span>
              </div>
              <p className="text-[13px] text-slate-500">
                {live
                  ? "Answering, booking and taking orders for you on WhatsApp and the web."
                  : "Customers won't get replies until you switch Nira back on."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-slate-600">{live ? "On" : "Off"}</span>
              <Switch checked={live} onChange={toggleActive} disabled={toggling} />
            </div>
          </div>
        </section>

        {/* Name */}
        <Panel title="Assistant name" description="Shown to customers. They can also find you by your business name.">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Glow Assistant (optional)" maxLength={100} />
            </div>
            <Button loading={saving} disabled={name.trim() === (config.bot_name || "")} onClick={saveName}>
              Save
            </Button>
          </div>
        </Panel>

        {/* Channels */}
        <div>
          <p className="mb-3 text-[13px] font-medium uppercase tracking-wide text-slate-500">Share with customers</p>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {config.whatsapp_link && (
              <ChannelCard
                icon={<MessageCircle size={19} />}
                iconClass="bg-[#25D366]/15 text-[#128C4B]"
                title="WhatsApp"
                subtitle="Opens Nira on WhatsApp with your name already typed."
                link={config.whatsapp_link}
                qr={waQr}
                qrName="nira-whatsapp-qr.png"
                preview={
                  <div className="rounded-xl bg-[#E9F7EF] px-3 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#128C4B]">Customer&apos;s first message</p>
                    <p className="mt-1 text-[13px] text-charcoal">“{prefilled}”</p>
                  </div>
                }
              />
            )}
            {config.chat_link && (
              <ChannelCard
                icon={<Globe size={19} />}
                iconClass="bg-coral-light text-coral"
                title="Web chat"
                subtitle="Chat with Nira in the browser, already focused on you."
                link={config.chat_link}
                qr={webQr}
                qrName="nira-web-chat-qr.png"
                preview={
                  <div className="rounded-xl bg-coral-light/60 px-3 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-coral-deep">What customers see</p>
                    <p className="mt-1 text-[13px] text-charcoal">Nira chat “with {config.display_name}” — ready to book or order.</p>
                  </div>
                }
              />
            )}
          </div>
          <p className="mt-3 text-[12px] text-slate-500">Tip: print a QR code for your reception desk or add the link to your Instagram bio.</p>
        </div>
      </div>
    </div>
  );
}

// ── Team ─────────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = ["admin", "staff"];

function TeamSection() {
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [inviting, setInviting] = useState(false);
  const { can } = usePermissions();

  const load = async () => {
    setLoading(true);
    try {
      const calls: any[] = [api.get("/members")];
      if (can("manage_team")) calls.push(api.get("/members/invitations"));
      const results = await Promise.all(calls);
      setMembers(results[0].data);
      if (results[1]) setInvitations(results[1].data);
    } catch {
      toast.error("Couldn't load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeRole = async (id: string, role: string) => {
    try {
      await api.put(`/members/${id}/role`, { role });
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
      toast.success("Role updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't update role");
    }
  };

  const removeMember = async (id: string) => {
    try {
      await api.delete(`/members/${id}`);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't remove member");
    }
  };

  const sendInvite = async () => {
    if (!invitePhone) return;
    setInviting(true);
    try {
      await api.post("/members/invite", { phone: invitePhone, role: inviteRole });
      toast.success("Invitation sent");
      setInvitePhone("");
      setInviteOpen(false);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't send invite");
    } finally {
      setInviting(false);
    }
  };

  const cancelInvite = async (id: string) => {
    try {
      await api.delete(`/members/invitations/${id}`);
      setInvitations((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error("Couldn't cancel invitation");
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div>
      <SectionIntro title="Team" description="Owners and admins manage everything; staff handle bookings, orders and customers." />
      <div className="space-y-5">
        <Panel
          title={`Members · ${members.length}`}
          action={
            can("manage_team") && (
              <Button size="sm" icon={<UserPlus size={14} />} onClick={() => setInviteOpen((v) => !v)}>
                Invite
              </Button>
            )
          }
        >
          {inviteOpen && (
            <div className="mb-4 grid grid-cols-1 items-end gap-3 rounded-xl bg-page p-4 sm:grid-cols-[1fr_auto_auto]">
              <Input label="Phone number" value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} placeholder="+255 7xx xxx xxx" />
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="h-12 rounded-input border border-slate-200 bg-white px-3 text-sm text-charcoal outline-none focus:border-coral"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button loading={inviting} onClick={sendInvite}>Send invite</Button>
            </div>
          )}
          <div className="-mx-2 divide-y divide-slate-50">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-page/60">
                <Avatar name={m.full_name || m.email} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-charcoal">
                    {m.full_name || m.email || "Member"}
                    {m.role === "owner" && <Crown size={13} className="text-amber" />}
                  </p>
                  <p className="text-[12px] text-slate-500">Joined {formatDate(m.joined_at)}</p>
                </div>
                {m.role === "owner" ? (
                  <span className="rounded-full bg-amber-light px-2.5 py-0.5 text-[11px] font-medium text-amber-deep">Owner</span>
                ) : can("manage_team") ? (
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                    className="h-9 rounded-input border border-slate-200 bg-page px-2 text-[13px] text-charcoal outline-none focus:border-coral"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[13px] capitalize text-slate-500">{m.role}</span>
                )}
                {can("manage_team") && m.role !== "owner" && (
                  <button onClick={() => removeMember(m.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-coral-light hover:text-coral" aria-label="Remove member">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Panel>

        {can("manage_team") && invitations.length > 0 && (
          <Panel title={`Pending invitations · ${invitations.length}`}>
            <div className="-mx-2 divide-y divide-slate-50">
              {invitations.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-xl px-2 py-3">
                  <div>
                    <p className="text-sm text-charcoal">{inv.phone || inv.email}</p>
                    <p className="text-[12px] capitalize text-slate-500">{inv.role} · expires {formatDate(inv.expires_at)}</p>
                  </div>
                  <button onClick={() => cancelInvite(inv.id)} className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-coral hover:bg-coral-light">
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

// ── Plan & fees ──────────────────────────────────────────────────────────────

function PlanSection() {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/subscription")
      .then(({ data }) => setSub(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Shimmer h="h-48" />;

  return (
    <div>
      <SectionIntro title="Plan & fees" description="Nira earns when it brings you real results — no mandatory monthly subscription." />
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl bg-charcoal px-6 py-6 text-white shadow-card">
          <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-coral/30 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium">
              <Sparkles size={13} /> Nira Marketplace
            </span>
            <p className="mt-3 font-serif text-[26px] leading-tight">No monthly subscription</p>
            <p className="mt-1 max-w-lg text-[14px] text-white/75">
              Commission applies only to completed bookings and orders that come through Nira. Your standard marketplace listing is free.
            </p>
            {sub && (
              <p className="mt-4 text-[13px] text-white/70">
                Messages handled this month:{" "}
                <span className="font-medium text-white">{(sub.messages_used_this_month ?? 0).toLocaleString()}</span>
              </p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Link href="/earnings" className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-coral/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-light text-coral"><Receipt size={18} /></span>
            <p className="mt-4 flex items-center gap-1 text-[15px] font-medium text-charcoal">
              Nira Earnings <ArrowUpRight size={15} className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </p>
            <p className="text-[13px] text-slate-500">What Nira brought you, your monthly statement and disputes.</p>
          </Link>
          <a href="/pricing" target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-coral/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender-light text-lavender-deep"><Wallet size={18} /></span>
            <p className="mt-4 flex items-center gap-1 text-[15px] font-medium text-charcoal">
              How pricing works <ArrowUpRight size={15} className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </p>
            <p className="text-[13px] text-slate-500">Onboarding, commissions and optional promotion services.</p>
          </a>
        </div>
      </div>
    </div>
  );
}


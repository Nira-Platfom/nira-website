"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, Button, Input, Switch, Badge, Avatar, EmptyState } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import { Copy, Share2, Download, UserPlus, Trash2, Crown, Users as UsersIcon } from "lucide-react";

type Section = "general" | "bot" | "team" | "subscription";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "general", label: "General" },
  { id: "bot", label: "WhatsApp Bot" },
  { id: "team", label: "Team" },
  { id: "subscription", label: "Subscription" },
];

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("general");
  const { isOwner } = usePermissions();

  const visibleSections = SECTIONS.filter((s) => s.id !== "subscription" || isOwner());

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <nav className="md:w-48 shrink-0 md:pt-4">
        <div className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
          {visibleSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                "text-left px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                section === s.id ? "bg-coral-light text-coral" : "text-slate-500 hover:bg-white"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="flex-1 min-w-0 max-w-2xl">
        {section === "general" && <GeneralSection />}
        {section === "bot" && <BotSection />}
        {section === "team" && <TeamSection />}
        {section === "subscription" && <SubscriptionSection />}
      </div>
    </div>
  );
}

function GeneralSection() {
  const { business, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", location: "", city: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (business) setForm({ name: business.name || "", location: "", city: business.city || "", phone: "" });
  }, [business]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/business/profile", form);
      toast.success("Business profile updated");
      refreshUser();
    } catch {
      toast.error("Couldn't save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="General">
      <div className="space-y-4">
        <Input label="Business name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Business type" value={business?.type === "salon_spa" ? "Salon & Spa" : "Cosmetic Shop"} disabled />
        <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Street address" />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+255 7xx xxx xxx" />
        <Button loading={saving} onClick={save}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
}

function BotSection() {
  const { business } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/business/bot-config");
      setConfig(data);
      if (data.whatsapp_link) {
        const QRCode = (await import("qrcode")).default;
        setQr(await QRCode.toDataURL(data.whatsapp_link, { width: 240, margin: 1, color: { dark: "#1E293B", light: "#FFFFFF" } }));
      }
    } catch {
      toast.error("Couldn't load bot settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async () => {
    try {
      const { data } = await api.put("/business/bot-config/toggle", { bot_active: !config.bot_active });
      setConfig((c: any) => ({ ...c, bot_active: data.bot_active }));
      toast.success(data.message);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't update bot");
    }
  };

  const saveName = async () => {
    setSaving(true);
    try {
      await api.put("/business/bot-config", { bot_name: config.bot_name });
      toast.success("Bot name saved");
    } catch {
      toast.error("Couldn't save bot name");
    } finally {
      setSaving(false);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const downloadQr = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = "nira-whatsapp-qr.png";
    a.click();
  };

  if (loading || !config) {
    return <div className="h-64 rounded-card shimmer animate-dash-shimmer" />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-mint">
        <p className="text-sm text-charcoal font-medium">WhatsApp Ready</p>
        <p className="text-[13px] text-slate-500 mt-1">Customers can already message your bot using the shared Nira WhatsApp number.</p>
      </Card>

      <Card title="Your Bot">
        <div className="text-center py-4 border-b border-slate-100 mb-4">
          <div className="font-serif text-[32px] text-coral bg-coral-light inline-block px-6 py-3 rounded-lg">{config.bot_code}</div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Button size="sm" variant="secondary" icon={<Copy size={14} />} onClick={() => copy(config.bot_code, "Code")}>
            Copy Code
          </Button>
          <Button size="sm" variant="secondary" icon={<Copy size={14} />} onClick={() => copy(config.whatsapp_link, "Link")}>
            Copy Link
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={<Share2 size={14} />}
            onClick={() => (navigator.share ? navigator.share({ url: config.whatsapp_link }) : copy(config.whatsapp_link, "Link"))}
          >
            Share
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Input label="Bot name" value={config.bot_name || ""} onChange={(e) => setConfig({ ...config, bot_name: e.target.value })} />
          <div className="flex items-end pb-3">
            <Button size="sm" loading={saving} onClick={saveName}>
              Save
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-slate-100">
          <div>
            <p className="text-sm font-medium text-charcoal">Bot Active</p>
            <p className="text-[12px] text-slate-500">Customers can reach {business?.name} on WhatsApp</p>
          </div>
          <Switch checked={config.bot_active} onChange={toggleActive} />
        </div>
      </Card>

      {qr && (
        <Card title="QR Code">
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="WhatsApp bot QR code" className="rounded-lg border border-slate-100 mb-4" width={200} height={200} />
            <Button size="sm" variant="secondary" icon={<Download size={14} />} onClick={downloadQr}>
              Download PNG
            </Button>
            <p className="text-[12px] text-slate-400 mt-3 text-center max-w-xs">Print this and put it at your salon entrance</p>
          </div>
        </Card>
      )}
    </div>
  );
}

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

  if (loading) return <div className="h-64 rounded-card shimmer animate-dash-shimmer" />;

  return (
    <div className="space-y-6">
      <Card
        title="Team Members"
        action={
          can("manage_team") && (
            <Button size="sm" icon={<UserPlus size={14} />} onClick={() => setInviteOpen((v) => !v)}>
              Invite
            </Button>
          )
        }
      >
        {inviteOpen && (
          <div className="flex flex-col sm:flex-row items-end gap-2 mb-4 p-4 bg-page rounded-lg">
            <Input label="Phone number" value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} placeholder="+255 7xx xxx xxx" className="flex-1" />
            <div>
              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="h-12 rounded-input bg-white border border-slate-200 text-charcoal px-3 text-sm outline-none focus:border-coral"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button loading={inviting} onClick={sendInvite}>
              Send
            </Button>
          </div>
        )}
        <div className="divide-y divide-slate-50">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-3">
              <Avatar name={m.full_name || m.email} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate flex items-center gap-1.5">
                  {m.full_name || m.email || "Member"}
                  {m.role === "owner" && <Crown size={12} className="text-amber" />}
                </p>
                <p className="text-[12px] text-slate-500">Joined {formatDate(m.joined_at)}</p>
              </div>
              {m.role === "owner" ? (
                <Badge status="active" className="capitalize" />
              ) : can("manage_team") ? (
                <select
                  value={m.role}
                  onChange={(e) => changeRole(m.id, e.target.value)}
                  className="h-9 rounded-input bg-page border border-slate-200 text-charcoal px-2 text-[13px] outline-none focus:border-coral"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r[0].toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-[13px] text-slate-500 capitalize">{m.role}</span>
              )}
              {can("manage_team") && m.role !== "owner" && (
                <button onClick={() => removeMember(m.id)} className="text-slate-400 hover:text-coral">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {can("manage_team") && invitations.length > 0 && (
        <Card title="Pending Invitations">
          <div className="divide-y divide-slate-50">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-charcoal">{inv.phone || inv.email}</p>
                  <p className="text-[12px] text-slate-500 capitalize">{inv.role} · expires {formatDate(inv.expires_at)}</p>
                </div>
                <button onClick={() => cancelInvite(inv.id)} className="text-[12px] text-coral font-medium">
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function SubscriptionSection() {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/subscription")
      .then(({ data }) => setSub(data))
      .catch(() => toast.error("Couldn't load subscription"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 rounded-card shimmer animate-dash-shimmer" />;
  if (!sub) return <EmptyState icon={UsersIcon} title="No subscription info" description="Contact support if this seems wrong." />;

  const daysLeft = sub.trial_ends_at ? Math.max(0, Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / 86400000)) : null;

  return (
    <Card title="Current Plan">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-serif text-2xl text-charcoal capitalize">{sub.plan}</p>
          <Badge status={sub.status} className="mt-1" />
        </div>
        {daysLeft !== null && sub.status === "trialing" && (
          <div className="text-right">
            <p className="font-serif text-xl text-amber-deep">{daysLeft}</p>
            <p className="text-[11px] text-slate-500">days left in trial</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm py-2 border-t border-slate-100">
        <span className="text-slate-500">Messages used this month</span>
        <span className="text-charcoal font-medium">
          {sub.messages_used_this_month}
          {sub.message_limit ? ` / ${sub.message_limit}` : " / Unlimited"}
        </span>
      </div>
      {sub.plan === "free" && (
        <Button className="w-full mt-4" onClick={() => toast.info("Upgrade flow coming soon")}>
          Upgrade Plan
        </Button>
      )}
    </Card>
  );
}

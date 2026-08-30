"use client";
import { useEffect, useRef, useState } from "react";
import { Globe, Star, Trash2, Upload, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, Button, Textarea, Input, Switch, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MarketplacePage() {
  const [profile, setProfile] = useState<any>(null);
  const [hours, setHours] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: p }, { data: r }] = await Promise.all([api.get("/marketplace/profile"), api.get("/marketplace/reviews")]);
      setProfile(p);
      setHours(
        DAYS.map((_, i) => p.business_hours?.find((h: any) => h.day_of_week === i) || { day_of_week: i, opens_at: "09:00", closes_at: "18:00", is_closed: false })
      );
      setReviews(r);
    } catch {
      toast.error("Couldn't load marketplace profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVisibility = async () => {
    try {
      const { data } = await api.put("/marketplace/visibility", { is_marketplace: !profile.is_marketplace });
      setProfile((p: any) => ({ ...p, is_marketplace: data.is_marketplace }));
      toast.success(data.is_marketplace ? "You're now visible on Nira Marketplace" : "Hidden from Nira Marketplace");
    } catch {
      toast.error("Couldn't update visibility");
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/marketplace/profile", {
        description: profile.description,
        address: profile.address,
        city_area: profile.city_area,
        website_url: profile.website_url,
        instagram_url: profile.instagram_url,
        whatsapp_number: profile.whatsapp_number,
      });
      await api.put("/marketplace/hours", hours);
      toast.success("Profile saved");
      load();
    } catch {
      toast.error("Couldn't save profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadMedia = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      await api.post("/marketplace/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Photo uploaded");
      load();
    } catch {
      toast.error("Couldn't upload photo");
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      await api.delete(`/marketplace/media/${id}`);
      setProfile((p: any) => ({ ...p, media: p.media.filter((m: any) => m.id !== id) }));
    } catch {
      toast.error("Couldn't delete photo");
    }
  };

  const replyToReview = async (id: string, reply: string) => {
    try {
      const { data } = await api.put(`/marketplace/reviews/${id}/reply`, { business_reply: reply });
      setReviews((prev) => prev.map((r) => (r.id === id ? data : r)));
      toast.success("Reply posted");
    } catch {
      toast.error("Couldn't post reply");
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-4">
        <div className="h-24 rounded-card shimmer animate-dash-shimmer" />
        <div className="h-64 rounded-card shimmer animate-dash-shimmer" />
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-medium text-charcoal">Visible on Nira Marketplace</h3>
            <p className="text-sm text-slate-500 mt-1">
              {profile.is_marketplace
                ? `Visible to customers searching in ${profile.city_area || "your area"}`
                : "Hidden — customers cannot discover you"}
            </p>
          </div>
          <Switch checked={profile.is_marketplace} onChange={toggleVisibility} />
        </div>
        {profile.is_marketplace && (
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100 text-center">
            <div>
              <div className="font-serif text-xl text-charcoal">{profile.total_reviews}</div>
              <div className="text-[11px] text-slate-500">Reviews</div>
            </div>
            <div>
              <div className="font-serif text-xl text-charcoal flex items-center justify-center gap-1">
                {profile.avg_rating?.toFixed(1) || "—"} <Star size={14} className="fill-amber text-amber" />
              </div>
              <div className="text-[11px] text-slate-500">Average Rating</div>
            </div>
            <div>
              <div className="font-serif text-xl text-charcoal">{profile.is_verified ? "Verified" : "Unverified"}</div>
              <div className="text-[11px] text-slate-500">Status</div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 space-y-6">
          <Card title="Business Profile">
            <div className="space-y-4">
              <Textarea
                label="Description"
                rows={4}
                value={profile.description || ""}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Tell customers what makes your business special…"
              />
              <Input label="Address" value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
              <Input label="Area / neighborhood" value={profile.city_area || ""} onChange={(e) => setProfile({ ...profile, city_area: e.target.value })} placeholder="Masaki, Dar es Salaam" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Website" value={profile.website_url || ""} onChange={(e) => setProfile({ ...profile, website_url: e.target.value })} />
                <Input label="Instagram" value={profile.instagram_url || ""} onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })} />
              </div>
            </div>
          </Card>

          <Card title="Opening Hours">
            <div className="space-y-2">
              {hours.map((h, i) => (
                <div key={h.day_of_week} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-charcoal shrink-0">{DAYS[h.day_of_week]}</span>
                  <Switch checked={!h.is_closed} onChange={(v) => setHours((prev) => prev.map((x, j) => (j === i ? { ...x, is_closed: !v } : x)))} />
                  {!h.is_closed ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={h.opens_at || "09:00"}
                        onChange={(e) => setHours((prev) => prev.map((x, j) => (j === i ? { ...x, opens_at: e.target.value } : x)))}
                        className="h-9 rounded-input bg-page border border-slate-200 text-charcoal px-2 text-sm outline-none focus:border-coral"
                      />
                      <span className="text-slate-400 text-sm">to</span>
                      <input
                        type="time"
                        value={h.closes_at || "18:00"}
                        onChange={(e) => setHours((prev) => prev.map((x, j) => (j === i ? { ...x, closes_at: e.target.value } : x)))}
                        className="h-9 rounded-input bg-page border border-slate-200 text-charcoal px-2 text-sm outline-none focus:border-coral"
                      />
                    </div>
                  ) : (
                    <span className="text-[13px] text-slate-400">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Photos">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0])} />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {(profile.media || []).map((m: any) => (
                <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden bg-page group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.media_url} alt={m.caption || ""} className="w-full h-full object-cover" />
                  <button
                    onClick={() => deleteMedia(m.id)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-coral hover:text-coral"
              >
                <Upload size={18} />
                <span className="text-[11px] mt-1">Add photo</span>
              </button>
            </div>
          </Card>

          <Button loading={saving} onClick={saveProfile} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>

        <div className="lg:col-span-2">
          <Card title="Live Preview" className="sticky top-20">
            <div className="rounded-lg overflow-hidden border border-slate-100">
              <div className="h-28 bg-gradient-to-br from-coral to-lavender flex items-center justify-center">
                <Globe size={28} className="text-white/80" />
              </div>
              <div className="p-4">
                <h4 className="font-serif text-lg text-charcoal">Business Name</h4>
                <p className="text-[13px] text-slate-500 mb-2">{profile.city_area || "City area"}</p>
                <p className="text-[13px] text-slate-600 line-clamp-3">{profile.description || "Your description will appear here."}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Reviews">
        {reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Customer reviews from the marketplace will appear here." />
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <ReviewRow key={r.id} review={r} onReply={replyToReview} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ReviewRow({ review, onReply }: { review: any; onReply: (id: string, text: string) => void }) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="border-b border-slate-50 pb-4 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} className={i < review.rating ? "fill-amber text-amber" : "text-slate-200"} />
          ))}
          {review.is_verified && <span className="text-[11px] text-mint-deep ml-2">Verified</span>}
        </div>
        <span className="text-[11px] text-slate-400">{formatDate(review.created_at)}</span>
      </div>
      <p className="text-sm text-charcoal mb-2">{review.comment}</p>
      {review.business_reply ? (
        <div className="bg-page rounded-lg p-3 text-[13px] text-slate-600">
          <span className="font-medium text-charcoal">Your reply: </span>
          {review.business_reply}
        </div>
      ) : replying ? (
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply…"
            className="flex-1 h-9 rounded-input bg-page border border-slate-200 text-charcoal px-3 text-sm outline-none focus:border-coral"
          />
          <button
            onClick={() => {
              onReply(review.id, text);
              setReplying(false);
            }}
            className="w-9 h-9 rounded-full bg-coral text-white flex items-center justify-center shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      ) : (
        <button onClick={() => setReplying(true)} className="text-[13px] text-coral font-medium">
          Reply
        </button>
      )}
    </div>
  );
}

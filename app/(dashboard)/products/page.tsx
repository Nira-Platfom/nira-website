"use client";
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, Grid3x3, List, Package, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "@/lib/api";
import { Card, Button, EmptyState, Modal, Input, Textarea, Switch, DataTable, Badge, ImageUpload } from "@/components/ui";
import { formatTZS, cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string | null;
  price: number;
  description: string | null;
  usage_instructions: string | null;
  side_effects: string | null;
  skin_type: string | null;
  in_stock: boolean;
  stock_quantity: number | null;
  is_active: boolean;
  image_url?: string | null;
  brand: string | null;
  is_african_made: boolean;
}

// Below this, a stock quantity is flagged as running low — a nudge to
// restock, not a hard rule.
const LOW_STOCK_THRESHOLD = 5;

const empty = {
  name: "", category: "", price: "", skin_type: "", description: "", usage_instructions: "", side_effects: "",
  in_stock: true, trackStock: false, stock_quantity: "", brand: "", is_african_made: false,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  // A brand-new product has no id yet, so a photo can't be attached to it
  // until it's saved — but the customer still expects to just pick a photo
  // while filling the form, not in two separate steps. Stash the file +
  // a local preview here, then upload it right after the product is
  // created in submit(). For an existing product (editing set), the photo
  // still uploads immediately on pick, same as before.
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null);

  const clearPendingPhoto = () => {
    if (pendingPhotoPreview) URL.revokeObjectURL(pendingPhotoPreview);
    setPendingPhoto(null);
    setPendingPhotoPreview(null);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: activeProds }, { data: inactiveProds }, { data: cats }] = await Promise.all([
        api.get("/products", { params: { is_active: true } }),
        api.get("/products", { params: { is_active: false } }),
        api.get("/products/categories"),
      ]);
      setProducts([...activeProds, ...inactiveProds]);
      setCategories(cats);
    } catch {
      toast.error("Couldn't load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      products
        .filter((p) => category === "all" || p.category === category)
        .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())),
    [products, category, search]
  );

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    clearPendingPhoto();
    setSheetOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category || "",
      price: String(p.price),
      skin_type: p.skin_type || "",
      description: p.description || "",
      usage_instructions: p.usage_instructions || "",
      side_effects: p.side_effects || "",
      in_stock: p.in_stock,
      trackStock: p.stock_quantity !== null,
      stock_quantity: p.stock_quantity !== null ? String(p.stock_quantity) : "",
      brand: p.brand || "",
      is_african_made: p.is_african_made,
    });
    clearPendingPhoto();
    setSheetOpen(true);
  };

  const submit = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (form.trackStock && form.stock_quantity === "") {
      toast.error("Enter a stock quantity, or turn off stock tracking");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        category: form.category || undefined,
        price: parseFloat(form.price),
        skin_type: form.skin_type || undefined,
        description: form.description || undefined,
        usage_instructions: form.usage_instructions || undefined,
        side_effects: form.side_effects || undefined,
        in_stock: form.in_stock,
        stock_quantity: form.trackStock ? parseInt(form.stock_quantity, 10) : null,
        brand: form.brand || undefined,
        is_african_made: form.is_african_made,
      };
      if (editing) {
        const { data: updated } = await api.put(`/products/${editing.id}`, body);
        toast.success("Product updated");
        setSheetOpen(false);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const { data: created } = await api.post("/products", body);
        let finalProduct = created;
        if (pendingPhoto) {
          try {
            finalProduct = await uploadPhotoFor(created.id, pendingPhoto);
          } catch {
            toast.error("Product saved, but the photo couldn't be uploaded — try again from Edit.");
          }
        }
        toast.success("Product added");
        setEditing(finalProduct);
        setProducts((prev) => [finalProduct, ...prev]);
        clearPendingPhoto();
        setSheetOpen(false);
        if (created.category && !categories.includes(created.category)) {
          setCategories((prev) => [...prev, created.category]);
        }
      }
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Couldn't save product"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/products/${deleteTarget.id}`);
      if (data.deleted) {
        setProducts((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      } else {
        setProducts((prev) => prev.map((x) => (x.id === deleteTarget.id ? { ...x, is_active: false } : x)));
      }
      toast.success(data.message);
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(apiErrorMessage(e, "Couldn't delete product"));
    } finally {
      setDeleting(false);
    }
  };

  const uploadPhotoFor = async (productId: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data: updated } = await api.post(`/products/${productId}/photo`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return updated;
  };

  // Editing an existing product: upload right away, same as before. A
  // brand-new one has no id yet — stash the file + a local preview and
  // let submit() upload it once the product is actually created.
  const handlePhotoPick = async (file: File) => {
    if (!editing) {
      if (pendingPhotoPreview) URL.revokeObjectURL(pendingPhotoPreview);
      setPendingPhoto(file);
      setPendingPhotoPreview(URL.createObjectURL(file));
      return;
    }
    try {
      const updated = await uploadPhotoFor(editing.id, file);
      setEditing(updated);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Couldn't upload photo");
    }
  };

  const toggleActive = async (p: Product) => {
    try {
      await api.put(`/products/${p.id}`, { is_active: !p.is_active });
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
    } catch {
      toast.error("Couldn't update product");
    }
  };

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium text-charcoal">{row.original.name}</span> },
    { accessorKey: "category", header: "Category", cell: ({ row }) => row.original.category || "—" },
    { accessorKey: "price", header: "Price", cell: ({ row }) => <span className="font-serif text-coral">{formatTZS(row.original.price)}</span> },
    {
      accessorKey: "in_stock",
      header: "Stock",
      cell: ({ row }) => {
        const { in_stock, stock_quantity } = row.original;
        if (stock_quantity !== null) {
          const low = in_stock && stock_quantity <= LOW_STOCK_THRESHOLD;
          return (
            <span className={cn("text-[13px] font-medium", !in_stock ? "text-coral" : low ? "text-amber-deep" : "text-mint-deep")}>
              {stock_quantity} left{low && !!stock_quantity && " · low"}
            </span>
          );
        }
        return <Badge status={in_stock ? "active" : "cancelled"} />;
      },
    },
    { accessorKey: "is_active", header: "Status", cell: ({ row }) => <Badge status={row.original.is_active ? "active" : "cancelled"} /> },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <button onClick={() => openEdit(row.original)} className="text-slate-400 hover:text-coral">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeleteTarget(row.original)} className="text-slate-400 hover:text-coral">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors",
                category === c ? "bg-charcoal text-white border-charcoal" : "border-slate-200 text-slate-600 hover:border-coral hover:text-coral"
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-44 h-9 pl-8 pr-3 rounded-input bg-page border border-slate-200 text-charcoal text-sm outline-none focus:border-coral"
            />
          </div>
          <div className="flex items-center bg-page rounded-lg p-1 border border-slate-100">
            <button onClick={() => setView("grid")} className={cn("w-8 h-7 flex items-center justify-center rounded", view === "grid" && "bg-white shadow-sm")}>
              <Grid3x3 size={14} className="text-slate-500" />
            </button>
            <button onClick={() => setView("table")} className={cn("w-8 h-7 flex items-center justify-center rounded", view === "table" && "bg-white shadow-sm")}>
              <List size={14} className="text-slate-500" />
            </button>
          </div>
          <Button icon={<Plus size={16} />} onClick={openNew}>
            Add Product
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 rounded-card shimmer animate-dash-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Package} title="No products yet" description="Add products so your AI advisor can recommend them to customers." action={{ label: "Add Product", onClick: openNew }} />
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="group relative bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
              <div className={cn("h-1.5 w-full", p.is_active ? "bg-mint" : "bg-slate-200")} />
              <div className="h-28 relative overflow-hidden">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-coral-light to-lavender-light flex items-center justify-center">
                    <Package size={32} className="text-white/70" />
                  </div>
                )}
                <button
                  onClick={() => openEdit(p)}
                  className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Pencil size={18} className="text-white" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-[14px] font-medium text-charcoal truncate mb-1">{p.name}</h3>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {p.category && <span className="inline-block text-[11px] bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{p.category}</span>}
                  {p.is_african_made && (
                    <span className="inline-block text-[11px] bg-mint-light text-mint-deep rounded-full px-2 py-0.5">🌍 African-made</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-serif text-[17px] text-coral">{formatTZS(p.price)}</span>
                  {p.stock_quantity !== null ? (
                    <span
                      className={cn(
                        "text-[11px] font-medium flex items-center gap-1",
                        !p.in_stock ? "text-coral" : p.stock_quantity <= LOW_STOCK_THRESHOLD ? "text-amber-deep" : "text-mint-deep"
                      )}
                    >
                      {p.in_stock && p.stock_quantity <= LOW_STOCK_THRESHOLD && <AlertTriangle size={11} />}
                      {p.stock_quantity} left
                    </span>
                  ) : (
                    <span className={cn("text-[11px] font-medium", p.in_stock ? "text-mint-deep" : "text-coral")}>
                      {p.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{p.is_active ? "Active" : "Inactive"}</span>
                    <Switch checked={p.is_active} onChange={() => toggleActive(p)} />
                  </div>
                  <button onClick={() => setDeleteTarget(p)} className="text-slate-300 hover:text-coral transition-colors" title="Delete product">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} loading={loading} />
      )}

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? "Edit Product" : "Add Product"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>
              {editing ? "Done" : "Cancel"}
            </Button>
            <Button onClick={submit} loading={saving}>
              {editing ? "Save Changes" : "Add Product"}
            </Button>
          </>
        }
      >
        <ImageUpload
          className="mb-5"
          imageUrl={editing?.image_url || pendingPhotoPreview}
          onUpload={handlePhotoPick}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Input label="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Skincare" />
            <Input label="Price (TZS)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Skin type" value={form.skin_type} onChange={(e) => setForm({ ...form, skin_type: e.target.value })} placeholder="Oily, dry, all…" />
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Optional" />
          </div>
          <div className="space-y-4">
            <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea label="Usage instructions" rows={2} value={form.usage_instructions} onChange={(e) => setForm({ ...form, usage_instructions: e.target.value })} />
            <Textarea label="Side effects" rows={2} value={form.side_effects} onChange={(e) => setForm({ ...form, side_effects: e.target.value })} />
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-charcoal">African-made</span>
              <p className="text-[12px] text-slate-500 mt-0.5">Shown to customers who specifically ask for local/African products</p>
            </div>
            <Switch checked={form.is_african_made} onChange={(v) => setForm({ ...form, is_african_made: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-charcoal">Track stock quantity</span>
              <p className="text-[12px] text-slate-500 mt-0.5">Count units instead of a simple in/out switch</p>
            </div>
            <Switch
              checked={form.trackStock}
              onChange={(v) => setForm({ ...form, trackStock: v, in_stock: v ? form.in_stock : true })}
            />
          </div>
          {form.trackStock ? (
            <Input
              label="Units in stock"
              type="number"
              min={0}
              value={form.stock_quantity}
              onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
              hint="Goes down automatically as WhatsApp orders come in"
            />
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-charcoal">In Stock</span>
              <Switch checked={form.in_stock} onChange={(v) => setForm({ ...form, in_stock: v })} />
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete product"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <p className="text-sm text-charcoal">
            Delete <strong className="font-medium">{deleteTarget?.name}</strong>?
          </p>
          <p className="text-[13px] text-slate-500 mt-2">
            If it's never been ordered, this removes it permanently. If it has past orders, it'll be deactivated
            instead so that order history stays intact — same as turning it off with the Active switch.
          </p>
        </div>
      </Modal>
    </div>
  );
}

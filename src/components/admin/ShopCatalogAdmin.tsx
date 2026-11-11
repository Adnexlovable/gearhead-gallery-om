import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { ArrowLeft, ArrowRight, ExternalLink, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { shopCatalogQueryKey, toShopProduct } from "@/lib/shop";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";

type Product = Tables<"products">;
type Category = Tables<"shop_categories">;
type Color = { name: string; hex: string; image?: string };

const card = "vitrine p-5";
const label = "font-mono-tag text-[9px] text-gold-soft";
const input = "w-full rounded-md border border-gold/20 bg-background/60 px-2.5 py-2 text-sm text-foreground outline-none focus:border-gold/60";
const chip = "font-mono-tag rounded-full border border-gold/30 px-3 py-1.5 text-[9px] text-muted-foreground hover:border-gold hover:text-gold";
const BANDS = [["entry", "Entry level"], ["mid", "Mid range"], ["premium", "Premium"]] as const;

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const colors = (v: unknown): Color[] => (Array.isArray(v) ? v.flatMap((c) => (c && typeof c === "object" && typeof (c as Color).name === "string" && typeof (c as Color).hex === "string" ? [c as Color] : [])) : []);

async function uploadPhoto(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 8_000_000) throw new Error("Photo is too large (max 8 MB).");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `products/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("gearhead-product-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("gearhead-product-images").getPublicUrl(path).data.publicUrl;
}

export function ShopCatalogAdmin({ section = "products" }: { section?: "products" | "categories" }) {
  const [view, setView] = useState<"products" | "categories">("products");
  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const qc = useQueryClient();
  const fetchAll = useCallback(async () => {
    const [c, p] = await Promise.all([
      supabase.from("shop_categories").select("*").order("sort"),
      supabase.from("products").select("*").order("sort"),
    ]);
    if (c.error || p.error) toast.error("Could not load the catalogue: " + (c.error ?? p.error)?.message);
    setCats(c.data ?? []);
    setProducts(p.data ?? []);
  }, []);
  // After every save, drop cached shop data so /, /app and /store show the change straight away.
  const load = useCallback(async () => {
    await fetchAll();
    void qc.invalidateQueries({ queryKey: shopCatalogQueryKey });
    void qc.invalidateQueries({ queryKey: ["shop-product"] });
  }, [fetchAll, qc]);
  useEffect(() => { void fetchAll(); }, [fetchAll]);
  useEffect(() => setView(section), [section]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button className={chip} aria-pressed={view === "products"} onClick={() => setView("products")}>Products ({products.length})</button>
        <button className={chip} aria-pressed={view === "categories"} onClick={() => setView("categories")}>Categories ({cats.length})</button>
        <a href="/app" target="_blank" rel="noreferrer" className={`${chip} inline-flex items-center gap-1`}>Open shop app <ExternalLink size={11} /></a>
        <span className="text-xs text-muted-foreground">Changes go live on the shop app straight away. Names and descriptions are also used as each page's Google title and description.</span>
      </div>
      {view === "categories" ? <Categories cats={cats} reload={load} productCount={(s) => products.filter((p) => p.category === s).length} /> : <Products products={products} cats={cats} reload={load} />}
    </div>
  );
}

function Categories({ cats, reload, productCount }: { cats: Category[]; reload: () => Promise<void>; productCount: (slug: string) => number }) {
  const [name, setName] = useState("");
  const add = async () => {
    const n = name.trim().slice(0, 80);
    const slug = slugify(n);
    if (!slug) return;
    const { error } = await supabase.from("shop_categories").insert({ slug, name: n, sort: cats.length + 1, coming_soon: true });
    if (error) return toast.error(error.message);
    setName(""); toast.success("Category added"); void reload();
  };
  return (
    <div className="space-y-4">
      <div className={`${card} flex flex-wrap gap-2`}>
        <input className={`${input} flex-1`} placeholder="New category name, e.g. RC Boats" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        <button className="btn-gold !px-4 !py-2 !text-[10px]" onClick={add}><Plus size={14} /> Add category</button>
      </div>
      {cats.map((c) => <CategoryRow key={c.slug} c={c} count={productCount(c.slug)} reload={reload} />)}
    </div>
  );
}

function CategoryRow({ c, count, reload }: { c: Category; count: number; reload: () => Promise<void> }) {
  const [draft, setDraft] = useState(c);
  const [busy, setBusy] = useState(false);
  useEffect(() => setDraft(c), [c]);
  const save = async (patch: Partial<Category> = {}) => {
    setBusy(true);
    const next = { ...draft, ...patch };
    const { error } = await supabase.from("shop_categories").update({ name: next.name.slice(0, 80), tagline: next.tagline.slice(0, 120), description: next.description.slice(0, 400), cover: next.cover, sort: next.sort, visible: next.visible, coming_soon: next.coming_soon, updated_at: new Date().toISOString() }).eq("slug", c.slug);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); void reload();
  };
  return (
    <div className={`${card} grid gap-4 md:grid-cols-[180px_1fr]`}>
      <div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-gold/20 bg-surface">{draft.cover && <img src={draft.cover} alt="" className="h-full w-full object-contain" />}</div>
        <label className={`${chip} mt-2 inline-flex cursor-pointer items-center gap-1`}><ImagePlus size={12} /> Change cover
          <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const url = await uploadPhoto(f, `categories/${c.slug}`); setDraft({ ...draft, cover: url }); await save({ cover: url }); } catch (err) { toast.error((err as Error).message); } }} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><div className={label}>Name · /{c.slug} · {count} products</div><input className={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
        <div><div className={label}>Tagline</div><input className={input} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></div>
        <div className="sm:col-span-2"><div className={label}>Description (also the Google description)</div><textarea className={input} rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <span className={label}>Order</span><input type="number" className={`${input} !w-20`} value={draft.sort} onChange={(e) => setDraft({ ...draft, sort: Number(e.target.value) })} />
          <button className={chip} onClick={() => save({ visible: !draft.visible })}>{draft.visible ? "Visible" : "Hidden"}</button>
          <button className={chip} onClick={() => save({ coming_soon: !draft.coming_soon })}>{draft.coming_soon ? "Coming soon" : "Open"}</button>
          <a className={chip} href={`/collection/${c.slug}`} target="_blank" rel="noreferrer">View page</a>
          <button className="btn-gold ml-auto !px-4 !py-2 !text-[10px]" disabled={busy} onClick={() => save()}><Save size={13} /> Save</button>
        </div>
      </div>
    </div>
  );
}

function Products({ products, cats, reload }: { products: Product[]; cats: Category[]; reload: () => Promise<void> }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const editorRef = useRef<HTMLElement | null>(null);
  // The editor sits below the whole grid, so bring it into view whenever it opens.
  useEffect(() => {
    if (open) editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);
  const shown = useMemo(() => products.filter((p) => (filter === "all" || p.category === filter) && (!q || p.name.toLowerCase().includes(q.toLowerCase()))), [products, filter, q]);
  const add = async () => {
    const name = newName.trim().slice(0, 120);
    const slug = slugify(name);
    if (!slug) return;
    const category = filter !== "all" ? filter : cats[0]?.slug ?? "performance";
    const { data, error } = await supabase.from("products").insert({ slug, name, category, type: "", edition: "mid", price_band: "mid", sort: products.length + 1, visible: false }).select("id").single();
    if (error) return toast.error(error.message.includes("duplicate") ? "A product with this name already exists." : error.message);
    setNewName(""); toast.success("Product added (hidden until you make it visible)"); await reload(); setOpen(data.id);
  };
  return (
    <div className="space-y-3">
      <div className={`${card} grid gap-2 md:grid-cols-[1fr_200px]`}>
        <input className={input} placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={input} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All categories</option>
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <div className="flex gap-2 md:col-span-2">
          <input className={`${input} flex-1`} placeholder="New product name" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={120} />
          <button className="btn-gold !px-4 !py-2 !text-[10px]" onClick={add}><Plus size={14} /> Add product</button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((p) => <ProductCard key={p.id} product={toShopProduct(p)} categoryName={cats.find((c) => c.slug === p.category)?.name}
          adminActions={<>
            <Button variant="outline" onClick={() => setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id}>Edit</Button>
            <Button variant="outline" aria-label={`Delete ${p.name}`} onClick={async () => {
              if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return;
              const { error } = await supabase.from("products").delete().eq("id", p.id);
              if (error) return toast.error(error.message);
              setOpen(null); toast.success("Product deleted"); void reload();
            }}><Trash2 size={14} />Delete</Button>
          </>} />)}
      </div>
      {products.filter((p) => p.id === open).map((p) => <section key={p.id} ref={editorRef} aria-label={`Edit ${p.name}`} className="scroll-mt-6 border-t border-border pt-5">
        <h3 className="font-display text-xl font-bold">{p.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Stock {p.stock_quantity} · {p.visible ? "Visible" : "Hidden"}</p>
        <ProductEditor p={p} cats={cats} reload={reload} onDeleted={() => setOpen(null)} />
      </section>)}
      {!shown.length && <p className="text-sm text-muted-foreground">No products match.</p>}
    </div>
  );
}

function ProductEditor({ p, cats, reload, onDeleted }: { p: Product; cats: Category[]; reload: () => Promise<void>; onDeleted: () => void }) {
  const [d, setD] = useState({
    name: p.name, category: p.category, scale: p.scale, type: p.type, description: p.description,
    features: strings(p.features).join("\n"), gallery: strings(p.gallery), colors: colors(p.color_variants),
    price_band: p.price_band, in_stock: p.in_stock, visible: p.visible, featured: p.featured,
    ask_price: p.ask_price, selling_price: p.selling_price ?? 0, stock_quantity: p.stock_quantity,
  });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((x) => ({ ...x, [k]: v }));
  const move = (i: number, dir: -1 | 1) => { const g = [...d.gallery]; const j = i + dir; if (j < 0 || j >= g.length) return; [g[i], g[j]] = [g[j], g[i]]; set("gallery", g); };

  const save = async () => {
    if (!d.name.trim()) return toast.error("Name is required");
    if (!d.ask_price && !(Number(d.selling_price) > 0)) return toast.error("Enter a selling price, or switch back to price on request.");
    setBusy(true);
    const { error } = await supabase.from("products").update({
      name: d.name.trim().slice(0, 120), category: d.category, scale: d.scale.slice(0, 40), tag: d.scale.slice(0, 40), type: d.type.slice(0, 80),
      description: d.description.slice(0, 1200), features: d.features.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12),
      gallery: d.gallery, img: d.gallery[0] ?? "", color_variants: d.colors.filter((c) => c.name.trim()),
      price_band: d.price_band, edition: d.price_band, in_stock: d.in_stock, visible: d.visible, featured: d.featured,
      ask_price: d.ask_price, selling_price: d.ask_price ? null : Math.round(Number(d.selling_price) * 1000) / 1000,
      stock_quantity: Math.max(0, Math.floor(Number(d.stock_quantity) || 0)), updated_at: new Date().toISOString(),
    }).eq("id", p.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Product saved"); void reload();
  };
  const remove = async () => {
    if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted"); onDeleted(); void reload();
  };
  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const urls: string[] = [];
      for (const f of Array.from(files).slice(0, 8)) urls.push(await uploadPhoto(f, p.slug ?? p.id));
      set("gallery", [...d.gallery, ...urls]);
      toast.success(`${urls.length} photo${urls.length > 1 ? "s" : ""} added — press Save`);
    } catch (err) { toast.error((err as Error).message); }
  };

  return (
    <div className="mt-5 grid gap-4 border-t border-gold/15 pt-5">
      <div>
        <div className={label}>Photos (first photo is the cover) · drag order with arrows</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {d.gallery.map((g, i) => (
            <div key={g + i} className="w-32 overflow-hidden rounded-lg border border-gold/20">
              <img src={g} alt="" className="aspect-[3/2] w-full bg-surface object-contain" />
              <div className="flex justify-between bg-surface px-1 py-1">
                <button aria-label="Move left" onClick={() => move(i, -1)} className="p-1 text-muted-foreground hover:text-gold"><ArrowLeft size={13} /></button>
                <button aria-label="Remove photo" onClick={() => set("gallery", d.gallery.filter((_, j) => j !== i))} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
                <button aria-label="Move right" onClick={() => move(i, 1)} className="p-1 text-muted-foreground hover:text-gold"><ArrowRight size={13} /></button>
              </div>
            </div>
          ))}
          <label className="grid w-32 cursor-pointer place-items-center rounded-lg border border-dashed border-gold/40 text-xs text-gold-soft hover:border-gold">
            <span className="grid place-items-center gap-1 py-6"><ImagePlus size={18} />Add photos</span>
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { void addPhotos(e.target.files); e.target.value = ""; }} />
          </label>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2"><div className={label}>Name (also the Google title)</div><input className={input} value={d.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><div className={label}>Category</div><select className={input} value={d.category} onChange={(e) => set("category", e.target.value)}>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>Scale / size</div><input className={input} value={d.scale} onChange={(e) => set("scale", e.target.value)} placeholder="1:10" /></div>
          <div><div className={label}>Level</div><select className={input} value={d.price_band} onChange={(e) => set("price_band", e.target.value)}>{BANDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        </div>
        <div className="md:col-span-2"><div className={label}>Type</div><input className={input} value={d.type} onChange={(e) => set("type", e.target.value)} placeholder="Brushless / Buggy" /></div>
        <div className="md:col-span-2"><div className={label}>Description (also the Google description)</div><textarea className={input} rows={3} value={d.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div><div className={label}>Features (one per line)</div><textarea className={input} rows={4} value={d.features} onChange={(e) => set("features", e.target.value)} /></div>
        <div>
          <div className={label}>Colour options (name, colour, optional photo)</div>
          <div className="mt-1 space-y-2">
            {d.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" value={c.hex} onChange={(e) => set("colors", d.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))} className="h-9 w-10 rounded border border-gold/20 bg-transparent" aria-label="Colour" />
                <input className={input} value={c.name} placeholder="Red" onChange={(e) => set("colors", d.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <select className={`${input} !w-28`} value={c.image ?? ""} onChange={(e) => set("colors", d.colors.map((x, j) => (j === i ? { ...x, image: e.target.value || undefined } : x)))} aria-label="Photo for this colour">
                  <option value="">No photo</option>
                  {d.gallery.map((g, gi) => <option key={g} value={g}>Photo {gi + 1}</option>)}
                </select>
                <button aria-label="Remove colour" onClick={() => set("colors", d.colors.filter((_, j) => j !== i))} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            ))}
            <button className={chip} onClick={() => set("colors", [...d.colors, { name: "", hex: "#ff951f" }])}><Plus size={11} className="inline" /> Add colour</button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className={chip} onClick={() => set("visible", !d.visible)}>{d.visible ? "Visible in shop" : "Hidden"}</button>
        <button className={chip} onClick={() => set("in_stock", !d.in_stock)}>{d.in_stock ? "Opening stock" : "Preorder"}</button>
        <button className={chip} onClick={() => set("featured", !d.featured)}>{d.featured ? "Featured" : "Not featured"}</button>
        <button className={chip} onClick={() => set("ask_price", !d.ask_price)}>{d.ask_price ? "Price on request" : "Show price"}</button>
        <span className="flex items-center gap-1 text-sm">Stock <input type="number" min={0} step={1} inputMode="numeric" className={`${input} !w-20`} value={d.stock_quantity} onChange={(e) => set("stock_quantity", Number(e.target.value))} aria-label="Stock quantity" /></span>
        {!d.ask_price && <span className="flex items-center gap-1 text-sm">OMR <input type="number" min={0} step="0.001" className={`${input} !w-28`} value={d.selling_price} onChange={(e) => set("selling_price", Number(e.target.value))} /></span>}
        {p.slug && <a className={chip} href={`/product/${p.slug}`} target="_blank" rel="noreferrer">View page</a>}
        <div className="ml-auto flex gap-2">
          <button className={chip} onClick={remove}><Trash2 size={11} className="inline" /> Delete</button>
          <button className="btn-gold !px-4 !py-2 !text-[10px]" disabled={busy} onClick={save}><Save size={13} /> {busy ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

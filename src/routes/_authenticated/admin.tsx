import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { ShopDetailsEditor } from "@/components/admin/ShopDetailsEditor";
import { SearchConsolePanel } from "@/components/admin/SearchConsolePanel";
import { parseShopDetails } from "@/lib/shop-details";
import { ArrowUpRight, RefreshCw, LogOut, Inbox as InboxIcon, CalendarDays, Package, Layers, ListChecks, Clock, CheckCircle2, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — GearHead RC" },
      { name: "description", content: "Manage enquiries, bookings, products, sections and launch roadmap." },
      { property: "og:title", content: "Admin Dashboard — GearHead RC" },
      { property: "og:description", content: "GearHead RC boutique management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const TABS = ["Inbox", "Bookings", "Products", "Sections", "Roadmap", "Search"] as const;
const TAB_ICONS = [InboxIcon, CalendarDays, Package, Layers, ListChecks, Search];
type Tab = (typeof TABS)[number];

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("Inbox");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(!!data));
  }, []);

  if (isAdmin === null) return <Shell><p className="text-muted-foreground">Checking access…</p></Shell>;
  if (!isAdmin)
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold text-foreground">Access restricted</h1>
        <p className="mt-2 text-muted-foreground">This account doesn't have admin access.</p>
        <Link to="/" className="btn-gold mt-6 inline-block">Back to gallery</Link>
      </Shell>
    );

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase text-gold-soft">/ GearHead RC</div>
          <div className="mt-3 flex flex-wrap items-center gap-3"><h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">Admin Dashboard</h1><span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] uppercase text-gold-soft">Super admin</span></div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title="Refresh dashboard" aria-label="Refresh dashboard" onClick={() => setRefresh((r) => r + 1)}><RefreshCw /></Button>
          <Button variant="outline" size="icon" asChild><Link to="/" title="View website" aria-label="View website"><ArrowUpRight /></Link></Button>
          <Button variant="outline" size="icon" title="Sign out" aria-label="Sign out" onClick={() => supabase.auth.signOut()}><LogOut /></Button>
        </div>
      </div>
      <div className="mt-8 flex overflow-x-auto border-y border-border">
        {TABS.map((t, i) => {
          const Icon = TAB_ICONS[i];
          return <Button variant="ghost" key={t} onClick={() => setTab(t)} aria-pressed={tab === t}
            className={`h-14 shrink-0 rounded-none border-r border-border px-5 text-xs uppercase ${tab === t ? "bg-surface-2 text-gold" : "text-muted-foreground"}`}>
            <Icon />{t}
          </Button>;
        })}
      </div>
      <div key={refresh} className="mt-8">
        <div className="mb-6"><div className="text-xs uppercase text-muted-foreground">{tab === "Sections" ? "Website control" : "Boutique management"}</div><h2 className="mt-2 font-display text-3xl font-bold">{tab}</h2></div>
        {tab === "Inbox" && <Inbox />}
        {tab === "Bookings" && <Bookings />}
        {tab === "Products" && <Products />}
        {tab === "Sections" && <Sections />}
        {tab === "Roadmap" && <Roadmap />}
        {tab === "Search" && <SearchConsolePanel />}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-background px-5 py-10 md:px-10 md:py-14"><div className="mx-auto max-w-6xl">{children}</div></main>;
}

function useRows<T>(table: "enquiries" | "bookings" | "products" | "site_sections" | "roadmap_tasks", order: string, asc: boolean) {
  const [rows, setRows] = useState<T[]>([]);
  const load = useCallback(async () => {
    const { data } = await supabase.from(table).select("*").order(order, { ascending: asc });
    setRows((data ?? []) as T[]);
  }, [table, order, asc]);
  useEffect(() => { load(); }, [load]);
  return { rows, load };
}

const card = "vitrine p-5";
const small = "font-mono-tag text-[9px] text-gold-soft";
const btn = "font-mono-tag rounded-full border border-gold/30 px-3 py-1 text-[9px] text-muted-foreground hover:border-gold hover:text-gold";
const inputCls = "rounded-md border border-gold/20 bg-background/60 px-2 py-1 text-sm text-foreground outline-none focus:border-gold/60";

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-gold/15 p-10 text-center text-sm text-muted-foreground">{text}</div>;
}

function Inbox() {
  const { rows, load } = useRows<Tables<"enquiries">>("enquiries", "created_at", false);
  if (!rows.length) return <Empty text="No product enquiries yet." />;
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.id} className={`${card} ${r.read ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap justify-between gap-2">
            <div className={small}>{new Date(r.created_at).toLocaleString("en-GB")} · {r.product}</div>
            <div className="flex gap-2">
              <button className={btn} onClick={async () => { await supabase.from("enquiries").update({ read: !r.read }).eq("id", r.id); load(); }}>{r.read ? "Mark unread" : "Mark read"}</button>
              <button className={btn} onClick={async () => { if (confirm("Delete enquiry?")) { await supabase.from("enquiries").delete().eq("id", r.id); load(); } }}>Delete</button>
            </div>
          </div>
          <div className="mt-2 font-display font-bold text-foreground">{r.name} · <span className="text-gold">{r.contact}</span></div>
          {r.message && <p className="mt-1 text-sm text-muted-foreground">{r.message}</p>}
        </div>
      ))}
    </div>
  );
}

function Bookings() {
  const { rows, load } = useRows<Tables<"bookings">>("bookings", "visit_date", true);
  if (!rows.length) return <Empty text="No visit bookings yet." />;
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.id} className={card}>
          <div className="flex flex-wrap justify-between gap-2">
            <div className={small}>{r.visit_date} · {r.visit_time} · {r.party} guests · {r.experience}</div>
            <div className="flex gap-2">
              <select className={inputCls} value={r.status} onChange={async (e) => { await supabase.from("bookings").update({ status: e.target.value, read: true }).eq("id", r.id); load(); }}>
                {["new", "confirmed", "completed", "cancelled"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className={btn} onClick={async () => { if (confirm("Delete booking?")) { await supabase.from("bookings").delete().eq("id", r.id); load(); } }}>Delete</button>
            </div>
          </div>
          <div className="mt-2 font-display font-bold text-foreground">{r.name} · <span className="text-gold">{r.contact}</span></div>
          {r.notes && <p className="mt-1 text-sm text-muted-foreground">{r.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function Products() {
  const { rows, load } = useRows<Tables<"products">>("products", "sort", true);
  const update = async (id: string, patch: Partial<Tables<"products">>) => { await supabase.from("products").update(patch).eq("id", id); load(); };
  if (!rows.length) return <Empty text="No products." />;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {rows.map((r) => (
        <div key={r.id} className={card}>
          <div className={small}>{r.type} · {r.edition}</div>
          <div className="mt-1 font-display font-bold text-foreground">{r.name}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            OMR <input type="number" step="0.001" defaultValue={r.price} className={`${inputCls} w-24`} onBlur={(e) => update(r.id, { price: Number(e.target.value) })} />
            – <input type="number" step="0.001" defaultValue={r.price_max} className={`${inputCls} w-24`} onBlur={(e) => update(r.id, { price_max: Number(e.target.value) })} />
          </div>
          <div className="mt-3 flex gap-2">
            <button className={btn} onClick={() => update(r.id, { in_stock: !r.in_stock })}>{r.in_stock ? "In stock" : "Pre-order"}</button>
            <button className={btn} onClick={() => update(r.id, { visible: !r.visible })}>{r.visible ? "Visible" : "Hidden"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Sections() {
  const { rows, load } = useRows<Tables<"site_sections">>("site_sections", "sort", true);
  return (
    <div className="space-y-2">
      {rows.find((r) => r.id === "contact") && <ShopDetailsEditor value={rows.find((r) => r.id === "contact")?.contact_details} onSaved={load} />}
      {rows.map((r) => (
        <div key={r.id} className={`${card} flex items-center justify-between gap-4`}>
          <div>
            <div className="font-display font-bold text-foreground">{r.label}</div>
            {r.note && <div className="text-xs text-muted-foreground">{r.note}</div>}
          </div>
          <button className={btn} onClick={async () => { await supabase.from("site_sections").update({ visible: !r.visible }).eq("id", r.id); load(); }}>{r.visible ? "Live" : "Hidden"}</button>
        </div>
      ))}
    </div>
  );
}

function Roadmap() {
  const { rows, load } = useRows<Tables<"roadmap_tasks">>("roadmap_tasks", "sort", true);
  const { rows: sections } = useRows<Tables<"site_sections">>("site_sections", "sort", true);
  const details = parseShopDetails(sections.find((s) => s.id === "contact")?.contact_details);
  const complete = !!(details.address && details.phone && details.hours && details.email && (details.instagram || details.facebook || details.tiktok));
  const [title, setTitle] = useState("");
  const effectiveRows = rows.map((r) => r.title === "Opening hours, email and social links" ? { ...r, status: complete ? "done" : "todo", blocker: complete ? "" : "Add missing details in Sections" } : r);
  const done = effectiveRows.filter((r) => r.status === "done").length;
  const cycle: Record<string, string> = { todo: "doing", doing: "done", done: "todo" };
  return (
    <div>
      <div className="mb-6 border-b border-border pb-6"><div className="flex items-center gap-2 font-display text-lg font-bold">{complete ? <CheckCircle2 className="text-gold" /> : <Clock className="text-gold" />}Shop details</div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">{(["address", "phone", "hours", "email", "instagram", "facebook", "tiktok"] as const).map((key) => <div key={key}><dt className="text-xs capitalize text-muted-foreground">{key === "hours" ? "Opening hours" : key}</dt><dd className="mt-1 whitespace-pre-line break-words text-sm">{details[key] || "Not added"}</dd></div>)}</dl>
      </div>
      <div className={card}>
        <div className={small}>Launch progress · {done}/{rows.length} done</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full bg-gold transition-all" style={{ width: `${rows.length ? (done / rows.length) * 100 : 0}%` }} /></div>
      </div>
      <form className="mt-4 flex gap-2" onSubmit={async (e) => { e.preventDefault(); const t = title.trim().slice(0, 200); if (!t) return; await supabase.from("roadmap_tasks").insert({ title: t, sort: rows.length + 1 }); setTitle(""); load(); }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a launch task…" className={`${inputCls} flex-1 py-2`} />
        <button className="btn-gold !py-2 !px-4 !text-[10px]">Add</button>
      </form>
      {(["doing", "todo", "done"] as const).map((s) => (
        <div key={s} className="mt-6">
          <div className={small}>{s === "doing" ? "In progress" : s === "todo" ? "Up next" : "Done"}</div>
          <div className="mt-2 space-y-2">
             {effectiveRows.filter((r) => r.status === s).map((r) => (
              <div key={r.id} className={`${card} flex items-center justify-between gap-3 !py-3`}>
                <div className={r.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}>
                  {r.title}{r.blocker && <span className="ml-2 text-xs text-gold-soft">· {r.blocker}</span>}
                </div>
                <div className="flex gap-2">
                  <button className={btn} onClick={async () => { await supabase.from("roadmap_tasks").update({ status: cycle[r.status] ?? "todo" }).eq("id", r.id); load(); }}>→ {cycle[r.status] ?? "todo"}</button>
                  <button className={btn} onClick={async () => { await supabase.from("roadmap_tasks").delete().eq("id", r.id); load(); }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

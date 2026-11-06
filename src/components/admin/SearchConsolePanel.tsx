import { useEffect, useState } from "react";
import { ExternalLink, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Settings = Tables<"search_console_settings">;

const EMPTY: Settings = {
  id: "primary",
  property_url: "https://gearheadrc.store/",
  property_type: "url_prefix",
  verification_method: "meta_tag",
  verified: false,
  verified_on: null,
  sitemap_url: "https://gearheadrc.store/sitemap.xml",
  google_account: "",
  notes: "",
  google_verification: "",
  updated_at: new Date().toISOString(),
};

const STEPS = [
  { title: "Open Search Console", body: "Sign in at Google Search Console with the Google account that should own the site's search data." },
  { title: "Add your website", body: "Choose “URL prefix” and enter https://gearheadrc.store/ exactly as shown below." },
  { title: "Pick “HTML tag”", body: "Copy the tag Google shows you and send it in chat — it will be added to the site, then publish." },
  { title: "Press Verify", body: "Once the site is published with the tag, press Verify in Search Console and tick “Verified” here." },
  { title: "Submit the sitemap", body: "Under Sitemaps, submit sitemap.xml so Google finds the home page and store." },
  { title: "Check weekly", body: "Performance → Queries shows the searches; Pages shows which pages bring visitors. Data appears after 2–3 days." },
];

const inputCls = "w-full min-w-0 rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:border-gold";

export function SearchConsolePanel() {
  const [s, setS] = useState<Settings>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.from("search_console_settings").select("*").eq("id", "primary").maybeSingle().then(({ data }) => {
      if (data) setS(data);
    });
  }, []);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const reportUrl = s.property_url
    ? `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(s.property_type === "domain" ? `sc-domain:${s.property_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}` : s.property_url)}`
    : "https://search.google.com/search-console";

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex items-center gap-3"><Search className="text-gold" size={20} /><h3 className="font-display text-xl font-bold">How to connect Google Search Console</h3></div>
        <ol className="grid gap-3 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <li key={step.title} className="vitrine flex gap-4 p-4">
              <span className="font-display text-2xl font-bold text-gold">{i + 1}</span>
              <div><div className="font-display font-bold text-foreground">{step.title}</div><p className="mt-1 text-sm text-muted-foreground">{step.body}</p></div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" asChild><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer"><ExternalLink />Open Search Console</a></Button>
          <Button variant="outline" asChild><a href={reportUrl} target="_blank" rel="noreferrer"><ExternalLink />Searches &amp; pages report</a></Button>
        </div>
      </section>

      <form className="border-t border-border pt-8" onSubmit={async (event) => {
        event.preventDefault(); setBusy(true); setMessage("");
        const payload = {
          id: "primary",
          property_url: s.property_url.trim().slice(0, 300),
          property_type: s.property_type,
          verification_method: s.verification_method,
          verified: s.verified,
          verified_on: s.verified_on || null,
          sitemap_url: s.sitemap_url.trim().slice(0, 300),
          google_account: s.google_account.trim().slice(0, 200),
          notes: s.notes.trim().slice(0, 2000),
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from("search_console_settings").upsert(payload).select("id").single();
        setBusy(false);
        setMessage(error ? "Unable to save. Please try again." : "Search Console details saved.");
      }}>
        <h3 className="mb-5 font-display text-xl font-bold">Your property details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 md:col-span-2"><span className="text-xs text-muted-foreground">Property address</span>
            <input className={inputCls} value={s.property_url} maxLength={300} onChange={(e) => set("property_url", e.target.value)} /></label>
          <label className="grid gap-2"><span className="text-xs text-muted-foreground">Property type</span>
            <select className={inputCls} value={s.property_type} onChange={(e) => set("property_type", e.target.value)}>
              <option value="url_prefix">URL prefix</option><option value="domain">Domain</option>
            </select></label>
          <label className="grid gap-2"><span className="text-xs text-muted-foreground">Verification method</span>
            <select className={inputCls} value={s.verification_method} onChange={(e) => set("verification_method", e.target.value)}>
              <option value="meta_tag">HTML tag</option><option value="dns">DNS record</option><option value="html_file">HTML file</option><option value="analytics">Google Analytics</option>
            </select></label>
          <label className="grid gap-2"><span className="text-xs text-muted-foreground">Google account that owns it</span>
            <input type="email" className={inputCls} value={s.google_account} maxLength={200} onChange={(e) => set("google_account", e.target.value)} placeholder="name@gmail.com" /></label>
          <label className="grid gap-2"><span className="text-xs text-muted-foreground">Sitemap address</span>
            <input className={inputCls} value={s.sitemap_url} maxLength={300} onChange={(e) => set("sitemap_url", e.target.value)} /></label>
          <label className="flex items-center gap-3 rounded-md border border-input px-3 py-3 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={s.verified} onChange={(e) => set("verified", e.target.checked)} />Verified in Search Console</label>
          <label className="grid gap-2"><span className="text-xs text-muted-foreground">Verified on</span>
            <input type="date" className={inputCls} value={s.verified_on ?? ""} onChange={(e) => set("verified_on", e.target.value || null)} /></label>
          <label className="grid gap-2 md:col-span-2"><span className="text-xs text-muted-foreground">Notes (top searches, pages to watch)</span>
            <textarea rows={4} className={inputCls} value={s.notes} maxLength={2000} onChange={(e) => set("notes", e.target.value)} /></label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={busy}><Save />{busy ? "Saving…" : "Save details"}</Button>
          <p role="status" className="text-sm text-muted-foreground">{message}</p>
        </div>
      </form>
    </div>
  );
}

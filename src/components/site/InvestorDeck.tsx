import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Flag, Layers3, MoveUpRight, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

const slides = [
  { label: "The vision", title: "Automotive passion. A lasting platform.", text: "Build a destination where automotive culture, considered collecting and memorable experiences meet — beginning in Muscat.", points: ["A distinctive collector-first brand", "Physical boutique + digital discovery", "Scale models, RC cars and framed art"] },
  { label: "The opportunity", title: "Connect the collection to the community.", text: "Our strategic opportunity is to bring product discovery, boutique visits and collector relationships into one coherent experience.", points: ["Curated retail rather than a generic catalogue", "Immersive product discovery", "Relationships beyond a single purchase"] },
  { label: "The model", title: "Three complementary avenues.", text: "A proposed commercial direction spanning curated products, framed automotive art and boutique-led experiences.", points: ["Collector retail: scale models and RC cars", "Art editions: automotive shadow-box displays", "Experiences: boutique visits and community events"] },
  { label: "The growth strategy", title: "Establish. Validate. Then expand.", text: "Prioritise reliable operations and a compelling local experience before exploring broader reach and strategic partnerships.", points: ["Complete launch readiness and owner approvals", "Validate demand and operational performance", "Explore partnerships and regional reach"] },
  { label: "The partnership", title: "Build the next chapter together.", text: "We welcome conversations with strategic partners who share our interest in automotive culture, retail and collector experiences.", points: ["Retail and distribution relationships", "Brand and community collaborations", "Investment discussions subject to due diligence"] },
];

export function InvestorDeck() {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];
  if (!current) return null;
  return (
    <>

      <div className="carbon-surface border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 md:grid-cols-4 md:px-10">
          {[['01', 'The vision'], ['02', 'Strategic deck'], ['03', 'Future roadmap'], ['04', 'Partnerships']].map(([num, label], i) => <Link key={num} to="/" hash={['vision', 'investor-deck', 'future-roadmap', 'partnerships'][i]} className="group flex items-center justify-between gap-2 border-r border-border py-6 pr-4 text-xs last:border-r-0 md:py-8 md:pl-5"><span><span className="mr-3 font-mono text-[10px] text-primary">{num}</span>{label}</span><MoveUpRight size={14} className="text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>)}
        </div>
      </div>

      <section id="vision" className="scroll-mt-24 border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="grid gap-8 md:grid-cols-[1fr_2fr]"><div className="deck-label"><Target size={15} /> 01 / Our north star</div><div><h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">More than objects.<br /><span className="text-muted-foreground">A culture worth building.</span></h2><p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">GearHead brings the precision of automotive design into the collector’s world. Our ambition is to connect a curated boutique, immersive digital discovery and a passionate community in one enduring brand.</p></div></Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[{ icon: Layers3, title: "Curated by passion", body: "Scale models, RC cars and automotive art selected for people who appreciate the details." }, { icon: Flag, title: "Rooted in Muscat", body: "A local boutique identity, built around personal service and meaningful collector relationships." }, { icon: TrendingUp, title: "Designed for tomorrow", body: "A proposed path from a collector destination to a connected automotive culture platform." }].map(({ icon: Icon, title, body }, i) => <Reveal key={title} delay={i * 80} className="executive-card p-7"><Icon size={22} className="text-primary" /><h3 className="mt-7 font-display text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section id="investor-deck" className="carbon-surface scroll-mt-24 border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><div className="deck-label">02 / Strategic investor deck</div><h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">The next chapter.</h2></div><span className="font-mono text-[10px] uppercase text-muted-foreground">Strategic concept / Discussion draft</span></Reveal>
          <div className="grid border-y border-border md:grid-cols-[220px_1fr]">
            <div role="tablist" aria-label="Investor deck chapters" className="flex overflow-x-auto border-b border-border md:flex-col md:border-b-0 md:border-r md:py-7">{slides.map((s, i) => <Button key={s.label} role="tab" id={`deck-tab-${i}`} aria-selected={slide === i} aria-controls="deck-content" variant="ghost" onClick={() => setSlide(i)} className={`h-12 shrink-0 justify-start rounded-none px-5 text-xs md:h-14 ${slide === i ? 'border-l-2 border-primary bg-primary/10 text-primary' : 'text-muted-foreground'}`}><span className="mr-3 font-mono text-[10px]">0{i + 1}</span>{s.label}</Button>)}</div>
            <div id="deck-content" role="tabpanel" aria-labelledby={`deck-tab-${slide}`} className="min-h-[410px] p-6 md:min-h-[420px] md:p-12" aria-live="polite">
              <div className="flex justify-between font-mono text-[10px] uppercase text-primary"><span>{current.label}</span><span>0{slide + 1} / 05</span></div>
              <h3 className="mt-8 max-w-xl font-display text-3xl font-semibold leading-tight md:text-4xl">{current.title}</h3><p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{current.text}</p>
              <ul className="mt-7 space-y-3">{current.points.map(point => <li key={point} className="flex items-start gap-3 text-sm"><span className="mt-2 h-1 w-1 shrink-0 bg-primary" />{point}</li>)}</ul>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4"><p className="max-w-xl text-[11px] leading-5 text-muted-foreground">Proposed direction, not a financial forecast. No funding terms, revenue figures or performance claims are presented.</p><div className="flex shrink-0 gap-2"><Button variant="outline" size="icon" aria-label="Previous deck chapter" disabled={slide === 0} onClick={() => setSlide(s => s - 1)}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next deck chapter" disabled={slide === slides.length - 1} onClick={() => setSlide(s => s + 1)}><ChevronRight /></Button></div></div>
        </div>
      </section>

      <section id="future-roadmap" className="scroll-mt-24 border-b border-border py-20 md:py-28"><div className="mx-auto max-w-7xl px-6 md:px-10"><Reveal><div className="deck-label">03 / Future roadmap</div><div className="mt-4 flex flex-wrap items-end justify-between gap-6"><h2 className="font-display text-3xl font-bold md:text-5xl">A deliberate path forward.</h2><span className="font-mono text-[10px] uppercase text-muted-foreground">Proposed phases / Not committed dates</span></div></Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">{[{ phase: '01', stage: 'Foundation', title: 'Prepare for launch.', tasks: ['Confirm products, prices and availability', 'Complete boutique information and visit operations', 'Validate customer and admin journeys'] }, { phase: '02', stage: 'Activation', title: 'Build the collector network.', tasks: ['Strengthen product discovery and storytelling', 'Develop boutique-led collector experiences', 'Measure demand and customer feedback'] }, { phase: '03', stage: 'Expansion', title: 'Grow with intention.', tasks: ['Explore brand and distribution partnerships', 'Evaluate regional digital reach', 'Develop new art and collector editions'] }].map((p, i) => <Reveal key={p.phase} delay={i * 80} className="border-t border-primary/40 pt-6"><div className="flex items-center justify-between"><span className="font-mono text-3xl text-primary/70">{p.phase}</span><span className="rounded-sm border border-border px-3 py-1.5 font-mono text-[9px] uppercase text-muted-foreground">{p.stage}</span></div><h3 className="mt-7 font-display text-2xl font-semibold">{p.title}</h3><ul className="mt-5 space-y-4">{p.tasks.map(t => <li key={t} className="flex gap-3 text-sm leading-6 text-muted-foreground"><ArrowUpRight size={14} className="mt-1 shrink-0 text-primary" />{t}</li>)}</ul></Reveal>)}</div>
      </div></section>

      <section id="partnerships" className="carbon-surface scroll-mt-24 py-20 md:py-28"><Reveal className="mx-auto grid max-w-7xl items-center gap-9 px-6 md:grid-cols-[1fr_auto] md:px-10"><div><div className="deck-label">04 / Strategic partnerships</div><h2 className="mt-5 font-display text-3xl font-bold md:text-5xl">Share the passion.<br /><span className="text-primary">Shape the future.</span></h2><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">Let’s start a conversation about the next chapter of GearHead.</p></div><div className="flex flex-col gap-3"><Button asChild size="lg" className="h-12 rounded-sm font-mono text-xs"><Link to="/app" hash="contact">Connect with GearHead <ArrowUpRight /></Link></Button><Button asChild size="lg" variant="outline" className="h-12 rounded-sm font-mono text-xs"><Link to="/app" hash="contact">Visit the boutique <ArrowDown /></Link></Button></div></Reveal></section>
    </>
  );
}

import { BadgeCheck, Building2, FileCheck2, Globe2, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const TRUST_BADGES = [
  {
    icon: Globe2,
    title: "100% Foreign-Owned LLC",
    body: "Fully foreign-owned limited liability company established under the Sultanate’s Foreign Capital Investment Law (FCIL).",
    tag: "FCIL",
  },
  {
    icon: BadgeCheck,
    title: "13+ Years Track Record",
    body: "Commercial retail and supply chain operations in the Sultanate, built on long-standing supplier and customer relationships.",
    tag: "Oman",
  },
  {
    icon: FileCheck2,
    title: "Regulatory Compliance",
    body: "Aligned with MOCIIP, OCCI and Tax Authority standards, with clean commercial registration and filings.",
    tag: "MOCIIP · OCCI",
  },
];

export function CorporateFoundation() {
  return (
    <section id="foundation" className="carbon-surface scroll-mt-24 border-b border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="deck-label">
          <ShieldCheck size={15} /> Corporate foundation
        </Reveal>

        <Reveal
          delay={80}
          className="mt-8 grid items-start gap-10 border-t border-border pt-10 lg:grid-cols-[1.15fr_1fr]"
        >
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Enterprise Framework
              <br />
              <span className="text-muted-foreground">&amp; Foundation</span>
            </h2>
            <div className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border border-primary/30 bg-primary/5 px-5 py-4">
              <Building2 size={20} className="shrink-0 text-primary" />
              <span>
                <span className="font-mono-tag block text-[9px] text-muted-foreground">
                  Backed by
                </span>
                <span className="font-display text-lg font-semibold text-foreground md:text-xl">
                  Adnan Trading Services LLC
                </span>
                <span className="font-mono-tag ml-3 text-[10px] text-primary">
                  CR: 1634293
                </span>
              </span>
            </div>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">
              GearHead RC is developed and operated under a registered
              Omani LLC with an established commercial base. The corporate
              structure, registration and compliance position give partners,
              suppliers and investors a clear, verifiable entity to deal with
              from day one.
            </p>
          </div>

          <div className="grid gap-4">
            {TRUST_BADGES.map(({ icon: Icon, title, body, tag }, i) => (
              <Reveal
                key={title}
                delay={i * 90}
                className="executive-card flex gap-4 p-5 md:p-6"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-primary/35 bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-base font-semibold text-foreground md:text-lg">
                      {title}
                    </h3>
                    <span className="rounded-sm border border-border px-2 py-1 font-mono-tag text-[8px] text-muted-foreground">
                      {tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Instagram, MapPin, Mail, Phone, Clock } from "lucide-react";
import { Reveal } from "./Reveal";
import { socialUrl, useShopDetails } from "@/lib/shop-details";

export function Contact() {
  const details = useShopDetails();
  return (
    <section id="contact" className="relative bg-surface/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <div className="pill mb-4">Visit the Gallery</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Come see them <span className="italic text-gold-gradient">in person</span>.
            </h2>
            <p className="mt-5 max-w-md text-sm md:text-base text-muted-foreground">
              The gallery is open by appointment in Bausher, Muscat. Sip Omani coffee under museum lighting and walk the halls.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-gold" />
                <div>
                  <div className="font-mono-tag text-[10px] text-gold-soft">Address</div>
                  <div className="text-foreground">{details.address}</div>
                </div>
              </div>
              {(details.phone || details.whatsapp) && <div className="flex items-start gap-3">
                <Phone size={18} className="mt-1 text-gold" />
                <div>
                  <div className="font-mono-tag text-[10px] text-gold-soft">Phone / WhatsApp</div>
                  {details.phone && <a href={`tel:${details.phone.replace(/[^+\d]/g, "")}`} className="block text-foreground hover:text-gold">{details.phone}</a>}
                  {details.whatsapp && <a href={`https://wa.me/${details.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-foreground hover:text-gold">WhatsApp · {details.whatsapp}</a>}
                </div>
              </div>}
              {details.hours && <div className="flex items-start gap-3"><Clock size={18} className="mt-1 text-gold" /><div><div className="font-mono-tag text-[10px] text-gold-soft">Opening hours</div><div className="whitespace-pre-line text-foreground">{details.hours}</div></div></div>}
              {details.email && <div className="flex items-start gap-3">
                <Mail size={18} className="mt-1 text-gold" />
                <div>
                  <div className="font-mono-tag text-[10px] text-gold-soft">Email</div>
                  <a href={`mailto:${details.email}`} className="break-all text-foreground hover:text-gold">{details.email}</a>
                </div>
              </div>}
              {["instagram", "facebook", "tiktok"].map((key) => {
                const value = details[key as "instagram" | "facebook" | "tiktok"];
                const href = socialUrl(value);
                return href ? <div key={key} className="flex items-start gap-3">
                <Instagram size={18} className="mt-1 text-gold" />
                <div>
                  <div className="font-mono-tag text-[10px] text-gold-soft">{key}</div>
                  <a href={href} target="_blank" rel="noreferrer" className="break-all text-foreground hover:text-gold">{key}</a>
                </div>
              </div> : null;
              })}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="vitrine vitrine-light relative p-7 md:p-9"
            >
              <div className="font-mono-tag text-[10px] text-gold-soft">Request a private viewing</div>
              <div className="mt-4 space-y-4">
                <Field label="Your name" placeholder="Khalid Al-Hinai" />
                <Field label="Email" type="email" placeholder="you@domain.com" />
                <Field label="Interested in" placeholder="e.g. Ferrari 250 GTO, Trinity Series…" />
                <div>
                  <label className="font-mono-tag text-[10px] text-gold-soft">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a little about your collection."
                    className="mt-1 w-full rounded-lg border border-gold/20 bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
                  />
                </div>
                <button type="submit" className="btn-gold w-full">Reserve an appointment</button>
                <a
                  href="#booking"
                  data-cursor="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="font-mono-tag block w-full rounded-full border border-gold/30 px-5 py-3 text-center text-[10px] text-gold transition-colors hover:border-gold hover:bg-gold/10"
                >
                  Or pick a date & time →
                </a>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="font-mono-tag text-[10px] text-gold-soft">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gold/20 bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
      />
    </div>
  );
}

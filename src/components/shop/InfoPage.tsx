import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { AppNavbar } from "@/components/site/AppNavbar";
import { Footer } from "@/components/site/Footer";
import { SectionHead } from "@/components/shop/SectionHead";
import { useSiteMedia, siteMediaStyle } from "@/lib/site-media";
import { WHATSAPP_NUMBER } from "@/lib/shop";

/** Simple shop info page (Service, Indoor track) opened from the 5 boxes under the cover. */
export function InfoPage(props: {
  kicker: string;
  title: ReactNode;
  text: string;
  photos: { src: string; label: string }[];
  points: [string, string][];
  whatsappText: string;
  ctaLabel: string;
  more: { label: string; category: string };
}) {
  const siteMedia = useSiteMedia();
  return (
    <div className="gearhead-home ghx-shop" style={siteMediaStyle(siteMedia)}>
      <AppNavbar />
      <main className="ghx-page">
        <section className="ghx-section">
          <div className="ghx-wrap">
            <Link to="/app" className="ghx-back"><ArrowLeft size={15} /> Back to home</Link>
            <SectionHead as="h1" kicker={props.kicker} title={props.title} text={props.text} />
            <div className="ghx-media-grid">
              {props.photos.map((p, i) => (
                <figure key={p.src} className={`ghx-media${i === 0 ? " ghx-media-wide" : ""}`}>
                  <img src={p.src} alt={p.label} loading={i === 0 ? "eager" : "lazy"} />
                  <figcaption><strong>{p.label}</strong></figcaption>
                </figure>
              ))}
            </div>
            <div className="ghx-offer-grid">
              {props.points.map(([t, s]) => (
                <div key={t} className="ghx-offer"><CheckCircle2 size={18} aria-hidden="true" /><div><strong>{t}</strong><span>{s}</span></div></div>
              ))}
            </div>
            <div className="ghx-hero-ctas mt-6">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(props.whatsappText)}`} target="_blank" rel="noopener noreferrer" className="ghx-btn ghx-btn-primary"><MessageCircle size={16} /> {props.ctaLabel}</a>
              <Link to="/collection/$category" params={{ category: props.more.category }} className="ghx-btn ghx-btn-outline">{props.more.label} <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="app" />
    </div>
  );
}

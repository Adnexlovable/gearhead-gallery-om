import { Reveal } from "./Reveal";
import heroBg from "@/assets/hero-bg.jpg";
import sf90 from "@/assets/sf90.jpg";

export function VideoShowcase() {
  return (
    <section className="relative">
      {/* Panel 1 */}
      <div className="relative h-[90vh] overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D15]/95 via-[#0B1D15]/40 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
          <Reveal className="max-w-xl">
            <div className="pill mb-4">Showroom · Film 01</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold leading-[0.95] text-foreground">
              Cinematic showroom.<br />
              <span className="italic text-gold-gradient">Curated</span> like a film set.
            </h2>
            <p className="mt-5 max-w-md text-sm md:text-base text-muted-foreground">
              Every vitrine is lit, framed, and color-graded so that each model performs like the star it deserves to be.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Panel 2 */}
      <div className="relative h-[90vh] overflow-hidden">
        <img src={sf90} alt="" className="absolute inset-0 h-full w-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0B1D15]/95 via-[#0B1D15]/40 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-end px-6 md:px-10">
          <Reveal className="max-w-xl text-right">
            <div className="pill mb-4">Showroom · Film 02</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold leading-[0.95] text-foreground">
              Scaled to the millimetre.<br />
              <span className="italic text-gold-gradient">Felt</span> at full size.
            </h2>
            <p className="ml-auto mt-5 max-w-md text-sm md:text-base text-muted-foreground">
              From mirror stems to brake calipers, every detail honours the original — for the collector who notices.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

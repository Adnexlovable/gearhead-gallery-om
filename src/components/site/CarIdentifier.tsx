import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { identifyCar } from "@/lib/identify-car.functions";
import sf24 from "@/assets/ferrari-sf24.jpg";
import w15 from "@/assets/mercedes-w15.jpg";
import huracan from "@/assets/huracan-sterrato.jpg";
import sf90 from "@/assets/sf90.jpg";
import wrangler from "@/assets/wrangler.jpg";
import defender from "@/assets/defender.jpg";
import gto from "@/assets/250gto.jpg";
import silverghost from "@/assets/silverghost.jpg";
import frameBmw from "@/assets/frame-bmw.jpg";
import frameBatmobile from "@/assets/frame-batmobile.jpg";
import framePorsche from "@/assets/frame-porsche.jpg";

const IMAGES: Record<string, string> = {
  sf24, w15, huracan, sf90, wrangler, defender, gto, silverghost,
  "frame-bmw": frameBmw,
  "frame-batmobile": frameBatmobile,
  "frame-porsche": framePorsche,
};

type Result = Awaited<ReturnType<typeof identifyCar>>;

export function CarIdentifier() {
  const identify = useServerFn(identifyCar);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose a photo file.");
      return;
    }
    if (file.size > 6_000_000) {
      setError("That photo is a bit large — please use one under 6MB.");
      return;
    }
    setError(null);
    setResult(null);
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = () => reject(new Error("Could not read that file."));
      fr.readAsDataURL(file);
    });
    setPreview(dataUrl);
    setLoading(true);
    try {
      const res = await identify({ data: { imageDataUrl: dataUrl } });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="identify" className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="text-center">
          <div className="pill mx-auto mb-4 inline-flex">Curator's Eye</div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Snap it, <span className="italic text-gold-gradient">name it</span>, own it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-muted-foreground">
            Upload a photo of any car. Our curator identifies the machine and points you to the pieces in the gallery that match it.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upload panel */}
            <div className="vitrine relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden p-6">
              {preview ? (
                <>
                  <img src={preview} alt="Your uploaded car" className="absolute inset-0 h-full w-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D15]/90 via-[#0B1D15]/40 to-transparent" />
                  <button
                    onClick={reset}
                    data-cursor="hover"
                    aria-label="Remove photo"
                    className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-surface text-gold transition-colors hover:bg-gold hover:text-[#0B1D15]"
                  >
                    <X size={16} />
                  </button>
                  {loading && (
                    <div className="relative z-10 flex items-center gap-3 rounded-full border border-gold/30 glass px-5 py-3">
                      <Loader2 size={16} className="animate-spin text-gold" />
                      <span className="font-mono-tag text-[10px] text-foreground/80">Examining the bodywork…</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-surface">
                    <Upload size={20} className="text-gold" />
                  </div>
                  <button
                    onClick={() => inputRef.current?.click()}
                    data-cursor="hover"
                    className="btn-gold mt-6"
                  >
                    Upload a car photo
                  </button>
                  <p className="font-mono-tag mt-4 text-[10px] text-muted-foreground">JPG or PNG · up to 6MB</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                }}
              />
            </div>

            {/* Result panel */}
            <div className="vitrine relative min-h-[320px] p-6">
              {error && <p className="text-sm text-gold-soft">{error}</p>}

              {!error && !result && (
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "The curator is studying your photo…"
                    : "Your identification and matching pieces will appear here."}
                </p>
              )}

              {result && !result.is_car && (
                <p className="text-sm text-muted-foreground">
                  We couldn't find a car in that photo. Try a clearer shot of the vehicle.
                </p>
              )}

              {result?.is_car && (
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-gold" />
                    <span className="font-mono-tag text-[9px] text-gold-soft/80">
                      {result.confidence.toUpperCase()} CONFIDENCE · {result.category ?? "—"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                    {[result.make, result.model].filter(Boolean).join(" ") || "Unidentified"}
                  </h3>
                  {result.era && (
                    <div className="font-mono-tag mt-1 text-[10px] text-muted-foreground">{result.era}</div>
                  )}
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{result.notes}</p>

                  {result.matches.length > 0 && (
                    <div className="mt-5 border-t border-gold/15 pt-4">
                      <div className="font-mono-tag mb-3 text-[9px] text-gold/70">MATCHING PIECES</div>
                      <ul className="space-y-3">
                        {result.matches.map((m) => (
                          <li key={m.id} className="flex items-center gap-3">
                            <img
                              src={IMAGES[m.id]}
                              alt={m.name}
                              className="h-14 w-20 flex-none rounded-sm object-cover"
                            />
                            <div className="min-w-0">
                              <div className="truncate font-display text-sm font-bold text-foreground">{m.name}</div>
                              <div className="font-mono-tag text-[9px] text-gold-soft">{m.tag} · {m.price}</div>
                              <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{m.reason}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#shop"
                        data-cursor="hover"
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="btn-gold mt-5 inline-flex !py-2.5 !px-5 !text-[10px]"
                      >
                        View in the boutique
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

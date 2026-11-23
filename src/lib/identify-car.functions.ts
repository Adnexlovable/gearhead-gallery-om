import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader, setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { protectAiRequest } from "@/lib/ai/request-protection.server";
import { getCarImageDataUrlError, MAX_CAR_IMAGE_DATA_URL_LENGTH } from "@/lib/ai/image-validation";

const CATALOG = [
  { id: "sf24", name: "Ferrari SF-24", tag: "F1 Scale 1:43", price: "OMR 89", category: "F1" },
  { id: "w15", name: "Mercedes-AMG W15", tag: "F1 Scale 1:43", price: "OMR 89", category: "F1" },
  {
    id: "sf90",
    name: "Ferrari SF90 Stradale",
    tag: "Supercar 1:24",
    price: "OMR 145",
    category: "Supercars",
  },
  {
    id: "huracan",
    name: "Lamborghini Huracán Sterrato",
    tag: "Supercar 1:24",
    price: "OMR 160",
    category: "Supercars",
  },
  {
    id: "wrangler",
    name: "Jeep Wrangler Rubicon RC",
    tag: "RC Rally Edition",
    price: "OMR 220",
    category: "4x4 Off-Road",
  },
  {
    id: "defender",
    name: "Land Rover Defender 130 V8",
    tag: "Shadow-Box · Gold Edition",
    price: "OMR 395",
    category: "4x4 Off-Road",
  },
  {
    id: "gto",
    name: "Ferrari 250 GTO",
    tag: "Heritage 1:18",
    price: "OMR 310",
    category: "Vintage Classics",
  },
  {
    id: "silverghost",
    name: "Rolls-Royce Silver Ghost",
    tag: "Heritage 1:18",
    price: "OMR 340",
    category: "Vintage Classics",
  },
  {
    id: "frame-bmw",
    name: "BMW M3 — LED Vitrine",
    tag: "Framed Art",
    price: "OMR 480",
    category: "Framed Art",
  },
  {
    id: "frame-batmobile",
    name: "The Dark Knight Rises — Batmobile Set",
    tag: "Framed Art · Limited",
    price: "OMR 690",
    category: "Framed Art",
  },
  {
    id: "frame-porsche",
    name: "Porsche 911 Trinity",
    tag: "Framed Art · Trinity Series",
    price: "OMR 620",
    category: "Framed Art",
  },
];

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    is_car: { type: "boolean" },
    make: { type: ["string", "null"] },
    model: { type: ["string", "null"] },
    era: { type: ["string", "null"] },
    category: { type: ["string", "null"] },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    notes: { type: "string" },
    matches: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          reason: { type: "string" },
        },
        required: ["id", "reason"],
      },
    },
  },
  required: ["is_car", "make", "model", "era", "category", "confidence", "notes", "matches"],
} as const;

export type CarIdentificationResult =
  | {
      ok: true;
      is_car: boolean;
      make: string | null;
      model: string | null;
      era: string | null;
      category: string | null;
      confidence: "low" | "medium" | "high";
      notes: string;
      matches: ((typeof CATALOG)[number] & { reason: string })[];
    }
  | {
      ok: false;
      status: 403 | 429 | 503;
      error: string;
      retryAfterSeconds?: number;
    };

function failedResult(
  status: 403 | 429 | 503,
  error: string,
  retryAfterSeconds?: number,
): CarIdentificationResult {
  setResponseStatus(status);
  if (status === 429 && retryAfterSeconds) {
    setResponseHeader("Retry-After", String(retryAfterSeconds));
  }
  return { ok: false, status, error, retryAfterSeconds };
}

function getRetryAfterSeconds(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) return Math.ceil(seconds);
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? undefined
    : Math.max(1, Math.ceil((timestamp - Date.now()) / 1000));
}

export const identifyCar = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        imageDataUrl: z
          .string()
          .max(MAX_CAR_IMAGE_DATA_URL_LENGTH, "Photo is too large. Please use an image under 5 MB.")
          .superRefine((value, ctx) => {
            const error = getCarImageDataUrlError(value);
            if (error) ctx.addIssue({ code: "custom", message: error });
          }),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<CarIdentificationResult> => {
    const protection = await protectAiRequest("car-identifier");
    if (!protection.allowed) {
      if (protection.status === 429) {
        return failedResult(
          429,
          `Too many photo requests. Please wait ${protection.retryAfterSeconds} seconds before trying again.`,
          protection.retryAfterSeconds,
        );
      }
      return failedResult(
        protection.status,
        protection.status === 403
          ? "This request could not be verified. Please reload the page and try again."
          : "Photo identification is temporarily unavailable. Please try again shortly.",
      );
    }

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return failedResult(503, "Photo identification is temporarily unavailable.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
        text: {
          format: {
            type: "json_schema",
            name: "car_identification",
            strict: true,
            schema: RESULT_SCHEMA,
          },
        },
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "You are the curator of GearHead RC, a scale model car boutique in Muscat, Oman. " +
                  "Identify the vehicle in this photo (make, model, rough era) and classify it into one of: " +
                  "F1, Supercars, 4x4 Off-Road, Vintage Classics, Framed Art. " +
                  "Then pick 2-3 matching pieces from this catalogue, using only these ids, ordered best-first. " +
                  "Write notes as one or two warm, gallery-curator sentences about the car. " +
                  "If the photo is not a car, set is_car to false, leave identification fields null and matches empty.\n\n" +
                  `Catalogue: ${JSON.stringify(CATALOG)}`,
              },
              { type: "input_image", image_url: data.imageDataUrl },
            ],
          },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429) {
        return failedResult(
          429,
          "The photo identifier is busy. Please wait a moment and try again.",
          getRetryAfterSeconds(res.headers.get("retry-after")),
        );
      }
      return failedResult(
        503,
        res.status === 402
          ? "Photo identification is temporarily unavailable. Please message us on WhatsApp."
          : "Photo identification could not complete. Please try again shortly.",
      );
    }

    // Accumulate the SSE output text (streaming is required on this endpoint).
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            text += event.delta;
          } else if (event.type === "response.completed" && event.response?.output_text) {
            if (!text) text = event.response.output_text;
          }
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return failedResult(503, "The curator could not read that photo. Please try another image.");
    }

    const shape = z.object({
      is_car: z.boolean(),
      make: z.string().nullable(),
      model: z.string().nullable(),
      era: z.string().nullable(),
      category: z.string().nullable(),
      confidence: z.enum(["low", "medium", "high"]),
      notes: z.string(),
      matches: z.array(z.object({ id: z.string(), reason: z.string() })),
    });
    const result = shape.parse(parsed);

    return {
      ...result,
      ok: true,
      matches: result.matches
        .map((m) => {
          const item = CATALOG.find((c) => c.id === m.id);
          return item ? { ...item, reason: m.reason } : null;
        })
        .filter((m): m is (typeof CATALOG)[number] & { reason: string } => m !== null)
        .slice(0, 3),
    };
  });

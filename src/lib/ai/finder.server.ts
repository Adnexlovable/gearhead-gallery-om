import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, Output, jsonSchema, streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export type FinderCatalogItem = {
  slug: string;
  name: string;
  category: string;
  scale: string;
  type: string;
  level: string;
  inStock: boolean;
  description: string;
  features: string[];
};

export type FinderAnswer = {
  summary: string;
  matches: { slug: string; reason: string }[];
  follow_up: string | null;
};

const SCHEMA = jsonSchema<FinderAnswer>({
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    matches: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { slug: { type: "string" }, reason: { type: "string" } },
        required: ["slug", "reason"],
      },
    },
    follow_up: { type: ["string", "null"] },
  },
  required: ["summary", "matches", "follow_up"],
});

const INSTRUCTIONS = `You are the friendly product expert at GearHead RC Hub, an RC car, scale model and diecast shop in Bausher, Muscat, Oman.
A shopper describes the vehicle, scale model, use or budget they want. Recommend 1 to 4 products from the catalogue that best match, best first.
Rules:
- Only use slugs that appear in the catalogue. Never invent products, features, prices or stock.
- Retail prices are not published yet. Never state a price, price range or currency amount. Each item has a level (Entry level, Mid range, Premium); use it only to respect the shopper's budget. As a rough internal guide, Entry level is roughly under 60 OMR, Mid range roughly 60-160 OMR, Premium above that.
- If an item is not in stock, mention it is available on preorder enquiry.
- Each reason is one short sentence explaining why it fits the request.
- summary is one or two warm sentences. follow_up is one short question that would help narrow the choice, or null.
- If nothing fits, return an empty matches list and explain kindly in summary, suggesting the shopper message the shop on WhatsApp.
- Reply in the same language the shopper used (English or Arabic).`;

export class FinderError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export async function recommendProducts(apiKey: string, query: string, catalog: FinderCatalogItem[]): Promise<FinderAnswer> {
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      instructions: INSTRUCTIONS,
      messages: [{ role: "user", content: `Catalogue (JSON):\n${JSON.stringify(catalog)}\n\nShopper request:\n${query}` }],
      output: Output.object({ schema: SCHEMA }),
      maxRetries: 0,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    return await result.output;
  } catch (error) {
    if (APICallError.isInstance(error)) {
      console.error(`Product finder gateway error [${error.statusCode}]: ${error.responseBody ?? error.message}`);
      const status = error.statusCode ?? 500;
      if (status === 429) throw new FinderError("The product finder is busy right now. Please try again in a minute.", 429);
      if (status === 402) throw new FinderError("The product finder is paused at the moment. Please message us on WhatsApp.", 402);
      if (status === 403) throw new FinderError("The product finder is not available right now. Please message us on WhatsApp.", 403);
      throw new FinderError("The product finder could not answer right now. Please try again.", status);
    }
    console.error("Product finder failed:", error);
    throw new FinderError("The product finder could not answer right now. Please try again.", 500);
  }
}

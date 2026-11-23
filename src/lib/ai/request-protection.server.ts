import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getRequest, setResponseHeader, setResponseStatus } from "@tanstack/react-start/server";

type Endpoint = "product-finder" | "car-identifier";

type ProtectionResult =
  | { allowed: true }
  | {
      allowed: false;
      status: 403 | 429 | 503;
      retryAfterSeconds?: number;
    };

const LIMITS: Record<Endpoint, { requests: number; window: `${number} m` }> = {
  "product-finder": { requests: 5, window: "1 m" },
  "car-identifier": { requests: 3, window: "10 m" },
};

let redis: Redis | undefined;
const limiters = new Map<Endpoint, Ratelimit>();

function getLimiter(endpoint: Endpoint, token: string, url: string): Ratelimit {
  const existing = limiters.get(endpoint);
  if (existing) return existing;

  redis ??= new Redis({ url, token });
  const config = LIMITS[endpoint];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `gearhead:${endpoint}`,
  });
  limiters.set(endpoint, limiter);
  return limiter;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const requestUrl = new URL(request.url);
    const expectedHost = (
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      requestUrl.host
    )
      .split(",", 1)[0]
      .trim()
      .toLowerCase();
    const expectedProtocol = (request.headers.get("x-forwarded-proto") ?? requestUrl.protocol)
      .split(",", 1)[0]
      .trim()
      .replace(/:$/, "")
      .toLowerCase();
    const originUrl = new URL(origin);

    return (
      originUrl.host.toLowerCase() === expectedHost &&
      originUrl.protocol.replace(/:$/, "").toLowerCase() === expectedProtocol
    );
  } catch {
    return false;
  }
}

function getClientIp(request: Request): string | null {
  const ip = (
    request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",", 1)[0]
  )?.trim();

  if (ip && ip.length <= 64 && /^[0-9a-fA-F:.]+$/.test(ip)) {
    return ip.toLowerCase();
  }

  return process.env.NODE_ENV === "production" ? null : "local-development";
}

async function hashIp(ip: string, token: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(token),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));

  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export async function protectAiRequest(endpoint: Endpoint): Promise<ProtectionResult> {
  const request = getRequest();
  if (!isSameOrigin(request)) {
    setResponseStatus(403);
    return { allowed: false, status: 403 };
  }

  const ip = getClientIp(request);
  if (!ip) {
    setResponseStatus(503);
    return { allowed: false, status: 503 };
  }

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    setResponseStatus(503);
    return { allowed: false, status: 503 };
  }

  try {
    const limiter = getLimiter(endpoint, token, url);
    const result = await limiter.limit(await hashIp(ip, token));
    if (result.success) return { allowed: true };

    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    setResponseStatus(429);
    setResponseHeader("Retry-After", String(retryAfterSeconds));
    return { allowed: false, status: 429, retryAfterSeconds };
  } catch {
    setResponseStatus(503);
    return { allowed: false, status: 503 };
  }
}

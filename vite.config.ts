// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const root = path.dirname(fileURLToPath(import.meta.url));

// Server-only env (no VITE_ prefix) for server routes/functions. Never add these to client defines.
const serverEnv = loadEnv(process.env.NODE_ENV === "production" ? "production" : "development", root, "");
for (const [key, value] of Object.entries(serverEnv)) {
  if (process.env[key] === undefined) process.env[key] = value;
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        // Pin email rendering to the hoisted entities v4.5.0 copy (v7 breaks SSR).
        "entities/lib/decode.js": path.resolve(root, "node_modules/entities/lib/decode.js"),
        "entities/lib/encode.js": path.resolve(root, "node_modules/entities/lib/encode.js"),
        entities: path.resolve(root, "node_modules/entities"),
      },
    },
  },
});

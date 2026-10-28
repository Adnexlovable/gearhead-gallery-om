import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";
import { APP_ICON_192, APP_THEME, SPLASH_SCRIPT, pwaLinks } from "@/lib/pwa";
import { siteSeoQuery } from "@/lib/seo.functions";
import { verificationCode } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-gold-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-gold">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="btn-ghost-gold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  loader: ({ context }) => context.queryClient.ensureQueryData(siteSeoQuery).catch(() => null),
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: APP_THEME },
      { name: "application-name", content: "GearHead RC" },
      { name: "msapplication-TileColor", content: APP_THEME },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "GearHead RC" },
      { name: "google-site-verification", content: "onFo_S52MbEFzFkgQlc8PnpmvUOoF5wf1jgZgGtFqOs" },
      // Extra code pasted by the owner in Admin → Search (Google accepts several verification tags).
      ...(() => { const c = verificationCode(loaderData?.googleVerification ?? ""); return c && c !== "onFo_S52MbEFzFkgQlc8PnpmvUOoF5wf1jgZgGtFqOs" ? [{ name: "google-site-verification", content: c }] : []; })(),
      { title: "GearHead RC Hub — A New RC Experience for Oman" },
      { name: "description", content: "GearHead RC Hub — performance RC cars, scale crawlers, parts and an indoor track experience planned for Bousher, Muscat, Oman." },
      { name: "author", content: "GearHead RC" },
      { property: "og:title", content: "GearHead RC Hub — RC Cars & Track, Muscat" },
      { property: "og:description", content: "RC vehicles, parts, service and an indoor track planned near Bousher Sand Dunes in Muscat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      ...pwaLinks,
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,800;1,900&family=Saira:ital,wdth,wght@1,125,800;1,125,900&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
    scripts: [{ children: SPLASH_SCRIPT }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>
        {/* Installed-app splash: shown only when the opening script adds .gh-splash-on */}
        <div className="gh-splash" aria-hidden="true"><img src={APP_ICON_192} alt="" width={168} height={168} /></div>
        {children}<Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <SmoothScroll />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

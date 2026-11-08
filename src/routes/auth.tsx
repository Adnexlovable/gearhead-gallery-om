import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Sign In — GearHead RC · Muscat" },
      { name: "description", content: "Sign in or create your GearHead RC collector account." },
      { property: "og:title", content: "Sign In — GearHead RC" },
      { property: "og:description", content: "Access your GearHead RC collector account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage({ kind: "info", text: "Check your email to confirm your account, then sign in." });
        } else {
          navigate({ to: "/" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-24">
      <div className="w-full max-w-md rounded-3xl border border-gold/20 glass p-8">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-surface">
            <span className="font-display text-sm font-bold text-gold-gradient">G</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-wide text-foreground">GearHead</div>
            <div className="font-mono-tag text-[9px] text-gold-soft/80">Gallery · Muscat</div>
          </div>
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to your collector account."
            : "Join the GearHead RC collectors."}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-tag text-[10px] text-gold-soft/80">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-gold/20 bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-tag text-[10px] text-gold-soft/80">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-gold/20 bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
              placeholder="••••••••"
            />
          </label>

          {message && (
            <p className={`text-sm ${message.kind === "error" ? "text-red-400" : "text-gold-soft"}`}>
              {message.text}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-gold mt-2 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New to GearHead?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(null); }}
            className="text-gold underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

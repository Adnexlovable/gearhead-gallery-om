import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin-email";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Admin Sign In — GearHead RC" },
      { name: "description", content: "Owner sign-in for the GearHead RC admin dashboard." },
      { property: "og:title", content: "Admin Sign In — GearHead RC" },
      { property: "og:description", content: "Owner-only access to the GearHead RC dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const BLOCKED = "This sign-in is only for the GearHead RC owner. Other emails can't be used.";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    const go = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      if (isAdminEmail(data.user.email ?? "")) navigate({ to: "/admin", replace: true });
      else {
        await supabase.auth.signOut();
        setMessage({ kind: "error", text: BLOCKED });
      }
    };
    void go();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") window.setTimeout(() => void go(), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!isAdminEmail(email)) {
      setMessage({ kind: "error", text: BLOCKED });
      return;
    }
    setBusy(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) {
          if (/already registered|user already|exists/i.test(error.message)) {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (signInError) throw signInError;
            navigate({ to: "/admin", replace: true });
            return;
          }
          throw error;
        }
        if (data.session) {
          navigate({ to: "/admin", replace: true });
        } else {
          setMessage({
            kind: "info",
            text: `Account created. If no verification email arrives, go to Lovable Cloud / Supabase dashboard → Authentication → Users, find ${cleanEmail}, and confirm the email manually. Then come back and sign in.`
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : "Something went wrong.";
      setMessage({
        kind: "error",
        text: /fetch|network|paused|credit/i.test(text)
          ? "Can't reach the shop server right now. Add Cloud credits in Lovable, then try again."
          : text,
      });
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setMessage(null);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: ADMIN_EMAIL,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    setMessage(
      error
        ? { kind: "error", text: error.message }
        : { kind: "info", text: `Resend requested. If nothing arrives, confirm the user manually in the Supabase dashboard.` }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-24">
      <div className="w-full max-w-md rounded-3xl border border-gold/20 glass p-8">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-surface">
            <span className="font-display text-sm font-bold text-gold-gradient">G</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-wide text-foreground">GearHead RC</div>
            <div className="font-mono-tag text-[9px] text-gold-soft/80">Owner admin</div>
          </div>
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground">
          {mode === "signin" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Owner only. You'll go straight to the admin page."
            : "Create the owner account. If no email arrives, confirm it manually in the Supabase dashboard."}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-tag text-[10px] text-gold-soft/80">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-gold/20 bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-tag text-[10px] text-gold-soft/80">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-gold/20 bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
              placeholder="At least 8 characters"
            />
          </label>

          {message && (
            <p role="status" className={`text-sm ${message.kind === "error" ? "text-destructive" : "text-gold-soft"}`}>
              {message.text}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-gold mt-2 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(null); }}
            className="text-gold underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "First time? Create the admin account" : "Already have account? Sign in"}
          </button>
          {mode === "signup" && (
            <button onClick={resend} className="text-gold-soft underline-offset-4 hover:underline">
              Didn't get the email? Try resend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

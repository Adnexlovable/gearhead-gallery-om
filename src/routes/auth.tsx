import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin-email";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

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
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage({ kind: "info", text: "Password reset link sent. Check your inbox." });
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
          ? "Can't reach the shop server right now. Try again shortly."
          : /invalid login credentials/i.test(text)
            ? "Invalid email or password."
            : text,
      });
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
            <div className="font-display text-sm font-bold tracking-wide text-foreground">
              GearHead RC
            </div>
            <div className="font-mono-tag text-[9px] text-gold-soft/80">Owner admin</div>
          </div>
        </Link>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {mode === "signin" ? "Admin sign in" : "Reset password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Owner only. Sign in to manage the site."
            : "Request a password reset link for the owner account."}
        </p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-tag text-[10px] text-gold-soft/80">Owner email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-gold/20 bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-gold/60"
            />
          </label>
          {mode === "signin" && (
            <label className="flex flex-col gap-1.5">
              <span className="font-mono-tag text-[10px] text-gold-soft/80">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gold/20 bg-surface py-3 pl-4 pr-12 text-sm text-foreground outline-none focus:border-gold/60"
                  placeholder="Your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </label>
          )}
          {message && (
            <p
              role="status"
              className={`text-sm ${message.kind === "error" ? "text-destructive" : "text-gold-soft"}`}
            >
              {message.text}
            </p>
          )}
          <Button type="submit" disabled={busy} className="btn-gold mt-2 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Send reset link"}
          </Button>
        </form>
        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <button
              onClick={() => {
                setMode("forgot");
                setMessage(null);
              }}
              className="text-gold-soft underline-offset-4 hover:underline"
            >
              Forgot your password?
            </button>
          ) : (
            <button
              onClick={() => {
                setMode("signin");
                setMessage(null);
              }}
              className="text-gold-soft underline-offset-4 hover:underline"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

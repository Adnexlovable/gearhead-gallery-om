import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Reset Password — GearHead RC" },
      { name: "description", content: "Set a new password for your GearHead RC account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    // The recovery link lands here with a token in the URL hash; the Supabase
    // client picks it up and fires PASSWORD_RECOVERY once the session is set.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage({ kind: "error", text: "The two passwords do not match." });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ kind: "info", text: "Password updated. Taking you to sign in…" });
      setTimeout(() => navigate({ to: "/auth", replace: true }), 1200);
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

        <h1 className="font-display text-2xl font-bold text-foreground">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a new password for your account.
        </p>

        {!ready ? (
          <p className="mt-6 text-sm text-muted-foreground">
            This page only works from the password reset link in your email.{" "}
            <Link to="/auth" className="text-gold underline-offset-4 hover:underline">
              Request a new link
            </Link>
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono-tag text-[10px] text-gold-soft/80">New password</span>
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
            <label className="flex flex-col gap-1.5">
              <span className="font-mono-tag text-[10px] text-gold-soft/80">Repeat new password</span>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {busy ? "Please wait…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

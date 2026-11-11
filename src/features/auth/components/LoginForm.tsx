"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";
import { AnalyticsEvent, capture, identifyUser } from "@/shared/lib/analytics";
import site from "@/shared/components/site/site.module.css";
import styles from "./auth.module.css";

function passwordStrength(password: string) {
  if (password.length < 8) return "weak";
  if (password.length >= 12 && /[^a-zA-Z0-9]/.test(password)) return "strong";
  return /[A-Z0-9]/.test(password) ? "good" : "weak";
}

export function LoginForm({ isSignUp }: { isSignUp: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const strength = passwordStrength(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    setMessage(null);
    setPending("email");

    try {
      const supabase = createClient();
      if (isSignUp) {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
          },
        });
        if (authError) {
          setError(authError.message);
        } else if (data.session) {
          identifyUser(data.session.user.id, {
            email: data.session.user.email ?? null,
          });
          capture(AnalyticsEvent.UserSignedUp, { method: "email" });
          router.push("/welcome");
          router.refresh();
          return;
        } else {
          setMessage("Check your email for the confirmation link.");
        }
      } else {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
        if (authError) {
          setError(authError.message);
        } else {
          if (data.user)
            identifyUser(data.user.id, { email: data.user.email ?? null });
          capture(AnalyticsEvent.UserSignedIn, { method: "email" });
          router.push("/dashboard");
          router.refresh();
          return;
        }
      }
    } catch {
      setError("We couldn’t connect. Check your connection and try again.");
    }
    submittingRef.current = false;
    setPending(null);
  }

  async function handleGoogleLogin() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    setMessage(null);
    setPending("google");
    try {
      capture(AnalyticsEvent.UserSignedIn, {
        method: "google",
        initiated: true,
      });
      const { error: authError } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
        },
      });
      if (!authError) return;
      setError(authError.message);
    } catch {
      setError("We couldn’t connect to Google. Try again or use your email.");
    }
    submittingRef.current = false;
    setPending(null);
  }

  return (
    <div className={styles.formContent}>
      <h1>{isSignUp ? "Make it yours." : "Welcome back."}</h1>
      <p className={styles.description}>
        {isSignUp
          ? "Create an account to save and publish your forms."
          : "Log in to your ByteForm workspace."}
      </p>
      <button
        type="button"
        className={styles.google}
        disabled={pending !== null}
        onClick={handleGoogleLogin}
      >
        {pending === "google" && (
          <LoaderCircle
            size={17}
            className={styles.spinner}
            aria-hidden="true"
          />
        )}
        {pending === "google"
          ? "Connecting to Google…"
          : "Continue with Google"}
      </button>
      <div className={styles.divider}>
        <span>or use your email</span>
      </div>
      <form onSubmit={handleSubmit} aria-busy={pending !== null}>
        <fieldset disabled={pending !== null} className={styles.fields}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
          />
          <label htmlFor="password">Password</label>
          <div className={styles.passwordField}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              minLength={isSignUp ? 6 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby={isSignUp ? "password-hint" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
          {isSignUp && (
            <div className={styles.passwordHint} id="password-hint">
              {password ? (
                <span data-strength={strength}>
                  Password strength: {strength}.{" "}
                  {strength !== "strong" &&
                    "Try a longer password with numbers and symbols."}
                </span>
              ) : (
                "Use at least 6 characters. A longer password is stronger."
              )}
            </div>
          )}
        </fieldset>
        <div aria-live="polite" aria-atomic="true">
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className={styles.success} role="status">
              {message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className={`${site.cta} ${styles.submit}`}
          disabled={pending !== null}
        >
          {pending === "email" ? (
            <>
              <LoaderCircle
                size={17}
                className={styles.spinner}
                aria-hidden="true"
              />{" "}
              {isSignUp ? "Creating account…" : "Logging in…"}
            </>
          ) : (
            <>
              {isSignUp ? "Create account" : "Log in"}{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
      <p className={styles.switchMode}>
        {isSignUp ? "Already have an account? " : "New to ByteForm? "}
        <Link
          href={isSignUp ? "/auth/login" : "/auth/login?mode=signup"}
          aria-disabled={pending !== null}
          tabIndex={pending !== null ? -1 : undefined}
          onClick={(event) => {
            if (pending !== null) event.preventDefault();
          }}
        >
          {isSignUp ? "Log in" : "Create an account"}
        </Link>
      </p>
      <p className={styles.guestNote}>
        Just exploring?{" "}
        <Link href="/new">Start building without an account.</Link>
      </p>
    </div>
  );
}

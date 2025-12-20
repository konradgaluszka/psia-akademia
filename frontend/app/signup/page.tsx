"use client";

import { useSignUp } from "@clerk/nextjs";
import { useMemo, useState } from "react";

import { providerIcons, socialProviders } from "../../components/authProviders";
import { useLocale } from "../../components/LocaleProvider";

const oauthStrategies = {
  google: "oauth_google",
  facebook: "oauth_facebook",
  tiktok: "oauth_tiktok"
} as const;

export default function SignupPage() {
  const { messages } = useLocale();
  const t = messages.signupPage;
  const { signUp, isLoaded } = useSignUp();
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  async function handleSocialSignup(provider: (typeof socialProviders)[number]) {
    setOauthError(null);
    if (!isLoaded) {
      setOauthError(t.oauthError);
      return;
    }
    try {
      await signUp.authenticateWithRedirect({
        strategy: oauthStrategies[provider],
        redirectUrl: "/oauth/callback",
        redirectUrlComplete: "/oauth/callback"
      });
    } catch (err) {
      console.error("Clerk OAuth error", err);
      setOauthError(t.oauthError);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError(t.errors.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        setSuccess(true);
        return;
      }

      if (response.status === 409) {
        setError(t.errors.conflict);
      } else {
        setError(t.errors.generic);
      }
    } catch (err) {
      console.error("Signup error", err);
      setError(t.errors.generic);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-10 flex justify-center px-2">
      <div className="card w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            {t.eyebrow}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                {t.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.passwordLabel}
            </label>
            <input
              type="password"
              name="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.confirmPasswordLabel}
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder={t.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <div className="font-semibold">{t.successTitle}</div>
              <p className="text-sm">{t.successBody}</p>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {isSubmitting ? t.continueWithEmailLoading : t.continueWithEmail}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span>{t.socialDivider}</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {oauthError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {oauthError}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {socialProviders.map((provider) => (
            <button
              key={provider}
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
              onClick={() => handleSocialSignup(provider)}
            >
              <div className="flex items-center gap-3">
                {providerIcons[provider]}
                <span>{t.providers[provider]}</span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {t.socialCta}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { providerIcons, socialProviders } from "../../components/authProviders";
import { useLocale } from "../../components/LocaleProvider";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const { messages } = useLocale();
  const t = messages.loginPage;
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    []
  );
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSocialLogin(provider: (typeof socialProviders)[number]) {
    if (provider !== "facebook") {
      return;
    }
    window.location.href = `${apiBaseUrl}/facebook/auth/login`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError(t.loginError);
        return;
      }

      await refresh();
      router.push("/");
    } catch (err) {
      console.error("Login error", err);
      setError(t.loginError);
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
          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.emailLabel}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
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
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {t.continueWithEmail}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span>{t.socialDivider}</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {socialProviders.map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => handleSocialLogin(provider)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
            >
              <div className="flex items-center gap-3">
                {providerIcons[provider]}
                <span>{t.providers[provider]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

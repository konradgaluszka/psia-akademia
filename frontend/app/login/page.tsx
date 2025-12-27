"use client";

import { useMemo } from "react";

import { providerIcons, socialProviders } from "../../components/authProviders";
import { useLocale } from "../../components/LocaleProvider";

export default function LoginPage() {
  const { messages } = useLocale();
  const t = messages.loginPage;
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    []
  );

  function handleSocialLogin(provider: (typeof socialProviders)[number]) {
    if (provider !== "facebook") {
      return;
    }
    window.location.href = `${apiBaseUrl}/facebook/auth/login`;
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

        <form className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.emailLabel}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t.emailPlaceholder}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500"
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

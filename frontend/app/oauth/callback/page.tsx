"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useLocale } from "../../../components/LocaleProvider";

type OAuthStatus = "idle" | "loading" | "success" | "error";

export default function OAuthCallbackPage() {
  const { messages } = useLocale();
  const t = messages.oauthCallback;
  const { getToken, isLoaded } = useAuth();
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    []
  );

  const [status, setStatus] = useState<OAuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function linkAccount() {
      if (!isLoaded) {
        return;
      }
      setStatus("loading");
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          setError(t.missingToken);
          setStatus("error");
          return;
        }

        const response = await fetch(`${apiBaseUrl}/auth/oauth/clerk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          setError(t.genericError);
          setStatus("error");
          return;
        }

        setStatus("success");
      } catch (err) {
        console.error("OAuth callback error", err);
        setError(t.genericError);
        setStatus("error");
      }
    }

    linkAccount();
  }, [apiBaseUrl, getToken, isLoaded, t.genericError, t.missingToken]);

  return (
    <div className="mt-10 flex justify-center px-2">
      <div className="card w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>

        {status === "loading" ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {t.loading}
          </div>
        ) : null}

        {status === "success" ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <div className="font-semibold">{t.successTitle}</div>
            <p className="text-sm">{t.successBody}</p>
          </div>
        ) : null}

        {status === "error" && error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-semibold">{t.errorTitle}</div>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
          >
            {t.ctaHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

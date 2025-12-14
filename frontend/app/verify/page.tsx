"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useLocale } from "../../components/LocaleProvider";

type VerificationState = "idle" | "loading" | "success" | "error";

export default function VerifyPage() {
  const { messages } = useLocale();
  const t = messages.verifyPage;
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    []
  );

  const [state, setState] = useState<VerificationState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setState("error");
        setError(t.invalid);
        return;
      }
      setState("loading");
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/verify?token=${encodeURIComponent(token)}`);
        if (response.ok) {
          setState("success");
          return;
        }

        if (response.status === 400) {
          setError(t.alreadyVerified);
        } else if (response.status === 404) {
          setError(t.invalid);
        } else if (response.status === 410) {
          setError(t.expired);
        } else {
          setError(t.generic);
        }
        setState("error");
      } catch (err) {
        console.error("Verification error", err);
        setError(t.generic);
        setState("error");
      }
    }
    verify();
  }, [apiBaseUrl, t.alreadyVerified, t.expired, t.generic, t.invalid, token]);

  const isLoading = state === "loading";
  const isSuccess = state === "success";

  return (
    <div className="mt-10 flex justify-center px-2">
      <div className="card w-full max-w-xl space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Loading...
          </div>
        ) : null}

        {isSuccess ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <div className="font-semibold">{t.successTitle}</div>
            <p className="text-sm">{t.successBody}</p>
          </div>
        ) : null}

        {state === "error" && error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-semibold">{t.failureTitle}</div>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
          >
            {t.ctaLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}

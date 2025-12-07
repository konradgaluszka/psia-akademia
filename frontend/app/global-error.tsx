"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="pl">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="space-y-4 text-center">
          <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            Application error
          </div>
          <h1 className="text-3xl font-bold">Coś poszło nie tak</h1>
          <p className="max-w-lg text-slate-600">
            {error?.message || "We were unable to load the page."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
          >
            Spróbuj ponownie
          </button>
        </div>
      </body>
    </html>
  );
}

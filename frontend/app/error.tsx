"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
        Something went wrong
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Unexpected error</h1>
      <p className="max-w-xl text-slate-600">
        We hit a snag while loading this page. {error?.message}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
      >
        Try again
      </button>
    </div>
  );
}

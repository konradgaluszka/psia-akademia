"use client";

import Link from "next/link";
import { useLocale } from "../../components/LocaleProvider";

export default function AboutPage() {
  const { locale } = useLocale();

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          {locale === "PL" ? "O nas" : "About us"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {locale === "PL"
            ? "Pomagamy psom i opiekunom uczyć się razem"
            : "Helping dogs and their people learn together"}
        </h1>
        <p className="mt-3 text-slate-600">
          {locale === "PL"
            ? "Zespół trenerów behawioralnych i instruktorów agility prowadzi kursy, konsultacje 1:1 oraz wydarzenia integracyjne. Wierzymy w pozytywne metody, jasną komunikację i tempo dopasowane do Waszego duetu."
            : "Our team of behavior specialists and agility instructors runs courses, 1:1 consults, and community events. We believe in positive methods, clear communication, and pacing that fits every team."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {locale === "PL" ? "Pozytywne metody" : "Positive methods"}
          </span>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {locale === "PL" ? "Doświadczeni trenerzy" : "Experienced trainers"}
          </span>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {locale === "PL" ? "Indywidualne podejście" : "Personalized approach"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/search"
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500"
        >
          {locale === "PL" ? "Zobacz ofertę" : "View offerings"}
        </Link>
        <Link
          href="/contact"
          className="rounded-full px-6 py-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:ring-brand-400"
        >
          {locale === "PL" ? "Skontaktuj się" : "Contact us"}
        </Link>
      </div>
    </div>
  );
}

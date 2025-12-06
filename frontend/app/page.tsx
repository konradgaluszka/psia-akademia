"use client";

import Link from "next/link";
import { useLocale } from "../components/LocaleProvider";

export default function Home() {
  const { messages } = useLocale();
  const featured = messages.featuredEvents;

  return (
    <div className="mt-10 space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            {messages.hero.eyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            {messages.hero.title}
          </h1>
          <p className="text-lg text-slate-600">
            {messages.hero.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/search"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500"
            >
              {messages.hero.ctaFind}
            </Link>
            <Link
              href="/event/puppy-basics"
              className="rounded-full px-6 py-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:ring-brand-400"
            >
              {messages.hero.ctaFeatured}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card">
              <p className="text-sm font-semibold text-slate-500">
                {messages.hero.statAvailabilityLabel}
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {messages.hero.statAvailabilityValue}
              </p>
              <p className="text-sm text-slate-500">
                {messages.hero.statAvailabilityDescription}
              </p>
            </div>
            <div className="card">
              <p className="text-sm font-semibold text-slate-500">
                {messages.hero.statTrainersLabel}
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {messages.hero.statTrainersValue}
              </p>
              <p className="text-sm text-slate-500">
                {messages.hero.statTrainersDescription}
              </p>
            </div>
          </div>
        </div>
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              {messages.hero.searchLabel}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {messages.hero.searchTitle}
            </h2>
            <p className="text-sm text-slate-500">
              {messages.hero.searchDescription}
            </p>
          </div>
          <form className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                {messages.hero.searchNeedLabel}
              </label>
              <input
                name="query"
                placeholder={messages.hero.searchNeedPlaceholder}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {messages.hero.searchDayLabel}
                </label>
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100">
                  {messages.hero.searchDayOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {messages.hero.searchFormatLabel}
                </label>
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100">
                  {messages.hero.searchFormatOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500"
            >
              {messages.hero.searchSubmit}
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            {messages.featuredSection.title}
          </h3>
          <Link
            href="/search"
            className="text-sm font-semibold text-brand-700 hover:text-brand-500"
          >
            {messages.featuredSection.viewAll}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((event) => (
            <article key={event.id} className="card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-700">
                  {event.price}
                </p>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {event.location}
                </span>
              </div>
              <h4 className="mt-2 text-lg font-semibold text-slate-900">
                {event.title}
              </h4>
              <p className="text-sm text-slate-500">{event.time}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/event/${event.id}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-brand-700 hover:text-brand-500"
              >
                {messages.featuredSection.viewDetails}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";

const featured = [
  {
    id: "puppy-basics",
    title: "Puppy Basics",
    time: "Sat • 10:00 AM",
    location: "Outdoor yard",
    price: "$45",
    tags: ["Group class", "Beginner"]
  },
  {
    id: "agility-fun",
    title: "Agility Fun Run",
    time: "Sun • 2:00 PM",
    location: "Arena A",
    price: "$65",
    tags: ["Intermediate", "High energy"]
  },
  {
    id: "behavior-1on1",
    title: "Behavior Consult (1:1)",
    time: "Weekdays • by appt",
    location: "Training room",
    price: "$95",
    tags: ["Private", "Tailored plan"]
  }
];

export default function Home() {
  return (
    <div className="mt-10 space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Training • Events • Care
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Book courses and meetings for your dog with trusted trainers.
          </h1>
          <p className="text-lg text-slate-600">
            Browse curated sessions across obedience, agility, and personalized
            consults. Real-time availability, transparent pricing, and fast
            booking powered by our academy.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/search"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500"
            >
              Find an event
            </Link>
            <Link
              href="/event/puppy-basics"
              className="rounded-full px-6 py-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:ring-brand-400"
            >
              View featured course
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card">
              <p className="text-sm font-semibold text-slate-500">Availability</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                Same-week slots
              </p>
              <p className="text-sm text-slate-500">
                Reserve instantly without back-and-forth.
              </p>
            </div>
            <div className="card">
              <p className="text-sm font-semibold text-slate-500">Trainers</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                Vetted experts
              </p>
              <p className="text-sm text-slate-500">
                Behaviorists and agility coaches with proven programs.
              </p>
            </div>
          </div>
        </div>
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Quick search
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Find the right fit
            </h2>
            <p className="text-sm text-slate-500">
              Filter by goal, energy level, or trainer preference.
            </p>
          </div>
          <form className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                What do you need?
              </label>
              <input
                name="query"
                placeholder="Puppy basics, agility, behavior..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Day
                </label>
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100">
                  <option>Any day</option>
                  <option>Weekday</option>
                  <option>Weekend</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Format
                </label>
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100">
                  <option>Any</option>
                  <option>Group class</option>
                  <option>1:1 Session</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500"
            >
              Search availability
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            Featured events
          </h3>
          <Link
            href="/search"
            className="text-sm font-semibold text-brand-700 hover:text-brand-500"
          >
            View all
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
                View details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

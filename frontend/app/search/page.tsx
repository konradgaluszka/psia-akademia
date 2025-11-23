import Link from "next/link";

const mockResults = [
  {
    id: "focus-walks",
    title: "Leash Focus Walks",
    description: "Small-group walks to build loose-leash and attention skills.",
    price: "$40",
    duration: "50 min",
    availability: "Wed/Fri"
  },
  {
    id: "agility-basics",
    title: "Agility Basics",
    description: "Intro to tunnels, jumps, and contact work with safety cues.",
    price: "$60",
    duration: "75 min",
    availability: "Sat"
  },
  {
    id: "reactivity-reset",
    title: "Reactivity Reset (1:1)",
    description:
      "Personalized plan for leash reactivity, triggers, and recovery routines.",
    price: "$110",
    duration: "60 min",
    availability: "Weekdays"
  }
];

export default function SearchPage() {
  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Search
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Find training that fits
          </h1>
          <p className="text-sm text-slate-500">
            Filter by format, trainer, and schedule. Results are mock data for
            now.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-semibold text-brand-700 hover:text-brand-500"
        >
          Back to home
        </Link>
      </div>

      <form className="card grid gap-4 md:grid-cols-4">
        <input
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 md:col-span-2"
          placeholder="Search by goal, skill, or trainer"
        />
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100">
          <option>Any format</option>
          <option>Group class</option>
          <option>1:1 Session</option>
        </select>
        <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-800/20 transition hover:bg-brand-500">
          Search
        </button>
      </form>

      <div className="grid gap-4">
        {mockResults.map((result) => (
          <article
            key={result.id}
            className="card grid gap-4 md:grid-cols-[1.2fr,0.4fr]"
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {result.title}
              </h2>
              <p className="text-sm text-slate-600">{result.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {result.duration}
                </span>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                  {result.availability}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between gap-3 md:items-end">
              <p className="text-lg font-semibold text-slate-900">
                {result.price}
              </p>
              <Link
                href={`/event/${result.id}`}
                className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:ring-brand-400"
              >
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

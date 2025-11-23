import Link from "next/link";

type EventDetailProps = {
  params: { id: string };
};

const mockDetails = {
  title: "Agility Basics",
  description:
    "Intro to tunnels, jumps, and contact work with clear safety cues. Ideal for dogs who love movement and need structured outlets.",
  duration: "75 minutes",
  location: "Arena A",
  price: "$60",
  trainer: "Sam Carter",
  availability: ["Sat 10:00", "Sat 12:00", "Sun 2:00"]
};

export default function EventDetail({ params }: EventDetailProps) {
  return (
    <div className="mt-10 space-y-6">
      <Link
        href="/search"
        className="text-sm font-semibold text-brand-700 hover:text-brand-500"
      >
        ← Back to search
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <article className="card space-y-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              ID: {params.id}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {mockDetails.duration}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {mockDetails.title}
          </h1>
          <p className="text-slate-600">{mockDetails.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              Location: {mockDetails.location}
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              Trainer: {mockDetails.trainer}
            </div>
          </div>
        </article>
        <aside className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Price</p>
            <p className="text-2xl font-bold text-slate-900">
              {mockDetails.price}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Available slots
            </p>
            <div className="mt-2 grid gap-2">
              {mockDetails.availability.map((slot) => (
                <button
                  key={slot}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:bg-brand-500">
            Book now
          </button>
        </aside>
      </div>
    </div>
  );
}

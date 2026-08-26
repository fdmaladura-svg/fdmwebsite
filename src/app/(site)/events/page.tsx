import Image from "next/image";
import Link from "next/link";
import { PageHero, EmptyState, Badge } from "@/components/ui";
import { getUpcomingEvents, getPastEvents, getFeaturedProgrammes } from "@/lib/queries";
import { formatShortDate, classifyEvent } from "@/lib/dates";

export const metadata = { title: "Events & Programmes" };
export const dynamic = "force-dynamic";

type View = "upcoming" | "past" | "programmes";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: rawView } = await searchParams;
  const view = (["upcoming", "past", "programmes"].includes(rawView || "") ? rawView : "upcoming") as View;

  const [upcoming, past, programmes] = await Promise.all([
    getUpcomingEvents(50),
    getPastEvents(50),
    getFeaturedProgrammes(20),
  ]);

  const list = view === "past" ? past : view === "programmes" ? programmes : upcoming;

  const tabs: { key: View; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "programmes", label: "Featured Programmes" },
    { key: "past", label: "Past Events" },
  ];

  return (
    <>
      <PageHero
        eyebrow="What's Happening"
        title="Events & Programmes"
        subtitle="Divine encounters, gatherings and celebrations across the ministry calendar."
        imageUrl="/images/aladura-prayer.jpg"
      />

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2 border-b border-[#eadfca] pb-4">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={`/events?view=${tab.key}`}
                className={`px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] border ${
                  view === tab.key
                    ? "bg-[#14110f] text-white border-[#14110f]"
                    : "border-[#e2d9c6] text-[#5b5148] hover:border-[#c8a24a]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {list.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((e) => (
                <Link href={`/events/${e.slug}`} key={e.id} className="card overflow-hidden group flex flex-col">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={e.bannerUrl || "/images/hero-worship.jpg"}
                      alt={e.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3">
                      <Badge tone={view === "past" ? "muted" : "gold"}>{classifyEvent(e.startDate, e.endDate)}</Badge>
                    </span>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">{e.category}</p>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-snug">{e.title}</h2>
                    <p className="mt-2 text-sm text-[#8b8175]">
                      {formatShortDate(e.startDate)}
                      {e.endDate && e.endDate !== e.startDate ? ` – ${formatShortDate(e.endDate)}` : ""}
                    </p>
                    <p className="mt-3 text-sm text-[#5b5148] line-clamp-3 grow">{e.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState message="More programmes are coming soon. Please check back." />
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#faf6ee] py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="display-title text-2xl">Calendar View</h2>
          <p className="mt-2 text-sm text-[#5b5148]">Upcoming gatherings at a glance (Africa/Lagos time).</p>
          <div className="mt-6 divide-y divide-[#eadfca] border border-[#eadfca] bg-white">
            {upcoming.length ? (
              upcoming.slice(0, 12).map((e) => (
                <Link
                  key={`cal-${e.id}`}
                  href={`/events/${e.slug}`}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-[#fbf8f1]"
                >
                  <span className="w-28 text-sm font-semibold text-[#6a1f2b]">{formatShortDate(e.startDate)}</span>
                  <span className="grow font-display text-lg">{e.title}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-[#8b8175]">
                    {e.startTime || ""} {e.venue ? `• ${e.venue}` : ""}
                  </span>
                </Link>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-[#8b8175]">No dates scheduled yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { db } from "@/db";
import { events, sermons, devotionals, ministries, ksmCourses } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { PageHero, EmptyState } from "@/components/ui";

export const metadata = { title: "Search" };
export const dynamic = "force-dynamic";

type Hit = { title: string; href: string; type: string; snippet: string };

async function search(q: string): Promise<Hit[]> {
  if (!q) return [];
  const like = `%${q}%`;
  try {
    const [ev, sm, dv, mn, kc] = await Promise.all([
      db.select().from(events).where(and(eq(events.status, "published"), sql`${events.title} ilike ${like} or ${events.summary} ilike ${like}`)).limit(10),
      db.select().from(sermons).where(and(eq(sermons.status, "published"), sql`${sermons.title} ilike ${like} or ${sermons.description} ilike ${like}`)).limit(10),
      db.select().from(devotionals).where(and(eq(devotionals.status, "published"), sql`${devotionals.title} ilike ${like} or ${devotionals.excerpt} ilike ${like}`)).limit(10),
      db.select().from(ministries).where(and(eq(ministries.status, "published"), sql`${ministries.name} ilike ${like} or ${ministries.description} ilike ${like}`)).limit(10),
      db.select().from(ksmCourses).where(sql`${ksmCourses.title} ilike ${like} or ${ksmCourses.description} ilike ${like}`).limit(10),
    ]);
    return [
      ...ev.map((e) => ({ title: e.title, href: `/events/${e.slug}`, type: "Event", snippet: e.summary || "" })),
      ...sm.map((s) => ({ title: s.title, href: `/sermons/${s.slug}`, type: "Sermon", snippet: s.description || "" })),
      ...dv.map((d) => ({ title: d.title, href: `/voice-of-mercy/${d.slug}`, type: "Voice of Mercy", snippet: d.excerpt || "" })),
      ...mn.map((m) => ({ title: m.name, href: `/ministries/${m.slug}`, type: "Ministry", snippet: m.description || "" })),
      ...kc.map((c) => ({ title: c.title, href: "/school-of-ministry#curriculum", type: "KSM Course", snippet: c.description || "" })),
    ];
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const results = await search((q || "").trim());

  return (
    <>
      <PageHero eyebrow="Find Anything" title="Search" subtitle="Events, sermons, ministries, devotionals and KSM content." />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4">
          <form action="/search" className="flex gap-3">
            <input name="q" defaultValue={q} placeholder="What are you looking for?" className="field" aria-label="Search" />
            <button type="submit" className="btn btn-dark">
              Search
            </button>
          </form>

          <div className="mt-10 space-y-4">
            {q && results.length === 0 ? <EmptyState message={`No results found for “${q}”.`} /> : null}
            {results.map((r) => (
              <Link key={r.href + r.title} href={r.href} className="block border border-[#eadfca] p-5 hover:border-[#c8a24a]">
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#9b7a2c]">{r.type}</p>
                <h2 className="mt-1 font-display text-xl font-bold">{r.title}</h2>
                <p className="mt-1 text-sm text-[#5b5148] line-clamp-2">{r.snippet}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

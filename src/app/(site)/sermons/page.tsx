import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { sermons } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { PageHero, EmptyState } from "@/components/ui";
import { formatShortDate } from "@/lib/dates";

export const metadata = { title: "Sermons & Messages" };
export const dynamic = "force-dynamic";

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ speaker?: string; series?: string; year?: string; q?: string }>;
}) {
  const sp = await searchParams;
  let list: (typeof sermons.$inferSelect)[] = [];
  try {
    const filters = [eq(sermons.status, "published")];
    if (sp.speaker) filters.push(eq(sermons.speaker, sp.speaker));
    if (sp.series) filters.push(eq(sermons.series, sp.series));
    if (sp.year) filters.push(sql`extract(year from ${sermons.sermonDate}) = ${Number(sp.year)}`);
    if (sp.q) filters.push(sql`(${sermons.title} ilike ${"%" + sp.q + "%"} or ${sermons.scripture} ilike ${"%" + sp.q + "%"})`);
    list = await db.select().from(sermons).where(and(...filters)).orderBy(desc(sermons.sermonDate));
  } catch {
    list = [];
  }

  const speakers = [...new Set(list.map((s) => s.speaker).filter(Boolean))] as string[];
  const seriesList = [...new Set(list.map((s) => s.series).filter(Boolean))] as string[];

  return (
    <>
      <PageHero
        eyebrow="The Word"
        title="Sermons & Messages"
        subtitle="Listen, watch and grow — sound biblical teaching for every season of life."
        imageUrl="/images/hero-worship.jpg"
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <form className="grid gap-3 sm:grid-cols-4 mb-10" action="/sermons">
            <input name="q" defaultValue={sp.q} placeholder="Search title or scripture" className="field" aria-label="Search sermons" />
            <select name="speaker" defaultValue={sp.speaker || ""} className="field" aria-label="Filter by speaker">
              <option value="">All speakers</option>
              {speakers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select name="series" defaultValue={sp.series || ""} className="field" aria-label="Filter by series">
              <option value="">All series</option>
              {seriesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-dark">
              Filter
            </button>
          </form>

          {list.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <Link key={s.id} href={`/sermons/${s.slug}`} className="card overflow-hidden group">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={s.thumbnailUrl || "/images/choir.jpg"}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#9b7a2c]">{formatShortDate(s.sermonDate)}</p>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-snug">{s.title}</h2>
                    <p className="mt-2 text-sm text-[#5b5148]">{s.speaker}</p>
                    {s.scripture ? <p className="mt-1 text-sm italic text-[#6a1f2b]">{s.scripture}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="Messages will appear here soon." />
          )}
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { devotionals } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { PageHero, EmptyState, Badge } from "@/components/ui";
import { formatShortDate } from "@/lib/dates";

export const metadata = { title: "Voice of Mercy Speaks" };
export const dynamic = "force-dynamic";

const FILTERS = ["Latest", "Prayer", "Prophecy", "Encouragement", "Faith", "Healing", "Victory", "Spiritual Growth"];

export default async function VoiceOfMercyPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category && FILTERS.includes(category) ? category : "Latest";

  let list: (typeof devotionals.$inferSelect)[] = [];
  try {
    const filters = [eq(devotionals.status, "published")];
    if (active !== "Latest") filters.push(eq(devotionals.category, active));
    list = await db.select().from(devotionals).where(and(...filters)).orderBy(desc(devotionals.publishDate));
  } catch {
    list = [];
  }

  return (
    <>
      <PageHero
        eyebrow="Prophetic Devotionals"
        title="Voice of Mercy Speaks"
        subtitle="Daily and weekly prophetic words, scripture reflections, prayer declarations and messages of mercy."
        imageUrl="/images/voice-of-mercy.jpg"
      />

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f}
                href={f === "Latest" ? "/voice-of-mercy" : `/voice-of-mercy?category=${encodeURIComponent(f)}`}
                className={`px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] border ${
                  active === f ? "bg-[#6a1f2b] text-white border-[#6a1f2b]" : "border-[#e2d9c6] text-[#5b5148] hover:border-[#c8a24a]"
                }`}
              >
                {f}
              </Link>
            ))}
          </div>

          {list.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((d) => (
                <article key={d.id} className="card overflow-hidden flex flex-col">
                  <Link href={`/voice-of-mercy/${d.slug}`} className="relative aspect-[3/4] bg-[#14110f]">
                    <Image
                      src={d.imageUrl || "/images/voice-of-mercy.jpg"}
                      alt={d.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-6 flex flex-col grow">
                    <Badge tone="wine">{d.category}</Badge>
                    <h2 className="mt-3 font-display text-2xl font-bold leading-snug">
                      <Link href={`/voice-of-mercy/${d.slug}`}>{d.title}</Link>
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[#9b7a2c]">{d.scripture}</p>
                    <p className="mt-3 text-sm text-[#5b5148] line-clamp-4 grow">{d.excerpt}</p>
                    <p className="mt-4 text-xs text-[#8b8175]">
                      {formatShortDate(d.publishDate)} • {d.speaker}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/voice-of-mercy/${d.slug}`} className="btn btn-dark !py-2 !px-3 !text-[0.62rem]">
                        Read More
                      </Link>
                      {d.audioUrl ? (
                        <a href={d.audioUrl} className="btn btn-outline !text-[#14110f] !border-[#14110f] !py-2 !px-3 !text-[0.62rem]">
                          Listen
                        </a>
                      ) : null}
                      {d.videoUrl ? (
                        <a href={d.videoUrl} className="btn btn-outline !text-[#14110f] !border-[#14110f] !py-2 !px-3 !text-[0.62rem]">
                          Watch
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState message="Prophetic messages will appear here soon." />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

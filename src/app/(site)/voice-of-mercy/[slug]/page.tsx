import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { devotionals } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import ShareButtons from "@/components/ShareButtons";
import { Badge } from "@/components/ui";
import { formatLongDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    const rows = await db
      .select()
      .from(devotionals)
      .where(and(eq(devotionals.slug, slug), eq(devotionals.status, "published")))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getPost(slug);
  if (!d) return { title: "Voice of Mercy Speaks" };
  return {
    title: d.title,
    description: d.excerpt ?? undefined,
    openGraph: { title: d.title, description: d.excerpt ?? undefined, images: d.imageUrl ? [d.imageUrl] : [] },
  };
}

export default async function DevotionalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getPost(slug);
  if (!d) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    datePublished: d.publishDate,
    author: { "@type": "Person", name: d.speaker },
    image: d.imageUrl ? [d.imageUrl] : [],
    publisher: { "@type": "Organization", name: "Faith Dynamite Ministries (Aladura)" },
  };

  return (
    <article className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="bg-[#14110f] text-white py-14">
        <div className="mx-auto max-w-4xl px-4">
          <Badge tone="gold">{d.category}</Badge>
          <h1 className="display-title mt-4 text-4xl sm:text-5xl">{d.title}</h1>
          <p className="mt-3 text-[#e6c97a] text-lg">{d.scripture}</p>
          <p className="mt-2 text-sm text-white/60">
            {formatLongDate(d.publishDate)} • {d.speaker}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 grid gap-10 lg:grid-cols-[320px_1fr]">
        <div>
          <div className="relative aspect-[3/4] border border-[#eadfca]">
            <Image
              src={d.imageUrl || "/images/voice-of-mercy.jpg"}
              alt={`${d.title} flyer`}
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-5">
            <ShareButtons title={d.title} path={`/voice-of-mercy/${d.slug}`} />
          </div>
        </div>
        <div>
          <div className="prose-fdm text-[#3f3831] text-lg">
            {(d.body || d.excerpt || "").split("\n\n").map((p, i) => (
              <p key={i} className="leading-9">
                {p}
              </p>
            ))}
          </div>
          {d.audioUrl ? (
            <div className="mt-8">
              <p className="eyebrow mb-2">Listen</p>
              <audio controls src={d.audioUrl} className="w-full" />
            </div>
          ) : null}
          <div className="mt-10 border-t border-[#eadfca] pt-6 text-sm text-[#8b8175]">
            Voice of Mercy Speaks • Faith Dynamite Ministries • C&amp;S Movement Church (Ayo Ni O)
          </div>
        </div>
      </div>
    </article>
  );
}

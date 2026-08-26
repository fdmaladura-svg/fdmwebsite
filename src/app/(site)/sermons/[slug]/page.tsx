import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { sermons } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import ShareButtons from "@/components/ShareButtons";
import { formatLongDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

function embedUrl(url?: string | null) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  if (url.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
  return url;
}

async function getSermon(slug: string) {
  try {
    const rows = await db
      .select()
      .from(sermons)
      .where(and(eq(sermons.slug, slug), eq(sermons.status, "published")))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSermon(slug);
  return { title: s?.title ?? "Sermon", description: s?.description ?? undefined };
}

export default async function SermonDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSermon(slug);
  if (!s) notFound();
  const video = embedUrl(s.videoUrl);

  return (
    <article className="bg-white">
      <header className="bg-[#14110f] text-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <p className="eyebrow !text-[#e6c97a]">{formatLongDate(s.sermonDate)}</p>
          <h1 className="display-title mt-3 text-4xl sm:text-5xl">{s.title}</h1>
          <p className="mt-4 text-white/75">
            {s.speaker}
            {s.series ? ` • ${s.series}` : ""}
          </p>
          {s.scripture ? <p className="mt-2 text-[#e6c97a] italic">{s.scripture}</p> : null}
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {video ? (
          <div className="relative aspect-video bg-black">
            <iframe
              src={video}
              title={s.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : s.thumbnailUrl ? (
          <div className="relative aspect-video">
            <Image src={s.thumbnailUrl} alt={s.title} fill sizes="100vw" className="object-cover" />
          </div>
        ) : null}

        {s.audioUrl ? (
          <div className="mt-6">
            <p className="eyebrow mb-2">Listen</p>
            <audio controls src={s.audioUrl} className="w-full">
              Your browser does not support audio playback.
            </audio>
            {s.allowDownload ? (
              <a href={s.audioUrl} download className="btn btn-dark mt-3">
                Download Audio
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="prose-fdm mt-10 text-[#3f3831]">
          {(s.description || "").split("\n\n").map((p, i) => (
            <p key={i} className="leading-8">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-10 border-t border-[#eadfca] pt-6">
          <ShareButtons title={s.title} path={`/sermons/${s.slug}`} />
        </div>
      </div>
    </article>
  );
}

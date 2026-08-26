import { notFound } from "next/navigation";
import { db } from "@/db";
import { galleryAlbums } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { PageHero } from "@/components/ui";
import { getAlbumMedia } from "@/lib/queries";
import Lightbox from "@/components/Lightbox";

export const dynamic = "force-dynamic";

async function getAlbum(slug: string) {
  try {
    const rows = await db
      .select()
      .from(galleryAlbums)
      .where(and(eq(galleryAlbums.slug, slug), eq(galleryAlbums.status, "published")))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getAlbum(slug);
  return { title: a?.title ?? "Album" };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) notFound();
  const media = await getAlbumMedia(album.id);

  return (
    <>
      <PageHero eyebrow="Gallery" title={album.title} subtitle={album.description} imageUrl={album.coverUrl} />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <Lightbox items={media.map((m) => ({ url: m.url, caption: m.caption, type: m.mediaType }))} />
        </div>
      </section>
    </>
  );
}

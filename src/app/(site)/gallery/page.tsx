import Image from "next/image";
import Link from "next/link";
import { PageHero, EmptyState } from "@/components/ui";
import { getAlbums } from "@/lib/queries";

export const metadata = { title: "Media & Gallery" };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await getAlbums();
  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Gallery"
        subtitle="Moments of worship, encounter and celebration across our ministry."
        imageUrl="/images/choir.jpg"
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          {albums.length ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
              {albums.map((a, i) => (
                <Link key={a.id} href={`/gallery/${a.slug}`} className="mb-5 block break-inside-avoid group relative">
                  <div className={`relative ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                    <Image
                      src={a.coverUrl || "/images/hero-worship.jpg"}
                      alt={a.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="font-display text-2xl leading-tight">{a.title}</h2>
                      {a.description ? <p className="mt-1 text-xs text-white/75 line-clamp-1">{a.description}</p> : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="Photo albums will be published here soon." />
          )}
        </div>
      </section>
    </>
  );
}

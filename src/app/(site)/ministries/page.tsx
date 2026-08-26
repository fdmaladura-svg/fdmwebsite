import Image from "next/image";
import Link from "next/link";
import { PageHero, EmptyState } from "@/components/ui";
import { getMinistries } from "@/lib/queries";

export const metadata = { title: "Ministries" };
export const dynamic = "force-dynamic";

export default async function MinistriesPage() {
  const list = await getMinistries();
  return (
    <>
      <PageHero
        eyebrow="Serve & Belong"
        title="Our Ministries"
        subtitle="There is a place for every member of the family to grow, serve and flourish."
        imageUrl="/images/hero-worship.jpg"
      />
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          {list.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((m) => (
                <Link key={m.id} href={`/ministries/${m.slug}`} className="card overflow-hidden group">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={m.imageUrl || "/images/hero-worship.jpg"}
                      alt={m.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-2xl font-bold">{m.name}</h2>
                    <p className="mt-2 text-sm text-[#5b5148] leading-relaxed line-clamp-3">{m.description}</p>
                    {m.meetingInfo ? (
                      <p className="mt-4 text-[0.68rem] uppercase tracking-[0.16em] text-[#9b7a2c]">{m.meetingInfo}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="Our ministries will be listed here soon." />
          )}
        </div>
      </section>
    </>
  );
}

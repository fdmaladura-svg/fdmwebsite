import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { ministries } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { PageHero } from "@/components/ui";

export const dynamic = "force-dynamic";

async function getMinistry(slug: string) {
  try {
    const rows = await db
      .select()
      .from(ministries)
      .where(and(eq(ministries.slug, slug), eq(ministries.status, "published")))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getMinistry(slug);
  return { title: m?.name ?? "Ministry", description: m?.description ?? undefined };
}

export default async function MinistryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getMinistry(slug);
  if (!m) notFound();

  return (
    <>
      <PageHero eyebrow="Ministry" title={m.name} subtitle={m.description} imageUrl={m.imageUrl} />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="prose-fdm text-[#3f3831]">
            {(m.body || m.description || "").split("\n\n").map((p, i) => (
              <p key={i} className="leading-8">
                {p}
              </p>
            ))}
            {m.imageUrl ? (
              <div className="relative aspect-[16/9] mt-8">
                <Image src={m.imageUrl} alt={m.name} fill sizes="100vw" className="object-cover" loading="lazy" />
              </div>
            ) : null}
          </div>
          <aside className="bg-[#faf6ee] p-6 h-fit border border-[#eadfca]">
            <h2 className="font-display text-xl font-bold">Ministry Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {m.leader ? (
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Leader</dt>
                  <dd className="text-[#3f3831]">{m.leader}</dd>
                </div>
              ) : null}
              {m.meetingInfo ? (
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Meets</dt>
                  <dd className="text-[#3f3831]">{m.meetingInfo}</dd>
                </div>
              ) : null}
            </dl>
            <Link href={m.ctaUrl || "/contact"} className="btn btn-gold mt-6 w-full">
              {m.ctaLabel || "Join This Ministry"}
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui";
import Countdown from "@/components/Countdown";
import ShareButtons from "@/components/ShareButtons";
import { formatLongDate, formatTime, classifyEvent } from "@/lib/dates";

export const dynamic = "force-dynamic";

async function getEvent(slug: string) {
  try {
    const rows = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.status, "published")))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return { title: "Event" };
  return {
    title: e.title,
    description: e.summary ?? undefined,
    openGraph: { title: e.title, description: e.summary ?? undefined, images: e.bannerUrl ? [e.bannerUrl] : [] },
  };
}

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) notFound();

  const status = classifyEvent(e.startDate, e.endDate);
  const startIso = new Date(`${e.startDate}T${e.startTime || "09:00"}:00`).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: startIso,
    endDate: e.endDate ? new Date(`${e.endDate}T${e.endTime || "20:00"}:00`).toISOString() : startIso,
    eventAttendanceMode:
      e.locationType === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: e.venue || "Faith Dynamite Ministries" },
    image: e.bannerUrl ? [e.bannerUrl] : [],
    description: e.summary || e.description || "",
    organizer: { "@type": "Organization", name: "Faith Dynamite Ministries (Aladura)" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative bg-[#14110f] text-white">
        {e.bannerUrl ? (
          <Image src={e.bannerUrl} alt={e.title} fill sizes="100vw" className="object-cover opacity-40" priority />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14110f] via-[#14110f]/85 to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <Badge tone="wine">{status}</Badge>
          <p className="eyebrow mt-4 !text-[#e6c97a]">{e.category}</p>
          <h1 className="display-title mt-3 text-4xl sm:text-5xl max-w-3xl">{e.title}</h1>
          {e.theme ? <p className="mt-4 text-xl text-[#e6c97a] font-display">Theme: {e.theme}</p> : null}
          <p className="mt-4 text-white/80">
            {formatLongDate(e.startDate)}
            {e.endDate && e.endDate !== e.startDate ? ` – ${formatLongDate(e.endDate)}` : ""}
            {e.startTime ? ` • ${formatTime(e.startTime)}` : ""}
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="prose-fdm text-[#3f3831]">
              {(e.description || e.summary || "").split("\n\n").map((p, i) => (
                <p key={i} className="leading-8">
                  {p}
                </p>
              ))}
            </div>
            {e.scripture ? (
              <p className="mt-6 border-l-2 border-[#c8a24a] pl-4 italic text-[#6a1f2b]">{e.scripture}</p>
            ) : null}
            {e.slug === "doxa-the-throne-of-glory" ? (
              <Link href="/doxa" className="btn btn-wine mt-8">
                Visit The DOXA Page
              </Link>
            ) : null}
            <div className="mt-10">
              <ShareButtons title={e.title} path={`/events/${e.slug}`} />
            </div>
          </div>

          <aside className="space-y-6">
            {status !== "Completed" ? (
              <div className="border border-[#eadfca] bg-[#faf6ee] p-6">
                <p className="eyebrow">Counting Down</p>
                <div className="mt-4">
                  <Countdown target={startIso} />
                </div>
              </div>
            ) : null}
            <div className="border border-[#eadfca] p-6">
              <h2 className="font-display text-xl font-bold">Details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">When</dt>
                  <dd>{formatLongDate(e.startDate)}</dd>
                </div>
                {e.venue ? (
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Venue</dt>
                    <dd>{e.venue}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Format</dt>
                  <dd className="capitalize">{e.locationType}</dd>
                </div>
                {e.speaker ? (
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Minister</dt>
                    <dd>{e.speaker}</dd>
                  </div>
                ) : null}
                {e.contactInfo ? (
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Contact</dt>
                    <dd>{e.contactInfo}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-5 grid gap-2">
                {e.registrationUrl ? (
                  <a href={e.registrationUrl} className="btn btn-gold" target="_blank" rel="noreferrer noopener">
                    Register
                  </a>
                ) : null}
                {e.streamUrl ? (
                  <a href={e.streamUrl} className="btn btn-dark" target="_blank" rel="noreferrer noopener">
                    Watch Stream
                  </a>
                ) : null}
                {e.mapUrl ? (
                  <a href={e.mapUrl} className="btn btn-outline !text-[#14110f] !border-[#14110f]" target="_blank" rel="noreferrer noopener">
                    Get Directions
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

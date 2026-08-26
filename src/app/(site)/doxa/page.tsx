import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import Countdown from "@/components/Countdown";
import ShareButtons from "@/components/ShareButtons";
import { getAlbums } from "@/lib/queries";
import { doxaDates, formatLongDate, toISODate } from "@/lib/dates";

export const metadata = {
  title: "DOXA — The Throne of Glory | 40 Days of Glory",
  description: "DOXA — The Throne of Glory: 40 Days of Glory from the last Monday in October to the first Friday in December.",
};
export const dynamic = "force-dynamic";

const DAILY = [
  ["Morning Glory Prayer", "6:00 AM daily — beginning each day at the throne of grace."],
  ["Word Encounter", "Teaching sessions on glory, consecration and Kingdom authority."],
  ["Evening Altar", "Corporate worship, prophetic ministration and intercession."],
  ["Weekly Vigil", "Extended night watch for breakthrough and divine visitation."],
];

export default async function DoxaPage() {
  const year = new Date().getFullYear();
  let record: typeof events.$inferSelect | null = null;
  try {
    const rows = await db.select().from(events).where(eq(events.slug, "doxa-the-throne-of-glory")).limit(1);
    record = rows[0] ?? null;
  } catch {
    record = null;
  }

  const auto = doxaDates(year);
  const startDate = record?.startDate || toISODate(auto.start);
  const endDate = record?.endDate || toISODate(auto.end);
  const startIso = new Date(`${startDate}T18:00:00`).toISOString();
  const albums = await getAlbums(4);

  return (
    <div className="bg-[#14110f] text-white">
      <section className="relative min-h-[70vh] flex items-center">
        <Image
          src={record?.bannerUrl || "/images/aladura-prayer.jpg"}
          alt="DOXA — The Throne of Glory"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14110f] via-[#14110f]/85 to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 w-full">
          <p className="eyebrow !text-[#e6c97a]">Annual Programme</p>
          <h1 className="display-title mt-4 text-5xl sm:text-7xl">DOXA</h1>
          <p className="mt-2 font-display text-3xl text-[#e6c97a]">The Throne of Glory</p>
          <p className="mt-5 text-xl tracking-[0.14em] uppercase text-white/80">40 Days of Glory</p>
          <p className="mt-4 text-white/70">
            {formatLongDate(startDate)} — {formatLongDate(endDate)}
          </p>
          <div className="mt-8 max-w-lg">
            <Countdown target={startIso} light />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/events/doxa-the-throne-of-glory" className="btn btn-gold">
              Event Details
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Register / Enquire
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#faf6ee] text-[#14110f] py-16">
        <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">The Encounter</p>
            <h2 className="display-title mt-3 text-4xl">Theme: {record?.theme || "40 Days of Glory"}</h2>
            <div className="prose-fdm mt-6 text-[#3f3831]">
              {(record?.description ||
                "DOXA — The Throne of Glory is our annual 40 Days of Glory: a sustained season of prayer, worship, the Word and divine encounters.")
                .split("\n\n")
                .map((p, i) => (
                  <p key={i} className="leading-8">
                    {p}
                  </p>
                ))}
            </div>
            {record?.scripture ? (
              <p className="mt-6 border-l-2 border-[#c8a24a] pl-4 italic text-[#6a1f2b]">{record.scripture}</p>
            ) : null}
            <div className="mt-8">
              <ShareButtons title="DOXA — The Throne of Glory" path="/doxa" />
            </div>
          </div>
          <div className="border border-[#eadfca] bg-white p-6">
            <h3 className="font-display text-2xl">Daily Activities</h3>
            <ul className="mt-4 space-y-4">
              {DAILY.map(([title, body]) => (
                <li key={title}>
                  <p className="font-semibold text-[#6a1f2b]">{title}</p>
                  <p className="text-sm text-[#5b5148]">{body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-[#eadfca] pt-4">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Guest Ministers</p>
              <p className="mt-1 text-sm text-[#5b5148]">
                {record?.speaker || "Guest ministers will be announced by the church administrator."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-[#14110f] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="eyebrow">Gallery</p>
          <h2 className="display-title mt-3 text-4xl">Glory Moments</h2>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {albums.map((a) => (
              <Link key={a.id} href={`/gallery/${a.slug}`} className="relative aspect-square group">
                <Image
                  src={a.coverUrl || "/images/hero-worship.jpg"}
                  alt={a.title}
                  fill
                  sizes="25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs px-2 py-1.5">{a.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

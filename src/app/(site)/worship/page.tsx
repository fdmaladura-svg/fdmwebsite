import Link from "next/link";
import Countdown from "@/components/Countdown";
import { PageHero, SectionHeading, EmptyState } from "@/components/ui";
import { getSchedules, getNextService } from "@/lib/queries";
import { formatLongDate } from "@/lib/dates";

export const metadata = { title: "Worship & Service Times" };
export const dynamic = "force-dynamic";

export default async function WorshipPage() {
  const [schedules, nextService] = await Promise.all([getSchedules(), getNextService()]);

  return (
    <>
      <PageHero
        eyebrow="Worship With Us"
        title="Service Times"
        subtitle="Prayer, praise, the Word and prophetic ministration — every week, all year round."
        imageUrl="/images/choir.jpg"
      />

      {nextService ? (
        <section className="bg-[#14110f] text-white py-12">
          <div className="mx-auto max-w-7xl px-4 grid gap-8 lg:grid-cols-[1fr_420px] items-center">
            <div>
              <p className="eyebrow !text-[#e6c97a]">Next Gathering</p>
              <h2 className="display-title mt-2 text-3xl">{nextService.title}</h2>
              <p className="mt-2 text-white/70">
                {formatLongDate(new Date(nextService.when))} • {nextService.timeLabel}
              </p>
            </div>
            <Countdown target={nextService.when} light />
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Weekly Rhythm" title="Our Weekly Activities" />
          {schedules.length ? (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.map((s) => (
                <div key={s.id} className="card p-7">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#9b7a2c]">{s.dayLabel}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{s.title}</h3>
                  <p className="mt-1 text-lg text-[#6a1f2b] font-semibold">{s.timeLabel}</p>
                  {s.description ? <p className="mt-3 text-sm text-[#5b5148] leading-relaxed">{s.description}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState message="Service times will be published here soon." />
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#faf6ee] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="display-title text-3xl">Can&apos;t make it in person?</h2>
          <p className="mt-4 text-[#5b5148]">
            Join our online congregation and worship with us from anywhere in the world.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/watch-live" className="btn btn-gold">
              Watch Live
            </Link>
            <Link href="/sermons" className="btn btn-dark">
              Recent Messages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

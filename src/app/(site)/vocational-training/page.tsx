import Image from "next/image";
import Link from "next/link";
import { PageHero, EmptyState, Badge } from "@/components/ui";
import { getSections, sectionText } from "@/lib/content";
import { getPublishedVocationalCourses } from "@/lib/queries";
import { formatShortDate } from "@/lib/dates";

export const metadata = { title: "Vocational Training — Skills For Life" };
export const dynamic = "force-dynamic";

export default async function VocationalPage() {
  const [sections, courses] = await Promise.all([getSections("vocational"), getPublishedVocationalCourses()]);
  const t = (key: string, field: Parameters<typeof sectionText>[2], fallback = "") =>
    sectionText(sections, key, field, fallback);

  return (
    <>
      <PageHero
        eyebrow={t("hero", "eyebrow", "Vocational Empowerment")}
        title={t("hero", "title", "Skills For Life")}
        subtitle={t("hero", "subtitle", "Spiritual empowerment. Practical empowerment. Sustainable lives.")}
        imageUrl={t("hero", "imageUrl", "/images/vocational.jpg")}
      />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-2 items-center">
          <p className="text-lg leading-9 text-[#3f3831]">{t("hero", "body")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Spiritual Transformation", "Worship • Prayer • Biblical teaching • Discipleship • KSM"],
              ["Practical Empowerment", "Vocational education • Digital skills • Entrepreneurship • Career development"],
            ].map(([title, body]) => (
              <div key={title} className="border border-[#eadfca] bg-[#faf6ee] p-6">
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm text-[#5b5148]">{body}</p>
              </div>
            ))}
            <p className="sm:col-span-2 text-center text-[0.7rem] uppercase tracking-[0.2em] text-[#9b7a2c]">
              Empowering the whole person for Kingdom and societal impact
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#faf6ee] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="eyebrow">Training Programmes</p>
          <h2 className="display-title mt-3 text-4xl">Available Courses</h2>
          {courses.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <article key={c.id} className="card overflow-hidden flex flex-col">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={c.imageUrl || "/images/vocational.jpg"}
                      alt={c.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <div className="flex gap-2">
                      <Badge tone={c.isFree ? "gold" : "wine"}>{c.isFree ? "Free" : `₦${(c.fee || 0).toLocaleString()}`}</Badge>
                      {c.certificate ? <Badge tone="muted">Certificate</Badge> : null}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold">{c.title}</h3>
                    <p className="mt-2 text-sm text-[#5b5148] grow">{c.description}</p>
                    <dl className="mt-4 space-y-1 text-xs text-[#8b8175]">
                      {c.duration ? <div>Duration: {c.duration}</div> : null}
                      {c.startDate ? <div>Starts: {formatShortDate(c.startDate)}</div> : null}
                      {c.schedule ? <div>Schedule: {c.schedule}</div> : null}
                      {c.venue ? <div>Venue: {c.venue}</div> : null}
                      {c.registrationDeadline ? <div>Register before: {formatShortDate(c.registrationDeadline)}</div> : null}
                    </dl>
                    <Link
                      href={`/vocational-training/apply?course=${encodeURIComponent(c.title)}`}
                      className={`btn mt-5 ${c.registrationOpen ? "btn-gold" : "btn-dark pointer-events-none opacity-60"}`}
                    >
                      {c.registrationOpen ? "Register" : "Registration Closed"}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                message="New empowerment programmes will be announced soon."
                action={
                  <Link href="/vocational-training/apply" className="btn btn-dark">
                    Register Your Interest
                  </Link>
                }
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

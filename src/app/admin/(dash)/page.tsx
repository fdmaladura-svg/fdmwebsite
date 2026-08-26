import Link from "next/link";
import { db } from "@/db";
import {
  ksmApplications,
  vocationalApplications,
  prayerRequests,
  testimonies,
  donations,
  mediaLibrary,
} from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getNextService, getUpcomingEvents } from "@/lib/queries";
import { formatLongDate, formatShortDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

async function count(table: string, where = "") {
  try {
    const res = await db.execute(sql.raw(`select count(*)::int as c from ${table} ${where}`));
    return (res.rows as { c: number }[])[0]?.c ?? 0;
  } catch {
    return 0;
  }
}

const QUICK = [
  ["+ Add Event", "/admin/content/events/new"],
  ["+ Upload Photos", "/admin/media"],
  ["+ Add Sermon", "/admin/content/sermons/new"],
  ["+ Add Voice of Mercy Post", "/admin/content/devotionals/new"],
  ["+ Add Programme", "/admin/content/events/new"],
  ["+ Add KSM Course", "/admin/content/ksmCourses/new"],
  ["+ Add Vocational Course", "/admin/content/vocationalCourses/new"],
  ["Edit Homepage", "/admin/website/homepage"],
];

export default async function AdminDashboard() {
  const [nextService, upcoming, newKsm, newVoc, newPrayer, pendingTestimonies, recentDonations, recentMedia] =
    await Promise.all([
      getNextService(),
      getUpcomingEvents(5),
      count("ksm_applications", "where status = 'New'"),
      count("vocational_applications", "where status = 'New'"),
      count("prayer_requests", "where status = 'New'"),
      count("testimonies", "where status = 'pending'"),
      db.select().from(donations).orderBy(desc(donations.createdAt)).limit(5).catch(() => []),
      db.select().from(mediaLibrary).orderBy(desc(mediaLibrary.createdAt)).limit(6).catch(() => []),
    ]);

  const totalGiven = await (async () => {
    try {
      const res = await db
        .select({ total: sql<number>`coalesce(sum(${donations.amount}),0)::int` })
        .from(donations)
        .where(eq(donations.status, "success"));
      return res[0]?.total ?? 0;
    } catch {
      return 0;
    }
  })();

  const stats = [
    ["New KSM applications", newKsm, "/admin/submissions/ksm"],
    ["New training registrations", newVoc, "/admin/submissions/vocational"],
    ["New prayer requests", newPrayer, "/admin/submissions/prayer"],
    ["Testimonies awaiting approval", pendingTestimonies, "/admin/submissions/testimonies"],
  ] as const;

  const pendingKsm = await db
    .select()
    .from(ksmApplications)
    .orderBy(desc(ksmApplications.createdAt))
    .limit(4)
    .catch(() => [] as (typeof ksmApplications.$inferSelect)[]);
  const pendingVoc = await db
    .select()
    .from(vocationalApplications)
    .orderBy(desc(vocationalApplications.createdAt))
    .limit(3)
    .catch(() => [] as (typeof vocationalApplications.$inferSelect)[]);
  const pendingPrayer = await db
    .select()
    .from(prayerRequests)
    .orderBy(desc(prayerRequests.createdAt))
    .limit(3)
    .catch(() => [] as (typeof prayerRequests.$inferSelect)[]);
  const pendingTest = await db
    .select()
    .from(testimonies)
    .orderBy(desc(testimonies.createdAt))
    .limit(3)
    .catch(() => [] as (typeof testimonies.$inferSelect)[]);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Today &amp; This Week</p>
        <h1 className="display-title mt-2 text-3xl sm:text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-[#6b6156]">
          Everything you need to keep the Faith Dynamite Ministries website fresh and accurate.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#14110f] text-white p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-[#c8a24a]">Next service</p>
          {nextService ? (
            <>
              <p className="mt-2 font-display text-xl">{nextService.title}</p>
              <p className="mt-1 text-xs text-white/60">{formatLongDate(new Date(nextService.when))}</p>
              <p className="text-xs text-white/60">{nextService.timeLabel}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-white/60">No service times added yet.</p>
          )}
        </div>
        {stats.map(([label, value, href]) => (
          <Link key={label} href={href} className="bg-white border border-[#e6e2da] p-5 hover:border-[#c8a24a]">
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-[#9b7a2c]">{label}</p>
            <p className="mt-2 font-display text-3xl">{value}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="font-display text-2xl">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="border border-[#d8cfbd] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] hover:border-[#c8a24a] hover:text-[#8a6a20]"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-[#e6e2da] p-5">
          <h2 className="font-display text-xl">Upcoming events</h2>
          <ul className="mt-4 divide-y divide-[#eee9df]">
            {upcoming.length ? (
              upcoming.map((e) => (
                <li key={e.id} className="py-3 flex justify-between gap-3 text-sm">
                  <Link href={`/admin/content/events/${e.id}`} className="font-medium hover:text-[#8a6a20]">
                    {e.title}
                  </Link>
                  <span className="text-[#8b8175]">{formatShortDate(e.startDate)}</span>
                </li>
              ))
            ) : (
              <li className="py-3 text-sm text-[#8b8175]">No upcoming events yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-white border border-[#e6e2da] p-5">
          <h2 className="font-display text-xl">Recent giving</h2>
          <p className="mt-1 text-xs text-[#8b8175]">
            Total received: <strong>₦{totalGiven.toLocaleString()}</strong>
          </p>
          <ul className="mt-4 divide-y divide-[#eee9df]">
            {recentDonations.length ? (
              recentDonations.map((d) => (
                <li key={d.id} className="py-3 flex justify-between gap-3 text-sm">
                  <span>
                    {d.anonymous ? "Anonymous" : d.donorName} • {d.category}
                  </span>
                  <span className="text-[#8b8175]">
                    ₦{d.amount.toLocaleString()} ({d.status})
                  </span>
                </li>
              ))
            ) : (
              <li className="py-3 text-sm text-[#8b8175]">No giving recorded yet.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-[#e6e2da] p-5">
          <h2 className="font-display text-xl">Latest applications</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {pendingKsm.map((a) => (
              <li key={`k${a.id}`} className="flex justify-between gap-3">
                <span>
                  KSM • {a.fullName} <span className="text-xs text-[#8b8175]">({a.reference})</span>
                </span>
                <span className="text-[#8b8175]">{a.status}</span>
              </li>
            ))}
            {pendingVoc.map((a) => (
              <li key={`v${a.id}`} className="flex justify-between gap-3">
                <span>Training • {a.fullName}</span>
                <span className="text-[#8b8175]">{a.status}</span>
              </li>
            ))}
            {!pendingKsm.length && !pendingVoc.length ? (
              <li className="text-[#8b8175]">No applications yet.</li>
            ) : null}
          </ul>
        </div>

        <div className="bg-white border border-[#e6e2da] p-5">
          <h2 className="font-display text-xl">Prayer &amp; testimonies</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {pendingPrayer.map((p) => (
              <li key={`p${p.id}`} className="truncate">
                🙏 {p.confidential ? "Confidential request" : p.request.slice(0, 60)}
              </li>
            ))}
            {pendingTest.map((t) => (
              <li key={`t${t.id}`} className="truncate">
                ✨ {t.name}: {t.body.slice(0, 50)}…
              </li>
            ))}
            {!pendingPrayer.length && !pendingTest.length ? (
              <li className="text-[#8b8175]">Nothing new right now.</li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className="bg-white border border-[#e6e2da] p-5">
        <h2 className="font-display text-xl">Latest uploaded media</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {recentMedia.length ? (
            recentMedia.map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.id} src={m.url} alt={m.altText || ""} className="h-20 w-28 object-cover border border-[#e6e2da]" />
            ))
          ) : (
            <p className="text-sm text-[#8b8175]">No media uploaded yet.</p>
          )}
        </div>
        <Link href="/admin/media" className="btn btn-dark mt-5">
          Open Media Library
        </Link>
      </section>
    </div>
  );
}

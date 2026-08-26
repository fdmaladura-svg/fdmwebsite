import Image from "next/image";
import Link from "next/link";
import { getSections, sectionText, getSetting, type ChurchInfo, type KsmSettings } from "@/lib/content";
import { getKsmCourses } from "@/lib/queries";
import { EmptyState } from "@/components/ui";

export const metadata = {
  title: "KATARTISMOS School of Ministry (KSM)",
  description: "Equipping Saints. Transforming Lives. Advancing the Kingdom. Tuition free, 100% online ministry training.",
};
export const dynamic = "force-dynamic";

const WHO_CAN_APPLY = [
  ["Pastors", "🕊️"],
  ["Ministers", "📖"],
  ["Evangelists", "📣"],
  ["Prophets", "🔥"],
  ["Teachers", "🎓"],
  ["Church Workers", "🤝"],
  ["Youth Leaders", "⭐"],
  ["Choir Members", "🎵"],
  ["New Believers", "🌱"],
  ["Anyone passionate about knowing God and serving His Kingdom", "👑"],
];

const BENEFITS = [
  ["Tuition Free", "Study without paying a kobo in tuition."],
  ["Online Classes", "Learn from anywhere in the world."],
  ["Seasoned Instructors", "Learn from experienced ministers and teachers."],
  ["Interactive Learning", "Live sessions, discussion and Q&A."],
  ["Practical Ministry Training", "Hands-on assignments and ministry practice."],
  ["Mentorship & Support", "Personal guidance through your journey."],
  ["Certificate Awarded", "Receive a Certificate of Completion on graduation."],
];

export default async function KsmPage() {
  const [sections, church, ksm, courses] = await Promise.all([
    getSections("ksm"),
    getSetting<ChurchInfo>("church"),
    getSetting<KsmSettings>("ksm"),
    getKsmCourses(),
  ]);
  const t = (key: string, field: Parameters<typeof sectionText>[2], fallback = "") =>
    sectionText(sections, key, field, fallback);

  return (
    <div className="bg-[#f7f8fb]">
      {/* HERO */}
      <section className="relative bg-[#12224a] text-white overflow-hidden">
        <Image
          src={t("hero", "imageUrl", "/images/ksm-learning.jpg")}
          alt="KSM online ministry training"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d193a] via-[#12224a]/90 to-[#12224a]/60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 grid gap-10 lg:grid-cols-[160px_1fr] items-center">
          <Image
            src={church.ksmLogoUrl}
            alt="KATARTISMOS School of Ministry crest"
            width={180}
            height={180}
            className="h-32 w-32 lg:h-40 lg:w-40 object-contain"
            priority
          />
          <div>
            <p className="eyebrow !text-[#e6c97a]">{t("hero", "eyebrow", "Ephesians 4:11–16")}</p>
            <h1 className="display-title mt-3 text-4xl sm:text-5xl lg:text-6xl">
              {t("hero", "title", "KATARTISMOS School of Ministry")}
            </h1>
            <p className="mt-4 text-xl text-[#e6c97a] font-display">
              {t("hero", "subtitle", "Equipping Saints. Transforming Lives. Advancing the Kingdom.")}
            </p>
            <p className="mt-4 tracking-[0.24em] text-sm text-white/80 uppercase">
              {t("hero", "body", "EQUIP • ESTABLISH • EDIFY • EMPOWER")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={t("hero", "ctaUrl", "/school-of-ministry/apply")} className="btn btn-gold">
                {t("hero", "ctaLabel", "Apply For Admission")}
              </Link>
              <Link href="#curriculum" className="btn btn-outline">
                {t("hero", "cta2Label", "View Curriculum")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ADMISSION */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="eyebrow">{t("admission", "eyebrow", "Admissions")}</p>
            <h2 className="display-title mt-3 text-4xl text-[#12224a]">
              {ksm.admissionOpen ? t("admission", "title", "Admission Now Open") : "Admissions Currently Closed"}
            </h2>
            <p className="mt-5 text-[#4a5468] leading-8">{t("admission", "body")}</p>
            <ul className="mt-6 space-y-3 text-[#28324a]">
              {[
                "Do you believe God has called you into ministry?",
                "Do you desire to know God's Word more deeply?",
                "Do you want to discover, develop and deploy your spiritual gifts?",
              ].map((q) => (
                <li key={q} className="flex gap-3">
                  <span className="text-[#c8a24a]" aria-hidden>
                    ✔
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ksm.tuitionFree ? (
              <div className="bg-[#12224a] text-white p-8 text-center">
                <p className="display-title text-3xl text-[#e6c97a]">Tuition Free</p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-white/70">100% Free To Study</p>
              </div>
            ) : null}
            {ksm.online ? (
              <div className="bg-[#c8a24a] text-[#14110f] p-8 text-center">
                <p className="display-title text-3xl">100% Online</p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em]">Learn From Anywhere In The World</p>
              </div>
            ) : null}
            <div className="sm:col-span-2 border border-[#dbe1ee] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#7b8399]">Enquiries & Registration</p>
              <p className="mt-2 font-display text-2xl text-[#12224a]">{ksm.enquiryPhones}</p>
              <p className="mt-1 text-sm text-[#4a5468]">Venue: {ksm.venue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="bg-[#f2f4f9] py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="eyebrow">What You Will Learn</p>
          <h2 className="display-title mt-3 text-4xl text-[#12224a]">Curriculum</h2>
          {courses.length ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <div key={c.id} className="bg-white border-l-2 border-[#c8a24a] p-6">
                  <h3 className="font-display text-xl font-bold text-[#12224a]">{c.title}</h3>
                  <p className="mt-2 text-sm text-[#4a5468] leading-relaxed">{c.description}</p>
                  {c.instructor ? (
                    <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">{c.instructor}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState message="Course details will be published here soon." />
            </div>
          )}
        </div>
      </section>

      {/* WHO CAN APPLY */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="eyebrow">Who Can Apply?</p>
          <h2 className="display-title mt-3 text-4xl text-[#12224a]">This School Is For You</h2>
          <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {WHO_CAN_APPLY.map(([label, icon]) => (
              <div key={label} className="border border-[#e3e7f0] p-5 text-center">
                <div className="text-2xl" aria-hidden>
                  {icon}
                </div>
                <p className="mt-3 text-sm font-semibold text-[#28324a] leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#12224a] text-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="eyebrow !text-[#e6c97a]">Admission Benefits</p>
          <h2 className="display-title mt-3 text-4xl">Why Study At KSM</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(([title, body]) => (
              <div key={title} className="border border-white/15 bg-white/[0.04] p-6">
                <h3 className="font-display text-xl text-[#e6c97a]">{title}</h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="display-title text-3xl">Start Your Journey. Fulfil Your Calling.</p>
            <p className="mt-3 text-white/70">Be equipped. Be empowered. Be released for Kingdom impact.</p>
            <Link href="/school-of-ministry/apply" className="btn btn-gold mt-7">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

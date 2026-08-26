import Image from "next/image";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/ui";
import { getSections, sectionText, getSetting, type ChurchInfo } from "@/lib/content";
import { getLeaders } from "@/lib/queries";

export const metadata = { title: "About Us" };
export const dynamic = "force-dynamic";

const BELIEFS = [
  ["The Bible", "We believe the Holy Scriptures are the inspired, infallible Word of God and the final authority for faith and living."],
  ["God", "We believe in one eternal God, Creator of heaven and earth, existing in three Persons: Father, Son and Holy Spirit."],
  ["Jesus Christ", "We believe in the deity, virgin birth, sinless life, atoning death, bodily resurrection and soon return of our Lord Jesus Christ."],
  ["Holy Spirit", "We believe in the person, power and gifts of the Holy Spirit for holy living, service and ministry."],
  ["Salvation", "We believe salvation is by grace through faith in Jesus Christ alone, evidenced by repentance and new life."],
  ["Prayer", "We believe in fervent, persistent prayer as the heartbeat of the Aladura heritage and the life of every believer."],
  ["Worship", "We believe in reverent, Spirit-led worship that exalts God and transforms the worshipper."],
  ["Christian Living", "We believe in holiness, integrity, love and good works as the fruit of genuine faith."],
  ["The Church", "We believe the Church is the body of Christ, called to gather, grow, serve and disciple nations."],
  ["Evangelism", "We believe every believer is commissioned to share the gospel and make disciples."],
];

export default async function AboutPage() {
  const [sections, church, leaderList] = await Promise.all([
    getSections("about"),
    getSetting<ChurchInfo>("church"),
    getLeaders(),
  ]);
  const t = (key: string, field: Parameters<typeof sectionText>[2], fallback = "") =>
    sectionText(sections, key, field, fallback);

  return (
    <>
      <PageHero
        eyebrow={t("hero", "eyebrow", "About Us")}
        title={t("hero", "title", "Who We Are")}
        subtitle={t("hero", "subtitle")}
        imageUrl={t("hero", "imageUrl", "/images/aladura-prayer.jpg")}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 prose-fdm text-[#3f3831]">
          {t("hero", "body")
            .split("\n\n")
            .map((para, i) => (
              <p key={i} className="text-lg leading-8">
                {para}
              </p>
            ))}
        </div>
      </section>

      <section className="bg-[#faf6ee] py-16">
        <div className="mx-auto max-w-7xl px-4 grid gap-6 lg:grid-cols-2">
          {(["vision", "mission"] as const).map((key) => (
            <div key={key} className="card p-8 sm:p-10">
              <p className="eyebrow">{key === "vision" ? "Our Vision" : "Our Mission"}</p>
              <h2 className="display-title mt-3 text-3xl">{t(key, "title")}</h2>
              <p className="mt-4 text-[#5b5148] leading-8">{t(key, "body")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="What We Believe" title="Our Beliefs" subtitle="The convictions that shape our worship, teaching and service." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map(([title, body]) => (
              <div key={title} className="border-l-2 border-[#c8a24a] bg-[#fbf8f1] p-6">
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b5148]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#12224a] text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-[1fr_320px] items-center">
          <div>
            <p className="eyebrow !text-[#e6c97a]">{t("heritage", "eyebrow", "Our Heritage")}</p>
            <h2 className="display-title mt-3 text-3xl sm:text-4xl">{t("heritage", "title")}</h2>
            <p className="mt-5 text-white/80 leading-8">{t("heritage", "body")}</p>
          </div>
          <div className="bg-white/95 p-8 flex items-center justify-center">
            <Image
              src={church.affiliationLogoUrl}
              alt="Cherubim & Seraphim Movement Church (Ayo Ni O) logo"
              width={200}
              height={200}
              className="h-40 w-40 object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow={t("leadership", "eyebrow", "Our Team")}
            title={t("leadership", "title", "Our Leadership")}
            subtitle={leaderList.length ? null : t("leadership", "body")}
          />
          {leaderList.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leaderList.map((l) => (
                <article key={l.id} className="card overflow-hidden">
                  <div className="relative aspect-[4/5] bg-[#f1eee7]">
                    <Image
                      src={l.photoUrl || "/images/voice-of-mercy.jpg"}
                      alt={l.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold">{l.name}</h3>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em] text-[#9b7a2c]">{l.title}</p>
                    <p className="mt-3 text-sm text-[#5b5148] leading-relaxed">{l.shortBio}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
          <div className="mt-12 text-center">
            <Link href="/plan-your-visit" className="btn btn-dark">
              Plan Your Visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

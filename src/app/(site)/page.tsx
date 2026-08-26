import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { SectionHeading, EmptyState, Badge, GoldLink } from "@/components/ui";
import { getSections, sectionText, sectionVisible, getSetting, type ChurchInfo } from "@/lib/content";
import {
  getSchedules,
  getUpcomingEvents,
  getFeaturedProgrammes,
  getLatestSermons,
  getLatestDevotionals,
  getMinistries,
  getAlbums,
  getApprovedTestimonies,
  getNextService,
} from "@/lib/queries";
import { formatShortDate, formatLongDate, classifyEvent } from "@/lib/dates";

export const dynamic = "force-dynamic";

const ICONS: Record<string, string> = {
  book: "📖",
  church: "⛪",
  flame: "🔥",
  moon: "🌙",
  oil: "🕊️",
};

export default async function HomePage() {
  const [
    sections,
    church,
    schedules,
    nextService,
    programmes,
    upcoming,
    sermonList,
    devotionalList,
    ministryList,
    albums,
    testimonyList,
  ] = await Promise.all([
    getSections("home"),
    getSetting<ChurchInfo>("church"),
    getSchedules(),
    getNextService(),
    getFeaturedProgrammes(3),
    getUpcomingEvents(4),
    getLatestSermons(3),
    getLatestDevotionals(3),
    getMinistries(6),
    getAlbums(4),
    getApprovedTestimonies(3),
  ]);

  const t = (key: string, field: Parameters<typeof sectionText>[2], fallback = "") =>
    sectionText(sections, key, field, fallback);
  const show = (key: string) => sectionVisible(sections, key);

  const heroImage = t("hero", "imageUrl", "/images/hero-worship.jpg");

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[86vh] flex items-center bg-[#14110f] text-white overflow-hidden">
        <Image
          src={heroImage}
          alt="Faith Dynamite Ministries congregation in worship"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#14110f] via-[#14110f]/80 to-[#14110f]/25"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 w-full fade-up">
          <div className="max-w-3xl">
            <p className="eyebrow !text-[#e6c97a]">{t("hero", "eyebrow", "Faith Dynamite Ministries (Aladura)")}</p>
            <h1 className="display-title mt-4 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl uppercase">
              {t("hero", "title", "Where Faith Works Wonders")}
            </h1>
            <p className="mt-6 text-lg sm:text-xl font-medium text-[#e6c97a]">
              {t("hero", "subtitle", "Raising Kingdom Ambassadors. Transforming Lives. Advancing the Kingdom of God.")}
            </p>
            <p className="mt-4 max-w-xl text-base text-white/80 leading-relaxed">{t("hero", "body")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={t("hero", "ctaUrl", "/plan-your-visit")} className="btn btn-gold">
                {t("hero", "ctaLabel", "Join Us This Sunday")}
              </Link>
              <Link href={t("hero", "cta2Url", "/watch-live")} className="btn btn-outline">
                {t("hero", "cta2Label", "Watch Online")}
              </Link>
              <Link href="/plan-your-visit" className="btn btn-outline hidden sm:inline-flex">
                Plan Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENT STRIP — dynamic next service */}
      {nextService ? (
        <div className="bg-[#6a1f2b] text-white">
          <div className="mx-auto max-w-7xl px-4 py-3 text-center text-[0.7rem] sm:text-xs uppercase tracking-[0.2em]">
            Next Service • {nextService.title} • {nextService.dayLabel} {nextService.timeLabel}
          </div>
        </div>
      ) : null}

      {/* NEXT GATHERING COUNTDOWN */}
      {nextService ? (
        <section className="bg-[#faf6ee]">
          <div className="mx-auto max-w-7xl px-4 -mt-0 py-12">
            <div className="card p-6 sm:p-9 grid gap-8 lg:grid-cols-[1.1fr_1fr] items-center">
              <div>
                <p className="eyebrow">Next Gathering</p>
                <h2 className="display-title mt-2 text-3xl sm:text-4xl">{nextService.title}</h2>
                <p className="mt-2 text-[#5b5148]">
                  {nextService.dayLabel} • {nextService.timeLabel}
                </p>
                <p className="mt-1 text-sm text-[#8b8175]">{formatLongDate(new Date(nextService.when))}</p>
                {nextService.description ? (
                  <p className="mt-4 text-[#5b5148] leading-relaxed">{nextService.description}</p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/worship" className="btn btn-dark">
                    View Service Details
                  </Link>
                  <Link href="/watch-live" className="btn btn-wine">
                    Watch Live
                  </Link>
                </div>
              </div>
              <Countdown target={nextService.when} />
            </div>
          </div>
        </section>
      ) : null}

      {/* WELCOME */}
      {show("welcome") ? (
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={t("welcome", "imageUrl", "/images/aladura-prayer.jpg")}
                alt="Worshippers in prayer at Faith Dynamite Ministries"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -right-3 hidden sm:block bg-[#6a1f2b] text-white px-6 py-4">
                <p className="font-display text-2xl">{church.tagline}</p>
              </div>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow={t("welcome", "eyebrow", "Welcome Home")}
                title={t("welcome", "title", "You Are Welcome Here")}
                subtitle={t("welcome", "subtitle")}
              />
              <p className="mt-6 text-[#5b5148] leading-8">{t("welcome", "body")}</p>
              <div className="mt-7">
                <Link href={t("welcome", "ctaUrl", "/about")} className="btn btn-dark">
                  {t("welcome", "ctaLabel", "Discover Our Story")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* WEEKLY SERVICES */}
      {show("services") ? (
        <section className="bg-[#faf6ee] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("services", "eyebrow", "Gather With Us")}
              title={t("services", "title", "Weekly Activities")}
              subtitle={t("services", "subtitle")}
            />
            {schedules.length ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {schedules.map((s) => (
                  <div key={s.id} className="card p-6">
                    <div className="text-3xl" aria-hidden>
                      {ICONS[s.icon || "church"] ?? "⛪"}
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-bold">{s.title}</h3>
                    <p className="mt-1 text-[#9b7a2c] font-semibold text-sm uppercase tracking-[0.12em]">
                      {s.dayLabel} • {s.timeLabel}
                    </p>
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
      ) : null}

      {/* SPECIAL PROGRAMMES */}
      {show("programmes") ? (
        <section className="bg-[#14110f] py-16 sm:py-24 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              light
              eyebrow={t("programmes", "eyebrow", "Special Programmes")}
              title={t("programmes", "title", "Experience God With Us")}
              subtitle={t("programmes", "subtitle")}
            />
            {programmes.length ? (
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {programmes.map((p) => (
                  <Link
                    href={`/events/${p.slug}`}
                    key={p.id}
                    className="group border border-white/12 bg-white/[0.03] overflow-hidden hover:border-[#c8a24a] transition-colors"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={p.bannerUrl || "/images/hero-worship.jpg"}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-[0.62rem] uppercase tracking-[0.18em] text-[#e6c97a]">{p.category}</span>
                      <h3 className="mt-3 font-display text-2xl font-bold leading-snug">{p.title}</h3>
                      <p className="mt-3 text-sm text-white/70 leading-relaxed line-clamp-3">{p.summary}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/50">
                        {formatShortDate(p.startDate)}
                        {p.endDate ? ` – ${formatShortDate(p.endDate)}` : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-white/70">More programmes are coming soon. Please check back.</p>
            )}
            <div className="mt-10 text-center">
              <Link href="/events" className="btn btn-gold">
                View All Programmes
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* MISSION */}
      {show("mission") ? (
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow={t("mission", "eyebrow", "Our Mission")}
                title={t("mission", "title")}
              />
              <p className="mt-6 text-[#5b5148] leading-8">{t("mission", "body")}</p>
              <div className="mt-7 grid grid-cols-2 gap-4 max-w-md">
                {["Spiritual Transformation", "Practical Empowerment"].map((item) => (
                  <div key={item} className="border-l-2 border-[#c8a24a] pl-4">
                    <p className="font-display text-xl font-bold">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href={t("mission", "ctaUrl", "/about")} className="btn btn-dark">
                  {t("mission", "ctaLabel", "About Our Ministry")}
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src={t("mission", "imageUrl", "/images/choir.jpg")}
                alt="Choir ministration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* MINISTRIES */}
      {show("ministries") ? (
        <section className="bg-[#faf6ee] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("ministries", "eyebrow", "Serve & Belong")}
              title={t("ministries", "title", "Our Ministries")}
              subtitle={t("ministries", "subtitle")}
            />
            {ministryList.length ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ministryList.map((m) => (
                  <Link href={`/ministries/${m.slug}`} key={m.id} className="card overflow-hidden group">
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
                      <h3 className="font-display text-2xl font-bold">{m.name}</h3>
                      <p className="mt-2 text-sm text-[#5b5148] line-clamp-2">{m.description}</p>
                      <p className="mt-4 text-[0.7rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Learn more →</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <EmptyState message="Our ministries will be listed here soon." />
              </div>
            )}
            <div className="mt-10 text-center">
              <GoldLink href="/ministries">View all ministries</GoldLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* VOICE OF MERCY */}
      {show("voice") ? (
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("voice", "eyebrow", "Prophetic Devotionals")}
              title={t("voice", "title", "Voice of Mercy Speaks")}
              subtitle={t("voice", "subtitle")}
            />
            {devotionalList.length ? (
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {devotionalList.map((d) => (
                  <article key={d.id} className="card overflow-hidden flex flex-col">
                    <Link href={`/voice-of-mercy/${d.slug}`} className="relative aspect-[3/4] block bg-[#14110f]">
                      <Image
                        src={d.imageUrl || "/images/voice-of-mercy.jpg"}
                        alt={d.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <div className="p-6 flex flex-col grow">
                      <Badge tone="wine">{d.category}</Badge>
                      <h3 className="mt-3 font-display text-2xl font-bold leading-snug">
                        <Link href={`/voice-of-mercy/${d.slug}`}>{d.title}</Link>
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-[#9b7a2c]">{d.scripture}</p>
                      <p className="mt-3 text-sm text-[#5b5148] line-clamp-3 grow">{d.excerpt}</p>
                      <p className="mt-4 text-xs text-[#8b8175]">
                        {formatShortDate(d.publishDate)} • {d.speaker}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <EmptyState message="Prophetic messages will appear here soon." />
              </div>
            )}
            <div className="mt-10 text-center">
              <Link href="/voice-of-mercy" className="btn btn-wine">
                Read The Archive
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* SERMONS */}
      {show("sermons") ? (
        <section className="bg-[#faf6ee] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("sermons", "eyebrow", "The Word")}
              title={t("sermons", "title", "Latest Messages")}
              subtitle={t("sermons", "subtitle")}
            />
            {sermonList.length ? (
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {sermonList.map((s) => (
                  <Link href={`/sermons/${s.slug}`} key={s.id} className="card overflow-hidden group">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={s.thumbnailUrl || "/images/hero-worship.jpg"}
                        alt={s.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-[0.14em] text-[#9b7a2c]">
                        {formatShortDate(s.sermonDate)}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold leading-snug">{s.title}</h3>
                      <p className="mt-2 text-sm text-[#5b5148]">{s.speaker}</p>
                      <p className="mt-1 text-sm italic text-[#6a1f2b]">{s.scripture}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <EmptyState message="Messages will appear here soon." />
              </div>
            )}
            <div className="mt-10 text-center">
              <GoldLink href="/sermons">Browse all messages</GoldLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* KSM */}
      {show("ksm") ? (
        <section className="relative bg-[#12224a] text-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Image
                src={church.ksmLogoUrl}
                alt="KATARTISMOS School of Ministry logo"
                width={120}
                height={120}
                className="h-24 w-24 object-contain"
                loading="lazy"
              />
              <p className="eyebrow mt-5 !text-[#e6c97a]">{t("ksm", "eyebrow", "KATARTISMOS School of Ministry")}</p>
              <h2 className="display-title mt-3 text-3xl sm:text-4xl">{t("ksm", "title")}</h2>
              <p className="mt-5 text-white/80 leading-8">{t("ksm", "body")}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Equip", "Establish", "Edify", "Empower"].map((v) => (
                  <span
                    key={v}
                    className="border border-[#c8a24a]/60 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-[#e6c97a]"
                  >
                    {v}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={t("ksm", "ctaUrl", "/school-of-ministry")} className="btn btn-gold">
                  {t("ksm", "ctaLabel", "Explore KSM")}
                </Link>
                <Link href={t("ksm", "cta2Url", "/school-of-ministry/apply")} className="btn btn-outline">
                  {t("ksm", "cta2Label", "Apply Now")}
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src={t("ksm", "imageUrl", "/images/ksm-learning.jpg")}
                alt="Students learning online with KSM"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* VOCATIONAL */}
      {show("vocational") ? (
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative aspect-[4/3] order-2 lg:order-1">
              <Image
                src={t("vocational", "imageUrl", "/images/vocational.jpg")}
                alt="Vocational skills training"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                align="left"
                eyebrow={t("vocational", "eyebrow", "Vocational Empowerment")}
                title={t("vocational", "title", "Skills For Life")}
                subtitle={t("vocational", "subtitle")}
              />
              <p className="mt-6 text-[#5b5148] leading-8">{t("vocational", "body")}</p>
              <div className="mt-8">
                <Link href={t("vocational", "ctaUrl", "/vocational-training")} className="btn btn-wine">
                  {t("vocational", "ctaLabel", "See Training Programmes")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* UPCOMING EVENTS */}
      {show("events") ? (
        <section className="bg-[#faf6ee] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("events", "eyebrow", "What's Happening")}
              title={t("events", "title", "Upcoming Events")}
              subtitle={t("events", "subtitle")}
            />
            {upcoming.length ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {upcoming.map((e) => (
                  <Link href={`/events/${e.slug}`} key={e.id} className="card p-6 flex gap-5 items-start">
                    <div className="shrink-0 w-16 text-center bg-[#14110f] text-white py-3">
                      <div className="font-display text-2xl font-bold text-[#e6c97a]">
                        {new Date(`${e.startDate}T12:00:00`).getDate()}
                      </div>
                      <div className="text-[0.6rem] uppercase tracking-[0.14em]">
                        {new Date(`${e.startDate}T12:00:00`).toLocaleDateString("en-NG", { month: "short" })}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <Badge tone={classifyEvent(e.startDate, e.endDate) === "Happening Today" ? "wine" : "gold"}>
                        {classifyEvent(e.startDate, e.endDate)}
                      </Badge>
                      <h3 className="mt-2 font-display text-xl font-bold leading-snug">{e.title}</h3>
                      <p className="mt-1 text-sm text-[#8b8175]">
                        {formatShortDate(e.startDate)} {e.startTime ? `• ${e.startTime}` : ""}{" "}
                        {e.venue ? `• ${e.venue}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-[#5b5148] line-clamp-2">{e.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <EmptyState message="More programmes are coming soon. Please check back." />
              </div>
            )}
            <div className="mt-10 text-center">
              <Link href="/events" className="btn btn-dark">
                Full Events Calendar
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* GALLERY */}
      {show("gallery") && albums.length ? (
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("gallery", "eyebrow", "Moments")}
              title={t("gallery", "title", "Recent Gallery")}
              subtitle={t("gallery", "subtitle")}
            />
            <div className="mt-12 grid gap-4 grid-cols-2 lg:grid-cols-4">
              {albums.map((a) => (
                <Link key={a.id} href={`/gallery/${a.slug}`} className="group relative aspect-square overflow-hidden">
                  <Image
                    src={a.coverUrl || "/images/hero-worship.jpg"}
                    alt={a.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
                  <span className="absolute bottom-3 left-3 right-3 text-white font-display text-lg leading-tight">
                    {a.title}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <GoldLink href="/gallery">View the full gallery</GoldLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* TESTIMONIES */}
      {show("testimonies") ? (
        <section className="bg-[#6a1f2b] text-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              light
              eyebrow={t("testimonies", "eyebrow", "Wonders")}
              title={t("testimonies", "title", "Faith Works Wonders")}
              subtitle={t("testimonies", "subtitle")}
            />
            {testimonyList.length ? (
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {testimonyList.map((tm) => (
                  <blockquote key={tm.id} className="border border-white/15 bg-white/[0.04] p-6">
                    <p className="text-white/85 leading-relaxed italic">“{tm.body}”</p>
                    <footer className="mt-4 text-[0.7rem] uppercase tracking-[0.18em] text-[#e6c97a]">
                      — {tm.name}
                    </footer>
                  </blockquote>
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-white/70">Testimonies will be shared here soon.</p>
            )}
            <div className="mt-10 text-center">
              <Link href="/testimonies" className="btn btn-gold">
                Share Your Testimony
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* GIVING + VISIT */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 grid gap-6 lg:grid-cols-2">
          {show("giving") ? (
            <div className="bg-[#14110f] text-white p-8 sm:p-12">
              <p className="eyebrow !text-[#e6c97a]">{t("giving", "eyebrow", "Partnership")}</p>
              <h2 className="display-title mt-3 text-3xl sm:text-4xl">{t("giving", "title", "Give With Purpose")}</h2>
              <p className="mt-4 text-white/75 leading-relaxed">{t("giving", "body")}</p>
              <Link href={t("giving", "ctaUrl", "/give")} className="btn btn-gold mt-8">
                {t("giving", "ctaLabel", "Give Online")}
              </Link>
            </div>
          ) : null}
          {show("visit") ? (
            <div className="relative p-8 sm:p-12 text-white overflow-hidden">
              <Image
                src={t("visit", "imageUrl", "/images/youth-ministry.jpg")}
                alt="Church family welcoming visitors"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#12224a]/80" aria-hidden />
              <div className="relative">
                <p className="eyebrow !text-[#e6c97a]">{t("visit", "eyebrow", "First Time?")}</p>
                <h2 className="display-title mt-3 text-3xl sm:text-4xl">{t("visit", "title", "Plan Your Visit")}</h2>
                <p className="mt-4 text-white/80 leading-relaxed">{t("visit", "body")}</p>
                <Link href={t("visit", "ctaUrl", "/plan-your-visit")} className="btn btn-outline mt-8">
                  {t("visit", "ctaLabel", "I'm Coming This Sunday")}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* LOCATION + NEWSLETTER */}
      <section className="bg-[#faf6ee] py-16">
        <div className="mx-auto max-w-7xl px-4 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="eyebrow">Find Us</p>
            <h2 className="display-title mt-3 text-3xl">Location & Contact</h2>
            <ul className="mt-5 space-y-2 text-[#5b5148]">
              <li>{church.address || "Our address will be published here shortly."}</li>
              {church.phone ? <li>Tel: {church.phone}</li> : null}
              {church.email ? <li>Email: {church.email}</li> : null}
              <li>{church.officeHours}</li>
            </ul>
            <Link href="/contact" className="btn btn-dark mt-7">
              Contact Us
            </Link>
          </div>
          {show("newsletter") ? (
            <div className="card p-8">
              <p className="eyebrow">{t("newsletter", "eyebrow", "Stay Connected")}</p>
              <h3 className="display-title mt-3 text-2xl">{t("newsletter", "title", "Join Our WhatsApp Community")}</h3>
              <p className="mt-3 text-[#5b5148]">{t("newsletter", "body")}</p>
              <Link href={t("newsletter", "ctaUrl", "/contact")} className="btn btn-wine mt-6">
                {t("newsletter", "ctaLabel", "Contact Us")}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

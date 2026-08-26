import Image from "next/image";
import Link from "next/link";
import type { ChurchInfo, SocialLinks } from "@/lib/content";

type Schedule = { id: number; title: string; dayLabel: string; timeLabel: string };

export default function SiteFooter({
  church,
  social,
  links,
  schedules,
}: {
  church: ChurchInfo;
  social: SocialLinks;
  links: { label: string; href: string }[];
  schedules: Schedule[];
}) {
  const socialEntries = Object.entries(social).filter(([, url]) => url && url.trim().length > 0);

  return (
    <footer className="bg-[#14110f] text-[#e8e0d2]">
      <div className="gold-rule" />
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={church.logoUrl}
              alt="Faith Dynamite Ministries logo"
              width={72}
              height={72}
              className="h-16 w-16 object-contain"
            />
            <div>
              <p className="font-display text-xl font-bold text-white leading-tight">
                Faith Dynamite Ministries
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#c8a24a]">
                {church.tagline}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#bfb5a4]">
            Faith Dynamite Ministries (Aladura)
            <br />
            {church.affiliation}.
          </p>
          <Image
            src={church.affiliationLogoUrl}
            alt="Cherubim and Seraphim Movement Church (Ayo Ni O) logo"
            width={56}
            height={56}
            className="mt-4 h-11 w-11 object-contain bg-white/95 p-1 rounded-sm"
          />
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-[#e6c97a]">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="text-[#bfb5a4] hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/voice-of-mercy" className="text-[#bfb5a4] hover:text-white transition-colors">
                Voice of Mercy Speaks
              </Link>
            </li>
            <li>
              <Link href="/prayer-request" className="text-[#bfb5a4] hover:text-white transition-colors">
                Prayer Request
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-[#e6c97a]">Service Times</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {schedules.map((s) => (
              <li key={s.id}>
                <span className="block text-white">{s.title}</span>
                <span className="text-[#bfb5a4]">
                  {s.dayLabel} • {s.timeLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-[#e6c97a]">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#bfb5a4]">
            {church.address ? <li>{church.address}</li> : <li>Address coming soon</li>}
            {church.phone ? <li>Tel: {church.phone}</li> : null}
            {church.whatsapp ? <li>WhatsApp: {church.whatsapp}</li> : null}
            {church.email ? <li>Email: {church.email}</li> : null}
            {church.officeHours ? <li>{church.officeHours}</li> : null}
          </ul>
          {socialEntries.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {socialEntries.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border border-white/25 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.14em] hover:border-[#c8a24a] hover:text-[#e6c97a]"
                >
                  {name}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8f8677]">
          <p>© {new Date().getFullYear()} Faith Dynamite Ministries (Aladura). All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/search" className="hover:text-white">
              Search
            </Link>
            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

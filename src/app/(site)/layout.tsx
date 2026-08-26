import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSetting, type ChurchInfo, type SocialLinks } from "@/lib/content";
import { getNav, getSchedules, getAnnouncements } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [church, social, headerNav, footerNav, schedules, announcementRows, user] = await Promise.all([
    getSetting<ChurchInfo>("church"),
    getSetting<SocialLinks>("social"),
    getNav("header"),
    getNav("footer"),
    getSchedules(),
    getAnnouncements(),
    getSessionUser(),
  ]);

  const whatsappNumber = (social.whatsapp || church.whatsapp || "").replace(/[^0-9]/g, "");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: "Faith Dynamite Ministries (Aladura)",
    slogan: church.tagline,
    description: church.affiliation,
    logo: church.logoUrl,
    telephone: church.phone || undefined,
    email: church.email || undefined,
    address: church.address || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader
        items={headerNav.length ? headerNav.map((n) => ({ label: n.label, href: n.href })) : [{ label: "Home", href: "/" }]}
        logoUrl={church.logoUrl}
        churchName={church.name}
        tagline={church.tagline}
        announcements={announcementRows.map((a) => ({ message: a.message, linkUrl: a.linkUrl }))}
      />
      <main id="main">{children}</main>
      <SiteFooter
        church={church}
        social={social}
        links={footerNav.map((n) => ({ label: n.label, href: n.href }))}
        schedules={schedules.map((s) => ({ id: s.id, title: s.title, dayLabel: s.dayLabel, timeLabel: s.timeLabel }))}
      />

      {whatsappNumber ? (
        <a
          href={`https://wa.me/${whatsappNumber.startsWith("0") ? `234${whatsappNumber.slice(1)}` : whatsappNumber}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
            <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.4 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.1 1.2-1.1 2.8s1.2 3.3 1.3 3.5 2.3 3.6 5.6 5c3.3 1.3 3.3.9 3.9.8s1.8-.7 2-1.4.3-1.3.2-1.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z" />
          </svg>
        </a>
      ) : null}

      {user ? (
        <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-[#14110f] text-white px-3 py-2 shadow-lg text-xs">
          <span className="hidden sm:inline text-[#e6c97a] uppercase tracking-[0.14em]">Admin mode</span>
          <Link href="/admin" className="underline hover:text-[#e6c97a]">
            Dashboard
          </Link>
          <Link href="/admin/website/homepage" className="underline hover:text-[#e6c97a]">
            Edit Page
          </Link>
        </div>
      ) : null}
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type NavItem = { label: string; href: string };

export default function SiteHeader({
  items,
  logoUrl,
  churchName,
  tagline,
  announcements,
}: {
  items: NavItem[];
  logoUrl: string;
  churchName: string;
  tagline: string;
  announcements: { message: string; linkUrl: string | null }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (announcements.length < 2) return;
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, [announcements.length]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const current = announcements.length ? announcements[tick % announcements.length] : null;

  return (
    <header className="sticky top-0 z-50">
      {current ? (
        <div className="bg-[#14110f] text-[#e6c97a] text-[0.72rem] sm:text-xs tracking-[0.12em] uppercase">
          <div className="mx-auto max-w-7xl px-4 py-2 text-center">
            {current.linkUrl ? (
              <Link href={current.linkUrl} className="hover:text-white transition-colors">
                {current.message}
              </Link>
            ) : (
              <span>{current.message}</span>
            )}
          </div>
        </div>
      ) : null}

      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur shadow-[0_10px_30px_-24px_rgba(0,0,0,0.7)]"
            : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className={`flex items-center justify-between gap-4 ${scrolled ? "py-2" : "py-3"} transition-all`}>
            <Link href="/" className="flex items-center gap-3 min-w-0">
              <Image
                src={logoUrl}
                alt={`${churchName} logo`}
                width={64}
                height={64}
                priority
                className={`${scrolled ? "h-10 w-10" : "h-12 w-12"} object-contain transition-all`}
              />
              <span className="min-w-0">
                <span className="block font-display text-[1.02rem] sm:text-[1.15rem] font-bold leading-tight text-[#14110f] truncate">
                  Faith Dynamite Ministries
                </span>
                <span className="block text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.22em] text-[#9b7a2c] truncate">
                  {tagline}
                </span>
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-5" aria-label="Main navigation">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={`text-[0.78rem] font-semibold uppercase tracking-[0.09em] transition-colors ${
                      active ? "text-[#9b7a2c]" : "text-[#3b332c] hover:text-[#6a1f2b]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <Link href="/plan-your-visit" className="btn btn-dark !px-4 !py-2.5 !text-[0.68rem]">
                Plan Your Visit
              </Link>
              <Link href="/give" className="btn btn-gold !px-4 !py-2.5 !text-[0.68rem]">
                Give Online
              </Link>
            </div>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden inline-flex h-11 w-11 items-center justify-center border border-[#e2d9c6] text-[#14110f]"
            >
              <span className="sr-only">Menu</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M3 6h18" strokeLinecap="round" />
                    <path d="M3 12h18" strokeLinecap="round" />
                    <path d="M3 18h18" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="gold-rule" />
      </div>

      {open ? (
        <div className="xl:hidden bg-[#14110f] text-white max-h-[75vh] overflow-y-auto">
          <nav className="px-4 py-4 grid gap-1" aria-label="Mobile navigation">
            {items.map((item) => (
              <Link
                key={`m-${item.href}-${item.label}`}
                href={item.href}
                className="py-3 border-b border-white/10 text-sm uppercase tracking-[0.12em] hover:text-[#e6c97a]"
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-4">
              <Link href="/plan-your-visit" className="btn btn-outline !py-3">
                Plan Visit
              </Link>
              <Link href="/give" className="btn btn-gold !py-3">
                Give
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

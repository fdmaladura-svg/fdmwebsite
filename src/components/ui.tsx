import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto max-w-3xl" : "text-left max-w-2xl"}`}>
      {eyebrow ? (
        <p className={`eyebrow ${light ? "!text-[#e6c97a]" : ""}`}>{eyebrow}</p>
      ) : null}
      <h2
        className={`display-title mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] ${
          light ? "text-white" : "text-[#14110f]"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/75" : "text-[#5b5148]"}`}>
          {subtitle}
        </p>
      ) : null}
      <div className={`mt-6 h-px w-24 ${align === "center" ? "mx-auto" : ""} bg-[#c8a24a]`} />
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="border border-dashed border-[#d8cdb8] bg-[#fbf8f1] px-6 py-12 text-center">
      <p className="font-display text-xl text-[#6a1f2b]">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "wine" | "navy" | "muted" }) {
  const tones: Record<string, string> = {
    gold: "bg-[#f6edd8] text-[#8a6a20] border-[#e3d3a8]",
    wine: "bg-[#f7e9eb] text-[#6a1f2b] border-[#e6c9ce]",
    navy: "bg-[#e8ecf6] text-[#12224a] border-[#c8d2e8]",
    muted: "bg-[#f1eee7] text-[#5b5148] border-[#ded7c9]",
  };
  return (
    <span
      className={`inline-block border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  imageUrl,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
}) {
  return (
    <section className="relative bg-[#14110f] text-white">
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-[#14110f] via-[#14110f]/85 to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-24">
        {eyebrow ? <p className="eyebrow !text-[#e6c97a]">{eyebrow}</p> : null}
        <h1 className="display-title mt-3 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-2xl text-lg text-white/80">{subtitle}</p> : null}
        <div className="mt-7 h-px w-28 bg-[#c8a24a]" />
      </div>
    </section>
  );
}

export function GoldLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-[#9b7a2c] hover:text-[#6a1f2b] transition-colors"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

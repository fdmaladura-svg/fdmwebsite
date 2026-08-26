"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export type NavGroup = { title: string; items: { label: string; href: string }[] };

export default function AdminShell({
  groups,
  user,
  logoUrl,
  children,
  onLogout,
}: {
  groups: NavGroup[];
  user: { name: string; role: string };
  logoUrl: string;
  children: ReactNode;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#14110f]">
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#14110f] text-white px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src={logoUrl} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="font-display text-lg">FDM Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="border border-white/30 px-3 py-1.5 text-xs uppercase tracking-[0.12em]"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div className="lg:flex">
        <aside
          className={`${open ? "block" : "hidden"} lg:block lg:w-72 shrink-0 bg-[#14110f] text-white lg:min-h-screen`}
        >
          <div className="hidden lg:flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <Image src={logoUrl} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
            <div>
              <p className="font-display text-lg leading-tight">Faith Dynamite</p>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#c8a24a]">Church Manager</p>
            </div>
          </div>

          <nav className="px-3 py-4 space-y-5 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto" aria-label="Admin">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="px-2 text-[0.6rem] uppercase tracking-[0.2em] text-[#8f8677]">{group.title}</p>
                <ul className="mt-2 space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`block px-2 py-2 text-sm rounded-sm transition-colors ${
                            active ? "bg-[#c8a24a] text-[#14110f] font-semibold" : "text-white/80 hover:bg-white/10"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-white/10 text-xs text-white/60">
            <p className="text-white">{user.name}</p>
            <p className="capitalize">{user.role.replace("_", " ")}</p>
            <div className="mt-3 flex gap-3">
              <Link href="/" className="underline hover:text-white">
                View website
              </Link>
              <form action={onLogout}>
                <button type="submit" className="underline hover:text-white">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="grow min-w-0 px-4 sm:px-8 py-6 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

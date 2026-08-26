import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getSessionUser } from "@/lib/auth";
import { getSetting, type ChurchInfo } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administrator Sign In" };

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");
  const church = await getSetting<ChurchInfo>("church");

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#14110f] text-white">
      <div className="relative hidden lg:block">
        <Image src="/images/aladura-prayer.jpg" alt="" fill sizes="50vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-[#14110f]/60" aria-hidden />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-display text-4xl">Where Faith Works Wonders</p>
          <p className="mt-3 text-white/70">
            Faith Dynamite Ministries (Aladura) — a member of Cherubim and Seraphim Movement Church (Ayo Ni O).
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <Image
              src={church.logoUrl}
              alt="Faith Dynamite Ministries logo"
              width={96}
              height={96}
              className="h-20 w-20 object-contain"
              priority
            />
            <h1 className="display-title mt-5 text-3xl">Church Manager</h1>
            <p className="mt-2 text-sm text-white/60">Sign in to manage your website content.</p>
          </div>

          <div className="mt-9">
            <LoginForm />
          </div>

          <div className="mt-8 rounded-sm border border-white/10 bg-white/[0.03] p-4 text-xs text-white/50">
            <p className="font-semibold text-white/70">Demo access for this build</p>
            <p className="mt-1">Super Admin: admin@faithdynamite.org / FaithDynamite2026!</p>
            <p>Editor: editor@faithdynamite.org / Editor2026!</p>
            <p className="mt-3">
              Accounts are created by the Super Admin only.{" "}
              <Link href="/contact" className="underline">
                Need help?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

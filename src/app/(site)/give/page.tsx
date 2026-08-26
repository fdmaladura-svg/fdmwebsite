import { PageHero } from "@/components/ui";
import GiveForm from "@/components/GiveForm";
import { getGivingCategories } from "@/lib/queries";
import { getSections, sectionText, getSetting, type BankSettings } from "@/lib/content";

export const metadata = { title: "Give" };
export const dynamic = "force-dynamic";

export default async function GivePage() {
  const [categories, sections, bank] = await Promise.all([
    getGivingCategories(),
    getSections("give"),
    getSetting<BankSettings>("bank"),
  ]);
  const t = (key: string, field: Parameters<typeof sectionText>[2], fallback = "") =>
    sectionText(sections, key, field, fallback);

  const names = categories.length
    ? categories.map((c) => c.name)
    : ["Tithe", "Offering", "Thanksgiving", "Missions", "Welfare / Benevolence", "Other"];

  return (
    <>
      <PageHero
        eyebrow={t("hero", "eyebrow", "Giving")}
        title={t("hero", "title", "Give With Purpose")}
        subtitle={t("hero", "subtitle", "Partner with what God is doing through Faith Dynamite Ministries.")}
        imageUrl="/images/choir.jpg"
      />

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="border border-[#eadfca] p-6 sm:p-9">
            <h2 className="display-title text-2xl">Give Online</h2>
            <p className="mt-2 text-sm text-[#5b5148]">All amounts are in Nigerian Naira (₦).</p>
            <div className="mt-7">
              <GiveForm categories={names} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#faf6ee] border border-[#eadfca] p-6 sm:p-8">
              <p className="text-[#5b5148] leading-8">{t("hero", "body")}</p>
            </div>
            {bank.enabled ? (
              <div className="border border-[#eadfca] p-6 sm:p-8">
                <h2 className="display-title text-2xl">Give By Bank Transfer</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Bank Name</dt>
                    <dd className="text-[#3f3831]">{bank.bankName}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Account Name</dt>
                    <dd className="text-[#3f3831]">{bank.accountName}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#9b7a2c]">Account Number</dt>
                    <dd className="text-[#3f3831] font-bold tracking-wider">{bank.accountNumber}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm text-[#5b5148] leading-relaxed">{bank.instructions}</p>
              </div>
            ) : null}
            <div className="bg-[#14110f] text-white p-6 sm:p-8">
              <h2 className="display-title text-xl text-[#e6c97a]">Giving Categories</h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/75">
                {names.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

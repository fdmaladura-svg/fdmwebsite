import { PageHero } from "@/components/ui";
import FormShell from "@/components/FormShell";
import { submitVisitorRequest } from "@/app/actions/public";
import { getSections, sectionText, getSetting, type ChurchInfo } from "@/lib/content";
import { getSchedules } from "@/lib/queries";

export const metadata = { title: "Plan Your Visit" };
export const dynamic = "force-dynamic";

const FAQS = [
  ["How long are the services?", "Our Sunday worship service typically lasts about two hours."],
  ["Is there parking?", "Parking information will be published by the church administrator. Please contact the office for guidance."],
  ["Will I be singled out as a visitor?", "We warmly welcome first-time worshippers, but you will never be embarrassed or pressured."],
  ["Can I come with my children?", "Absolutely. Our children's church runs alongside the main service."],
];

export default async function VisitPage() {
  const [sections, church, schedules] = await Promise.all([
    getSections("visit"),
    getSetting<ChurchInfo>("church"),
    getSchedules(),
  ]);
  const t = (key: string, field: Parameters<typeof sectionText>[2], fallback = "") =>
    sectionText(sections, key, field, fallback);

  return (
    <>
      <PageHero
        eyebrow={t("hero", "eyebrow", "First Time Here?")}
        title={t("hero", "title", "Plan Your Visit")}
        subtitle={t("hero", "subtitle")}
        imageUrl={t("hero", "imageUrl", "/images/youth-ministry.jpg")}
      />

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-lg leading-9 text-[#3f3831]">{t("hero", "body")}</p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {(["expect", "wear", "children", "directions"] as const).map((key) => (
                <div key={key} className="border border-[#eadfca] p-6">
                  <h2 className="font-display text-2xl">{t(key, "title")}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b5148]">{t(key, "body")}</p>
                </div>
              ))}
            </div>

            <h2 className="display-title mt-14 text-3xl">Service Times</h2>
            <ul className="mt-5 divide-y divide-[#eadfca] border border-[#eadfca]">
              {schedules.map((s) => (
                <li key={s.id} className="flex flex-wrap justify-between gap-2 px-5 py-3">
                  <span className="font-semibold">{s.title}</span>
                  <span className="text-sm text-[#8b8175]">
                    {s.dayLabel} • {s.timeLabel}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="display-title mt-14 text-3xl">Frequently Asked Questions</h2>
            <div className="mt-5 space-y-3">
              {FAQS.map(([q, a]) => (
                <details key={q} className="border border-[#eadfca] p-5">
                  <summary className="cursor-pointer font-semibold">{q}</summary>
                  <p className="mt-2 text-sm text-[#5b5148]">{a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="bg-[#faf6ee] border border-[#eadfca] p-6 sm:p-8 h-fit">
            <h2 className="display-title text-2xl">I&apos;m Coming This Sunday</h2>
            <p className="mt-2 text-sm text-[#5b5148]">Let us know you are coming and we will be expecting you.</p>
            <div className="mt-6">
              <FormShell action={submitVisitorRequest} submitLabel="Tell Us You're Coming">
                <div>
                  <label className="label" htmlFor="name">
                    Name *
                  </label>
                  <input id="name" name="name" required className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="phone">
                    Phone
                  </label>
                  <input id="phone" name="phone" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="attendingCount">
                    Number attending
                  </label>
                  <input id="attendingCount" name="attendingCount" type="number" min={1} defaultValue={1} className="field" />
                </div>
                <label className="flex items-center gap-3 text-sm text-[#5b5148]">
                  <input type="checkbox" name="bringingChildren" className="h-4 w-4" />
                  I am bringing children
                </label>
                <div>
                  <label className="label" htmlFor="preferredService">
                    Preferred service
                  </label>
                  <select id="preferredService" name="preferredService" className="field">
                    {schedules.map((s) => (
                      <option key={s.id}>{`${s.title} — ${s.dayLabel} ${s.timeLabel}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="message">
                    Anything we should know?
                  </label>
                  <textarea id="message" name="message" rows={3} className="field" />
                </div>
              </FormShell>
            </div>
            {church.address ? <p className="mt-6 text-sm text-[#5b5148]">{church.address}</p> : null}
          </aside>
        </div>
      </section>
    </>
  );
}

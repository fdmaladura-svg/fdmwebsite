import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { pageSections } from "@/db/schema";
import AdminForm from "@/components/admin/AdminForm";
import ImageField from "@/components/admin/ImageField";
import { saveSectionAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

const PAGES: Record<string, { key: string; label: string; preview: string; intro: string }> = {
  homepage: {
    key: "home",
    label: "Homepage",
    preview: "/",
    intro: "Click into any section below, change the words or pictures, then press Save. Your website updates immediately.",
  },
  about: { key: "about", label: "About Page", preview: "/about", intro: "Tell your story: who you are, your vision, mission and heritage." },
  give: { key: "give", label: "Giving Page", preview: "/give", intro: "The words shown on your giving page." },
  visit: { key: "visit", label: "Plan Your Visit Page", preview: "/plan-your-visit", intro: "Help first-time visitors feel welcome." },
  ksm: { key: "ksm", label: "School of Ministry Page", preview: "/school-of-ministry", intro: "Headline content for KATARTISMOS School of Ministry." },
  vocational: { key: "vocational", label: "Vocational Training Page", preview: "/vocational-training", intro: "Words shown on the Skills For Life page." },
  contact: { key: "contact", label: "Contact Page", preview: "/contact", intro: "Introduction shown on your contact page." },
};

export default async function WebsitePageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const config = PAGES[page];
  if (!config) notFound();

  let sections: (typeof pageSections.$inferSelect)[] = [];
  try {
    sections = await db
      .select()
      .from(pageSections)
      .where(eq(pageSections.page, config.key))
      .orderBy(asc(pageSections.sortOrder));
  } catch {
    sections = [];
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Website</p>
          <h1 className="display-title mt-2 text-3xl">Edit {config.label}</h1>
          <p className="mt-2 text-sm text-[#6b6156] max-w-2xl">{config.intro}</p>
        </div>
        <Link href={config.preview} target="_blank" className="btn btn-dark">
          Preview page
        </Link>
      </header>

      {sections.length ? (
        <div className="space-y-5">
          {sections.map((section) => (
            <details key={section.id} className="bg-white border border-[#e6e2da]" open={section.sortOrder <= 2}>
              <summary className="cursor-pointer px-5 py-4 font-display text-xl flex items-center justify-between gap-3">
                <span>{section.label}</span>
                <span className="text-[0.62rem] uppercase tracking-[0.16em] text-[#8b8175]">
                  {section.visible ? "Shown" : "Hidden"}
                </span>
              </summary>
              <div className="px-5 pb-6 pt-2 border-t border-[#eee9df]">
                <AdminForm action={saveSectionAction}>
                  <input type="hidden" name="__id" value={section.id} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor={`e-${section.id}`}>
                        Small label above the heading
                      </label>
                      <input id={`e-${section.id}`} name="eyebrow" defaultValue={section.eyebrow ?? ""} className="field" />
                    </div>
                    <div>
                      <label className="label" htmlFor={`t-${section.id}`}>
                        Main heading
                      </label>
                      <input id={`t-${section.id}`} name="title" defaultValue={section.title ?? ""} className="field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor={`s-${section.id}`}>
                        Supporting line
                      </label>
                      <input id={`s-${section.id}`} name="subtitle" defaultValue={section.subtitle ?? ""} className="field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor={`b-${section.id}`}>
                        Paragraph text
                      </label>
                      <textarea id={`b-${section.id}`} name="body" defaultValue={section.body ?? ""} rows={6} className="field" />
                      <p className="mt-1 text-xs text-[#8b8175]">Leave a blank line between paragraphs.</p>
                    </div>
                    <div className="sm:col-span-2">
                      <ImageField name="imageUrl" label="Section picture" defaultValue={section.imageUrl ?? ""} />
                    </div>
                    <div>
                      <label className="label" htmlFor={`cl-${section.id}`}>
                        Button label
                      </label>
                      <input id={`cl-${section.id}`} name="ctaLabel" defaultValue={section.ctaLabel ?? ""} className="field" />
                    </div>
                    <div>
                      <label className="label" htmlFor={`cu-${section.id}`}>
                        Button link
                      </label>
                      <input id={`cu-${section.id}`} name="ctaUrl" defaultValue={section.ctaUrl ?? ""} className="field" />
                    </div>
                    <div>
                      <label className="label" htmlFor={`c2l-${section.id}`}>
                        Second button label
                      </label>
                      <input id={`c2l-${section.id}`} name="cta2Label" defaultValue={section.cta2Label ?? ""} className="field" />
                    </div>
                    <div>
                      <label className="label" htmlFor={`c2u-${section.id}`}>
                        Second button link
                      </label>
                      <input id={`c2u-${section.id}`} name="cta2Url" defaultValue={section.cta2Url ?? ""} className="field" />
                    </div>
                    <div>
                      <label className="label" htmlFor={`o-${section.id}`}>
                        Position on the page
                      </label>
                      <input
                        id={`o-${section.id}`}
                        name="sortOrder"
                        type="number"
                        defaultValue={section.sortOrder}
                        className="field"
                      />
                      <p className="mt-1 text-xs text-[#8b8175]">Smaller numbers appear higher up.</p>
                    </div>
                    <label className="flex items-center gap-3 text-sm mt-6">
                      <input type="checkbox" name="visible" defaultChecked={section.visible} className="h-4 w-4" />
                      Show this section on the website
                    </label>
                  </div>
                </AdminForm>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <p className="bg-white border border-[#e6e2da] p-8 text-center text-[#8b8175]">
          No editable sections found for this page yet.
        </p>
      )}
    </div>
  );
}

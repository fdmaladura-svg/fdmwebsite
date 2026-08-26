import { PageHero } from "@/components/ui";
import FormShell from "@/components/FormShell";
import { submitTestimony } from "@/app/actions/public";
import { getApprovedTestimonies } from "@/lib/queries";

export const metadata = { title: "Testimonies" };
export const dynamic = "force-dynamic";

export default async function TestimoniesPage() {
  const list = await getApprovedTestimonies(24);
  return (
    <>
      <PageHero
        eyebrow="Faith Works Wonders"
        title="Testimonies"
        subtitle="Read what God is doing, and share your own story of His faithfulness."
        imageUrl="/images/choir.jpg"
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            {list.length ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {list.map((t) => (
                  <blockquote key={t.id} className="border-l-2 border-[#c8a24a] bg-[#faf6ee] p-6">
                    <p className="italic leading-relaxed text-[#3f3831]">“{t.body}”</p>
                    <footer className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-[#9b7a2c]">— {t.name}</footer>
                  </blockquote>
                ))}
              </div>
            ) : (
              <p className="text-[#8b8175]">Testimonies will be shared here soon.</p>
            )}
          </div>
          <aside className="border border-[#eadfca] p-6 sm:p-8 h-fit">
            <h2 className="display-title text-2xl">Share Your Testimony</h2>
            <p className="mt-2 text-sm text-[#5b5148]">
              Every testimony is reviewed by the church office before publication.
            </p>
            <div className="mt-6">
              <FormShell action={submitTestimony} submitLabel="Submit Testimony">
                <div>
                  <label className="label" htmlFor="name">
                    Name *
                  </label>
                  <input id="name" name="name" required className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="body">
                    Your Testimony *
                  </label>
                  <textarea id="body" name="body" rows={6} required className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="photoUrl">
                    Photo link (optional)
                  </label>
                  <input id="photoUrl" name="photoUrl" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="videoUrl">
                    Video link (optional)
                  </label>
                  <input id="videoUrl" name="videoUrl" className="field" />
                </div>
                <label className="flex items-start gap-3 text-sm text-[#5b5148]">
                  <input type="checkbox" name="permission" className="mt-1 h-4 w-4" />
                  I give permission for this testimony to be published.
                </label>
              </FormShell>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

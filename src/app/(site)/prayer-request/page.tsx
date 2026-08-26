import { PageHero } from "@/components/ui";
import FormShell from "@/components/FormShell";
import { submitPrayerRequest } from "@/app/actions/public";

export const metadata = { title: "Prayer Request" };

export default function PrayerRequestPage() {
  return (
    <>
      <PageHero
        eyebrow="We Stand With You"
        title="Prayer Request"
        subtitle="Send your request and our intercessors will stand with you in prayer."
        imageUrl="/images/aladura-prayer.jpg"
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-2xl px-4">
          <FormShell action={submitPrayerRequest} submitLabel="Send Prayer Request">
            <div>
              <label className="label" htmlFor="name">
                Name
              </label>
              <input id="name" name="name" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="contact">
                Phone or Email (optional)
              </label>
              <input id="contact" name="contact" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="request">
                Your Prayer Request *
              </label>
              <textarea id="request" name="request" rows={6} required className="field" />
            </div>
            <label className="flex items-start gap-3 text-sm text-[#5b5148]">
              <input type="checkbox" name="confidential" className="mt-1 h-4 w-4" />
              Keep this request confidential (only authorised church administrators will see it)
            </label>
          </FormShell>
        </div>
      </section>
    </>
  );
}

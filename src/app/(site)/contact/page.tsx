import { PageHero } from "@/components/ui";
import FormShell from "@/components/FormShell";
import { submitContactMessage } from "@/app/actions/public";
import { getSetting, type ChurchInfo, type SocialLinks } from "@/lib/content";

export const metadata = { title: "Contact Us" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [church, social] = await Promise.all([
    getSetting<ChurchInfo>("church"),
    getSetting<SocialLinks>("social"),
  ]);
  const socials = Object.entries(social).filter(([, v]) => v);

  return (
    <>
      <PageHero
        eyebrow="Say Hello"
        title="Contact Us"
        subtitle="We would love to hear from you — for prayer, enquiries or partnership."
        imageUrl="/images/hero-worship.jpg"
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display-title text-3xl">Church Information</h2>
            <dl className="mt-6 space-y-4 text-sm">
              {[
                ["Address", church.address || "Our address will be published here shortly."],
                ["Telephone", church.phone || "Coming soon"],
                ["WhatsApp", church.whatsapp || "Coming soon"],
                ["Email", church.email || "Coming soon"],
                ["Office Hours", church.officeHours],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-[#9b7a2c]">{label}</dt>
                  <dd className="text-[#3f3831] mt-1">{value}</dd>
                </div>
              ))}
            </dl>

            {socials.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {socials.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border border-[#ded5c2] px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] hover:border-[#c8a24a]"
                  >
                    {name}
                  </a>
                ))}
              </div>
            ) : null}

            {church.mapEmbedUrl ? (
              <div className="mt-8 aspect-video border border-[#eadfca]">
                <iframe src={church.mapEmbedUrl} title="Church location map" className="h-full w-full" loading="lazy" />
              </div>
            ) : (
              <div className="mt-8 border border-dashed border-[#d8cdb8] bg-[#fbf8f1] p-8 text-center text-sm text-[#8b8175]">
                Our map location will be added by the church administrator.
              </div>
            )}
          </div>

          <div className="border border-[#eadfca] p-6 sm:p-8">
            <h2 className="display-title text-3xl">Send A Message</h2>
            <div className="mt-6">
              <FormShell action={submitContactMessage} submitLabel="Send Message">
                <div>
                  <label className="label" htmlFor="name">
                    Name *
                  </label>
                  <input id="name" name="name" required className="field" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="email">
                      Email
                    </label>
                    <input id="email" name="email" type="email" className="field" />
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">
                      Phone
                    </label>
                    <input id="phone" name="phone" className="field" />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="subject">
                    Subject
                  </label>
                  <input id="subject" name="subject" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="message">
                    Message *
                  </label>
                  <textarea id="message" name="message" rows={5} required className="field" />
                </div>
              </FormShell>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

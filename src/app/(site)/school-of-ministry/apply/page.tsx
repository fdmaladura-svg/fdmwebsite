import FormShell from "@/components/FormShell";
import { submitKsmApplication } from "@/app/actions/public";
import { getKsmCourses } from "@/lib/queries";
import { getSetting, type KsmSettings } from "@/lib/content";

export const metadata = { title: "KSM Online Application" };
export const dynamic = "force-dynamic";

export default async function KsmApplyPage() {
  const [courses, ksm] = await Promise.all([getKsmCourses(), getSetting<KsmSettings>("ksm")]);

  return (
    <div className="bg-[#f7f8fb]">
      <section className="bg-[#12224a] text-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <p className="eyebrow !text-[#e6c97a]">KATARTISMOS School of Ministry</p>
          <h1 className="display-title mt-3 text-4xl sm:text-5xl">Online Application</h1>
          <p className="mt-4 text-white/75">
            Complete the form below to apply. Tuition is free and classes hold {ksm.venue.toLowerCase()}. You will
            receive an application reference number immediately after submission.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white border border-[#e3e7f0] p-6 sm:p-10">
            <FormShell
              action={submitKsmApplication}
              submitLabel="Submit Application"
              note="Your details are kept confidential and used only for admission purposes."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="fullName">
                    Full Name *
                  </label>
                  <input id="fullName" name="fullName" required className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="gender">
                    Gender
                  </label>
                  <select id="gender" name="gender" className="field">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="dateOfBirth">
                    Date of Birth
                  </label>
                  <input id="dateOfBirth" name="dateOfBirth" type="date" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="phone">
                    Phone Number
                  </label>
                  <input id="phone" name="phone" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="whatsapp">
                    WhatsApp Number
                  </label>
                  <input id="whatsapp" name="whatsapp" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="email">
                    Email Address *
                  </label>
                  <input id="email" name="email" type="email" required className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="address">
                    Home Address
                  </label>
                  <input id="address" name="address" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="state">
                    State
                  </label>
                  <input id="state" name="state" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="country">
                    Country
                  </label>
                  <input id="country" name="country" defaultValue="Nigeria" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="church">
                    Church
                  </label>
                  <input id="church" name="church" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="denomination">
                    Denomination
                  </label>
                  <input id="denomination" name="denomination" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="churchRole">
                    Current Church Role
                  </label>
                  <input id="churchRole" name="churchRole" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="programme">
                    Selected Programme / Course
                  </label>
                  <select id="programme" name="programme" className="field">
                    <option value="General Ministry Programme">General Ministry Programme</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="ministryExperience">
                    Ministry Experience
                  </label>
                  <textarea id="ministryExperience" name="ministryExperience" rows={3} className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="motivation">
                    Why do you want to attend KSM?
                  </label>
                  <textarea id="motivation" name="motivation" rows={4} className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="photoUrl">
                    Passport Photograph (image link, optional)
                  </label>
                  <input id="photoUrl" name="photoUrl" placeholder="https://…" className="field" />
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm text-[#4a5468]">
                <input type="checkbox" name="agreement" className="mt-1 h-4 w-4" />
                <span>
                  I declare that the information provided is true, and I commit to participate faithfully in the
                  programme. *
                </span>
              </label>
            </FormShell>
          </div>
        </div>
      </section>
    </div>
  );
}

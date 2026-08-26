import FormShell from "@/components/FormShell";
import { submitVocationalApplication } from "@/app/actions/public";
import { getPublishedVocationalCourses } from "@/lib/queries";
import { PageHero } from "@/components/ui";

export const metadata = { title: "Vocational Training Registration" };
export const dynamic = "force-dynamic";

export default async function VocationalApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const courses = await getPublishedVocationalCourses();

  return (
    <>
      <PageHero
        eyebrow="Skills For Life"
        title="Training Registration"
        subtitle="Tell us about yourself and the skill you would like to learn."
        imageUrl="/images/vocational.jpg"
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4">
          <FormShell action={submitVocationalApplication} submitLabel="Submit Registration">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fullName">
                  Full Name *
                </label>
                <input id="fullName" name="fullName" required className="field" />
              </div>
              <div>
                <label className="label" htmlFor="phone">
                  Phone *
                </label>
                <input id="phone" name="phone" required className="field" />
              </div>
              <div>
                <label className="label" htmlFor="whatsapp">
                  WhatsApp
                </label>
                <input id="whatsapp" name="whatsapp" className="field" />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input id="email" name="email" type="email" className="field" />
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
                <label className="label" htmlFor="ageRange">
                  Age Range
                </label>
                <select id="ageRange" name="ageRange" className="field">
                  <option value="">Select</option>
                  <option>Under 18</option>
                  <option>18 – 25</option>
                  <option>26 – 35</option>
                  <option>36 – 45</option>
                  <option>46 and above</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="employmentStatus">
                  Employment Status
                </label>
                <select id="employmentStatus" name="employmentStatus" className="field">
                  <option value="">Select</option>
                  <option>Student</option>
                  <option>Employed</option>
                  <option>Self-employed</option>
                  <option>Unemployed</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">
                  Address
                </label>
                <input id="address" name="address" className="field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="courseTitle">
                  Selected Training
                </label>
                <select id="courseTitle" name="courseTitle" defaultValue={course || ""} className="field">
                  <option value="">Any / Not sure yet</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                  {course && !courses.some((c) => c.title === course) ? <option value={course}>{course}</option> : null}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="experience">
                  Previous Experience
                </label>
                <textarea id="experience" name="experience" rows={3} className="field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="reason">
                  Why are you applying?
                </label>
                <textarea id="reason" name="reason" rows={4} className="field" />
              </div>
            </div>
          </FormShell>
        </div>
      </section>
    </>
  );
}

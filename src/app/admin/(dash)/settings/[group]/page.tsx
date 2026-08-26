import { notFound } from "next/navigation";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { asc } from "drizzle-orm";
import AdminForm from "@/components/admin/AdminForm";
import ImageField from "@/components/admin/ImageField";
import { saveSettingsAction, createAdminAction } from "@/app/actions/admin";
import { getSetting } from "@/lib/content";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SettingField = { name: string; label: string; type?: "text" | "textarea" | "checkbox" | "image"; help?: string };

const GROUPS: Record<string, { key: string; label: string; intro: string; fields: SettingField[] }> = {
  church: {
    key: "church",
    label: "Church Information",
    intro: "These details appear in the footer, contact page and search results.",
    fields: [
      { name: "name", label: "Church name" },
      { name: "tagline", label: "Tagline" },
      { name: "affiliation", label: "Affiliation line" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "phone", label: "Telephone" },
      { name: "whatsapp", label: "WhatsApp number", help: "Adding this shows the floating WhatsApp button." },
      { name: "email", label: "Email address" },
      { name: "officeHours", label: "Office hours" },
      { name: "mapEmbedUrl", label: "Google Maps embed link" },
      { name: "logoUrl", label: "Church logo", type: "image" },
      { name: "affiliationLogoUrl", label: "C&S Movement Church logo", type: "image" },
      { name: "ksmLogoUrl", label: "KSM logo", type: "image" },
    ],
  },
  social: {
    key: "social",
    label: "Social Media",
    intro: "Leave a box empty to hide that icon from the website.",
    fields: [
      { name: "facebook", label: "Facebook link" },
      { name: "instagram", label: "Instagram link" },
      { name: "youtube", label: "YouTube link" },
      { name: "tiktok", label: "TikTok link" },
      { name: "x", label: "X (Twitter) link" },
      { name: "whatsapp", label: "WhatsApp group / number link" },
    ],
  },
  live: {
    key: "live",
    label: "Live Streaming",
    intro: "Turn the live player on only while a service is streaming.",
    fields: [
      { name: "isLive", label: "We are live right now", type: "checkbox" },
      { name: "youtubeUrl", label: "YouTube live link" },
      { name: "facebookUrl", label: "Facebook live link" },
      { name: "embedUrl", label: "Other embed link" },
      { name: "offlineMessage", label: "Message shown when offline", type: "textarea" },
    ],
  },
  bank: {
    key: "bank",
    label: "Bank Transfer Details",
    intro: "Shown on the giving page. Leave the switch off to hide bank transfer completely.",
    fields: [
      { name: "enabled", label: "Show bank transfer on the giving page", type: "checkbox" },
      { name: "bankName", label: "Bank name" },
      { name: "accountName", label: "Account name" },
      { name: "accountNumber", label: "Account number" },
      { name: "instructions", label: "Instructions for givers", type: "textarea" },
    ],
  },
  seo: {
    key: "seo",
    label: "Search & Sharing",
    intro: "How your website appears on Google and when shared on social media.",
    fields: [
      { name: "title", label: "Website title" },
      { name: "description", label: "Website description", type: "textarea" },
      { name: "ogImage", label: "Sharing image", type: "image" },
    ],
  },
  ksm: {
    key: "ksm",
    label: "KSM Settings",
    intro: "Admission policy and enquiry details for the School of Ministry.",
    fields: [
      { name: "admissionOpen", label: "Admission is currently open", type: "checkbox" },
      { name: "tuitionFree", label: "Show the Tuition Free badge", type: "checkbox" },
      { name: "online", label: "Show the 100% Online badge", type: "checkbox" },
      { name: "enquiryPhones", label: "Enquiry phone numbers" },
      { name: "venue", label: "Venue" },
    ],
  },
};

export default async function SettingsGroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;

  if (group === "paystack") {
    return (
      <div className="space-y-6 max-w-3xl">
        <header>
          <p className="eyebrow">Giving</p>
          <h1 className="display-title mt-2 text-3xl">Paystack</h1>
        </header>
        <div className="bg-white border border-[#e6e2da] p-6 space-y-4 text-sm text-[#3f3831]">
          <p>
            Online card giving is powered by <strong>Paystack</strong>. For security, your secret key is never stored in
            the website content — it is kept in the server environment.
          </p>
          <p>
            Status:{" "}
            <strong className={process.env.PAYSTACK_SECRET_KEY ? "text-[#1f6b3a]" : "text-[#8c2b2b]"}>
              {process.env.PAYSTACK_SECRET_KEY ? "Connected" : "Not yet connected"}
            </strong>
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Ask your web administrator to add PAYSTACK_SECRET_KEY to the server settings.</li>
            <li>
              In your Paystack dashboard, set the webhook address to <code>/api/paystack/webhook</code> on this website.
            </li>
            <li>Until then, givers are guided to use the bank transfer details instead.</li>
          </ol>
        </div>
      </div>
    );
  }

  if (group === "administrators") {
    const user = await getSessionUser();
    const admins = await db
      .select()
      .from(adminUsers)
      .orderBy(asc(adminUsers.id))
      .catch(() => [] as (typeof adminUsers.$inferSelect)[]);

    return (
      <div className="space-y-6 max-w-3xl">
        <header>
          <p className="eyebrow">Settings</p>
          <h1 className="display-title mt-2 text-3xl">Administrators</h1>
          <p className="mt-2 text-sm text-[#6b6156]">
            Super Admin can do everything. Admin manages content and submissions. Editor manages content only (no
            financial settings).
          </p>
        </header>

        <div className="bg-white border border-[#e6e2da] divide-y divide-[#eee9df]">
          {admins.map((a) => (
            <div key={a.id} className="px-5 py-3 flex justify-between text-sm">
              <span>
                {a.name} <span className="text-[#8b8175]">({a.email})</span>
              </span>
              <span className="capitalize text-[#8a6a20]">{a.role.replace("_", " ")}</span>
            </div>
          ))}
        </div>

        {user?.role === "super_admin" ? (
          <div className="bg-white border border-[#e6e2da] p-6">
            <h2 className="font-display text-2xl">Invite a new administrator</h2>
            <div className="mt-5">
              <AdminForm action={createAdminAction} submitLabel="Create Account">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="name">
                      Full name
                    </label>
                    <input id="name" name="name" className="field" required />
                  </div>
                  <div>
                    <label className="label" htmlFor="email">
                      Email address
                    </label>
                    <input id="email" name="email" type="email" className="field" required />
                  </div>
                  <div>
                    <label className="label" htmlFor="password">
                      Temporary password
                    </label>
                    <input id="password" name="password" className="field" required minLength={8} />
                  </div>
                  <div>
                    <label className="label" htmlFor="role">
                      Permission level
                    </label>
                    <select id="role" name="role" className="field" defaultValue="editor">
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </AdminForm>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#6b6156]">Only a Super Admin can add new administrators.</p>
        )}
      </div>
    );
  }

  const config = GROUPS[group];
  if (!config) notFound();
  const values = (await getSetting<Record<string, unknown>>(config.key)) || {};
  const booleans = config.fields.filter((f) => f.type === "checkbox").map((f) => f.name);

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <p className="eyebrow">Settings</p>
        <h1 className="display-title mt-2 text-3xl">{config.label}</h1>
        <p className="mt-2 text-sm text-[#6b6156]">{config.intro}</p>
      </header>

      <div className="bg-white border border-[#e6e2da] p-5 sm:p-8">
        <AdminForm action={saveSettingsAction}>
          <input type="hidden" name="__key" value={config.key} />
          <input type="hidden" name="__booleans" value={booleans.join(",")} />
          <div className="grid gap-5">
            {config.fields.map((f) => {
              const value = values[f.name];
              if (f.type === "checkbox") {
                return (
                  <label key={f.name} className="flex items-center gap-3 text-sm">
                    <input type="checkbox" name={f.name} defaultChecked={value === true} className="h-4 w-4" />
                    {f.label}
                  </label>
                );
              }
              if (f.type === "image") {
                return (
                  <ImageField key={f.name} name={f.name} label={f.label} defaultValue={String(value ?? "")} help={f.help} />
                );
              }
              return (
                <div key={f.name}>
                  <label className="label" htmlFor={`s-${f.name}`}>
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea id={`s-${f.name}`} name={f.name} defaultValue={String(value ?? "")} rows={3} className="field" />
                  ) : (
                    <input id={`s-${f.name}`} name={f.name} defaultValue={String(value ?? "")} className="field" />
                  )}
                  {f.help ? <p className="mt-1 text-xs text-[#8b8175]">{f.help}</p> : null}
                </div>
              );
            })}
          </div>
        </AdminForm>
      </div>
    </div>
  );
}

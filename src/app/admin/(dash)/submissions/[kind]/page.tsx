import { notFound } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import {
  prayerRequests,
  testimonies,
  visitorRequests,
  contactMessages,
  ksmApplications,
  vocationalApplications,
} from "@/db/schema";
import { updateSubmissionStatusAction } from "@/app/actions/admin";
import { formatShortDate } from "@/lib/dates";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CONFIG = {
  prayer: {
    label: "Prayer Requests",
    intro: "Requests sent from the website. Confidential requests are only visible to administrators.",
    statuses: ["New", "Praying", "Follow-up", "Closed"],
  },
  testimonies: {
    label: "Testimonies",
    intro: "Nothing appears on the website until you mark it Approved.",
    statuses: ["pending", "approved", "archived"],
  },
  visitors: {
    label: "Visitor Requests",
    intro: "People planning to worship with us.",
    statuses: ["New", "Contacted", "Welcomed", "Closed"],
  },
  messages: {
    label: "Contact Messages",
    intro: "Messages sent through the contact form.",
    statuses: ["New", "Replied", "Closed"],
  },
  ksm: {
    label: "KSM Applications",
    intro: "Applications to KATARTISMOS School of Ministry.",
    statuses: ["New", "Reviewing", "Accepted", "Waitlisted", "Declined", "Enrolled", "Completed"],
  },
  vocational: {
    label: "Training Registrations",
    intro: "Registrations for vocational and skills programmes.",
    statuses: ["New", "Contacted", "Accepted", "Enrolled", "Completed", "Cancelled"],
  },
} as const;

type Kind = keyof typeof CONFIG;

export default async function SubmissionsPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!(kind in CONFIG)) notFound();
  const key = kind as Kind;
  const config = CONFIG[key];
  const user = await getSessionUser();

  let rows: Record<string, unknown>[] = [];
  try {
    const tables = {
      prayer: prayerRequests,
      testimonies,
      visitors: visitorRequests,
      messages: contactMessages,
      ksm: ksmApplications,
      vocational: vocationalApplications,
    } as const;
    const table = tables[key];
    rows = (await db.select().from(table).orderBy(desc(table.createdAt)).limit(300)) as Record<string, unknown>[];
  } catch {
    rows = [];
  }

  const csvHref = `/api/export/${key}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Engagement</p>
          <h1 className="display-title mt-2 text-3xl">{config.label}</h1>
          <p className="mt-2 text-sm text-[#6b6156] max-w-2xl">{config.intro}</p>
        </div>
        <a href={csvHref} className="btn btn-dark">
          Download CSV
        </a>
      </header>

      <div className="space-y-4">
        {rows.length ? (
          rows.map((row) => {
            const id = Number(row.id);
            const status = String(row.status ?? "New");
            return (
              <article key={id} className="bg-white border border-[#e6e2da] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-xl">
                      {String(row.fullName || row.name || row.donorName || "Anonymous")}
                      {row.reference ? (
                        <span className="ml-2 text-xs uppercase tracking-[0.14em] text-[#8a6a20]">
                          {String(row.reference)}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-[#8b8175]">
                      {formatShortDate(row.createdAt as Date)}
                      {row.email ? ` • ${String(row.email)}` : ""}
                      {row.phone ? ` • ${String(row.phone)}` : ""}
                      {row.contact ? ` • ${String(row.contact)}` : ""}
                    </p>
                  </div>
                  <form action={updateSubmissionStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="__kind" value={key} />
                    <input type="hidden" name="__id" value={id} />
                    <label className="sr-only" htmlFor={`st-${id}`}>
                      Status
                    </label>
                    <select id={`st-${id}`} name="__status" defaultValue={status} className="field !py-1.5 !text-sm">
                      {config.statuses.map((s) => (
                        <option key={s} value={s}>
                          {s === "pending" ? "Awaiting approval" : s === "approved" ? "Approved (live)" : s}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-gold !py-2 !px-3 !text-[0.62rem]">
                      Update
                    </button>
                  </form>
                </div>

                <div className="mt-4 text-sm text-[#3f3831] space-y-1">
                  {key === "prayer" ? (
                    row.confidential && user?.role === "editor" ? (
                      <p className="italic text-[#8b8175]">
                        This request is confidential and only visible to administrators.
                      </p>
                    ) : (
                      <p className="whitespace-pre-line">{String(row.request ?? "")}</p>
                    )
                  ) : null}
                  {key === "testimonies" ? <p className="whitespace-pre-line">{String(row.body ?? "")}</p> : null}
                  {key === "messages" ? (
                    <>
                      <p className="font-semibold">{String(row.subject ?? "")}</p>
                      <p className="whitespace-pre-line">{String(row.message ?? "")}</p>
                    </>
                  ) : null}
                  {key === "visitors" ? (
                    <>
                      <p>
                        Attending: {String(row.attendingCount ?? 1)} •{" "}
                        {row.bringingChildren ? "Bringing children" : "No children"} •{" "}
                        {String(row.preferredService ?? "")}
                      </p>
                      {row.message ? <p className="whitespace-pre-line">{String(row.message)}</p> : null}
                    </>
                  ) : null}
                  {key === "ksm" ? (
                    <div className="grid gap-1 sm:grid-cols-2">
                      <p>Programme: {String(row.programme ?? "—")}</p>
                      <p>Church: {String(row.church ?? "—")}</p>
                      <p>Role: {String(row.churchRole ?? "—")}</p>
                      <p>
                        Location: {String(row.state ?? "")} {String(row.country ?? "")}
                      </p>
                      <p className="sm:col-span-2">Why KSM: {String(row.motivation ?? "—")}</p>
                    </div>
                  ) : null}
                  {key === "vocational" ? (
                    <div className="grid gap-1 sm:grid-cols-2">
                      <p>Training: {String(row.courseTitle ?? "—")}</p>
                      <p>Employment: {String(row.employmentStatus ?? "—")}</p>
                      <p className="sm:col-span-2">Reason: {String(row.reason ?? "—")}</p>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })
        ) : (
          <p className="bg-white border border-[#e6e2da] p-10 text-center text-[#8b8175]">
            Nothing here yet. New submissions will appear on this page.
          </p>
        )}
      </div>
    </div>
  );
}

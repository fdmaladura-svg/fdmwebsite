import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { formatShortDate } from "@/lib/dates";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DonationsPage() {
  const user = await getSessionUser();
  if (user?.role === "editor") {
    return (
      <div className="bg-white border border-[#e6e2da] p-10 text-center">
        <h1 className="display-title text-2xl">Giving records are restricted</h1>
        <p className="mt-3 text-sm text-[#6b6156]">
          Only administrators can view donation records. Please contact your Super Admin if you need access.
        </p>
      </div>
    );
  }

  let rows: (typeof donations.$inferSelect)[] = [];
  let total = 0;
  try {
    rows = await db.select().from(donations).orderBy(desc(donations.createdAt)).limit(300);
    const res = await db
      .select({ total: sql<number>`coalesce(sum(${donations.amount}),0)::int` })
      .from(donations)
      .where(eq(donations.status, "success"));
    total = res[0]?.total ?? 0;
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Giving</p>
          <h1 className="display-title mt-2 text-3xl">Donations</h1>
          <p className="mt-2 text-sm text-[#6b6156]">
            Financial records are permanent and cannot be deleted. Total received:{" "}
            <strong>₦{total.toLocaleString()}</strong>
          </p>
        </div>
        <a href="/api/export/donations" className="btn btn-dark">
          Download CSV
        </a>
      </header>

      <div className="bg-white border border-[#e6e2da] overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-[#faf8f4] text-left">
            <tr>
              {["Date", "Reference", "Giver", "Purpose", "Amount", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-[0.62rem] uppercase tracking-[0.16em] text-[#8b8175]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee9df]">
            {rows.length ? (
              rows.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3">{formatShortDate(d.createdAt)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{d.reference}</td>
                  <td className="px-4 py-3">{d.anonymous ? "Anonymous" : d.donorName || "—"}</td>
                  <td className="px-4 py-3">{d.category}</td>
                  <td className="px-4 py-3">₦{d.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize">{d.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#8b8175]">
                  No giving records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import {
  prayerRequests,
  testimonies,
  visitorRequests,
  contactMessages,
  ksmApplications,
  vocationalApplications,
  donations,
} from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLES = {
  prayer: prayerRequests,
  testimonies,
  visitors: visitorRequests,
  messages: contactMessages,
  ksm: ksmApplications,
  vocational: vocationalApplications,
  donations,
} as const;

function csvEscape(value: unknown) {
  const s = value === null || value === undefined ? "" : String(value);
  return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

export async function GET(_request: Request, context: { params: Promise<{ kind: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { kind } = await context.params;
  const table = TABLES[kind as keyof typeof TABLES];
  if (!table) return NextResponse.json({ error: "Unknown export" }, { status: 404 });
  if (kind === "donations" && user.role === "editor") {
    return NextResponse.json({ error: "Not permitted" }, { status: 403 });
  }

  const rows = (await db.select().from(table).orderBy(desc(table.createdAt)).limit(5000)) as Record<
    string,
    unknown
  >[];
  if (!rows.length) return new NextResponse("No records", { status: 200 });

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${kind}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

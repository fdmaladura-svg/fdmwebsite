import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { SCHEMA_DDL } from "@/lib/schema-ddl";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function tableExists(name: string) {
  const res = await db.execute(sql`select to_regclass('public.' || ${name}) as t`);
  return (res.rows as { t: string | null }[])[0]?.t != null;
}

function describeError(error: unknown) {
  const e = error as { message?: string; cause?: { message?: string; code?: string }; code?: string };
  const parts = [e?.cause?.code, e?.cause?.message, e?.message].filter(Boolean);
  return parts.join(" | ").slice(0, 500);
}

export async function GET() {
  try {
    const ready = await tableExists("admin_users");
    return NextResponse.json({ ok: true, ready });
  } catch (error) {
    console.error("setup GET failed", error);
    return NextResponse.json(
      { ok: false, ready: false, error: describeError(error) },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const expected = process.env.DATABASE_SETUP_TOKEN;
  const token = request.headers.get("x-setup-token");
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const ready = await tableExists("admin_users");
    if (ready) {
      return NextResponse.json({ ok: true, alreadyConfigured: true, message: "Schema already exists." });
    }
    await db.execute(sql.raw(SCHEMA_DDL));
    const counts = await seedDatabase();
    return NextResponse.json({ ok: true, alreadyConfigured: false, counts });
  } catch (error) {
    console.error("Database setup failed", error);
    return NextResponse.json(
      { ok: false, error: describeError(error) },
      { status: 500 },
    );
  }
}

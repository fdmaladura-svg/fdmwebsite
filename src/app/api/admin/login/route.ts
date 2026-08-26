import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { createSessionToken, hashPassword, SESSION_COOKIE, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureDefaultAdmins() {
  const result = await db.execute(sql`select count(*)::int as c from admin_users`);
  const count = Number((result.rows as { c: number }[])[0]?.c ?? 0);
  if (count > 0) return;

  await db.insert(adminUsers).values([
    {
      name: "Church Administrator",
      email: "admin@faithdynamite.org",
      passwordHash: hashPassword("FaithDynamite2026!"),
      role: "super_admin",
      active: true,
    },
    {
      name: "Content Editor",
      email: "editor@faithdynamite.org",
      passwordHash: hashPassword("Editor2026!"),
      role: "editor",
      active: true,
    },
  ]);
}

function redirectWithError(request: Request, message: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectWithError(request, "Please submit the login form again.");
  }

  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  if (!email || !password) {
    return redirectWithError(request, "Please enter your email address and password.");
  }

  try {
    await ensureDefaultAdmins();
    const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    const user = rows[0];

    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return redirectWithError(request, "That email or password is not correct. Please try again.");
    }

    const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return redirectWithError(
      request,
      "The admin system is not ready yet. Please refresh and try again, or ask the web administrator to run the database setup.",
    );
  }
}

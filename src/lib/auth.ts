import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SESSION_COOKIE = "fdm_session";
const COOKIE = SESSION_COOKIE;
const SECRET = process.env.SESSION_SECRET || "faith-dynamite-dev-secret-change-me";

export type Role = "super_admin" | "admin" | "editor";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, s, 64).toString("hex");
  return `${s}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSessionToken(userId: number) {
  const payload = `${userId}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export async function createSession(userId: number) {
  const token = createSessionToken(userId);
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE)?.value;
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [id, issued, sig] = parts;
    if (sign(`${id}.${issued}`) !== sig) return null;
    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, Number(id)))
      .limit(1);
    const user = rows[0];
    if (!user || !user.active) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
  } catch {
    return null;
  }
}

export function canManageFinance(role: Role) {
  return role === "super_admin" || role === "admin";
}

export function canManageAdmins(role: Role) {
  return role === "super_admin";
}

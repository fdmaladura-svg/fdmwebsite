"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  adminUsers,
  pageSections,
  prayerRequests,
  testimonies,
  visitorRequests,
  contactMessages,
  ksmApplications,
  vocationalApplications,
  mediaLibrary,
} from "@/db/schema";
import { getResource, slugify, type Field } from "@/lib/admin/resources";
import {
  createSession,
  destroySession,
  getSessionUser,
  hashPassword,
  verifyPassword,
  canManageAdmins,
} from "@/lib/auth";
import { saveSetting } from "@/lib/content";
import type { FormResult } from "@/components/FormShell";

async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function loginAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  if (!email || !password) return { ok: false, message: "Please enter your email and password." };
  try {
    const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    const user = rows[0];
    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return { ok: false, message: "That email or password is not correct. Please try again." };
    }
    await createSession(user.id);
  } catch {
    return { ok: false, message: "We could not sign you in right now. Please try again." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

function coerce(field: Field, fd: FormData): unknown {
  const raw = fd.get(field.name);
  switch (field.type) {
    case "checkbox":
      return raw === "on" || raw === "true";
    case "number": {
      const v = String(raw ?? "").trim();
      return v === "" ? null : Number(v);
    }
    case "date": {
      const v = String(raw ?? "").trim();
      return v === "" ? null : v;
    }
    default: {
      const v = typeof raw === "string" ? raw.trim() : "";
      return v === "" ? null : v;
    }
  }
}

export async function saveResourceAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  await requireUser();
  const key = String(fd.get("__resource") || "");
  const idRaw = String(fd.get("__id") || "");
  const resource = getResource(key);
  if (!resource) return { ok: false, message: "That content type could not be found." };

  const values: Record<string, unknown> = {};
  for (const field of resource.fields) {
    values[field.name] = coerce(field, fd);
    if (field.required && (values[field.name] === null || values[field.name] === "")) {
      return { ok: false, message: `Please fill in “${field.label}”.` };
    }
  }

  // Special handling: day of week is stored as a number
  if (typeof values.dayOfWeek === "string") values.dayOfWeek = Number(values.dayOfWeek);

  if (resource.slugFrom && !values.slug) {
    const base = String(values[resource.slugFrom] || "item");
    values.slug = `${slugify(base)}`;
  }
  values.updatedAt = new Date();

  try {
    if (idRaw) {
      await db
        .update(resource.table)
        .set(values as never)
        .where(eq(resource.idCol, Number(idRaw)));
    } else {
      await db.insert(resource.table).values(values as never);
    }
  } catch {
    return {
      ok: false,
      message: "We could not save this. If you set a web address, make sure it is not already used by another item.",
    };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Changes saved successfully." };
}

export async function deleteResourceAction(fd: FormData) {
  await requireUser();
  const key = String(fd.get("__resource") || "");
  const id = Number(fd.get("__id"));
  const resource = getResource(key);
  if (!resource || !id) return;
  try {
    if (resource.hasStatus) {
      await db
        .update(resource.table)
        .set({ status: "archived", updatedAt: new Date() } as never)
        .where(eq(resource.idCol, id));
    } else {
      await db.delete(resource.table).where(eq(resource.idCol, id));
    }
  } catch {
    // ignore
  }
  revalidatePath("/", "layout");
  redirect(`/admin/content/${key}`);
}

export async function duplicateResourceAction(fd: FormData) {
  await requireUser();
  const key = String(fd.get("__resource") || "");
  const id = Number(fd.get("__id"));
  const resource = getResource(key);
  if (!resource || !id) return;
  try {
    const rows = (await db.select().from(resource.table).where(eq(resource.idCol, id)).limit(1)) as Record<
      string,
      unknown
    >[];
    const row = rows[0];
    if (row) {
      const copy: Record<string, unknown> = { ...row };
      delete copy.id;
      delete copy.createdAt;
      delete copy.updatedAt;
      if (typeof copy.slug === "string") copy.slug = `${copy.slug}-copy-${Date.now().toString().slice(-4)}`;
      const titleField = resource.titleField;
      if (typeof copy[titleField] === "string") copy[titleField] = `${copy[titleField]} (copy)`;
      if (resource.hasStatus) copy.status = "draft";
      await db.insert(resource.table).values(copy as never);
    }
  } catch {
    // ignore
  }
  revalidatePath("/", "layout");
  redirect(`/admin/content/${key}`);
}

export async function setStatusAction(fd: FormData) {
  await requireUser();
  const key = String(fd.get("__resource") || "");
  const id = Number(fd.get("__id"));
  const status = String(fd.get("__status") || "published");
  const resource = getResource(key);
  if (!resource || !id) return;
  try {
    await db
      .update(resource.table)
      .set({ status, updatedAt: new Date() } as never)
      .where(eq(resource.idCol, id));
  } catch {
    // ignore
  }
  revalidatePath("/", "layout");
}

export async function saveSectionAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  await requireUser();
  const id = Number(fd.get("__id"));
  if (!id) return { ok: false, message: "This section could not be found." };
  const text = (name: string) => {
    const v = fd.get(name);
    return typeof v === "string" ? v : null;
  };
  try {
    await db
      .update(pageSections)
      .set({
        eyebrow: text("eyebrow"),
        title: text("title"),
        subtitle: text("subtitle"),
        body: text("body"),
        imageUrl: text("imageUrl"),
        ctaLabel: text("ctaLabel"),
        ctaUrl: text("ctaUrl"),
        cta2Label: text("cta2Label"),
        cta2Url: text("cta2Url"),
        visible: fd.get("visible") === "on",
        sortOrder: Number(fd.get("sortOrder") || 0),
        updatedAt: new Date(),
      })
      .where(eq(pageSections.id, id));
  } catch {
    return { ok: false, message: "We could not save this section. Please try again." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Your page is now live with the new content." };
}

export async function saveSettingsAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  const user = await requireUser();
  const key = String(fd.get("__key") || "");
  const boolFields = String(fd.get("__booleans") || "")
    .split(",")
    .filter(Boolean);
  if (!key) return { ok: false, message: "Unknown settings group." };
  if ((key === "bank" || key === "paystack") && user.role === "editor") {
    return { ok: false, message: "Only administrators can change financial settings." };
  }

  const value: Record<string, unknown> = {};
  for (const [name, raw] of fd.entries()) {
    if (name.startsWith("__")) continue;
    value[name] = typeof raw === "string" ? raw : "";
  }
  for (const b of boolFields) value[b] = fd.get(b) === "on";

  try {
    await saveSetting(key, value);
  } catch {
    return { ok: false, message: "We could not save these settings. Please try again." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Changes saved successfully." };
}

const SUBMISSION_TABLES = {
  prayer: prayerRequests,
  testimonies: testimonies,
  visitors: visitorRequests,
  messages: contactMessages,
  ksm: ksmApplications,
  vocational: vocationalApplications,
} as const;

export async function updateSubmissionStatusAction(fd: FormData) {
  await requireUser();
  const kind = String(fd.get("__kind") || "") as keyof typeof SUBMISSION_TABLES;
  const id = Number(fd.get("__id"));
  const status = String(fd.get("__status") || "");
  const table = SUBMISSION_TABLES[kind];
  if (!table || !id || !status) return;
  try {
    await db
      .update(table)
      .set({ status, updatedAt: new Date() } as never)
      .where(eq((table as typeof prayerRequests).id, id));
  } catch {
    // ignore
  }
  revalidatePath("/admin", "layout");
}

export async function createAdminAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  const user = await requireUser();
  if (!canManageAdmins(user.role)) {
    return { ok: false, message: "Only a Super Admin can invite new administrators." };
  }
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const role = String(fd.get("role") || "editor");
  if (!name || !email || password.length < 8) {
    return { ok: false, message: "Please provide a name, email and a password of at least 8 characters." };
  }
  try {
    await db.insert(adminUsers).values({ name, email, passwordHash: hashPassword(password), role });
  } catch {
    return { ok: false, message: "That email address may already be in use." };
  }
  revalidatePath("/admin/settings/administrators");
  return { ok: true, message: "The new administrator can now sign in." };
}

export async function deleteMediaAction(fd: FormData) {
  await requireUser();
  const id = Number(fd.get("__id"));
  if (!id) return;
  try {
    await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id));
  } catch {
    // ignore
  }
  revalidatePath("/admin/media");
}

export async function updateMediaAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  await requireUser();
  const id = Number(fd.get("__id"));
  if (!id) return { ok: false, message: "Media item not found." };
  try {
    await db
      .update(mediaLibrary)
      .set({
        altText: String(fd.get("altText") || ""),
        caption: String(fd.get("caption") || ""),
        updatedAt: new Date(),
      })
      .where(eq(mediaLibrary.id, id));
  } catch {
    return { ok: false, message: "We could not update this image." };
  }
  revalidatePath("/admin/media");
  return { ok: true, message: "Changes saved successfully." };
}

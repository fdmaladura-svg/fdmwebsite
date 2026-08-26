import type { MetadataRoute } from "next";
import { db } from "@/db";
import { events, sermons, devotionals, ministries, galleryAlbums } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://faithdynamiteministries.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/worship",
    "/ministries",
    "/events",
    "/sermons",
    "/voice-of-mercy",
    "/gallery",
    "/school-of-ministry",
    "/school-of-ministry/apply",
    "/vocational-training",
    "/vocational-training/apply",
    "/give",
    "/contact",
    "/plan-your-visit",
    "/prayer-request",
    "/testimonies",
    "/watch-live",
    "/doxa",
  ].map((p) => ({ url: `${BASE}${p}`, lastModified: new Date() }));

  try {
    const [ev, sm, dv, mn, ga] = await Promise.all([
      db.select({ slug: events.slug }).from(events).where(eq(events.status, "published")),
      db.select({ slug: sermons.slug }).from(sermons).where(eq(sermons.status, "published")),
      db.select({ slug: devotionals.slug }).from(devotionals).where(eq(devotionals.status, "published")),
      db.select({ slug: ministries.slug }).from(ministries).where(eq(ministries.status, "published")),
      db.select({ slug: galleryAlbums.slug }).from(galleryAlbums).where(eq(galleryAlbums.status, "published")),
    ]);
    return [
      ...staticPaths,
      ...ev.map((r) => ({ url: `${BASE}/events/${r.slug}`, lastModified: new Date() })),
      ...sm.map((r) => ({ url: `${BASE}/sermons/${r.slug}`, lastModified: new Date() })),
      ...dv.map((r) => ({ url: `${BASE}/voice-of-mercy/${r.slug}`, lastModified: new Date() })),
      ...mn.map((r) => ({ url: `${BASE}/ministries/${r.slug}`, lastModified: new Date() })),
      ...ga.map((r) => ({ url: `${BASE}/gallery/${r.slug}`, lastModified: new Date() })),
    ];
  } catch {
    return staticPaths;
  }
}

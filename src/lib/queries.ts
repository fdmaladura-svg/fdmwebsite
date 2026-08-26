import { db } from "@/db";
import {
  navigationItems,
  serviceSchedules,
  events,
  sermons,
  devotionals,
  ministries,
  galleryAlbums,
  galleryMedia,
  testimonies,
  announcements,
  givingCategories,
  ksmCourses,
  vocationalCourses,
  leaders,
} from "@/db/schema";
import { and, asc, desc, eq, gte, lte, or, isNull, sql } from "drizzle-orm";
import { nextOccurrence, toISODate } from "./dates";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export function getNav(location: "header" | "footer") {
  return safe(
    () =>
      db
        .select()
        .from(navigationItems)
        .where(and(eq(navigationItems.location, location), eq(navigationItems.visible, true)))
        .orderBy(asc(navigationItems.sortOrder)),
    [],
  );
}

export function getSchedules() {
  return safe(
    () =>
      db
        .select()
        .from(serviceSchedules)
        .where(eq(serviceSchedules.published, true))
        .orderBy(asc(serviceSchedules.sortOrder)),
    [],
  );
}

export function getAnnouncements() {
  return safe(
    () =>
      db
        .select()
        .from(announcements)
        .where(eq(announcements.active, true))
        .orderBy(asc(announcements.sortOrder)),
    [],
  );
}

const publishedEvent = () =>
  and(
    eq(events.status, "published"),
    or(isNull(events.publishAt), lte(events.publishAt, new Date())),
  );

export function getUpcomingEvents(limit = 6) {
  const today = toISODate(new Date());
  return safe(
    () =>
      db
        .select()
        .from(events)
        .where(
          and(
            publishedEvent(),
            or(gte(events.startDate, today), gte(sql`coalesce(${events.endDate}, ${events.startDate})`, today)),
          ),
        )
        .orderBy(asc(events.startDate))
        .limit(limit),
    [],
  );
}

export function getPastEvents(limit = 24) {
  const today = toISODate(new Date());
  return safe(
    () =>
      db
        .select()
        .from(events)
        .where(and(publishedEvent(), lte(sql`coalesce(${events.endDate}, ${events.startDate})`, today)))
        .orderBy(desc(events.startDate))
        .limit(limit),
    [],
  );
}

export function getFeaturedProgrammes(limit = 3) {
  return safe(
    () =>
      db
        .select()
        .from(events)
        .where(and(publishedEvent(), eq(events.isProgramme, true)))
        .orderBy(desc(events.featured), asc(events.startDate))
        .limit(limit),
    [],
  );
}

export function getLatestSermons(limit = 3) {
  return safe(
    () =>
      db
        .select()
        .from(sermons)
        .where(eq(sermons.status, "published"))
        .orderBy(desc(sermons.sermonDate))
        .limit(limit),
    [],
  );
}

export function getLatestDevotionals(limit = 3) {
  return safe(
    () =>
      db
        .select()
        .from(devotionals)
        .where(eq(devotionals.status, "published"))
        .orderBy(desc(devotionals.publishDate))
        .limit(limit),
    [],
  );
}

export function getMinistries(limit?: number) {
  return safe(async () => {
    const q = db
      .select()
      .from(ministries)
      .where(eq(ministries.status, "published"))
      .orderBy(asc(ministries.sortOrder));
    return limit ? q.limit(limit) : q;
  }, []);
}

export function getLeaders() {
  return safe(
    () => db.select().from(leaders).where(eq(leaders.status, "published")).orderBy(asc(leaders.sortOrder)),
    [],
  );
}

export function getAlbums(limit?: number) {
  return safe(async () => {
    const q = db
      .select()
      .from(galleryAlbums)
      .where(eq(galleryAlbums.status, "published"))
      .orderBy(asc(galleryAlbums.sortOrder));
    return limit ? q.limit(limit) : q;
  }, []);
}

export function getAlbumMedia(albumId: number) {
  return safe(
    () =>
      db
        .select()
        .from(galleryMedia)
        .where(eq(galleryMedia.albumId, albumId))
        .orderBy(asc(galleryMedia.sortOrder)),
    [],
  );
}

export function getRecentMedia(limit = 8) {
  return safe(
    () => db.select().from(galleryMedia).orderBy(desc(galleryMedia.createdAt)).limit(limit),
    [],
  );
}

export function getApprovedTestimonies(limit = 6) {
  return safe(
    () =>
      db
        .select()
        .from(testimonies)
        .where(eq(testimonies.status, "approved"))
        .orderBy(desc(testimonies.createdAt))
        .limit(limit),
    [],
  );
}

export function getGivingCategories() {
  return safe(
    () =>
      db
        .select()
        .from(givingCategories)
        .where(eq(givingCategories.active, true))
        .orderBy(asc(givingCategories.sortOrder)),
    [],
  );
}

export function getKsmCourses() {
  return safe(
    () => db.select().from(ksmCourses).where(eq(ksmCourses.active, true)).orderBy(asc(ksmCourses.sortOrder)),
    [],
  );
}

export function getPublishedVocationalCourses() {
  return safe(
    () =>
      db
        .select()
        .from(vocationalCourses)
        .where(eq(vocationalCourses.status, "published"))
        .orderBy(asc(vocationalCourses.sortOrder)),
    [],
  );
}

export type NextServiceInfo = {
  title: string;
  dayLabel: string;
  timeLabel: string;
  description: string | null;
  when: string; // ISO
};

export async function getNextService(): Promise<NextServiceInfo | null> {
  const schedules = await getSchedules();
  if (!schedules.length) return null;
  const upcoming = schedules
    .map((s) => ({
      s,
      when: nextOccurrence({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, frequency: s.frequency }),
    }))
    .sort((a, b) => a.when.getTime() - b.when.getTime())[0];
  return {
    title: upcoming.s.title,
    dayLabel: upcoming.s.dayLabel,
    timeLabel: upcoming.s.timeLabel,
    description: upcoming.s.description,
    when: upcoming.when.toISOString(),
  };
}

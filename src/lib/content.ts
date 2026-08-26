import { db } from "@/db";
import { settings, pageSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export type ChurchInfo = {
  name: string;
  affiliation: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  mapEmbedUrl: string;
  logoUrl: string;
  affiliationLogoUrl: string;
  ksmLogoUrl: string;
};

export type SocialLinks = {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
  x: string;
};

export type LiveSettings = {
  isLive: boolean;
  youtubeUrl: string;
  facebookUrl: string;
  embedUrl: string;
  offlineMessage: string;
};

export type BankSettings = {
  enabled: boolean;
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
};

export type SeoSettings = {
  title: string;
  description: string;
  ogImage: string;
};

export type KsmSettings = {
  admissionOpen: boolean;
  tuitionFree: boolean;
  online: boolean;
  enquiryPhones: string;
  venue: string;
};

const DEFAULTS: Record<string, unknown> = {
  church: {
    name: "Faith Dynamite Ministries (Aladura)",
    affiliation: "A member of Cherubim and Seraphim Movement Church (Ayo Ni O)",
    tagline: "Where Faith Works Wonders",
    address: "",
    phone: "0707 000 0336",
    whatsapp: "08035707000",
    email: "",
    officeHours: "Monday – Friday, 9:00 AM – 4:00 PM",
    mapEmbedUrl: "",
    logoUrl: "/images/fdm-logo.png",
    affiliationLogoUrl: "/images/cs-logo.png",
    ksmLogoUrl: "/images/ksm-logo.png",
  } satisfies ChurchInfo,
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    whatsapp: "",
    x: "",
  } satisfies SocialLinks,
  live: {
    isLive: false,
    youtubeUrl: "",
    facebookUrl: "",
    embedUrl: "",
    offlineMessage:
      "We're currently offline. Watch our latest message while you wait.",
  } satisfies LiveSettings,
  bank: {
    enabled: true,
    bankName: "To be provided by the church administrator",
    accountName: "To be provided by the church administrator",
    accountNumber: "To be provided by the church administrator",
    instructions:
      "Please use your full name and giving purpose as the transfer narration, then send your proof of payment to the church office.",
  } satisfies BankSettings,
  seo: {
    title: "Faith Dynamite Ministries (Aladura) — Where Faith Works Wonders",
    description:
      "Faith Dynamite Ministries (Aladura), a member of Cherubim and Seraphim Movement Church (Ayo Ni O). Worship, prayer, biblical teaching, ministry training and empowerment.",
    ogImage: "/images/hero-worship.jpg",
  } satisfies SeoSettings,
  ksm: {
    admissionOpen: true,
    tuitionFree: true,
    online: true,
    enquiryPhones: "0707 000 0336, 0803 570 7000",
    venue: "Online (Global Access)",
  } satisfies KsmSettings,
};

export async function getSetting<T>(key: string): Promise<T> {
  try {
    const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    if (rows[0]) {
      return { ...(DEFAULTS[key] as object), ...(rows[0].value as object) } as T;
    }
  } catch {
    // database may not be ready — fall back to defaults
  }
  return DEFAULTS[key] as T;
}

export async function saveSetting(key: string, value: unknown) {
  const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  if (existing[0]) {
    await db
      .update(settings)
      .set({ value: value as object, updatedAt: new Date() })
      .where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value: value as object });
  }
}

export type Section = typeof pageSections.$inferSelect;

export async function getSections(page: string): Promise<Record<string, Section>> {
  try {
    const rows = await db
      .select()
      .from(pageSections)
      .where(eq(pageSections.page, page))
      .orderBy(asc(pageSections.sortOrder));
    return Object.fromEntries(rows.map((r) => [r.sectionKey, r]));
  } catch {
    return {};
  }
}

export function sectionText(
  sections: Record<string, Section>,
  key: string,
  field: keyof Section,
  fallback = "",
): string {
  const value = sections[key]?.[field];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function sectionVisible(sections: Record<string, Section>, key: string) {
  const s = sections[key];
  return s ? s.visible : true;
}

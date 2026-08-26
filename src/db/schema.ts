import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
} from "drizzle-orm/pg-core";

const ts = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"), // super_admin | admin | editor
  active: boolean("active").notNull().default(true),
  ...ts,
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pageSections = pgTable("page_sections", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(), // home, about, give, visit ...
  sectionKey: text("section_key").notNull(),
  label: text("label").notNull(),
  eyebrow: text("eyebrow"),
  title: text("title"),
  subtitle: text("subtitle"),
  body: text("body"),
  imageUrl: text("image_url"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  cta2Label: text("cta2_label"),
  cta2Url: text("cta2_url"),
  extra: jsonb("extra").$type<Record<string, unknown>>().default({}),
  visible: boolean("visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...ts,
});

export const navigationItems = pgTable("navigation_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  location: text("location").notNull().default("header"), // header | footer
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...ts,
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  linkUrl: text("link_url"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...ts,
});

export const serviceSchedules = pgTable("service_schedules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  dayOfWeek: integer("day_of_week").notNull().default(0), // 0=Sunday
  startTime: text("start_time").notNull().default("09:00"),
  timeLabel: text("time_label").notNull().default("9:00 AM"),
  dayLabel: text("day_label").notNull().default("Sunday"),
  frequency: text("frequency").notNull().default("weekly"), // weekly | first_dow | second_last_friday | monthly
  description: text("description"),
  icon: text("icon").default("church"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...ts,
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull().default("Event"),
  summary: text("summary"),
  description: text("description"),
  bannerUrl: text("banner_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  venue: text("venue"),
  locationType: text("location_type").notNull().default("onsite"), // onsite | online | hybrid
  mapUrl: text("map_url"),
  streamUrl: text("stream_url"),
  registrationUrl: text("registration_url"),
  speaker: text("speaker"),
  theme: text("theme"),
  scripture: text("scripture"),
  contactInfo: text("contact_info"),
  recurrence: text("recurrence").notNull().default("none"),
  isProgramme: boolean("is_programme").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("published"), // draft | published | archived
  publishAt: timestamp("publish_at", { withTimezone: true }),
  ...ts,
});

export const ministries = pgTable("ministries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").default("Ministry"),
  description: text("description"),
  body: text("body"),
  leader: text("leader"),
  meetingInfo: text("meeting_info"),
  imageUrl: text("image_url"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  ...ts,
});

export const leaders = pgTable("leaders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"),
  shortBio: text("short_bio"),
  fullBio: text("full_bio"),
  photoUrl: text("photo_url"),
  socials: jsonb("socials").$type<Record<string, string>>().default({}),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  ...ts,
});

export const sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  speaker: text("speaker"),
  sermonDate: date("sermon_date").notNull(),
  scripture: text("scripture"),
  series: text("series"),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  audioUrl: text("audio_url"),
  videoUrl: text("video_url"),
  allowDownload: boolean("allow_download").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("published"),
  ...ts,
});

export const devotionals = pgTable("devotionals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  scripture: text("scripture"),
  excerpt: text("excerpt"),
  body: text("body"),
  imageUrl: text("image_url"),
  speaker: text("speaker").default("Prophetess Temitope Afolabi-Adebisi (AjaraEmi)"),
  category: text("category").notNull().default("Prophecy"),
  audioUrl: text("audio_url"),
  videoUrl: text("video_url"),
  publishDate: date("publish_date").notNull(),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("published"),
  ...ts,
});

export const galleryAlbums = pgTable("gallery_albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  coverUrl: text("cover_url"),
  albumDate: date("album_date"),
  eventSlug: text("event_slug"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  ...ts,
});

export const galleryMedia = pgTable("gallery_media", {
  id: serial("id").primaryKey(),
  albumId: integer("album_id").notNull(),
  url: text("url").notNull(),
  mediaType: text("media_type").notNull().default("image"),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...ts,
});

export const mediaLibrary = pgTable("media_library", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  altText: text("alt_text"),
  caption: text("caption"),
  ...ts,
});

export const ksmCourses = pgTable("ksm_courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  instructor: text("instructor"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...ts,
});

export const ksmInstructors = pgTable("ksm_instructors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...ts,
});

export const ksmApplications = pgTable("ksm_applications", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  fullName: text("full_name").notNull(),
  gender: text("gender"),
  dateOfBirth: text("date_of_birth"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  address: text("address"),
  state: text("state"),
  country: text("country"),
  church: text("church"),
  denomination: text("denomination"),
  churchRole: text("church_role"),
  ministryExperience: text("ministry_experience"),
  motivation: text("motivation"),
  programme: text("programme"),
  photoUrl: text("photo_url"),
  status: text("status").notNull().default("New"),
  adminNotes: text("admin_notes"),
  ...ts,
});

export const vocationalCourses = pgTable("vocational_courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  instructor: text("instructor"),
  duration: text("duration"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  schedule: text("schedule"),
  venue: text("venue"),
  capacity: integer("capacity"),
  registrationDeadline: date("registration_deadline"),
  isFree: boolean("is_free").notNull().default(true),
  fee: integer("fee").default(0),
  requirements: text("requirements"),
  certificate: boolean("certificate").notNull().default(true),
  registrationOpen: boolean("registration_open").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("draft"),
  ...ts,
});

export const vocationalInstructors = pgTable("vocational_instructors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...ts,
});

export const vocationalApplications = pgTable("vocational_applications", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  gender: text("gender"),
  ageRange: text("age_range"),
  address: text("address"),
  courseTitle: text("course_title"),
  experience: text("experience"),
  employmentStatus: text("employment_status"),
  reason: text("reason"),
  status: text("status").notNull().default("New"),
  ...ts,
});

export const givingCategories = pgTable("giving_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...ts,
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  donorName: text("donor_name"),
  email: text("email"),
  phone: text("phone"),
  amount: integer("amount").notNull(), // Naira
  category: text("category"),
  note: text("note"),
  anonymous: boolean("anonymous").notNull().default(false),
  method: text("method").notNull().default("paystack"),
  status: text("status").notNull().default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  ...ts,
});

export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  name: text("name"),
  contact: text("contact"),
  request: text("request").notNull(),
  confidential: boolean("confidential").notNull().default(false),
  status: text("status").notNull().default("New"),
  ...ts,
});

export const testimonies = pgTable("testimonies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  body: text("body").notNull(),
  photoUrl: text("photo_url"),
  videoUrl: text("video_url"),
  permission: boolean("permission").notNull().default(false),
  status: text("status").notNull().default("pending"), // pending | approved | archived
  ...ts,
});

export const visitorRequests = pgTable("visitor_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  attendingCount: integer("attending_count").default(1),
  bringingChildren: boolean("bringing_children").notNull().default(false),
  preferredService: text("preferred_service"),
  message: text("message"),
  status: text("status").notNull().default("New"),
  ...ts,
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("New"),
  ...ts,
});

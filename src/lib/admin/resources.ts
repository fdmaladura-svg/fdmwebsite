import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import {
  events,
  sermons,
  devotionals,
  ministries,
  leaders,
  serviceSchedules,
  announcements,
  navigationItems,
  galleryAlbums,
  galleryMedia,
  ksmCourses,
  ksmInstructors,
  vocationalCourses,
  vocationalInstructors,
  givingCategories,
} from "@/db/schema";

export type FieldType =
  | "text"
  | "textarea"
  | "longtext"
  | "number"
  | "date"
  | "time"
  | "checkbox"
  | "select"
  | "image";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  required?: boolean;
  full?: boolean;
};

export type Resource = {
  key: string;
  label: string;
  singular: string;
  intro: string;
  table: PgTable;
  idCol: PgColumn;
  orderCol: PgColumn;
  orderDir: "asc" | "desc";
  titleField: string;
  slugFrom?: string;
  listFields: { name: string; label: string }[];
  fields: Field[];
  hasStatus?: boolean;
  publicPath?: (row: Record<string, unknown>) => string;
};

const STATUS: Field = {
  name: "status",
  label: "Visibility",
  type: "select",
  options: ["published", "draft", "archived"],
  help: "Published means visitors can see it. Draft keeps it hidden until you are ready.",
};

export const RESOURCES: Record<string, Resource> = {
  events: {
    key: "events",
    label: "Events & Programmes",
    singular: "Event",
    intro: "Everything on the church calendar — services, programmes and special gatherings.",
    table: events,
    idCol: events.id,
    orderCol: events.startDate,
    orderDir: "desc",
    titleField: "title",
    slugFrom: "title",
    hasStatus: true,
    publicPath: (row) => `/events/${row.slug as string}`,
    listFields: [
      { name: "title", label: "Title" },
      { name: "startDate", label: "Start date" },
      { name: "category", label: "Category" },
      { name: "status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Event title", type: "text", required: true, full: true },
      { name: "slug", label: "Web address (leave blank to create automatically)", type: "text", full: true },
      { name: "category", label: "Category", type: "text", help: "e.g. Annual Programme, Quarterly Programme, Service" },
      {
        name: "recurrence",
        label: "How often does it repeat?",
        type: "select",
        options: ["none", "weekly", "monthly", "first_sunday", "second_friday", "last_friday", "quarterly", "annual", "custom"],
      },
      { name: "summary", label: "Short summary (shown on cards)", type: "textarea", full: true },
      { name: "description", label: "Full description", type: "longtext", full: true },
      { name: "bannerUrl", label: "Banner image", type: "image", full: true },
      { name: "startDate", label: "Start date", type: "date", required: true },
      { name: "endDate", label: "End date", type: "date" },
      { name: "startTime", label: "Start time", type: "time" },
      { name: "endTime", label: "End time", type: "time" },
      { name: "venue", label: "Venue", type: "text" },
      { name: "locationType", label: "Where does it hold?", type: "select", options: ["onsite", "online", "hybrid"] },
      { name: "mapUrl", label: "Google Maps link", type: "text" },
      { name: "streamUrl", label: "Live stream link", type: "text" },
      { name: "registrationUrl", label: "Registration link", type: "text" },
      { name: "speaker", label: "Minister / Speaker", type: "text" },
      { name: "theme", label: "Theme", type: "text" },
      { name: "scripture", label: "Scripture", type: "text" },
      { name: "contactInfo", label: "Contact for this event", type: "text" },
      { name: "isProgramme", label: "This is a major programme", type: "checkbox" },
      { name: "featured", label: "Show this event on the homepage", type: "checkbox" },
      STATUS,
    ],
  },
  sermons: {
    key: "sermons",
    label: "Sermons",
    singular: "Sermon",
    intro: "Messages preached in the ministry, with audio and video links.",
    table: sermons,
    idCol: sermons.id,
    orderCol: sermons.sermonDate,
    orderDir: "desc",
    titleField: "title",
    slugFrom: "title",
    hasStatus: true,
    publicPath: (row) => `/sermons/${row.slug as string}`,
    listFields: [
      { name: "title", label: "Title" },
      { name: "speaker", label: "Speaker" },
      { name: "sermonDate", label: "Date" },
      { name: "status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Sermon title", type: "text", required: true, full: true },
      { name: "slug", label: "Web address (optional)", type: "text", full: true },
      { name: "speaker", label: "Speaker", type: "text" },
      { name: "sermonDate", label: "Date preached", type: "date", required: true },
      { name: "scripture", label: "Scripture", type: "text" },
      { name: "series", label: "Series", type: "text" },
      { name: "description", label: "Description", type: "longtext", full: true },
      { name: "thumbnailUrl", label: "Thumbnail image", type: "image", full: true },
      { name: "videoUrl", label: "Video link (YouTube or Facebook)", type: "text", full: true },
      { name: "audioUrl", label: "Audio link (MP3)", type: "text", full: true },
      { name: "allowDownload", label: "Allow visitors to download the audio", type: "checkbox" },
      { name: "featured", label: "Feature this message", type: "checkbox" },
      STATUS,
    ],
  },
  devotionals: {
    key: "devotionals",
    label: "Voice of Mercy",
    singular: "Voice of Mercy post",
    intro: "Prophetic devotionals, declarations and messages of mercy.",
    table: devotionals,
    idCol: devotionals.id,
    orderCol: devotionals.publishDate,
    orderDir: "desc",
    titleField: "title",
    slugFrom: "title",
    hasStatus: true,
    publicPath: (row) => `/voice-of-mercy/${row.slug as string}`,
    listFields: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "publishDate", label: "Publish date" },
      { name: "status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "slug", label: "Web address (optional)", type: "text", full: true },
      { name: "scripture", label: "Scripture", type: "text" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["Prayer", "Prophecy", "Encouragement", "Faith", "Healing", "Victory", "Spiritual Growth"],
      },
      { name: "speaker", label: "Speaker / Author", type: "text", full: true },
      { name: "excerpt", label: "Short excerpt", type: "textarea", full: true },
      { name: "body", label: "Full message (accessible text)", type: "longtext", full: true },
      { name: "imageUrl", label: "Flyer / featured image", type: "image", full: true },
      { name: "audioUrl", label: "Audio link", type: "text" },
      { name: "videoUrl", label: "Video link", type: "text" },
      { name: "publishDate", label: "Publish date", type: "date", required: true },
      { name: "featured", label: "Feature on homepage", type: "checkbox" },
      STATUS,
    ],
  },
  ministries: {
    key: "ministries",
    label: "Ministries",
    singular: "Ministry",
    intro: "Departments and groups people can belong to and serve in.",
    table: ministries,
    idCol: ministries.id,
    orderCol: ministries.sortOrder,
    orderDir: "asc",
    titleField: "name",
    slugFrom: "name",
    hasStatus: true,
    publicPath: (row) => `/ministries/${row.slug as string}`,
    listFields: [
      { name: "name", label: "Name" },
      { name: "leader", label: "Leader" },
      { name: "status", label: "Visibility" },
    ],
    fields: [
      { name: "name", label: "Ministry name", type: "text", required: true, full: true },
      { name: "slug", label: "Web address (optional)", type: "text", full: true },
      { name: "description", label: "Short description", type: "textarea", full: true },
      { name: "body", label: "Full description", type: "longtext", full: true },
      { name: "leader", label: "Ministry leader", type: "text" },
      { name: "meetingInfo", label: "Meeting information", type: "text" },
      { name: "imageUrl", label: "Featured image", type: "image", full: true },
      { name: "ctaLabel", label: "Button label", type: "text" },
      { name: "ctaUrl", label: "Button link", type: "text" },
      { name: "sortOrder", label: "Display order", type: "number" },
      STATUS,
    ],
  },
  leaders: {
    key: "leaders",
    label: "Ministry Leaders",
    singular: "Leader",
    intro: "Leadership profiles shown on the About page.",
    table: leaders,
    idCol: leaders.id,
    orderCol: leaders.sortOrder,
    orderDir: "asc",
    titleField: "name",
    hasStatus: true,
    listFields: [
      { name: "name", label: "Name" },
      { name: "title", label: "Ministry title" },
      { name: "status", label: "Visibility" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, full: true },
      { name: "title", label: "Ministry title", type: "text", full: true },
      { name: "shortBio", label: "Short biography", type: "textarea", full: true },
      { name: "fullBio", label: "Full biography", type: "longtext", full: true },
      { name: "photoUrl", label: "Portrait photo", type: "image", full: true },
      { name: "sortOrder", label: "Display order", type: "number" },
      STATUS,
    ],
  },
  schedules: {
    key: "schedules",
    label: "Service Times",
    singular: "Service",
    intro: "Weekly and monthly gatherings. These power the homepage countdown.",
    table: serviceSchedules,
    idCol: serviceSchedules.id,
    orderCol: serviceSchedules.sortOrder,
    orderDir: "asc",
    titleField: "title",
    listFields: [
      { name: "title", label: "Service" },
      { name: "dayLabel", label: "Day" },
      { name: "timeLabel", label: "Time" },
    ],
    fields: [
      { name: "title", label: "Service name", type: "text", required: true, full: true },
      { name: "dayLabel", label: "Day shown to visitors", type: "text", help: "e.g. Sunday, 2nd & Last Friday" },
      { name: "timeLabel", label: "Time shown to visitors", type: "text", help: "e.g. 9:00 AM" },
      {
        name: "dayOfWeek",
        label: "Day of the week",
        type: "select",
        options: ["0", "1", "2", "3", "4", "5", "6"],
        help: "0 = Sunday, 1 = Monday … 6 = Saturday. Used for the countdown.",
      },
      { name: "startTime", label: "Start time (24 hour, e.g. 09:00)", type: "time" },
      {
        name: "frequency",
        label: "How often",
        type: "select",
        options: ["weekly", "first_dow", "second_last", "last_dow"],
        help: "weekly = every week, first_dow = first of the month, second_last = 2nd and last of the month.",
      },
      { name: "description", label: "Description", type: "textarea", full: true },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        options: ["church", "book", "flame", "moon", "oil"],
      },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "published", label: "Show on the website", type: "checkbox" },
    ],
  },
  announcements: {
    key: "announcements",
    label: "Announcement Bar",
    singular: "Announcement",
    intro: "Short messages that rotate at the very top of every page.",
    table: announcements,
    idCol: announcements.id,
    orderCol: announcements.sortOrder,
    orderDir: "asc",
    titleField: "message",
    listFields: [
      { name: "message", label: "Message" },
      { name: "linkUrl", label: "Link" },
    ],
    fields: [
      { name: "message", label: "Message", type: "text", required: true, full: true },
      { name: "linkUrl", label: "Link (optional)", type: "text", full: true },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "active", label: "Show this announcement", type: "checkbox" },
    ],
  },
  navigation: {
    key: "navigation",
    label: "Navigation",
    singular: "Menu link",
    intro: "The links shown in the top menu and in the footer.",
    table: navigationItems,
    idCol: navigationItems.id,
    orderCol: navigationItems.sortOrder,
    orderDir: "asc",
    titleField: "label",
    listFields: [
      { name: "label", label: "Label" },
      { name: "href", label: "Link" },
      { name: "location", label: "Where" },
    ],
    fields: [
      { name: "label", label: "Menu label", type: "text", required: true },
      { name: "href", label: "Page link", type: "text", required: true, help: "e.g. /about" },
      { name: "location", label: "Where does it show?", type: "select", options: ["header", "footer"] },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "visible", label: "Show this link", type: "checkbox" },
    ],
  },
  albums: {
    key: "albums",
    label: "Photo Albums",
    singular: "Album",
    intro: "Group your photos into albums such as Sunday Worship or DOXA.",
    table: galleryAlbums,
    idCol: galleryAlbums.id,
    orderCol: galleryAlbums.sortOrder,
    orderDir: "asc",
    titleField: "title",
    slugFrom: "title",
    hasStatus: true,
    publicPath: (row) => `/gallery/${row.slug as string}`,
    listFields: [
      { name: "title", label: "Album" },
      { name: "albumDate", label: "Date" },
      { name: "status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Album title", type: "text", required: true, full: true },
      { name: "slug", label: "Web address (optional)", type: "text", full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "coverUrl", label: "Cover photo", type: "image", full: true },
      { name: "albumDate", label: "Date", type: "date" },
      { name: "eventSlug", label: "Related event web address", type: "text" },
      { name: "sortOrder", label: "Display order", type: "number" },
      STATUS,
    ],
  },
  photos: {
    key: "photos",
    label: "Album Photos",
    singular: "Photo",
    intro: "Individual photos inside an album. Choose the album number shown on the Photo Albums page.",
    table: galleryMedia,
    idCol: galleryMedia.id,
    orderCol: galleryMedia.sortOrder,
    orderDir: "asc",
    titleField: "caption",
    listFields: [
      { name: "caption", label: "Caption" },
      { name: "albumId", label: "Album number" },
    ],
    fields: [
      { name: "albumId", label: "Album number", type: "number", required: true },
      { name: "url", label: "Photo", type: "image", required: true, full: true },
      { name: "caption", label: "Caption", type: "text", full: true },
      { name: "mediaType", label: "Type", type: "select", options: ["image", "video"] },
      { name: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  ksmCourses: {
    key: "ksmCourses",
    label: "KSM Courses",
    singular: "Course",
    intro: "The KATARTISMOS School of Ministry curriculum.",
    table: ksmCourses,
    idCol: ksmCourses.id,
    orderCol: ksmCourses.sortOrder,
    orderDir: "asc",
    titleField: "title",
    listFields: [
      { name: "title", label: "Course" },
      { name: "instructor", label: "Instructor" },
    ],
    fields: [
      { name: "title", label: "Course title", type: "text", required: true, full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "instructor", label: "Instructor", type: "text" },
      { name: "imageUrl", label: "Course image", type: "image", full: true },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "active", label: "Show this course", type: "checkbox" },
    ],
  },
  ksmInstructors: {
    key: "ksmInstructors",
    label: "KSM Instructors",
    singular: "Instructor",
    intro: "Ministers and teachers who take KSM classes.",
    table: ksmInstructors,
    idCol: ksmInstructors.id,
    orderCol: ksmInstructors.sortOrder,
    orderDir: "asc",
    titleField: "name",
    listFields: [
      { name: "name", label: "Name" },
      { name: "title", label: "Title" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, full: true },
      { name: "title", label: "Title", type: "text" },
      { name: "bio", label: "Biography", type: "textarea", full: true },
      { name: "photoUrl", label: "Photo", type: "image", full: true },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "active", label: "Show this instructor", type: "checkbox" },
    ],
  },
  vocationalCourses: {
    key: "vocationalCourses",
    label: "Vocational Courses",
    singular: "Training course",
    intro: "Skills training programmes. New courses stay hidden until you set them to Published.",
    table: vocationalCourses,
    idCol: vocationalCourses.id,
    orderCol: vocationalCourses.sortOrder,
    orderDir: "asc",
    titleField: "title",
    slugFrom: "title",
    hasStatus: true,
    listFields: [
      { name: "title", label: "Course" },
      { name: "duration", label: "Duration" },
      { name: "status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Course title", type: "text", required: true, full: true },
      { name: "slug", label: "Web address (optional)", type: "text", full: true },
      { name: "description", label: "Description", type: "longtext", full: true },
      { name: "imageUrl", label: "Course image", type: "image", full: true },
      { name: "instructor", label: "Instructor", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "End date", type: "date" },
      { name: "schedule", label: "Schedule", type: "text" },
      { name: "venue", label: "Venue", type: "text" },
      { name: "capacity", label: "Capacity", type: "number" },
      { name: "registrationDeadline", label: "Registration deadline", type: "date" },
      { name: "isFree", label: "This training is free", type: "checkbox" },
      { name: "fee", label: "Fee (₦)", type: "number" },
      { name: "requirements", label: "Requirements", type: "textarea", full: true },
      { name: "certificate", label: "Certificate awarded", type: "checkbox" },
      { name: "registrationOpen", label: "Registration is open", type: "checkbox" },
      { name: "sortOrder", label: "Display order", type: "number" },
      STATUS,
    ],
  },
  vocationalInstructors: {
    key: "vocationalInstructors",
    label: "Vocational Instructors",
    singular: "Instructor",
    intro: "Trainers who facilitate the skills programmes.",
    table: vocationalInstructors,
    idCol: vocationalInstructors.id,
    orderCol: vocationalInstructors.sortOrder,
    orderDir: "asc",
    titleField: "name",
    listFields: [
      { name: "name", label: "Name" },
      { name: "title", label: "Title" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, full: true },
      { name: "title", label: "Title", type: "text" },
      { name: "bio", label: "Biography", type: "textarea", full: true },
      { name: "photoUrl", label: "Photo", type: "image", full: true },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "active", label: "Show this instructor", type: "checkbox" },
    ],
  },
  givingCategories: {
    key: "givingCategories",
    label: "Giving Categories",
    singular: "Giving category",
    intro: "The purposes people can choose when giving.",
    table: givingCategories,
    idCol: givingCategories.id,
    orderCol: givingCategories.sortOrder,
    orderDir: "asc",
    titleField: "name",
    listFields: [
      { name: "name", label: "Category" },
      { name: "active", label: "Active" },
    ],
    fields: [
      { name: "name", label: "Category name", type: "text", required: true, full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "sortOrder", label: "Display order", type: "number" },
      { name: "active", label: "Show this category", type: "checkbox" },
    ],
  },
};

export function getResource(key: string) {
  return RESOURCES[key] ?? null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

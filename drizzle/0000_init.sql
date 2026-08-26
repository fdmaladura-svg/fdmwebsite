CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"link_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devotionals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"scripture" text,
	"excerpt" text,
	"body" text,
	"image_url" text,
	"speaker" text DEFAULT 'Prophetess Temitope Afolabi-Adebisi (AjaraEmi)',
	"category" text DEFAULT 'Prophecy' NOT NULL,
	"audio_url" text,
	"video_url" text,
	"publish_date" date NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "devotionals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"donor_name" text,
	"email" text,
	"phone" text,
	"amount" integer NOT NULL,
	"category" text,
	"note" text,
	"anonymous" boolean DEFAULT false NOT NULL,
	"method" text DEFAULT 'paystack' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "donations_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" text DEFAULT 'Event' NOT NULL,
	"summary" text,
	"description" text,
	"banner_url" text,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"start_date" date NOT NULL,
	"end_date" date,
	"start_time" text,
	"end_time" text,
	"venue" text,
	"location_type" text DEFAULT 'onsite' NOT NULL,
	"map_url" text,
	"stream_url" text,
	"registration_url" text,
	"speaker" text,
	"theme" text,
	"scripture" text,
	"contact_info" text,
	"recurrence" text DEFAULT 'none' NOT NULL,
	"is_programme" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"cover_url" text,
	"album_date" date,
	"event_slug" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_albums_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" integer NOT NULL,
	"url" text NOT NULL,
	"media_type" text DEFAULT 'image' NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giving_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ksm_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"full_name" text NOT NULL,
	"gender" text,
	"date_of_birth" text,
	"phone" text,
	"whatsapp" text,
	"email" text,
	"address" text,
	"state" text,
	"country" text,
	"church" text,
	"denomination" text,
	"church_role" text,
	"ministry_experience" text,
	"motivation" text,
	"programme" text,
	"photo_url" text,
	"status" text DEFAULT 'New' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ksm_applications_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "ksm_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"instructor" text,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ksm_instructors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"bio" text,
	"photo_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"short_bio" text,
	"full_bio" text,
	"photo_url" text,
	"socials" jsonb DEFAULT '{}'::jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_library" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text,
	"size_bytes" integer,
	"alt_text" text,
	"caption" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ministries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text DEFAULT 'Ministry',
	"description" text,
	"body" text,
	"leader" text,
	"meeting_info" text,
	"image_url" text,
	"cta_label" text,
	"cta_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ministries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"location" text DEFAULT 'header' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page" text NOT NULL,
	"section_key" text NOT NULL,
	"label" text NOT NULL,
	"eyebrow" text,
	"title" text,
	"subtitle" text,
	"body" text,
	"image_url" text,
	"cta_label" text,
	"cta_url" text,
	"cta2_label" text,
	"cta2_url" text,
	"extra" jsonb DEFAULT '{}'::jsonb,
	"visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prayer_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"contact" text,
	"request" text NOT NULL,
	"confidential" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sermons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"speaker" text,
	"sermon_date" date NOT NULL,
	"scripture" text,
	"series" text,
	"description" text,
	"thumbnail_url" text,
	"audio_url" text,
	"video_url" text,
	"allow_download" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sermons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"day_of_week" integer DEFAULT 0 NOT NULL,
	"start_time" text DEFAULT '09:00' NOT NULL,
	"time_label" text DEFAULT '9:00 AM' NOT NULL,
	"day_label" text DEFAULT 'Sunday' NOT NULL,
	"frequency" text DEFAULT 'weekly' NOT NULL,
	"description" text,
	"icon" text DEFAULT 'church',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"body" text NOT NULL,
	"photo_url" text,
	"video_url" text,
	"permission" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visitor_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"attending_count" integer DEFAULT 1,
	"bringing_children" boolean DEFAULT false NOT NULL,
	"preferred_service" text,
	"message" text,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocational_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"whatsapp" text,
	"email" text,
	"gender" text,
	"age_range" text,
	"address" text,
	"course_title" text,
	"experience" text,
	"employment_status" text,
	"reason" text,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocational_applications_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "vocational_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image_url" text,
	"instructor" text,
	"duration" text,
	"start_date" date,
	"end_date" date,
	"schedule" text,
	"venue" text,
	"capacity" integer,
	"registration_deadline" date,
	"is_free" boolean DEFAULT true NOT NULL,
	"fee" integer DEFAULT 0,
	"requirements" text,
	"certificate" boolean DEFAULT true NOT NULL,
	"registration_open" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocational_courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "vocational_instructors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"bio" text,
	"photo_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

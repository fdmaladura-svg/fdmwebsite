-- Faith Dynamite Ministries Supabase baseline hardening notes
-- Run this in the Supabase SQL Editor AFTER Drizzle has created the tables.
-- The Next.js server connects with DATABASE_URL and performs privileged server-side operations.
-- Public visitors must not receive direct Supabase table access.

-- Enable Row Level Security on sensitive tables.
alter table if exists admin_users enable row level security;
alter table if exists ksm_applications enable row level security;
alter table if exists vocational_applications enable row level security;
alter table if exists donations enable row level security;
alter table if exists prayer_requests enable row level security;
alter table if exists testimonies enable row level security;
alter table if exists visitor_requests enable row level security;
alter table if exists contact_messages enable row level security;

-- Enable RLS on content tables too. The application reads these through server-side Drizzle.
alter table if exists settings enable row level security;
alter table if exists page_sections enable row level security;
alter table if exists navigation_items enable row level security;
alter table if exists service_schedules enable row level security;
alter table if exists announcements enable row level security;
alter table if exists events enable row level security;
alter table if exists ministries enable row level security;
alter table if exists leaders enable row level security;
alter table if exists sermons enable row level security;
alter table if exists devotionals enable row level security;
alter table if exists gallery_albums enable row level security;
alter table if exists gallery_media enable row level security;
alter table if exists media_library enable row level security;
alter table if exists ksm_courses enable row level security;
alter table if exists ksm_instructors enable row level security;
alter table if exists vocational_courses enable row level security;
alter table if exists vocational_instructors enable row level security;
alter table if exists giving_categories enable row level security;

-- Do not create broad anon/authenticated policies here.
-- This website currently uses server-side Drizzle access, not browser-side Supabase table queries.
-- If you later add Supabase Auth client access, create narrow policies per role at that time.

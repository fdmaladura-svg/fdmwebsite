import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminShell, { type NavGroup } from "@/components/admin/AdminShell";
import { getSessionUser } from "@/lib/auth";
import { getSetting, type ChurchInfo } from "@/lib/content";
import { logoutAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Church Manager" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  const church = await getSetting<ChurchInfo>("church");

  const groups: NavGroup[] = [
    { title: "Overview", items: [{ label: "Dashboard", href: "/admin" }] },
    {
      title: "Website",
      items: [
        { label: "Homepage", href: "/admin/website/homepage" },
        { label: "About Page", href: "/admin/website/about" },
        { label: "Giving Page", href: "/admin/website/give" },
        { label: "Plan Your Visit Page", href: "/admin/website/visit" },
        { label: "School of Ministry Page", href: "/admin/website/ksm" },
        { label: "Vocational Page", href: "/admin/website/vocational" },
        { label: "Announcement Bar", href: "/admin/content/announcements" },
        { label: "Navigation & Footer", href: "/admin/content/navigation" },
      ],
    },
    {
      title: "Worship",
      items: [{ label: "Service Times", href: "/admin/content/schedules" }],
    },
    {
      title: "Content",
      items: [
        { label: "Events & Programmes", href: "/admin/content/events" },
        { label: "Voice of Mercy", href: "/admin/content/devotionals" },
        { label: "Sermons", href: "/admin/content/sermons" },
        { label: "Photo Albums", href: "/admin/content/albums" },
        { label: "Album Photos", href: "/admin/content/photos" },
      ],
    },
    {
      title: "Ministries",
      items: [
        { label: "Ministries", href: "/admin/content/ministries" },
        { label: "Ministry Leaders", href: "/admin/content/leaders" },
      ],
    },
    {
      title: "School of Ministry",
      items: [
        { label: "KSM Courses", href: "/admin/content/ksmCourses" },
        { label: "KSM Instructors", href: "/admin/content/ksmInstructors" },
        { label: "KSM Applications", href: "/admin/submissions/ksm" },
      ],
    },
    {
      title: "Vocational Training",
      items: [
        { label: "Training Courses", href: "/admin/content/vocationalCourses" },
        { label: "Trainers", href: "/admin/content/vocationalInstructors" },
        { label: "Registrations", href: "/admin/submissions/vocational" },
      ],
    },
    {
      title: "Engagement",
      items: [
        { label: "Prayer Requests", href: "/admin/submissions/prayer" },
        { label: "Testimonies", href: "/admin/submissions/testimonies" },
        { label: "Visitor Requests", href: "/admin/submissions/visitors" },
        { label: "Contact Messages", href: "/admin/submissions/messages" },
      ],
    },
    {
      title: "Giving",
      items: [
        { label: "Donations", href: "/admin/giving/donations" },
        { label: "Giving Categories", href: "/admin/content/givingCategories" },
        { label: "Bank Transfer Details", href: "/admin/settings/bank" },
        { label: "Paystack", href: "/admin/settings/paystack" },
      ],
    },
    { title: "Media", items: [{ label: "Media Library", href: "/admin/media" }] },
    {
      title: "Settings",
      items: [
        { label: "Church Information", href: "/admin/settings/church" },
        { label: "Social Media", href: "/admin/settings/social" },
        { label: "Live Streaming", href: "/admin/settings/live" },
        { label: "Search & Sharing (SEO)", href: "/admin/settings/seo" },
        { label: "KSM Settings", href: "/admin/settings/ksm" },
        { label: "Administrators", href: "/admin/settings/administrators" },
      ],
    },
  ];

  return (
    <AdminShell groups={groups} user={{ name: user.name, role: user.role }} logoUrl={church.logoUrl} onLogout={logoutAction}>
      {children}
    </AdminShell>
  );
}

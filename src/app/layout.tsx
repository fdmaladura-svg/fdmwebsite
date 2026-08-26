import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getSetting, type SeoSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSetting<SeoSettings>("seo");
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
      default: seo.title,
      template: "%s | Faith Dynamite Ministries",
    },
    description: seo.description,
    icons: { icon: "/images/fdm-logo.png", apple: "/images/fdm-logo.png" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
      type: "website",
      siteName: "Faith Dynamite Ministries (Aladura)",
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.ogImage] },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

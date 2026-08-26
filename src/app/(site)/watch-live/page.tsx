import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getSetting, type LiveSettings } from "@/lib/content";
import { getLatestSermons, getNextService } from "@/lib/queries";
import { formatLongDate } from "@/lib/dates";

export const metadata = { title: "Watch Live" };
export const dynamic = "force-dynamic";

function toEmbed(url: string) {
  const yt = url.match(/(?:youtu\.be\/|v=|live\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  if (url.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
  return url;
}

export default async function WatchLivePage() {
  const [live, sermonList, nextService] = await Promise.all([
    getSetting<LiveSettings>("live"),
    getLatestSermons(3),
    getNextService(),
  ]);

  const source = live.embedUrl || live.youtubeUrl || live.facebookUrl;
  const embed = live.isLive && source ? toEmbed(source) : null;

  return (
    <>
      <PageHero
        eyebrow="Online Church"
        title="Watch Live"
        subtitle="Worship with us wherever you are in the world."
        imageUrl="/images/hero-worship.jpg"
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4">
          {embed ? (
            <div className="relative aspect-video bg-black">
              <iframe
                src={embed}
                title="Live stream"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="border border-[#eadfca] bg-[#faf6ee] p-10 text-center">
              <p className="font-display text-2xl text-[#6a1f2b]">{live.offlineMessage}</p>
              {nextService ? (
                <p className="mt-3 text-sm text-[#5b5148]">
                  Next service: <strong>{nextService.title}</strong> — {formatLongDate(new Date(nextService.when))} at{" "}
                  {nextService.timeLabel}
                </p>
              ) : null}
            </div>
          )}

          <h2 className="display-title mt-14 text-3xl">Latest Messages</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {sermonList.map((s) => (
              <Link key={s.id} href={`/sermons/${s.slug}`} className="card overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={s.thumbnailUrl || "/images/choir.jpg"}
                    alt={s.title}
                    fill
                    sizes="33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
                  <p className="mt-1 text-xs text-[#8b8175]">{s.speaker}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

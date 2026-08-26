import { desc } from "drizzle-orm";
import { db } from "@/db";
import { mediaLibrary } from "@/db/schema";
import MediaUploader from "@/components/admin/MediaUploader";
import AdminForm from "@/components/admin/AdminForm";
import { updateMediaAction, deleteMediaAction } from "@/app/actions/admin";
import { formatShortDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  let items: (typeof mediaLibrary.$inferSelect)[] = [];
  try {
    items = await db.select().from(mediaLibrary).orderBy(desc(mediaLibrary.createdAt)).limit(200);
  } catch {
    items = [];
  }
  const filtered = q
    ? items.filter((i) => `${i.filename} ${i.altText} ${i.caption}`.toLowerCase().includes(q.toLowerCase()))
    : items;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Media</p>
        <h1 className="display-title mt-2 text-3xl">Media Library</h1>
        <p className="mt-2 text-sm text-[#6b6156] max-w-2xl">
          Upload pictures once and use them anywhere on the website. JPG, PNG and WEBP up to 6MB.
        </p>
      </header>

      <MediaUploader />

      <form action="/admin/media" className="flex gap-3 max-w-md">
        <input name="q" defaultValue={q} placeholder="Search pictures" className="field" aria-label="Search media" />
        <button type="submit" className="btn btn-dark">
          Search
        </button>
      </form>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((m) => (
            <div key={m.id} className="bg-white border border-[#e6e2da]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.altText || m.filename} className="h-44 w-full object-cover" />
              <div className="p-4 space-y-3">
                <p className="text-xs text-[#8b8175] break-all">{m.filename}</p>
                <p className="text-xs text-[#8b8175]">
                  {formatShortDate(m.createdAt)} • {Math.round((m.sizeBytes || 0) / 1024)} KB
                </p>
                <AdminForm action={updateMediaAction} submitLabel="Save">
                  <input type="hidden" name="__id" value={m.id} />
                  <div>
                    <label className="label" htmlFor={`alt-${m.id}`}>
                      Description for screen readers
                    </label>
                    <input id={`alt-${m.id}`} name="altText" defaultValue={m.altText ?? ""} className="field" />
                  </div>
                  <div>
                    <label className="label" htmlFor={`cap-${m.id}`}>
                      Caption
                    </label>
                    <input id={`cap-${m.id}`} name="caption" defaultValue={m.caption ?? ""} className="field" />
                  </div>
                  <div>
                    <label className="label" htmlFor={`url-${m.id}`}>
                      Picture link (copy this into any page)
                    </label>
                    <input id={`url-${m.id}`} readOnly value={m.url} className="field !bg-[#faf8f4]" />
                  </div>
                </AdminForm>
                <form action={deleteMediaAction}>
                  <input type="hidden" name="__id" value={m.id} />
                  <button type="submit" className="text-xs text-[#8c2b2b] underline">
                    Remove from library
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#8b8175]">No pictures uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

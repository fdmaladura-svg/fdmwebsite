import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { getResource } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  let rows: Record<string, unknown>[] = [];
  try {
    rows = (await db
      .select()
      .from(resource.table)
      .orderBy(resource.orderDir === "asc" ? asc(resource.orderCol) : desc(resource.orderCol))
      .limit(300)) as Record<string, unknown>[];
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-title mt-2 text-3xl">{resource.label}</h1>
          <p className="mt-2 text-sm text-[#6b6156] max-w-2xl">{resource.intro}</p>
        </div>
        <Link href={`/admin/content/${key}/new`} className="btn btn-gold">
          + Add {resource.singular}
        </Link>
      </header>

      <div className="bg-white border border-[#e6e2da] overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-[#faf8f4] text-left">
            <tr>
              {resource.listFields.map((f) => (
                <th key={f.name} className="px-4 py-3 text-[0.62rem] uppercase tracking-[0.16em] text-[#8b8175]">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee9df]">
            {rows.length ? (
              rows.map((row) => (
                <tr key={String(row.id)} className="hover:bg-[#faf8f4]">
                  {resource.listFields.map((f) => {
                    const value = row[f.name];
                    return (
                      <td key={f.name} className="px-4 py-3 align-top">
                        {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value ?? "—").slice(0, 70)}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/content/${key}/${row.id}`} className="text-[#8a6a20] font-semibold underline">
                      Edit
                    </Link>
                    {resource.publicPath && row.status !== "draft" ? (
                      <Link
                        href={resource.publicPath(row)}
                        className="ml-3 text-[#5b5148] underline"
                        target="_blank"
                      >
                        View
                      </Link>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={resource.listFields.length + 1} className="px-4 py-10 text-center text-[#8b8175]">
                  Nothing here yet. Click “Add {resource.singular}” to create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

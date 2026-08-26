import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { getResource, type Field } from "@/lib/admin/resources";
import AdminForm from "@/components/admin/AdminForm";
import ImageField from "@/components/admin/ImageField";
import {
  saveResourceAction,
  deleteResourceAction,
  duplicateResourceAction,
} from "@/app/actions/admin";

export const dynamic = "force-dynamic";

const DAY_LABELS: Record<string, string> = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
};

const FREQ_LABELS: Record<string, string> = {
  weekly: "Every week",
  first_dow: "First of the month",
  second_last: "2nd and last of the month",
  last_dow: "Last of the month",
  none: "Does not repeat",
  monthly: "Every month",
  first_sunday: "First Sunday",
  second_friday: "Second Friday",
  last_friday: "Last Friday",
  quarterly: "Quarterly",
  annual: "Every year",
  custom: "Custom dates",
  published: "Published (visible to everyone)",
  draft: "Draft (hidden)",
  archived: "Archived",
  onsite: "At the church",
  online: "Online only",
  hybrid: "Both onsite and online",
  header: "Top menu",
  footer: "Footer",
  image: "Photo",
  video: "Video",
};

function optionLabel(field: Field, value: string) {
  if (field.name === "dayOfWeek") return DAY_LABELS[value] ?? value;
  return FREQ_LABELS[value] ?? value;
}

function renderField(field: Field, row: Record<string, unknown> | null) {
  const raw = row ? row[field.name] : undefined;
  const value = raw === null || raw === undefined ? "" : String(raw);
  const id = `f-${field.name}`;

  if (field.type === "image") {
    return <ImageField key={field.name} name={field.name} label={field.label} defaultValue={value} help={field.help} />;
  }

  if (field.type === "checkbox") {
    return (
      <label key={field.name} className="flex items-center gap-3 text-sm text-[#3f3831]">
        <input type="checkbox" name={field.name} defaultChecked={raw === true} className="h-4 w-4" />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
      <label className="label" htmlFor={id}>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      {field.type === "select" ? (
        <select id={id} name={field.name} defaultValue={value} className="field">
          {(field.options || []).map((o) => (
            <option key={o} value={o}>
              {optionLabel(field, o)}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea id={id} name={field.name} defaultValue={value} rows={3} className="field" />
      ) : field.type === "longtext" ? (
        <textarea id={id} name={field.name} defaultValue={value} rows={9} className="field" />
      ) : (
        <input
          id={id}
          name={field.name}
          defaultValue={value}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
          className="field"
        />
      )}
      {field.help ? <p className="mt-1 text-xs text-[#8b8175]">{field.help}</p> : null}
    </div>
  );
}

export default async function ResourceEditPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    try {
      const rows = (await db
        .select()
        .from(resource.table)
        .where(eq(resource.idCol, Number(id)))
        .limit(1)) as Record<string, unknown>[];
      row = rows[0] ?? null;
    } catch {
      row = null;
    }
    if (!row) notFound();
  }

  const checkboxes = resource.fields.filter((f) => f.type === "checkbox");
  const others = resource.fields.filter((f) => f.type !== "checkbox");

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/admin/content/${key}`} className="text-xs uppercase tracking-[0.16em] text-[#8a6a20]">
            ← Back to {resource.label}
          </Link>
          <h1 className="display-title mt-2 text-3xl">
            {isNew ? `Add ${resource.singular}` : `Edit ${resource.singular}`}
          </h1>
        </div>
        {!isNew && resource.publicPath && row ? (
          <Link href={resource.publicPath(row)} target="_blank" className="btn btn-dark">
            Preview
          </Link>
        ) : null}
      </header>

      <div className="bg-white border border-[#e6e2da] p-5 sm:p-8">
        <AdminForm action={saveResourceAction} submitLabel={isNew ? "Create" : "Save Changes"}>
          <input type="hidden" name="__resource" value={key} />
          <input type="hidden" name="__id" value={isNew ? "" : id} />
          <div className="grid gap-5 sm:grid-cols-2">{others.map((f) => renderField(f, row))}</div>
          {checkboxes.length ? (
            <fieldset className="border border-[#eee9df] p-4">
              <legend className="px-2 text-xs uppercase tracking-[0.16em] text-[#8b8175]">Options</legend>
              <div className="grid gap-3 sm:grid-cols-2">{checkboxes.map((f) => renderField(f, row))}</div>
            </fieldset>
          ) : null}
        </AdminForm>
      </div>

      {!isNew ? (
        <div className="bg-white border border-[#e6e2da] p-5 flex flex-wrap gap-4 items-center">
          <form action={duplicateResourceAction}>
            <input type="hidden" name="__resource" value={key} />
            <input type="hidden" name="__id" value={id} />
            <button type="submit" className="btn btn-dark">
              Duplicate
            </button>
          </form>
          <form
            action={deleteResourceAction}
            // eslint-disable-next-line react/no-unknown-property
          >
            <input type="hidden" name="__resource" value={key} />
            <input type="hidden" name="__id" value={id} />
            <button type="submit" className="btn btn-wine">
              {resource.hasStatus ? "Archive" : "Delete"}
            </button>
          </form>
          <p className="text-xs text-[#8b8175]">
            {resource.hasStatus
              ? "Archiving hides this item from the website but keeps a copy safely in your records."
              : "Deleting removes this item permanently. Are you sure?"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

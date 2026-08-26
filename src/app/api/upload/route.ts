import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { mediaLibrary } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Please upload a JPG, PNG or WEBP image." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "That image is too large. Please use an image under 6MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-60);
    const filename = `${Date.now()}-${safeName}`;
    await writeFile(path.join(dir, filename), buffer);
    const url = `/uploads/${filename}`;

    await db.insert(mediaLibrary).values({
      url,
      filename,
      mimeType: file.type,
      sizeBytes: file.size,
      altText: "",
      caption: "",
    });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "The upload failed. Please try again." }, { status: 500 });
  }
}

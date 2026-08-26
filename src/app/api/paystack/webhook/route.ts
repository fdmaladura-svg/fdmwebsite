import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const raw = await request.text();

  if (!secret) return NextResponse.json({ received: true, skipped: true });

  const signature = request.headers.get("x-paystack-signature") || "";
  const hash = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(raw);
    if (event?.event === "charge.success" && event?.data?.reference) {
      await db
        .update(donations)
        .set({ status: "success", paidAt: new Date(), updatedAt: new Date() })
        .where(eq(donations.reference, event.data.reference));
    }
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { donations } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Please enter an amount of ₦100 or more." }, { status: 400 });
    }

    const reference = `FDM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const donorName = String(body.name || "").trim();
    const email = String(body.email || "").trim();

    await db.insert(donations).values({
      reference,
      donorName: body.anonymous ? "Anonymous" : donorName || "Anonymous",
      email,
      phone: String(body.phone || ""),
      amount,
      category: String(body.category || "Offering"),
      note: String(body.note || ""),
      anonymous: Boolean(body.anonymous),
      method: "paystack",
      status: "pending",
    });

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({
        reference,
        pending: true,
        redirectUrl: `/give/success?reference=${reference}&pending=1`,
        message:
          "Online card payment is not yet activated. Your giving intent has been recorded — please complete it by bank transfer.",
      });
    }

    const origin = new URL(request.url).origin;
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email || "giving@faithdynamite.org",
        amount: amount * 100,
        reference,
        currency: "NGN",
        callback_url: `${origin}/give/success`,
        metadata: { category: body.category, donorName, phone: body.phone },
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.data?.authorization_url) {
      return NextResponse.json(
        { error: data?.message || "We could not start the payment. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reference, redirectUrl: data.data.authorization_url });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

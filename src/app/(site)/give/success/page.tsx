import Link from "next/link";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatLongDate } from "@/lib/dates";

export const metadata = { title: "Thank You For Your Generosity" };
export const dynamic = "force-dynamic";

async function verify(reference: string) {
  try {
    const rows = await db.select().from(donations).where(eq(donations.reference, reference)).limit(1);
    const record = rows[0];
    if (!record) return null;

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (secret && record.status !== "success") {
      const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${secret}` },
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.data?.status === "success") {
        await db
          .update(donations)
          .set({ status: "success", paidAt: new Date(), updatedAt: new Date() })
          .where(eq(donations.reference, reference));
        return { ...record, status: "success" as const };
      }
    }
    return record;
  } catch {
    return null;
  }
}

export default async function GiveSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; pending?: string }>;
}) {
  const { reference, pending } = await searchParams;
  const record = reference ? await verify(reference) : null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <p className="eyebrow">Giving</p>
        <h1 className="display-title mt-3 text-4xl sm:text-5xl">Thank You For Your Generosity</h1>
        <p className="mt-4 text-[#5b5148]">
          {pending
            ? "Your giving intent has been recorded. Please complete your gift using the bank transfer details on the giving page."
            : "May the Lord bless you and multiply your seed. Your partnership advances the Kingdom."}
        </p>

        {record ? (
          <dl className="mt-10 border border-[#eadfca] divide-y divide-[#eadfca] text-left">
            {[
              ["Transaction Reference", record.reference],
              ["Amount", `₦${record.amount.toLocaleString()}`],
              ["Category", record.category || "—"],
              ["Status", record.status === "success" ? "Successful" : "Pending"],
              ["Date", formatLongDate(record.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-5 py-3 text-sm">
                <dt className="text-[#8b8175] uppercase tracking-[0.12em] text-[0.65rem]">{label}</dt>
                <dd className="font-semibold text-[#3f3831]">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-dark">
            Return Home
          </Link>
          <Link href="/give" className="btn btn-gold">
            Give Again
          </Link>
        </div>
      </div>
    </section>
  );
}

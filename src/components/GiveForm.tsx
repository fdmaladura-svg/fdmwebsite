"use client";

import { useState } from "react";

export default function GiveForm({ categories }: { categories: string[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("5000");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          amount: Number(fd.get("amount")),
          category: fd.get("category"),
          note: fd.get("note"),
          anonymous: fd.get("anonymous") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "We could not process your gift. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const presets = [1000, 5000, 10000, 20000, 50000];

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <label className="label" htmlFor="category">
          Giving Purpose
        </label>
        <select id="category" name="category" className="field" defaultValue={categories[0]}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="amount">
          Amount (₦)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min={100}
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="field"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={`border px-3 py-1.5 text-xs font-bold ${
                amount === String(p) ? "border-[#c8a24a] bg-[#f6edd8]" : "border-[#e2d9c6] hover:border-[#c8a24a]"
              }`}
            >
              ₦{p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Full Name
          </label>
          <input id="name" name="name" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="note">
            Note (optional)
          </label>
          <input id="note" name="note" className="field" />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-[#5b5148]">
        <input type="checkbox" name="anonymous" className="h-4 w-4" />
        Give anonymously
      </label>

      {error ? (
        <p role="alert" className="border border-[#e0b4b4] bg-[#fbeeee] px-4 py-3 text-sm text-[#8c2b2b]">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn btn-gold disabled:opacity-60">
        {loading ? "Please wait…" : "Give Securely"}
      </button>
      <p className="text-xs text-[#8b8175]">
        Payments are processed securely by Paystack. We never store your card details.
      </p>
    </form>
  );
}

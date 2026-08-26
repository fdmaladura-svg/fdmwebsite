"use client";

import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <form action="/api/admin/login" method="post" className="grid gap-5">
      <div>
        <label htmlFor="email" className="label !text-white/70">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="field !bg-white/5 !text-white !border-white/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="label !text-white/70">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field !bg-white/5 !text-white !border-white/20"
        />
      </div>
      {error ? (
        <p role="alert" className="border border-[#7a3b3b] bg-[#3b1f1f] px-4 py-3 text-sm text-[#f0c9c9]">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-gold w-full">
        Sign In
      </button>
      <p className="text-xs text-white/45">
        Forgotten your password? Please ask your Super Admin to reset it for you.
      </p>
    </form>
  );
}

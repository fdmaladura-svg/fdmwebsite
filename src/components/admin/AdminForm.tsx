"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import type { FormResult } from "@/components/FormShell";

const initial: FormResult = { ok: false, message: "" };

export default function AdminForm({
  action,
  children,
  submitLabel = "Save Changes",
  extra,
}: {
  action: (prev: FormResult, fd: FormData) => Promise<FormResult>;
  children: ReactNode;
  submitLabel?: string;
  extra?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="grid gap-5">
      {children}
      <div className="sticky bottom-0 -mx-4 sm:mx-0 bg-white/95 backdrop-blur border-t border-[#e6e2da] px-4 py-3 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
        {extra}
        {state.message ? (
          <span
            role="status"
            className={`text-sm ${state.ok ? "text-[#1f6b3a]" : "text-[#8c2b2b]"}`}
          >
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}

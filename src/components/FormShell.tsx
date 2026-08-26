"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

export type FormResult = { ok: boolean; message: string; reference?: string };

const initial: FormResult = { ok: false, message: "" };

export default function FormShell({
  action,
  submitLabel = "Submit",
  children,
  note,
}: {
  action: (prev: FormResult, formData: FormData) => Promise<FormResult>;
  submitLabel?: string;
  children: ReactNode;
  note?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  if (state.ok) {
    return (
      <div className="border border-[#c8a24a] bg-[#fbf6e9] p-8 text-center">
        <p className="font-display text-2xl text-[#6a1f2b]">{state.message}</p>
        {state.reference ? (
          <p className="mt-3 text-sm text-[#5b5148]">
            Your reference number: <span className="font-bold tracking-wider">{state.reference}</span>
          </p>
        ) : null}
        <p className="mt-3 text-sm text-[#8b8175]">God bless you. Our team will be in touch.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      {children}
      {state.message && !state.ok ? (
        <p role="alert" className="border border-[#e0b4b4] bg-[#fbeeee] px-4 py-3 text-sm text-[#8c2b2b]">
          {state.message}
        </p>
      ) : null}
      <div className="flex items-center gap-4 flex-wrap">
        <button type="submit" disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? "Please wait…" : submitLabel}
        </button>
        {note ? <span className="text-xs text-[#8b8175]">{note}</span> : null}
      </div>
    </form>
  );
}

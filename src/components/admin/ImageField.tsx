"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageField({
  name,
  label,
  defaultValue,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  help?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Upload failed.");
      else setValue(data.url);
    } catch {
      setError("Upload failed. Please check your connection.");
    }
    setBusy(false);
  }

  return (
    <div>
      <label className="label" htmlFor={`${name}-url`}>
        {label}
      </label>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-24 w-32 border border-[#e6e2da] bg-[#faf8f4] overflow-hidden shrink-0">
          {value ? (
            <Image src={value} alt="" fill sizes="128px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-[#a39a8c]">No image</span>
          )}
        </div>
        <div className="grow min-w-[220px]">
          <input
            id={`${name}-url`}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Upload a picture or paste an image link"
            className="field"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="border border-[#c8a24a] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#8a6a20] disabled:opacity-60"
            >
              {busy ? "Uploading…" : "Upload picture"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => setValue("")}
                className="text-xs text-[#8c2b2b] underline"
              >
                Remove
              </button>
            ) : null}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
          {error ? <p className="mt-2 text-xs text-[#8c2b2b]">{error}</p> : null}
          {help ? <p className="mt-2 text-xs text-[#8b8175]">{help}</p> : null}
        </div>
      </div>
    </div>
  );
}

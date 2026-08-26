"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    setMessage("");
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok) uploaded += 1;
        else setError(data.error || "One of the pictures could not be uploaded.");
      } catch {
        setError("Upload failed. Please check your connection.");
      }
    }
    setBusy(false);
    if (uploaded) {
      setMessage(`${uploaded} picture${uploaded > 1 ? "s" : ""} uploaded successfully.`);
      router.refresh();
    }
  }

  return (
    <div className="bg-white border border-dashed border-[#c8a24a] p-6 text-center">
      <label htmlFor="media-upload" className="btn btn-gold cursor-pointer inline-flex">
        {busy ? "Uploading…" : "Upload pictures"}
      </label>
      <input
        id="media-upload"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <p className="mt-3 text-xs text-[#8b8175]">You can select several pictures at once from your phone or computer.</p>
      {message ? <p className="mt-3 text-sm text-[#1f6b3a]">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-[#8c2b2b]">{error}</p> : null}
    </div>
  );
}

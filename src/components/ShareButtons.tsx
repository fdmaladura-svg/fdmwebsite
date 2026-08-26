"use client";

import { useState } from "react";

export default function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const share = (network: "whatsapp" | "facebook" | "x") => {
    const encoded = encodeURIComponent(url);
    const text = encodeURIComponent(title);
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${encoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`,
    };
    window.open(links[network], "_blank", "noopener,noreferrer");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8b8175]">Share</span>
      {(["whatsapp", "facebook", "x"] as const).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => share(n)}
          className="border border-[#ded5c2] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] hover:border-[#c8a24a] hover:text-[#9b7a2c]"
        >
          {n === "x" ? "X" : n}
        </button>
      ))}
      <button
        type="button"
        onClick={copy}
        className="border border-[#ded5c2] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] hover:border-[#c8a24a] hover:text-[#9b7a2c]"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}

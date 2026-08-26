"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export type LightboxItem = { url: string; caption: string | null; type: string };

export default function Lightbox({ items }: { items: LightboxItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length]);

  if (!items.length) {
    return (
      <div className="border border-dashed border-[#d8cdb8] bg-[#fbf8f1] px-6 py-12 text-center">
        <p className="font-display text-xl text-[#6a1f2b]">Photos will be added to this album soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 lg:columns-3 gap-4">
        {items.map((item, i) => (
          <button
            key={`${item.url}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="mb-4 block w-full break-inside-avoid relative group"
            aria-label={item.caption || `Open image ${i + 1}`}
          >
            <span className={`relative block ${i % 3 === 1 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
              <Image
                src={item.url}
                alt={item.caption || "Gallery image"}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            </span>
            {item.caption ? (
              <span className="block text-left mt-1.5 text-xs text-[#8b8175]">{item.caption}</span>
            ) : null}
          </button>
        ))}
      </div>

      {index !== null ? (
        <div
          className="fixed inset-0 z-[60] bg-black/92 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIndex(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            aria-label="Close"
            onClick={() => setIndex(null)}
          >
            ×
          </button>
          <div className="relative w-full max-w-4xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[index].url}
              alt={items[index].caption || "Gallery image"}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-4 text-white text-4xl"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-4 text-white text-4xl"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i === null ? null : (i + 1) % items.length));
            }}
          >
            ›
          </button>
        </div>
      ) : null}
    </>
  );
}

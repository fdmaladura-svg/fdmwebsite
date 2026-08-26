"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export default function Countdown({ target, light = false }: { target: string; light?: boolean }) {
  const targetMs = new Date(target).getTime();
  const [time, setTime] = useState(() => diff(targetMs));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(diff(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const cells = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Minutes", time.minutes],
    ["Seconds", time.seconds],
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-live="polite">
      {cells.map(([label, value]) => (
        <div
          key={label}
          className={`text-center px-2 py-3 border ${
            light ? "border-white/20 bg-white/5" : "border-[#e6dcc7] bg-[#fbf8f1]"
          }`}
        >
          <div
            className={`font-display text-2xl sm:text-3xl font-bold ${
              light ? "text-[#e6c97a]" : "text-[#6a1f2b]"
            }`}
          >
            {mounted ? String(value).padStart(2, "0") : "--"}
          </div>
          <div
            className={`mt-1 text-[0.58rem] uppercase tracking-[0.18em] ${
              light ? "text-white/60" : "text-[#8b8175]"
            }`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

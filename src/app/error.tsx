"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#faf6ee] flex items-center">
      <div className="mx-auto max-w-xl px-4 text-center py-24">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="display-title mt-4 text-4xl text-[#6a1f2b]">We hit an unexpected problem</h1>
        <p className="mt-4 text-[#5b5148]">
          Please try again in a moment. If this keeps happening, kindly contact the church office.
        </p>
        <button type="button" onClick={reset} className="btn btn-gold mt-8">
          Try Again
        </button>
      </div>
    </main>
  );
}

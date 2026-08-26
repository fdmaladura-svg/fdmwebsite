import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#14110f] text-white flex items-center">
      <div className="mx-auto max-w-xl px-4 text-center py-24">
        <p className="eyebrow !text-[#e6c97a]">Page Not Found</p>
        <h1 className="display-title mt-4 text-6xl">404</h1>
        <p className="mt-4 text-white/75">
          We could not find that page. It may have been moved, or the link may be incorrect.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gold">
            Return Home
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}

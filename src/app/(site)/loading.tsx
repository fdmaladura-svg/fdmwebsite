export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <div className="h-4 w-32 bg-[#eee7d8] animate-pulse" />
      <div className="mt-5 h-12 w-3/4 bg-[#eee7d8] animate-pulse" />
      <div className="mt-4 h-4 w-1/2 bg-[#f3ede0] animate-pulse" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-[#eee7d8]">
            <div className="aspect-[16/10] bg-[#f3ede0] animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-5 w-2/3 bg-[#eee7d8] animate-pulse" />
              <div className="h-3 w-full bg-[#f3ede0] animate-pulse" />
              <div className="h-3 w-5/6 bg-[#f3ede0] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

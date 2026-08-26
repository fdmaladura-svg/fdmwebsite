export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-24 bg-[#e8e3d8] animate-pulse" />
      <div className="h-10 w-1/3 bg-[#e8e3d8] animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white border border-[#e6e2da] animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-white border border-[#e6e2da] animate-pulse" />
    </div>
  );
}

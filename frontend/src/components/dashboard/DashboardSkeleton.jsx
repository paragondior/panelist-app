function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Loading dashboard" role="status">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="h-4 w-32 rounded-full bg-white/[0.08]" />
        <div className="mt-5 h-10 w-2/3 rounded-xl bg-white/[0.08]" />
        <div className="mt-4 h-5 w-1/2 rounded-xl bg-white/[0.06]" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(15rem,0.8fr)_1.2fr]">
        <div className="aspect-[4/3] rounded-[2rem] bg-white/[0.06] lg:aspect-[4/5]" />
        <div className="space-y-5 py-8">
          <div className="h-5 w-28 rounded-full bg-white/[0.08]" />
          <div className="h-14 w-3/4 rounded-xl bg-white/[0.08]" />
          <div className="h-6 w-1/2 rounded-xl bg-white/[0.06]" />
          <div className="h-24 w-full rounded-2xl bg-white/[0.05]" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-28 rounded-2xl bg-white/[0.06]" />
        <div className="h-28 rounded-2xl bg-white/[0.06]" />
      </div>
    </div>
  )
}

export default DashboardSkeleton
function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Loading dashboard" role="status">
      <div className="h-24 rounded-2xl bg-white/[0.06]" />
      <div className="grid gap-8 lg:grid-cols-[minmax(15rem,0.8fr)_1.2fr]">
        <div className="aspect-[4/3] rounded-2xl bg-white/[0.06] lg:aspect-[4/5]" />
        <div className="space-y-5 py-8"><div className="h-5 w-28 rounded bg-white/[0.08]" /><div className="h-14 w-3/4 rounded bg-white/[0.08]" /><div className="h-5 w-1/2 rounded bg-white/[0.06]" /></div>
      </div>
      <div className="grid gap-3 md:grid-cols-2"><div className="h-24 rounded-2xl bg-white/[0.06]" /><div className="h-24 rounded-2xl bg-white/[0.06]" /></div>
    </div>
  )
}

export default DashboardSkeleton
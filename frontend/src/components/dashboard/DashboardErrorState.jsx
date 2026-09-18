function DashboardErrorState({ message, onRetry }) {
  return (
    <section className="rounded-2xl border border-rose-300/20 bg-rose-400/[0.06] p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">Unable to load session information</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">{message || 'Please try again in a moment.'}</p>
      <button className="mt-6 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:border-cyan-200/50 hover:text-cyan-200" onClick={onRetry} type="button">Try again</button>
    </section>
  )
}

export default DashboardErrorState
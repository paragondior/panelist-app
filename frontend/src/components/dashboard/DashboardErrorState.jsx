function DashboardErrorState({ message, onRetry }) {
  return (
    <section className="rounded-[2rem] border border-rose-400/20 bg-rose-500/5 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Session unavailable</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">We couldn’t load the live dashboard.</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-300">{message || 'The session may be temporarily unavailable or the room connection may have dropped. Please retry in a moment.'}</p>
      <button
        className="mt-6 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70"
        onClick={onRetry}
        type="button"
      >
        Try again
      </button>
    </section>
  )
}

export default DashboardErrorState
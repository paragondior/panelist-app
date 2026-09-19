

function EventHeader({ session, preview = false }) {
  return (
    <header className="relative border-b border-white/10 pb-4 pt-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.24em] text-rose-100">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.9)]" />
            Live
          </span>
          {preview && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-slate-300">
              Preview
            </span>
          )}
        </div>

      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-cyan-300/80">
          {session?.eventName ? 'Event' : 'Technology Leadership Summit'}
        </p>
        <h1 className="max-w-5xl text-2xl font-semibold tracking-[-0.06em] text-white sm:text-3xl lg:text-4xl xl:text-[3rem]">
          {session?.eventName || 'Technology Leadership Summit'}
        </h1>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-300 sm:text-base">
          {session?.sessionName || 'AI in Enterprise Panel'}
        </p>
      </div>
    </header>
  )
}

export default EventHeader
const labels = { draft: 'Draft', live: 'Live', completed: 'Completed', speaking: 'Speaking', next: 'Next', upcoming: 'Upcoming' }

function StatusIndicator({ status = 'draft' }) {
  const live = status === 'live' || status === 'speaking'
  const tone = live
    ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
    : status === 'completed'
      ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
      : status === 'next'
        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
        : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-500' : status === 'next' ? 'bg-amber-500' : 'bg-slate-400'}`} />
      {labels[status] || status}
    </span>
  )
}

export default StatusIndicator
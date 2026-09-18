const labels = { draft: 'Draft', live: 'Live', completed: 'Completed', speaking: 'Speaking', next: 'Next', upcoming: 'Upcoming' }

function StatusIndicator({ status = 'draft' }) {
  const live = status === 'live' || status === 'speaking'
  return <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${live ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}><span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-slate-400'}`} />{labels[status] || status}</span>
}

export default StatusIndicator
const statusStyles = {
  speaking: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/30',
  next: 'bg-amber-300/15 text-amber-100 ring-amber-200/30',
  upcoming: 'bg-white/10 text-slate-200 ring-white/15',
  completed: 'bg-slate-500/15 text-slate-400 ring-slate-400/20',
}

const statusLabels = {
  speaking: 'Speaking now',
  next: 'Next up',
  upcoming: 'Upcoming',
  completed: 'Completed',
}

function SpeakerStatusBadge({ status = 'upcoming', light = false }) {
  const style = light
    ? 'bg-slate-100 text-slate-600 ring-slate-200'
    : statusStyles[status] || statusStyles.upcoming

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ring-1 ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'speaking' ? 'animate-pulse bg-emerald-300' : 'bg-current'}`} />
      {statusLabels[status] || status}
    </span>
  )
}

export default SpeakerStatusBadge
const statusStyles = {
  speaking: 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/30 shadow-[0_0_0_1px_rgba(110,231,183,0.15)]',
  next: 'bg-amber-400/15 text-amber-100 ring-1 ring-amber-200/30',
  upcoming: 'bg-white/10 text-slate-200 ring-1 ring-white/10',
  completed: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/20',
}

const statusLabels = {
  speaking: 'Speaking now',
  next: 'Next up',
  upcoming: 'Upcoming',
  completed: 'Completed',
}

function SpeakerStatusBadge({ status = 'upcoming', light = false }) {
  const style = light
    ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
    : statusStyles[status] || statusStyles.upcoming

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'speaking' ? 'animate-pulse bg-emerald-300' : 'bg-current'}`} />
      {statusLabels[status] || status}
    </span>
  )
}

export default SpeakerStatusBadge
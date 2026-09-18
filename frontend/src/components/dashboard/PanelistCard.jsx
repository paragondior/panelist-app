import SpeakerStatusBadge from './SpeakerStatusBadge'

function PanelistCard({ panelist, completed = false }) {
  return (
    <article className={`group flex gap-4 rounded-2xl border p-4 transition duration-300 hover:-translate-y-1 ${completed ? 'border-white/5 bg-white/[0.03] opacity-65' : 'border-white/10 bg-white/[0.06] hover:border-cyan-200/30 hover:bg-white/[0.1]'}`}>
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-800">
        {panelist.profileImage ? (
          <img className="h-full w-full object-cover" src={panelist.profileImage} alt={panelist.fullName} />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-300/40 to-slate-800 text-xl font-semibold text-white">{panelist.fullName?.slice(0, 1)}</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white">{panelist.fullName}</h3>
            <p className="mt-1 truncate text-sm text-slate-400">{[panelist.role, panelist.company].filter(Boolean).join(' · ')}</p>
          </div>
          <SpeakerStatusBadge light={completed} status={completed ? 'completed' : panelist.status} />
        </div>
      </div>
    </article>
  )
}

export default PanelistCard
import SpeakerStatusBadge from './SpeakerStatusBadge'

function PanelistCard({ panelist, completed = false }) {
  return (
    <article className={`group flex gap-4 rounded-[1.6rem] border p-4 shadow-[0_16px_32px_rgba(15,23,42,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_18px_40px_rgba(34,211,238,0.12)] ${completed ? 'border-white/8 bg-slate-900/40 opacity-75' : 'border-white/10 bg-white/[0.06]'}`}>
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-md shadow-slate-950/40">
        {panelist.profileImage ? (
          <img className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]" src={panelist.profileImage} alt={panelist.fullName} />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-300/50 to-slate-800 text-xl font-semibold text-white">
            {panelist.fullName?.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">{panelist.fullName}</h3>
            <p className="mt-1 truncate text-sm text-slate-400">{[panelist.role, panelist.company].filter(Boolean).join(' · ')}</p>
          </div>
          <SpeakerStatusBadge light={completed} status={completed ? 'completed' : panelist.status} />
        </div>

        {panelist.topic && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">{panelist.topic}</p>
        )}
      </div>
    </article>
  )
}

export default PanelistCard
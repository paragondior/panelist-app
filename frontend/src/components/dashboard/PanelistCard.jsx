

function PanelistCard({ panelist }) {
  return (
    <article className="group flex w-full flex-col items-center">
      <div className="h-34 w-34 shrink-0 overflow-hidden rounded-full border border-white/15 bg-slate-800  mb-4 shadow-md shadow-slate-950/40">
        {panelist.profileImage ? (
          <img className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]" src={panelist.profileImage} alt={panelist.fullName} />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-300/50 to-slate-800 text-xl font-semibold text-white">
            {panelist.fullName?.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="min-w-0 items-center">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate  text-base font-semibold tracking-tight text-white">{panelist.fullName}</h3>
            <p className="mt-1 truncate text-xs text-slate-400">{[panelist.role, panelist.company].filter(Boolean).join(' · ')}</p>
          </div>
        
        </div>

        
      </div>
    </article>
  )
}

export default PanelistCard
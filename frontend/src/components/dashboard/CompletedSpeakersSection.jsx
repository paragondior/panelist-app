import PanelistCard from './PanelistCard'

function CompletedSpeakersSection({ panelists }) {
  return (
    <section aria-labelledby="completed-heading" className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-3 shadow-[0_12px_24px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Conversation</p>
          <h2 id="completed-heading" className="mt-1 text-base font-semibold tracking-[-0.03em] text-slate-200">Completed speakers</h2>
        </div>
      </div>

      {panelists.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">{panelists.map((panelist) => <div className="min-w-[180px] flex-1 opacity-80" key={panelist._id}><PanelistCard completed panelist={panelist} /></div>)}</div>
      ) : (
        <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-slate-900/30 p-4 text-sm text-slate-400">
          No completed speakers yet.
        </div>
      )}
    </section>
  )
}

export default CompletedSpeakersSection
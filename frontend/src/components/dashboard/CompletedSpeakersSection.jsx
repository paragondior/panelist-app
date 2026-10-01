import PanelistCard from './PanelistCard'

function CompletedSpeakersSection({ panelists }) {
  return (
<section aria-labelledby="completed-heading" className="relative">
      <div >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 pt-7">Conversation</p>
        <h2
  id="completed-heading"
  className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400 "
>Completed speakers</h2>
        </div>
      </div>

      {panelists.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">{panelists.map((panelist) => <div className="w-[160px] shrink-0 opacity-40" key={panelist._id}><PanelistCard completed panelist={panelist} /></div>)}</div>
      ) : (
        <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-slate-900/30 p-4 text-sm text-slate-400">
          No completed speakers yet.
        </div>
      )}
    </section>
  )
}

export default CompletedSpeakersSection
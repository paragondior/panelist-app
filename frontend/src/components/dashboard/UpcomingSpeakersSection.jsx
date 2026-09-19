import PanelistCard from './PanelistCard'

function UpcomingSpeakersSection({ panelists }) {
  return (
    <section aria-labelledby="upcoming-heading" className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_18px_35px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Next</p>
          <h2 id="upcoming-heading" className="mt-1 text-lg font-semibold tracking-[-0.04em] text-white">Upcoming speakers</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
          {panelists.length} remaining
        </span>
      </div>

      {panelists.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">{panelists.map((panelist) => <div className="min-w-[220px] flex-1" key={panelist._id}><PanelistCard panelist={panelist} /></div>)}</div>
      ) : (
        <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-slate-900/30 p-4 text-sm text-slate-400">
          No upcoming speakers have been scheduled yet.
        </div>
      )}
    </section>
  )
}

export default UpcomingSpeakersSection
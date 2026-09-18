import PanelistCard from './PanelistCard'

function UpcomingSpeakersSection({ panelists }) {
  return (
    <section aria-labelledby="upcoming-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">On deck</p>
          <h2 id="upcoming-heading" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Upcoming speakers</h2>
        </div>
        <span className="text-sm text-slate-500">{panelists.length} remaining</span>
      </div>
      {panelists.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">{panelists.map((panelist) => <PanelistCard key={panelist._id} panelist={panelist} />)}</div>
      ) : <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-500">No upcoming speakers have been added.</p>}
    </section>
  )
}

export default UpcomingSpeakersSection
import PanelistCard from './PanelistCard'

function UpcomingSpeakersSection({ panelists }) {
  const shouldAnimate = panelists.length > 0

  return (
    <section aria-labelledby="upcoming-heading" className="relative">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Next
          </p>

          <h2
            id="upcoming-heading"
            className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-slate-300"
          >
            Upcoming speakers
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
          {panelists.length} remaining
        </span>
      </div>

      {panelists.length > 0 ? (
       <div className="speaker-rail relative h-[330px] w-full overflow-hidden pb-1 pt-2">
        <div className={shouldAnimate ? 'speaker-rail-track flex w-max' : 'flex gap-8'}>
  {panelists.map((panelist) => (
    <div
      className="w-[220px] shrink-0 mr-8"
      key={panelist._id}
    >
      <PanelistCard panelist={panelist} />
    </div>
  ))}
</div>
        </div>
      ) : (
        <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-slate-900/30 p-4 text-sm text-slate-400">
          No upcoming speakers have been scheduled yet.
        </div>
      )}
    </section>
  )
}

export default UpcomingSpeakersSection
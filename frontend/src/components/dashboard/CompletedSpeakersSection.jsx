import PanelistCard from './PanelistCard'

function CompletedSpeakersSection({ panelists }) {
  return (
    <section aria-labelledby="completed-heading">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">The conversation so far</p>
        <h2 id="completed-heading" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-300">Completed speakers</h2>
      </div>
      {panelists.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">{panelists.map((panelist) => <PanelistCard completed key={panelist._id} panelist={panelist} />)}</div>
      ) : <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-600">No completed speakers yet.</p>}
    </section>
  )
}

export default CompletedSpeakersSection
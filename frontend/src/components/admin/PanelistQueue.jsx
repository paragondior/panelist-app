import StatusIndicator from './StatusIndicator'

function PanelistQueue({ panelists, onEdit, onDelete }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Panelist queue</h2>
          <p className="mt-1 text-sm text-slate-500">Speaking order for the selected session.</p>
        </div>

        <button
          className="rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          onClick={() => onEdit(null)}
          type="button"
        >
          Add panelist
        </button>
      </div>

      {panelists.length ? (
        <div className="mt-5 divide-y divide-slate-100">
          {panelists.map((panelist) => (
            <div className="flex items-center justify-between gap-3 py-4" key={panelist._id}>
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                  {panelist.speakingOrder}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{panelist.fullName}</p>
                  <p className="truncate text-sm text-slate-500">{[panelist.role, panelist.company].filter(Boolean).join(' · ')}</p>
                </div>

                <StatusIndicator status={panelist.status} />
              </div>

              <div className="flex shrink-0 gap-2">
                <button className="text-sm font-semibold text-cyan-700 hover:text-cyan-900" onClick={() => onEdit(panelist)} type="button">Edit</button>
                <button className="text-sm font-semibold text-rose-600 hover:text-rose-800" onClick={() => onDelete(panelist)} type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          No panelists in this session yet.
        </p>
      )}
    </section>
  )
}

export default PanelistQueue
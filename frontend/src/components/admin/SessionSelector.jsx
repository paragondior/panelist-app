import StatusIndicator from './StatusIndicator'

function SessionSelector({ sessions, value, onChange, onCreate }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-semibold text-slate-700">Active session<select className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" value={value || ''} onChange={(event) => onChange(event.target.value)}><option value="">Select a session</option>{sessions.map((session) => <option key={session._id} value={session._id}>{session.eventName} · {session.sessionName}</option>)}</select></label>{value && <StatusIndicator status={sessions.find((session) => session._id === value)?.status} />}<button className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800" onClick={onCreate} type="button">New session</button>
    </div>
  )
}

export default SessionSelector
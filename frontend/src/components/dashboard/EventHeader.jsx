import SpeakerStatusBadge from './SpeakerStatusBadge'

function EventHeader({ session, preview = false }) {
  return (
    <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Panelist live</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          {session?.eventName || 'Technology Leadership Summit'}
        </h1>
        <p className="mt-3 text-base text-slate-400 sm:text-lg">
          {session?.sessionName || 'AI in Enterprise Panel'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {preview && <span className="text-xs font-medium text-slate-500">Preview data</span>}
        <SpeakerStatusBadge status={session?.status === 'live' ? 'speaking' : 'upcoming'} />
      </div>
    </header>
  )
}

export default EventHeader
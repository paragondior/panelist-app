function SpeakerControls({
  panelists,
  currentSpeaker,
  onSelect,
  onStart,
  onEnd,
  onReset,
  isLoading,
  voiceIntroductionEnabled,
  onVoiceIntroductionChange,
}) {
  const currentIndex = panelists.findIndex((panelist) => panelist._id === currentSpeaker?._id)
  const designatedPanelist =
    currentSpeaker?.status === 'next'
      ? panelists.find((panelist) => panelist._id === currentSpeaker._id) || currentSpeaker
      : null
  const automaticNextPanelist =
    designatedPanelist ||
    panelists.find((panelist) => panelist.status === 'next') ||
    panelists.slice(currentIndex + 1).find((panelist) => panelist.status === 'upcoming') ||
    panelists.find((panelist) => panelist.status === 'upcoming')
  const selectedPanelistId = designatedPanelist?._id || ''

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Speaker controls</h2>
          <p className="mt-1 text-sm text-slate-500">
            Select a panelist to feature publicly, then start them when ready.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {isLoading ? 'Updating...' : 'Ready'}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">Voice Introduction</p>
            <p className="mt-1 text-xs text-slate-500">
              Automatically introduce speakers when they start.
            </p>
          </div>
          <button
            aria-checked={voiceIntroductionEnabled}
            aria-label="Voice Introduction"
            className={`relative inline-flex h-8 w-[4.25rem] shrink-0 items-center rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
              voiceIntroductionEnabled ? 'bg-emerald-600' : 'bg-slate-400'
            }`}
            onClick={() => onVoiceIntroductionChange(!voiceIntroductionEnabled)}
            role="switch"
            type="button"
          >
            <span
              className={`absolute text-[10px] font-bold uppercase tracking-wide text-white ${
                voiceIntroductionEnabled ? 'left-2' : 'right-2'
              }`}
            >
              {voiceIntroductionEnabled ? 'ON' : 'OFF'}
            </span>
            <span
              className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${
                voiceIntroductionEnabled ? 'translate-x-[2.25rem]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
          Select next speaker
          <select
            className="admin-input mt-2"
            disabled={!panelists.length || isLoading}
            onChange={(event) => {
              if (event.target.value) onSelect(event.target.value)
            }}
            value={selectedPanelistId}
          >
            <option value="">Choose a panelist...</option>
            {panelists.map((panelist) => (
              <option key={panelist._id} value={panelist._id}>
                {panelist.fullName}
                {panelist.status === 'speaking'
                  ? ' — Speaking'
                  : panelist.status === 'completed'
                    ? ' — Completed'
                    : ''}
              </option>
            ))}
          </select>
          {designatedPanelist && (
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Designated: {designatedPanelist.fullName}
            </span>
          )}
        </label>

        <button
          className="rounded-lg border border-rose-200 px-4 py-3 text-sm font-bold text-rose-700 hover:bg-green-400 disabled:opacity-50"
          disabled={!automaticNextPanelist || isLoading}
          onClick={() => onStart(automaticNextPanelist?._id)}
          type="button"
        >
          Start next speaker
        </button>
        <button
          className="rounded-lg border border-rose-200 px-4 py-3 text-sm font-bold text-rose-700 hover:bg-red-400 disabled:opacity-50"
          disabled={!currentSpeaker || isLoading}
          onClick={onEnd}
          type="button"
        >
          End current speaker
        </button>
        <button
          className="rounded-lg border border-rose-200 px-4 py-3 text-sm font-bold text-rose-700 hover:bg-red-400 disabled:opacity-50 sm:col-span-2"
          disabled={isLoading}
          onClick={onReset}
          type="button"
        >
          Reset session
        </button>
      </div>
    </section>
  )
}

export default SpeakerControls
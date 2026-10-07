const displayModes = [
  {
    value: 'showcase',
    title: 'Live Showcase',
    description: 'Cinematic speaker-focused display',
  },
  {
    value: 'panelist-wall',
    title: 'Panelist Wall',
    description: 'Full panelist overview',
  },
]

function DisplayModeSelector({ value = 'showcase', onChange, isLoading }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <legend className="px-1 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
        Public display mode
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {displayModes.map((mode) => {
          const selected = value === mode.value

          return (
            <button
              aria-pressed={selected}
              className={`rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                selected
                  ? 'border-cyan-500 bg-cyan-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              } disabled:cursor-not-allowed disabled:opacity-60`}
              disabled={isLoading || selected}
              key={mode.value}
              onClick={() => onChange(mode.value)}
              type="button"
            >
              <span className="block text-base font-semibold text-slate-900">{mode.title}</span>
              <span className="mt-1 block text-sm text-slate-500">{mode.description}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default DisplayModeSelector

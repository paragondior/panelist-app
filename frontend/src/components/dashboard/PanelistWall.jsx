import { useEffect, useState } from 'react'
import './PanelistWall.css'

function SpeakerPortrait({ panelist, featured = false }) {
  return (
    <div
      className={`aspect-square shrink-0 overflow-hidden rounded-full border border-cyan-100/25 bg-slate-800 ${
        featured
          ? 'w-64 shadow-[0_0_65px_rgba(34,211,238,0.22)] sm:w-80 lg:w-[22rem]'
          : 'w-32 shadow-[0_0_35px_rgba(34,211,238,0.1)] sm:w-40 lg:w-48'
      }`}
    >
      {panelist.profileImage ? (
        <img
          className="h-full w-full object-cover"
          src={panelist.profileImage}
          alt={panelist.fullName}
        />
      ) : (
        <div
          className={`flex h-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/45 via-blue-900/80 to-slate-950 font-semibold text-white ${
            featured ? 'text-8xl' : 'text-5xl'
          }`}
        >
          {panelist.fullName?.slice(0, 1)}
        </div>
      )}
    </div>
  )
}

function SpeakerFeature({ speaker }) {
  return (
    <div className="flex flex-col items-center px-3 text-center">
      <SpeakerPortrait featured panelist={speaker} />
      <h2 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
        {speaker.fullName}
      </h2>
      <p className="mt-3 text-lg font-medium text-cyan-100 sm:text-xl">
        {[speaker.role, speaker.company].filter(Boolean).join(' · ')}
      </p>
      {speaker.topic && (
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          “{speaker.topic}”
        </p>
      )}
    </div>
  )
}

function PanelistWall({ speaker, panelists }) {
  const selectedSpeaker = speaker || null
  const speakerId = selectedSpeaker?._id || null
  const [transition, setTransition] = useState(() => ({
    speakerId,
    speaker: selectedSpeaker,
    departingSpeaker: null,
    active: false,
  }))

  if (transition.speakerId !== speakerId || transition.speaker !== selectedSpeaker) {
    const isSpeakerChange = transition.speakerId !== speakerId
    setTransition({
      speakerId,
      speaker: selectedSpeaker,
      departingSpeaker: isSpeakerChange
        ? transition.speaker || transition.departingSpeaker
        : transition.departingSpeaker,
      active: isSpeakerChange
        ? Boolean(transition.speaker || transition.departingSpeaker)
        : transition.active,
    })
  }

  useEffect(() => {
    if (!transition.active) {
      return undefined
    }

    const transitionTimer = window.setTimeout(() => {
      setTransition((current) =>
        current.speakerId === speakerId
          ? { ...current, departingSpeaker: null, active: false }
          : current,
      )
    }, 650)

    return () => window.clearTimeout(transitionTimer)
  }, [speakerId, transition.active])

  const otherPanelists = panelists.filter(
    (panelist) => String(panelist._id) !== String(speaker?._id),
  )
  const hasFeaturedSpeaker = Boolean(speaker || transition.departingSpeaker)

  return (
    <div className="mt-6 space-y-8">
      <section
        aria-labelledby="wall-current-heading"
        className="relative overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-slate-950/45 px-4 py-7 shadow-[0_25px_80px_rgba(2,6,23,0.45)] backdrop-blur sm:px-8 sm:py-9"
      >
        <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />

        <div className="relative text-center">
          <p
            id="wall-current-heading"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200"
          >
            {speaker ? 'Current speaker' : 'Panelists'}
          </p>

          {hasFeaturedSpeaker ? (
            <div
              className={`panelist-wall-stage mt-6 ${
                transition.active ? 'panelist-wall-stage--transitioning' : ''
              }`}
            >
              {transition.departingSpeaker && (
                <div
                  aria-hidden="true"
                  className="panelist-wall-performer panelist-wall-performer--exit"
                  key={`departing-${transition.departingSpeaker._id}`}
                >
                  <SpeakerFeature speaker={transition.departingSpeaker} />
                </div>
              )}
              {speaker && (
                <div
                  className={`panelist-wall-performer ${
                    transition.active ? 'panelist-wall-performer--enter' : ''
                  }`}
                  key={`current-${speaker._id}`}
                >
                  <SpeakerFeature speaker={speaker} />
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-slate-300">
              No speaker selected
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="wall-panelists-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
              The conversation
            </p>
            <h2
              id="wall-panelists-heading"
              className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-white sm:text-2xl"
            >
              {speaker ? 'Other panelists' : 'All panelists'}
            </h2>
          </div>
          <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
            {otherPanelists.length} panelists
          </span>
        </div>

        {otherPanelists.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {otherPanelists.map((panelist) => (
              <article
                className="flex min-w-0 flex-col items-center px-2 text-center"
                key={panelist._id}
              >
                <SpeakerPortrait panelist={panelist} />
                <h3 className="mt-4 max-w-full truncate text-base font-semibold text-white sm:text-lg">
                  {panelist.fullName}
                </h3>
                <p className="mt-1 max-w-56 text-sm leading-5 text-slate-300">
                  {[panelist.role, panelist.company].filter(Boolean).join(' · ')}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-white/15 bg-slate-900/30 p-5 text-center text-sm text-slate-300">
            No other panelists are scheduled for this session.
          </p>
        )}
      </section>
    </div>
  )
}

export default PanelistWall

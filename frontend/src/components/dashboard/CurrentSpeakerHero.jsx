import { useEffect, useState } from 'react'
import SpeakerStatusBadge from './SpeakerStatusBadge'

function CurrentSpeakerHero({ speaker }) {
  const [visibleBio, setVisibleBio] = useState('')

  useEffect(() => {
    let typingTimer
    const resetTimer = window.setTimeout(() => {
      setVisibleBio('')

      if (!speaker?.bio) {
        return
      }

      let characterIndex = 0
      typingTimer = window.setInterval(() => {
        characterIndex += 1
        setVisibleBio(speaker.bio.slice(0, characterIndex))

        if (characterIndex >= speaker.bio.length) {
          window.clearInterval(typingTimer)
        }
      }, 75)
    }, 0)

    return () => {
      window.clearTimeout(resetTimer)
      if (typingTimer) {
        window.clearInterval(typingTimer)
      }
    }
  }, [speaker?._id, speaker?.bio])

  if (!speaker) {
    return (
      <section className="animate-fade-up relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_rgba(2,6,23,0.75)] backdrop-blur-sm sm:p-10 lg:p-12">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Current speaker</p>
        <h2 className="relative mt-5 max-w-xl text-3xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">The next voice will appear here.</h2>
        <p className="relative mt-4 max-w-lg text-base leading-7 text-slate-400">The session has not selected a current speaker yet. A live voice will appear here once the moderator starts the conversation.</p>
      </section>
    )
  }

  const speakerKey = speaker?._id || speaker?.fullName || 'no-speaker'

  return (
    <section key={speakerKey} className="speaker-enter relative min-h-[58vh] overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-gradient-to-br from-cyan-400/12 via-slate-900/90 to-slate-950 p-4 shadow-[0_35px_90px_rgba(2,6,23,0.8)] sm:p-6 lg:min-h-[64vh] lg:p-8">
      <div className="speaker-spotlight pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />

      <div className="relative grid h-full gap-8 lg:grid-cols-[minmax(18rem,0.85fr)_1.15fr] lg:items-center lg:gap-10">
        <div className="speaker-image-wrap relative aspect-[4/3] overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-800 shadow-[0_25px_60px_rgba(15,23,42,0.6)] lg:aspect-[4/5]">
          {speaker.profileImage ? (
            <img className="speaker-image h-full w-full object-cover" src={speaker.profileImage} alt={speaker.fullName} />
          ) : (
            <div className="flex h-full items-end bg-gradient-to-br from-cyan-300/55 via-slate-800 to-slate-950 p-6">
              <span className="text-7xl font-semibold tracking-[-0.08em] text-white/80">{speaker.fullName?.slice(0, 1)}</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
        </div>

        <div className="speaker-content relative flex h-full flex-col justify-center">
          <div className="flex items-center gap-3">
            <SpeakerStatusBadge status="speaking" />
          </div>

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl lg:text-6xl xl:text-[5rem]">{speaker.fullName}</h2>
          <p className="mt-3 text-lg leading-7 text-slate-200 sm:text-xl">{[speaker.role, speaker.company].filter(Boolean).join(' · ')}</p>

          {(speaker.topic || speaker.bio) && (
            <div className="bio-panel mt-8 max-w-xl rounded-[1.5rem] border border-white/10 bg-slate-900/45 p-5 shadow-[0_14px_35px_rgba(2,6,23,0.45)] backdrop-blur-sm">
              {speaker.topic && (
                <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">“{speaker.topic}”</p>
              )}
              {speaker.bio && (
                <p className="bio-copy mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  {visibleBio}
                  <span className="typewriter-cursor" aria-hidden="true">|</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CurrentSpeakerHero
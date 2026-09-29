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
    <section key={speakerKey} className="speaker-enter relative min-h-[50vh] overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-gradient-to-br from-cyan-400/12 via-slate-900/90 to-slate-950 p-3 shadow-[0_35px_90px_rgba(2,6,23,0.8)] sm:p-5 lg:min-h-[55vh] lg:p-6">
      <div className="speaker-spotlight pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 lg:translate-x-[52px] rounded-full border border-cyan-200/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />

      <div className="relative grid h-full gap-6 lg:grid-cols-[minmax(16rem,0.82fr)_1.18fr] lg:items-center lg:gap-8">
        

        <div className="speaker-content relative flex h-full flex-col justify-center">
          <div className="flex items-center gap-3">
            <SpeakerStatusBadge status="speaking" />
          </div>

         
          
  {speaker.topic && (
                <p className="mt-8 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">“{speaker.topic}”</p>
              )}

          
            {speaker.bio && (
  <p className="bio-copy mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
    {visibleBio}
    <span className="typewriter-cursor" aria-hidden="true">|</span>
  </p>
)}
            </div>
         
        <div className="flex flex-col items-center lg:translate-x-[52px]">
          <div className="mb-3 flex justify-end lg:translate-x-40">
  <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 backdrop-blur-md">
    {speaker.company}
  </span>
</div>
        <div className="speaker-image-wrap relative   items-center  h-[400px] w-[400px]   overflow-hidden rounded-full border border-white/10 bg-slate-800 shadow-[0_25px_60px_rgba(15,23,42,0.6)] ">
          {speaker.profileImage ? (
            <img className="speaker-image h-full w-full object-cover" src={speaker.profileImage} alt={speaker.fullName} />
          ) : (
            <div className="flex h-full items-end bg-gradient-to-br from-cyan-300/55 via-slate-800 to-slate-950 p-6">
              <span className="text-7xl font-semibold tracking-[-0.08em] text-white/80">{speaker.fullName?.slice(0, 1)}</span>
            </div>
            
          )}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
        </div>
         <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">{speaker.fullName}</h2>
         <p className="mt-2 text-sm font-medium leading-6 text-slate-400 sm:text-base">{[speaker.role, speaker.company].filter(Boolean).join(' · ')}</p>
         </div>

      </div>
    </section>
  )
}

export default CurrentSpeakerHero
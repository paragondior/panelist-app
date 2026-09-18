import SpeakerStatusBadge from './SpeakerStatusBadge'

function CurrentSpeakerHero({ speaker }) {
  if (!speaker) {
    return (
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-slate-950/30 sm:p-12">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Current speaker</p>
        <h2 className="relative mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">The next voice will appear here.</h2>
        <p className="relative mt-4 max-w-lg text-slate-400">The session has not selected a current speaker yet.</p>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-gradient-to-br from-cyan-300/[0.14] via-white/[0.08] to-white/[0.03] p-5 shadow-2xl shadow-slate-950/40 sm:p-8 lg:p-10">
      <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(15rem,0.8fr)_1.2fr] lg:items-center lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-800 shadow-xl shadow-slate-950/40 lg:aspect-[4/5]">
          {speaker.profileImage ? (
            <img className="h-full w-full object-cover" src={speaker.profileImage} alt={speaker.fullName} />
          ) : (
            <div className="flex h-full items-end bg-gradient-to-br from-cyan-300/50 via-slate-800 to-slate-950 p-6">
              <span className="text-7xl font-semibold tracking-[-0.08em] text-white/80">{speaker.fullName?.slice(0, 1)}</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </div>
        <div>
          <SpeakerStatusBadge status="speaking" />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Current speaker</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">{speaker.fullName}</h2>
          <p className="mt-4 text-lg text-slate-300">{[speaker.role, speaker.company].filter(Boolean).join(' · ')}</p>
          {speaker.topic && <p className="mt-8 max-w-xl text-xl leading-relaxed text-white">“{speaker.topic}”</p>}
          {speaker.bio && <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">{speaker.bio}</p>}
        </div>
      </div>
    </section>
  )
}

export default CurrentSpeakerHero
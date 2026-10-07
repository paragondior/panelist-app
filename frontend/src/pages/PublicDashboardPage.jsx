import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import CompletedSpeakersSection from '../components/dashboard/CompletedSpeakersSection'
import CurrentSpeakerHero from '../components/dashboard/CurrentSpeakerHero'
import DashboardErrorState from '../components/dashboard/DashboardErrorState'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton'
import EventHeader from '../components/dashboard/EventHeader'
import PanelistWall from '../components/dashboard/PanelistWall'
import UpcomingSpeakersSection from '../components/dashboard/UpcomingSpeakersSection'
import { useSocket } from '../hooks/useSocket'
import {
  useSessionStore,
  VOICE_INTRODUCTION_STORAGE_KEY,
} from '../store/session.store'

const previewSession = { eventName: 'Technology Leadership Summit', sessionName: 'AI in Enterprise Panel', status: 'live' }
const previewPanelists = [
  { _id: 'preview-current', fullName: 'Amara Okafor', role: 'VP, Applied AI', company: 'Northstar Systems', topic: 'Building trusted intelligence for the enterprise', bio: 'A product and technology leader focused on responsible AI at scale.', status: 'speaking' },
  { _id: 'preview-next', fullName: 'David Chen', role: 'Chief Product Officer', company: 'Lattice Works', status: 'next' },
  { _id: 'preview-upcoming', fullName: 'Maya Rodriguez', role: 'Research Director', company: 'Signal House', status: 'upcoming' },
  { _id: 'preview-completed', fullName: 'Elena Rossi', role: 'Founder', company: 'Studio Forma', status: 'completed' },
]

const buildSpeakerIntroduction = (speaker) => {
  const name = speaker.fullName?.trim()
  const role = speaker.role?.trim()
  const company = speaker.company?.trim()
  const bio = speaker.bio?.trim()

  if (!name) return ''

  const professionalTitle = role && company
    ? `${role} at ${company}`
    : role || (company ? `from ${company}` : '')
  const welcome = professionalTitle
    ? `Please welcome ${name}, ${professionalTitle}.`
    : `Please welcome ${name}.`

  if (!bio) return welcome

  const maxBioLength = 240
  const shortBio = bio.length <= maxBioLength
    ? bio
    : `${bio.slice(0, maxBioLength).replace(/\s+\S*$/, '').trimEnd()}…`

  return `${welcome} ${name} is ${shortBio}`
}

function PublicDashboardPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session') || import.meta.env.VITE_PUBLIC_SESSION_ID
  const { currentSession, currentSpeaker, panelists, speakerStartedAt, isLoading, error, fetchSession, applySessionSnapshot } = useSessionStore()
  const voiceIntroductionEnabled = useSessionStore((state) => state.voiceIntroductionEnabled)
  const syncVoiceIntroductionPreference = useSessionStore(
    (state) => state.syncVoiceIntroductionPreference,
  )
  const preview = !sessionId
  const lastIntroductionKey = useRef(null)
  const lastObservedIntroductionKey = useRef(null)
  const speakerForIntroduction = useRef(null)

  useEffect(() => {
    if (sessionId) fetchSession(sessionId).catch(() => {})
  }, [fetchSession, sessionId])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== VOICE_INTRODUCTION_STORAGE_KEY && event.key !== null) return
      syncVoiceIntroductionPreference(event.newValue !== 'off')
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [syncVoiceIntroductionPreference])

  useSocket({ sessionId, onSpeakerUpdated: applySessionSnapshot })

  const data = useMemo(() => {
    if (preview) return { session: previewSession, speaker: previewPanelists[0], panelists: previewPanelists }
    return { session: currentSession, speaker: currentSpeaker, panelists }
  }, [currentSession, currentSpeaker, panelists, preview])

  const speakerPanelist = data.panelists.find(
    (panelist) => String(panelist._id) === String(data.speaker?._id),
  )
  const isActuallySpeaking =
    data.speaker?.status === 'speaking' &&
    speakerPanelist?.status === 'speaking' &&
    Boolean(speakerStartedAt)
  const introductionKey = isActuallySpeaking
    ? `${data.speaker._id}:${speakerStartedAt}`
    : null

  useEffect(() => {
    speakerForIntroduction.current = data.speaker
  }, [data.speaker])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined

    if (!introductionKey) {
      window.speechSynthesis.cancel()
      lastObservedIntroductionKey.current = null
      return undefined
    }

    if (!voiceIntroductionEnabled) {
      window.speechSynthesis.cancel()
      lastObservedIntroductionKey.current = introductionKey
      return undefined
    }

    if (lastObservedIntroductionKey.current === introductionKey) {
      return undefined
    }

    if (lastIntroductionKey.current === introductionKey) {
      lastObservedIntroductionKey.current = introductionKey
      return undefined
    }

    if (typeof window.SpeechSynthesisUtterance !== 'function') return undefined

    window.speechSynthesis.cancel()
    const startTimer = window.setTimeout(() => {
      if (
        lastIntroductionKey.current === introductionKey ||
        lastObservedIntroductionKey.current === introductionKey
      ) {
        return
      }

      const introduction = buildSpeakerIntroduction(speakerForIntroduction.current || {})
      if (!introduction) return

      lastIntroductionKey.current = introductionKey
      lastObservedIntroductionKey.current = introductionKey
      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(introduction))
    }, 0)

    return () => {
      window.clearTimeout(startTimer)
      window.speechSynthesis.cancel()
    }
  }, [introductionKey, voiceIntroductionEnabled])

  useEffect(
    () => () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    },
    [],
  )

  const upcoming = data.panelists.filter((panelist) => ['next', 'upcoming'].includes(panelist.status))
  const completed = data.panelists.filter((panelist) => panelist.status === 'completed')
console.log("SESSION DATA:", data.session)
    return (
  <div className="min-h-screen overflow-x-hidden bg-[#02103d] text-white">
    {/* Dark depth layer */}
    <div
      className="
        pointer-events-none
        fixed
        inset-0
        bg-[radial-gradient(ellipse,rgba(34,211,238,0.25)_0%,rgba(34,211,238,0.10)_35%,transparent_70%)]
      "
    />

   <div
  className="
    pointer-events-none
    fixed
    inset-0
    opacity-100
   bg-[radial-gradient(circle_at_70%_15%,rgba(37,99,235,0.94),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.40),transparent_48%),radial-gradient(circle_at_20%_40%,rgba(59,130,246,0.55),transparent_40%),radial-gradient(circle_at_50%_45%,rgba(6,182,212,0.25),transparent_45%)]
  "
/>
<div
  className="
    pointer-events-none
    fixed
    bottom-[-20%]
    left-1/2
    h-[700px]
    w-[900px]
    -translate-x-1/2
    rounded-full
    bg-cyan-400/15
    blur-[180px]
  "
/>
     <div
  className="
    pointer-events-none
    fixed
    inset-0
    opacity-30
    [background-image:linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)]
    [background-size:72px_72px]
  "
/>
{/* Technical background lines */}
<div className="pointer-events-none fixed inset-0 opacity-30">
  <svg
    className="h-full w-full"
    viewBox="0 0 1920 1080"
    preserveAspectRatio="none"
  >
    <path
      d="M0 260 L260 180 L520 300 L780 190 L1040 310 L1300 200 L1560 320 L1920 220"
      stroke="rgba(59,130,246,0.35)"
      strokeWidth="1"
      fill="none"
    />

    <path
      d="M0 760 L220 680 L470 790 L720 660 L980 780 L1230 690 L1500 800 L1920 700"
      stroke="rgba(34,211,238,0.25)"
      strokeWidth="1"
      fill="none"
    />

    <path
      d="M300 0 L380 140 L300 280 L390 420 L310 560 L400 700 L320 850 L410 1080"
      stroke="rgba(59,130,246,0.18)"
      strokeWidth="1"
      fill="none"
    />

    <path
      d="M1500 0 L1420 150 L1510 290 L1430 430 L1520 570 L1440 720 L1530 870 L1460 1080"
      stroke="rgba(34,211,238,0.18)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
</div>
{/* Background grain / noise */}
<div className="pointer-events-none fixed inset-0 opacity-[0.40]">
  <svg className="h-full w-full">
    <filter id="backgroundNoise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>

    <rect
      width="100%"
      height="100%"
      filter="url(#backgroundNoise)"
    />
  </svg>
</div>
<div className="pointer-events-none fixed inset-0 opacity-50">
 <svg
  className="h-full w-full animate-[pulse_6s_ease-in-out_infinite]"
    viewBox="0 0 1920 1080"
    preserveAspectRatio="none"
       
  >
    <defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="8" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</defs>
 <path
  d="M-100 850 C 300 500, 600 1200, 1100 700 S 1800 300, 2100 700"
  stroke="rgba(56,189,248,0.75)"
  strokeWidth="3"
  fill="none"
  filter="url(#glow)"
/>

 <path
  d="M-200 500 C 400 200, 800 900, 1400 450 S 2000 100, 2200 550"
  stroke="rgba(34,211,238,0.60)"
  strokeWidth="2.5"
  fill="none"
  filter="url(#glow)"
/>

   <path
  d="M0 1050 C 500 700, 900 1200, 1500 800 S 2100 500, 2400 850"
  stroke="rgba(96,165,250,0.12)"
  strokeWidth="1.5"
  fill="none"
/>
  </svg>
</div>
<div className="pointer-events-none fixed inset-0">

  {/* Large atmospheric node */}
  <div className="absolute left-[12%] top-[20%] h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_25px_8px_rgba(103,232,249,0.25)]" />

  {/* Small distant node */}
  <div className="absolute left-[70%] top-[28%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_5px_rgba(103,232,249,0.22)]" />

  {/* Strong node */}
  <div className="absolute left-[80%] top-[60%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_28px_8px_rgba(103,232,249,0.3)]" />

  {/* Faint node */}
  <div className="absolute left-[25%] top-[80%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_4px_rgba(103,232,249,0.18)]" />

</div>

      <main className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {isLoading && !preview ? <DashboardSkeleton /> : error && !preview ? <DashboardErrorState message={error} onRetry={() => fetchSession(sessionId).catch(() => {})} /> : (
          <div className="flex min-h-[calc(100vh-2rem)] flex-col">
            <EventHeader preview={preview} session={data.session} />
            {data.session?.displayMode === 'panelist-wall' ? (
              <PanelistWall speaker={data.speaker} panelists={data.panelists} />
            ) : (
              <>
<div className="relative mt-5 flex-1">

  {/* Soft illumination behind the current speaker */}
 <div
  className="
    pointer-events-none
    absolute
    left-1/2
    top-1/2
    h-[460px]
    w-[1000px]
    -translate-x-1/2
    -translate-y-1/2
    rounded-full
    bg-[radial-gradient(ellipse,rgba(34,211,238,0.12)_0%,rgba(34,211,238,0.05)_35%,transparent_70%)]
    blur-[30px]
  "
/>

  <CurrentSpeakerHero speaker={data.speaker} session={data.session} />

</div>

<div className="mt-5 space-y-4">
  <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-8">
    <UpcomingSpeakersSection panelists={upcoming} />
  </div>

  <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-8">
    <CompletedSpeakersSection panelists={completed} />
  </div>
</div>
              </>
  )}
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicDashboardPage
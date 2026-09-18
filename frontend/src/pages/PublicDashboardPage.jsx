import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CompletedSpeakersSection from '../components/dashboard/CompletedSpeakersSection'
import CurrentSpeakerHero from '../components/dashboard/CurrentSpeakerHero'
import DashboardErrorState from '../components/dashboard/DashboardErrorState'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton'
import EventHeader from '../components/dashboard/EventHeader'
import UpcomingSpeakersSection from '../components/dashboard/UpcomingSpeakersSection'
import { useSocket } from '../hooks/useSocket'
import { useSessionStore } from '../store/session.store'

const previewSession = { eventName: 'Technology Leadership Summit', sessionName: 'AI in Enterprise Panel', status: 'live' }
const previewPanelists = [
  { _id: 'preview-current', fullName: 'Amara Okafor', role: 'VP, Applied AI', company: 'Northstar Systems', topic: 'Building trusted intelligence for the enterprise', bio: 'A product and technology leader focused on responsible AI at scale.', status: 'speaking' },
  { _id: 'preview-next', fullName: 'David Chen', role: 'Chief Product Officer', company: 'Lattice Works', status: 'next' },
  { _id: 'preview-upcoming', fullName: 'Maya Rodriguez', role: 'Research Director', company: 'Signal House', status: 'upcoming' },
  { _id: 'preview-completed', fullName: 'Elena Rossi', role: 'Founder', company: 'Studio Forma', status: 'completed' },
]

function PublicDashboardPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session') || import.meta.env.VITE_PUBLIC_SESSION_ID
  const { currentSession, currentSpeaker, panelists, isLoading, error, fetchSession, applySessionSnapshot } = useSessionStore()
  const preview = !sessionId

  useEffect(() => {
    if (sessionId) fetchSession(sessionId).catch(() => {})
  }, [fetchSession, sessionId])

  useSocket({ sessionId, onSpeakerUpdated: applySessionSnapshot })

  const data = useMemo(() => {
    if (preview) return { session: previewSession, speaker: previewPanelists[0], panelists: previewPanelists }
    return { session: currentSession, speaker: currentSpeaker, panelists }
  }, [currentSession, currentSpeaker, panelists, preview])

  const upcoming = data.panelists.filter((panelist) => ['next', 'upcoming'].includes(panelist.status))
  const completed = data.panelists.filter((panelist) => panelist.status === 'completed')

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111d] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_75%_8%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(14,116,144,0.1),transparent_28%)]" />
      <main className="relative mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        {isLoading && !preview ? <DashboardSkeleton /> : error && !preview ? <DashboardErrorState message={error} onRetry={() => fetchSession(sessionId).catch(() => {})} /> : (
          <>
            <EventHeader preview={preview} session={data.session} />
            <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.7fr)] lg:items-start">
              <CurrentSpeakerHero speaker={data.speaker} />
              <div className="space-y-10 lg:pt-2">
                <UpcomingSpeakersSection panelists={upcoming} />
                <CompletedSpeakersSection panelists={completed} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default PublicDashboardPage
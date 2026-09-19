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
    <div className="min-h-screen overflow-x-hidden bg-[#020817] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_28%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:54px_54px]" />

      <main className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {isLoading && !preview ? <DashboardSkeleton /> : error && !preview ? <DashboardErrorState message={error} onRetry={() => fetchSession(sessionId).catch(() => {})} /> : (
          <div className="flex min-h-[calc(100vh-2rem)] flex-col">
            <EventHeader preview={preview} session={data.session} />

            <div className="mt-5 flex-1">
              <CurrentSpeakerHero speaker={data.speaker} />
            </div>

            <div className="mt-5 space-y-4">
              <UpcomingSpeakersSection panelists={upcoming} />
              <CompletedSpeakersSection panelists={completed} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicDashboardPage
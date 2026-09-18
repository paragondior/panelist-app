import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminHeader from '../components/admin/AdminHeader'
import ConfirmDialog from '../components/admin/ConfirmDialog'
import CurrentSpeakerCard from '../components/admin/CurrentSpeakerCard'
import PanelistForm from '../components/admin/PanelistForm'
import PanelistQueue from '../components/admin/PanelistQueue'
import SessionForm from '../components/admin/SessionForm'
import SessionSelector from '../components/admin/SessionSelector'
import SpeakerControls from '../components/admin/SpeakerControls'
import StatusIndicator from '../components/admin/StatusIndicator'
import { useSocket } from '../hooks/useSocket'
import { usePanelistStore } from '../store/panelist.store'
import { useSessionStore } from '../store/session.store'

function AdminDashboardPage() {
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [modal, setModal] = useState(null)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const sessions = useSessionStore((state) => state.sessions)
  const activeSessionId = selectedSessionId || sessions[0]?._id || ''
  const currentSession = useSessionStore((state) => state.currentSession)
  const currentSpeaker = useSessionStore((state) => state.currentSpeaker)
  const sessionPanelists = useSessionStore((state) => state.panelists)
  const sessionLoading = useSessionStore((state) => state.isLoading)
  const sessionError = useSessionStore((state) => state.error)
  const fetchSessions = useSessionStore((state) => state.fetchSessions)
  const fetchSession = useSessionStore((state) => state.fetchSession)
  const createSession = useSessionStore((state) => state.createSession)
  const updateSession = useSessionStore((state) => state.updateSession)
  const deleteSession = useSessionStore((state) => state.deleteSession)
  const selectCurrentSpeaker = useSessionStore((state) => state.selectCurrentSpeaker)
  const startSpeaker = useSessionStore((state) => state.startSpeaker)
  const endSpeaker = useSessionStore((state) => state.endSpeaker)
  const resetSession = useSessionStore((state) => state.resetSession)
  const createPanelist = usePanelistStore((state) => state.createPanelist)
  const updatePanelist = usePanelistStore((state) => state.updatePanelist)
  const deletePanelist = usePanelistStore((state) => state.deletePanelist)

  const refreshSession = useCallback(async (sessionId = activeSessionId) => {
    if (!sessionId) return
    const data = await fetchSession(sessionId)
    usePanelistStore.getState().setPanelists(data.panelists || [])
  }, [activeSessionId, fetchSession])

  useEffect(() => {
    fetchSessions().catch(() => {})
  }, [fetchSessions])

  useEffect(() => {
    refreshSession().catch(() => {})
  }, [refreshSession])

  const handleSocketSnapshot = useCallback((snapshot) => {
    useSessionStore.getState().applySessionSnapshot(snapshot)
  }, [])

  useSocket({ sessionId: activeSessionId, onSpeakerUpdated: handleSocketSnapshot })

  const runAction = async (action, successMessage) => {
    setBusy(true); setFeedback(null)
    try { await action(); setFeedback({ type: 'success', message: successMessage }) } catch (error) { setFeedback({ type: 'error', message: error.response?.data?.message || 'The operation could not be completed.' }) } finally { setBusy(false) }
  }

  const submitSession = async (form) => {
    await runAction(async () => { const saved = modal.item ? await updateSession(modal.item._id, form) : await createSession(form); setSelectedSessionId(saved._id); setModal(null); await refreshSession(saved._id) }, modal.item ? 'Session updated.' : 'Session created.')
  }

  const submitPanelist = async (form) => {
    await runAction(async () => { if (modal.item) await updatePanelist(modal.item._id, form); else await createPanelist(form); setModal(null); await refreshSession() }, modal.item ? 'Panelist updated.' : 'Panelist added.')
  }

  const deleteConfirmed = async () => {
    await runAction(async () => { if (modal.type === 'session') { await deleteSession(modal.item._id); setSelectedSessionId(''); await fetchSessions() } else { await deletePanelist(modal.item._id); await refreshSession() } setModal(null) }, `${modal.type === 'session' ? 'Session' : 'Panelist'} deleted.`)
  }

  const upcomingCount = useMemo(() => sessionPanelists.filter((item) => item.status !== 'completed').length, [sessionPanelists])

  return <section className="mx-auto max-w-7xl space-y-8"><AdminHeader /><SessionSelector sessions={sessions} value={selectedSessionId} onChange={(id) => { setSelectedSessionId(id); setFeedback(null) }} onCreate={() => setModal({ type: 'session', item: null })} />{feedback && <p className={`rounded-lg px-4 py-3 text-sm font-semibold ${feedback.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`} role="status">{feedback.message}</p>}{sessionError && !currentSession && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{sessionError}</p>}{currentSession ? <><div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><CurrentSpeakerCard speaker={currentSpeaker} /><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Session overview</p><h2 className="mt-2 text-xl font-semibold text-slate-950">{currentSession.eventName}</h2><p className="mt-1 text-sm text-slate-500">{currentSession.sessionName}</p></div><StatusIndicator status={currentSession.status} /></div><dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-slate-400">Scheduled</dt><dd className="mt-1 font-semibold text-slate-700">{new Date(currentSession.scheduledAt).toLocaleString()}</dd></div><div><dt className="text-slate-400">On deck</dt><dd className="mt-1 font-semibold text-slate-700">{upcomingCount} panelists</dd></div></dl><div className="mt-6 flex gap-3"><button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold" onClick={() => setModal({ type: 'session', item: currentSession })} type="button">Edit session</button><button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700" onClick={() => setModal({ type: 'confirm', item: currentSession, target: 'session' })} type="button">Delete</button></div></section></div><SpeakerControls currentSpeaker={currentSpeaker} panelists={sessionPanelists} isLoading={busy || sessionLoading} onSelect={(id) => runAction(() => selectCurrentSpeaker(selectedSessionId, id), 'Next speaker selected.')} onStart={(id) => runAction(() => startSpeaker(selectedSessionId, id), 'Speaker started.')} onEnd={() => runAction(() => endSpeaker(selectedSessionId), 'Speaker ended.')} onReset={() => runAction(() => resetSession(selectedSessionId), 'Session reset.')} /><PanelistQueue panelists={sessionPanelists} onEdit={(item) => setModal({ type: 'panelist', item })} onDelete={(item) => setModal({ type: 'confirm', item, target: 'panelist' })} /></> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="text-xl font-semibold text-slate-900">{sessionLoading ? 'Loading session...' : 'No session selected'}</h2><p className="mt-2 text-sm text-slate-500">Create a session or choose one above to manage its speakers.</p></div>}{modal?.type === 'session' && <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-5"><div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><h2 className="mb-5 text-xl font-semibold">{modal.item ? 'Edit session' : 'Create session'}</h2><SessionForm session={modal.item} isLoading={busy} onCancel={() => setModal(null)} onSubmit={submitSession} /></div></div>}{modal?.type === 'panelist' && <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-5"><div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"><h2 className="mb-5 text-xl font-semibold">{modal.item ? 'Edit panelist' : 'Add panelist'}</h2><PanelistForm panelist={modal.item} sessionId={selectedSessionId} isLoading={busy} onCancel={() => setModal(null)} onSubmit={submitPanelist} /></div></div>}{modal?.type === 'confirm' && <ConfirmDialog title={`Delete ${modal.target}?`} message="This action cannot be undone. Session deletion also removes its panelists." isLoading={busy} onCancel={() => setModal(null)} onConfirm={deleteConfirmed} />}</section>
}

export default AdminDashboardPage
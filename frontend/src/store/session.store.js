import { create } from 'zustand'
import {
  createSession,
  deleteSession,
  endSpeaker,
  getSession,
  getSessions,
  resetSession,
  selectCurrentSpeaker,
  startSpeaker,
  updateSession,
} from '../services/sessions.api'

export const useSessionStore = create((set) => ({
  sessions: [],
  currentSession: null,
  currentSpeaker: null,
  panelists: [],
  speakerStartedAt: null,
  isLoading: false,
  error: null,

  createSession: async (session) => {
    const createdSession = await createSession(session)
    set((state) => ({ sessions: [...state.sessions, createdSession] }))
    return createdSession
  },

  updateSession: async (sessionId, session) => {
    const updatedSession = await updateSession(sessionId, session)
    set((state) => ({
      sessions: state.sessions.map((item) => (item._id === sessionId ? updatedSession : item)),
      currentSession: state.currentSession?._id === sessionId ? updatedSession : state.currentSession,
    }))
    return updatedSession
  },

  deleteSession: async (sessionId) => {
    await deleteSession(sessionId)
    set((state) => ({
      sessions: state.sessions.filter((item) => item._id !== sessionId),
      currentSession: state.currentSession?._id === sessionId ? null : state.currentSession,
      panelists: state.currentSession?._id === sessionId ? [] : state.panelists,
    }))
  },

  selectCurrentSpeaker: async (sessionId, panelistId) => {
    const snapshot = await selectCurrentSpeaker(sessionId, panelistId)
    set({ currentSession: snapshot.session, currentSpeaker: snapshot.session.currentSpeaker, speakerStartedAt: snapshot.session.speakerStartedAt, panelists: snapshot.panelists })
    return snapshot
  },

  startSpeaker: async (sessionId, panelistId) => {
    const snapshot = await startSpeaker(sessionId, panelistId)
    set({ currentSession: snapshot.session, currentSpeaker: snapshot.session.currentSpeaker, speakerStartedAt: snapshot.session.speakerStartedAt, panelists: snapshot.panelists })
    return snapshot
  },

  endSpeaker: async (sessionId) => {
    const snapshot = await endSpeaker(sessionId)
    set({ currentSession: snapshot.session, currentSpeaker: snapshot.session.currentSpeaker, speakerStartedAt: snapshot.session.speakerStartedAt, panelists: snapshot.panelists })
    return snapshot
  },

  resetSession: async (sessionId) => {
    const snapshot = await resetSession(sessionId)
    set({ currentSession: snapshot.session, currentSpeaker: snapshot.session.currentSpeaker, speakerStartedAt: snapshot.session.speakerStartedAt, panelists: snapshot.panelists })
    return snapshot
  },

  fetchSessions: async (params) => {
    set({ isLoading: true, error: null })

    try {
      const sessions = await getSessions(params)
      set({ sessions, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.message || 'Unable to load sessions', isLoading: false })
      throw error
    }
  },

  fetchSession: async (sessionId) => {
    set({ isLoading: true, error: null })

    try {
      const data = await getSession(sessionId)
      set({
        currentSession: data.session,
        currentSpeaker: data.session.currentSpeaker,
        speakerStartedAt: data.session.speakerStartedAt,
        panelists: data.panelists || [],
        isLoading: false,
      })
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Unable to load session', isLoading: false })
      throw error
    }
  },

  applySessionSnapshot: (snapshot) =>
    set((state) => {
      const session = snapshot.session || {
        ...state.currentSession,
        _id: snapshot.sessionId || state.currentSession?._id,
        currentSpeaker: snapshot.currentSpeaker ?? null,
        speakerStartedAt: snapshot.speakerStartedAt ?? null,
        status: snapshot.sessionStatus || state.currentSession?.status,
        updatedAt: snapshot.updatedAt || state.currentSession?.updatedAt,
      }

      return {
        currentSession: session,
        currentSpeaker: snapshot.currentSpeaker ?? session.currentSpeaker ?? null,
        speakerStartedAt: snapshot.speakerStartedAt ?? session.speakerStartedAt ?? null,
        panelists: snapshot.panelists || state.panelists,
      }
    }),
  clearSession: () => set({ currentSession: null, currentSpeaker: null, speakerStartedAt: null, panelists: [] }),
}))
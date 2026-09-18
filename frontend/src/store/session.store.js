import { create } from 'zustand'
import { getSession, getSessions } from '../services/sessions.api'

export const useSessionStore = create((set) => ({
  sessions: [],
  currentSession: null,
  currentSpeaker: null,
  speakerStartedAt: null,
  isLoading: false,
  error: null,

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
        isLoading: false,
      })
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Unable to load session', isLoading: false })
      throw error
    }
  },

  applySessionSnapshot: (snapshot) =>
    set({
      currentSession: snapshot.session,
      currentSpeaker: snapshot.session.currentSpeaker,
      speakerStartedAt: snapshot.session.speakerStartedAt,
    }),
  clearSession: () => set({ currentSession: null, currentSpeaker: null, speakerStartedAt: null }),
}))
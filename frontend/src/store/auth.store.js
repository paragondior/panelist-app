import { create } from 'zustand'
import { getCurrentUser, login as loginRequest } from '../services/auth.api'

const TOKEN_KEY = 'panelist-auth-token'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })

    try {
      const result = await loginRequest(credentials)
      localStorage.setItem(TOKEN_KEY, result.token)
      set({ user: result.user, isAuthenticated: true, isLoading: false })
      return result.user
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to sign in'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  hydrate: async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      return
    }

    set({ isLoading: true, error: null })

    try {
      const user = await getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, isAuthenticated: false, error: null })
  },
}))
import { create } from 'zustand'
import { getPanelists } from '../services/panelists.api'

export const usePanelistStore = create((set) => ({
  panelists: [],
  isLoading: false,
  error: null,

  fetchPanelists: async (params) => {
    set({ isLoading: true, error: null })

    try {
      const panelists = await getPanelists(params)
      set({ panelists, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.message || 'Unable to load panelists', isLoading: false })
      throw error
    }
  },

  setPanelists: (panelists) => set({ panelists }),
  clearPanelists: () => set({ panelists: [], error: null }),
}))
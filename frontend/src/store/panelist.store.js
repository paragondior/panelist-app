import { create } from 'zustand'
import { createPanelist, deletePanelist, getPanelists, updatePanelist } from '../services/panelists.api'

export const usePanelistStore = create((set) => ({
  panelists: [],
  isLoading: false,
  error: null,

  createPanelist: async (panelist) => {
    const createdPanelist = await createPanelist(panelist)
    set((state) => ({ panelists: [...state.panelists, createdPanelist] }))
    return createdPanelist
  },

  updatePanelist: async (panelistId, panelist) => {
    const updatedPanelist = await updatePanelist(panelistId, panelist)
    set((state) => ({ panelists: state.panelists.map((item) => (item._id === panelistId ? updatedPanelist : item)) }))
    return updatedPanelist
  },

  deletePanelist: async (panelistId) => {
    await deletePanelist(panelistId)
    set((state) => ({ panelists: state.panelists.filter((item) => item._id !== panelistId) }))
  },

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
import api from './api'

export const getPanelists = async (params = {}) => {
  const response = await api.get('/panelists', { params })
  return response.data.data.panelists
}

export const getPanelist = async (panelistId) => {
  const response = await api.get(`/panelists/${panelistId}`)
  return response.data.data.panelist
}

export const createPanelist = async (panelist) => {
  const response = await api.post('/panelists', panelist)
  return response.data.data.panelist
}

export const updatePanelist = async (panelistId, panelist) => {
  const response = await api.put(`/panelists/${panelistId}`, panelist)
  return response.data.data.panelist
}

export const deletePanelist = async (panelistId) => {
  await api.delete(`/panelists/${panelistId}`)
}
import api from './api'

export const getSessions = async (params = {}) => {
  const response = await api.get('/sessions', { params })
  return response.data.data.sessions
}

export const getSession = async (sessionId) => {
  const response = await api.get(`/public/sessions/${sessionId}/dashboard`)
  return response.data.data
}

export const createSession = async (session) => {
  const response = await api.post('/sessions', session)
  return response.data.data.session
}

export const updateSession = async (sessionId, session) => {
  const response = await api.put(`/sessions/${sessionId}`, session)
  return response.data.data.session
}

export const deleteSession = async (sessionId) => {
  await api.delete(`/sessions/${sessionId}`)
}

export const selectCurrentSpeaker = async (sessionId, panelistId) => {
  const response = await api.put(`/sessions/${sessionId}/current-speaker`, { panelistId })
  return response.data.data
}

export const startSpeaker = async (sessionId, panelistId) => {
  const response = await api.put(`/sessions/${sessionId}/start-speaker`, { panelistId })
  return response.data.data
}

export const endSpeaker = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/end-speaker`)
  return response.data.data
}

export const resetSession = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/reset`)
  return response.data.data
}
import api from './api'

export const uploadPanelistImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await api.post('/uploads/panelist-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data.imageUrl
}

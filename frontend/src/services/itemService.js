import apiClient from './api'

export const itemService = {
  getAllItems: async () => {
    const response = await apiClient.get('/items')
    return response.data
  },

  getItemById: async (id) => {
    const response = await apiClient.get(`/items/${id}`)
    return response.data
  },

  createItem: async (itemData) => {
    const response = await apiClient.post('/items', itemData)
    return response.data
  },

  updateItem: async (id, itemData) => {
    const response = await apiClient.put(`/items/${id}`, itemData)
    return response.data
  },

  deleteItem: async (id) => {
    await apiClient.delete(`/items/${id}`)
  },
}

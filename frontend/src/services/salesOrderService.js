import apiClient from './api'

export const salesOrderService = {
  getAllOrders: async () => {
    const response = await apiClient.get('/sales-orders')
    return response.data
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/sales-orders/${id}`)
    return response.data
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post('/sales-orders', orderData)
    return response.data
  },

  updateOrder: async (id, orderData) => {
    const response = await apiClient.put(`/sales-orders/${id}`, orderData)
    return response.data
  },

  deleteOrder: async (id) => {
    await apiClient.delete(`/sales-orders/${id}`)
  },
}

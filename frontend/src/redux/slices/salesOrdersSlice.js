import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { salesOrderService } from '../../services/salesOrderService'

export const fetchSalesOrders = createAsyncThunk(
  'salesOrders/fetchSalesOrders',
  async () => {
    const response = await salesOrderService.getAllOrders()
    return response
  }
)

export const fetchSalesOrderById = createAsyncThunk(
  'salesOrders/fetchSalesOrderById',
  async (id) => {
    const response = await salesOrderService.getOrderById(id)
    return response
  }
)

export const createSalesOrder = createAsyncThunk(
  'salesOrders/createSalesOrder',
  async (orderData) => {
    const response = await salesOrderService.createOrder(orderData)
    return response
  }
)

export const updateSalesOrder = createAsyncThunk(
  'salesOrders/updateSalesOrder',
  async ({ id, orderData }) => {
    const response = await salesOrderService.updateOrder(id, orderData)
    return response
  }
)

const salesOrdersSlice = createSlice({
  name: 'salesOrders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchSalesOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch order by ID
      .addCase(fetchSalesOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSalesOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchSalesOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create order
      .addCase(createSalesOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders.unshift(action.payload)
      })
      .addCase(createSalesOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Update order
      .addCase(updateSalesOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSalesOrder.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orders.findIndex(order => order.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
      })
      .addCase(updateSalesOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearCurrentOrder } = salesOrdersSlice.actions
export default salesOrdersSlice.reducer

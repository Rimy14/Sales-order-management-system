import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { itemService } from '../../services/itemService'

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async () => {
    const response = await itemService.getAllItems()
    return response
  }
)

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default itemsSlice.reducer

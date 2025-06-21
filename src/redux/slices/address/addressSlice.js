import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch user addresses
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/addresses/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch addresses');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Save address
export const saveAddress = createAsyncThunk(
  'address/saveAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) throw new Error('Failed to save address');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      });
  },
});

export default addressSlice.reducer;
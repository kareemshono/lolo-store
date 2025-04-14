import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";




// Async thunk to register a user
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
      try {

        const res = await axios.post("http://localhost:5000/api/users/register", userData,{
            withCredentials:true,

        });

        return res.data.user; 

        // Return user data to be stored in Redux state
      } catch (error) {
        return rejectWithValue(error.response?.data?.msg || "Something went wrong");
      }
    }
  );
  // Async thunk to logout a user
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
            return;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || "Logout failed");
        }
    }
);
  


  const initialState = {
    user: null,
    isLoading: false,
    error: null,
  };
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
 
      },
    },
    extraReducers: (builder) => {
        builder
            // Register User Cases
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Logout User Cases
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
  });

  
  // Export actions and reducer
  export const { logout } = authSlice.actions;
  export default authSlice.reducer;
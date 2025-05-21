import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to register a user
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/register", userData, {
            withCredentials: true,
        });
        return res.data.user;
      } catch (error) {
        return rejectWithValue({ message: error.response?.data?.msg || "Something went wrong", type: "register" });
      }
    }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
      try {
          const res = await axios.post(
              "http://localhost:5000/api/users/login",
              { email, password },
              { withCredentials: true }
          );
          console.log("Login response:", res.data);
          return res.data.user;
      } catch (error) {
          console.error("Login error:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
          });
          return rejectWithValue({ message: error.response?.data?.msg || "Failed to login", type: "login" });
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
            return rejectWithValue({ message: error.response?.data?.msg || "Logout failed", type: "logout" });
        }
    }
);

// Fetch user on load
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
      try {
          const res = await axios.get("http://localhost:5000/api/users/me", {
              withCredentials: true,
          });
          return res.data.user;
      } catch (error) {
          console.error("Fetch user error:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
          });
          // Suppress error unless explicitly needed
          return rejectWithValue({ message: error.response?.data?.msg || "Failed to fetch user", type: "fetch", suppress: true });
      }
  }
);

const initialState = {
    user: null,
    isLoading: false,
    error: null, // { message, type, suppress? }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
        state.error = null;
      },
      clearError: (state) => {
        state.error = null;
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
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
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
            })
            // Fetch User Cases
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
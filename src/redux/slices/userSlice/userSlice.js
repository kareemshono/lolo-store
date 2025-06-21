import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
      return rejectWithValue({
        message: error.response?.data?.msg || "Failed to fetch user",
        type: "fetch",
        suppress: true,
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", credentials, {
        withCredentials: true,
      });
      return { user: res.data.user, toast: "Logged in successfully!" };
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue({
        message: error.response?.data?.msg || "Invalid credentials",
        type: "login",
        suppress: false,
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", credentials, {
        withCredentials: true,
      });
      sessionStorage.setItem("isNewUser", "true");
      return { user: res.data.user, toast: "Signed up successfully!" };
    } catch (error) {
      console.error("Register error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue({
        message: error.response?.data?.msg || "Failed to register user",
        type: "register",
        suppress: false,
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, {
        withCredentials: true,
      });
      return { toast: "Signed out successfully!" };
    } catch (error) {
      console.error("Logout error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue({
        message: error.response?.data?.msg || "Failed to sign out",
        type: "logout",
        suppress: false,
      });
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    welcomeToast: null,
    successToast: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearToasts: (state) => {
      state.welcomeToast = null;
      state.successToast = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        if (action.payload) {
          const isNewUser = sessionStorage.getItem("isNewUser") === "true";
          state.welcomeToast = `Welcome${isNewUser ? "!" : " back,"} ${action.payload.name}!`;
          if (isNewUser) sessionStorage.removeItem("isNewUser");
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.successToast = action.payload.toast;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.successToast = action.payload.toast;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.welcomeToast = null;
        state.successToast = action.payload.toast;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearToasts } = userSlice.actions;
export default userSlice.reducer;
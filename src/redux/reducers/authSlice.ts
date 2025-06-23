// src/redux/reducers/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";

// Helper function to safely access localStorage
const getStoredUserInfo = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : {};
  }
  return {};
};

export const fetchUser = createAsyncThunk(
  "fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      const response = await api.get(`/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  data: any[];
  error: string | null;
  userInfo: any;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  data: [],
  error: null,
  userInfo: getStoredUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.userInfo = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.userInfo = {};
      if (typeof window !== 'undefined') {
        localStorage.removeItem("userInfo");
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.userInfo = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem("userInfo", JSON.stringify(action.payload));
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { message?: string })?.message || "Failed to fetch user";
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
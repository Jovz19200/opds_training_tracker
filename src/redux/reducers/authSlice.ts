// src/redux/reducers/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    data: [],
    error: null as string | null,
    userInfo: getStoredUserInfo(),
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.userInfo = payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem("userInfo", JSON.stringify(payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
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

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
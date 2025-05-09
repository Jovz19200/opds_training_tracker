// src/redux/api/loginApiSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

interface LoginState {
  loading: boolean;
  error: string | null;
  userInfo: Record<string, any>;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  userInfo: {},
};

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: { message: string } }
>("login", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/login", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const register = createAsyncThunk<
  LoginResponse,
  RegisterPayload,
  { rejectValue: { message: string } }
>("register", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/users/register", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const logout = createAsyncThunk("logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
  return null;
});

const loginApiSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unknown error";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Registration failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.userInfo = {};
      });
  },
});

export default loginApiSlice.reducer;
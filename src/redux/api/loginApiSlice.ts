// src/redux/api/loginApiSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";
import Cookies from 'js-cookie';
import { setUser } from "../reducers/authSlice";

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
  user: {
    id: string
    email: string
    role: string
    name: string
  }
  token: string
  twoFARequired?: boolean
  email?: string
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
}

const getStoredUserInfo = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const stored = Cookies.get("userInfo");
  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed || {};
  } catch (error) {
    console.error('Error parsing stored user info:', error);
    return {};
  }
};

const initialState: LoginState = {
  loading: false,
  error: null,
  userInfo: getStoredUserInfo(),
};

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: { message: string } }
>("login", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/login", payload);
    // If 2FA is not required, we'll still return the response
    // but let verify2FA slice handle the user state
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
    const response = await axios.post("/auth/register", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const logout = createAsyncThunk("logout", async () => {
  Cookies.remove("accessToken");
  Cookies.remove("userInfo");
  localStorage.removeItem("userInfo");
  return null;
});

const loginApiSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLoginState: (state) => {
      state.loading = false;
      state.error = null;
      state.userInfo = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userInfo = action.payload.user;
        // Set cookies with security options
        Cookies.set("accessToken", action.payload.token, {
          secure: true,
          sameSite: 'strict',
          expires: 7 // 7 days
        });
        Cookies.set("userInfo", JSON.stringify(action.payload.user), {
          secure: true,
          sameSite: 'strict',
          expires: 7 // 7 days
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unknown error";
        state.userInfo = {};
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userInfo = action.payload.user;
        // Set cookies with security options
        Cookies.set("accessToken", action.payload.token, {
          secure: true,
          sameSite: 'strict',
          expires: 7 // 7 days
        });
        Cookies.set("userInfo", JSON.stringify(action.payload.user), {
          secure: true,
          sameSite: 'strict',
          expires: 7 // 7 days
        });
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

export const { clearLoginState } = loginApiSlice.actions;
export default loginApiSlice.reducer;
// src/redux/api/loginApiSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";
import Cookies from 'js-cookie';

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
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: 'trainee' | 'trainer' | 'admin';
  };
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
}

const getStoredUserInfo = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = Cookies.get("userInfo");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error parsing stored user info:', error);
      return {};
    }
  }
  return {};
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
  return null;
});

export const handleGoogleAuthToken = createAsyncThunk<
  LoginResponse,
  string,
  { rejectValue: { message: string } }
>("login/handleGoogleAuthToken", async (token, { rejectWithValue }) => {
  try {
    // Set the token in axios defaults for this request
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const response = await axios.get("/auth/me");
    
    // Check if response.data is the user object directly
    const userData = response.data.data;
    
    if (!userData) {
      throw new Error('No user data received');
    }
    
    // Store the token and user info in cookies
    Cookies.set("accessToken", token, {
      secure: true,
      sameSite: 'strict',
      expires: 7 // 7 days
    });
    Cookies.set("userInfo", JSON.stringify(userData), {
      secure: true,
      sameSite: 'strict',
      expires: 7 // 7 days
    });

    return {
      token,
      user: userData
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: 'Failed to authenticate' });
  }
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
      })
      .addCase(handleGoogleAuthToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleGoogleAuthToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userInfo = action.payload.user;
      })
      .addCase(handleGoogleAuthToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to authenticate with Google";
      });
  },
});

export default loginApiSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "./api"
import Cookies from "js-cookie"
import { setUser } from "../reducers/authSlice"

interface Verify2FAState {
  loading: boolean
  error: string | null
}

interface Verify2FAPayload {
  email: string
  twoFAToken: string
}

interface Verify2FAResponse {
  user: {
    id: string
    email: string
    role: string
    name: string
  }
  token: string
}

const initialState: Verify2FAState = {
  loading: false,
  error: null,
}

// This function will be used to set user state and cookies
const setUserStateAndCookies = (dispatch: any, user: any, token: string) => {
  // Set user in auth state
  dispatch(setUser(user))
  // Set cookies with security options
  Cookies.set("accessToken", token, {
    secure: true,
    sameSite: 'strict',
    expires: 7 // 7 days
  })
  Cookies.set("userInfo", JSON.stringify(user), {
    secure: true,
    sameSite: 'strict',
    expires: 7 // 7 days
  })
}

export const verify2FA = createAsyncThunk<
  Verify2FAResponse,
  Verify2FAPayload,
  { rejectValue: { message: string } }
>("verify2FA", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post("/auth/verify2fa", payload)
    setUserStateAndCookies(dispatch, response.data.user, response.data.token)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data)
  }
})

// New thunk for handling non-2FA login
export const handleNon2FALogin = createAsyncThunk<
  Verify2FAResponse,
  Verify2FAResponse,
  { rejectValue: { message: string } }
>("handleNon2FALogin", async (response, { dispatch }) => {
  setUserStateAndCookies(dispatch, response.user, response.token)
  return response
})

const verify2FAApiSlice = createSlice({
  name: "verify2FA",
  initialState,
  reducers: {
    clearVerify2FAState: (state) => {
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verify2FA.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verify2FA.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message ?? "Failed to verify 2FA code"
      })
      .addCase(handleNon2FALogin.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
  },
})

export const { clearVerify2FAState } = verify2FAApiSlice.actions
export default verify2FAApiSlice.reducer 
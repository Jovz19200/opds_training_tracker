import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from './api'

interface VerifyEmailPayload {
  token: string
}

interface VerifyEmailResponse {
  message: string
  success: boolean
}

interface ResetPasswordPayload {
  resetToken: string
  password: string
}

interface ResetPasswordResponse {
  message: string
  success: boolean
}

export const verifyEmail = createAsyncThunk<VerifyEmailResponse, VerifyEmailPayload>(
  'auth/verifyEmail',
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/auth/verifyemail/${token}`)
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify email')
    }
  }
)

export const resetPassword = createAsyncThunk<ResetPasswordResponse, ResetPasswordPayload>(
  'auth/resetPassword',
  async ({ resetToken, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/auth/resetpassword', { resetToken, password })
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password')
    }
  }
) 
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from './api'

interface VerifyEmailPayload {
  token: string
}

interface VerifyEmailResponse {
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
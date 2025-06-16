import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const googleAuthApi = createApi({
  reducerPath: 'googleAuth',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/auth',
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    initiateGoogleAuth: builder.mutation({
      query: () => ({
        url: '/google',
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.url) {
            window.open(data.url, '_blank', 'width=500,height=600')
          }
        } catch (error) {
          console.error('Failed to open Google auth window:', error)
        }
      },
    }),
    handleGoogleCallback: builder.mutation({
      query: (code) => ({
        url: '/google/callback',
        method: 'POST',
        body: { code },
      }),
    }),
  }),
})

export const { 
  useInitiateGoogleAuthMutation,
  useHandleGoogleCallbackMutation 
} = googleAuthApi 
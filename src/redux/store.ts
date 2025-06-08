// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./api/loginApiSlice";
import organizationReducer from "./api/organizationApiSlice";
import trainingReducer from "./api/trainingApiSlice";
import { googleAuthApi } from "./api/googleAuthApiSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    organizations: organizationReducer,
    trainings: trainingReducer,
    [googleAuthApi.reducerPath]: googleAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(googleAuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
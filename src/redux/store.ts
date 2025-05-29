// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./api/loginApiSlice";
import organizationReducer from "./api/organizationApiSlice";
import trainingReducer from "./api/trainingApiSlice";
import verify2FAReducer from "./api/verify2FAApiSlice";
import authReducer from "./reducers/authSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    organizations: organizationReducer,
    trainings: trainingReducer,
    verify2FA: verify2FAReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
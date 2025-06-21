// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import loginReducer from "./api/loginApiSlice";
import verify2FAReducer from "./api/verify2FAApiSlice";
import trainingReducer from "./api/trainingApiSlice";
import userReducer from "./api/userApiSlice";
import organizationReducer from "./api/organizationApiSlice";
import feedbackReducer from "./api/feedbackApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    login: loginReducer,
    verify2FA: verify2FAReducer,
    trainings: trainingReducer,
    users: userReducer,
    organizations: organizationReducer,
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

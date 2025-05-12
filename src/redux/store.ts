// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./api/loginApiSlice";
import organizationReducer from "./api/organizationApiSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    organizations: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
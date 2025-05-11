// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./api/loginApiSlice";
import authReducer from "./reducers/authSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
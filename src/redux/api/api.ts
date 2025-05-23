// src/redux/api/api.ts
import axios from "axios";
import Cookies from 'js-cookie';

const base_URL =  process.env.NEXT_PUBLIC_OTMS_URL;

const api = axios.create({
  baseURL: base_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
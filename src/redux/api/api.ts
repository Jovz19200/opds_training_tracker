// src/redux/api/api.ts
import axios from "axios";
console.log(process.env.PORT);
const api = axios.create({
  baseURL: process.env.OTMS_BN_LOCAL_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(process.env.OTMS_BN_LOCAL_URL);
// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
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
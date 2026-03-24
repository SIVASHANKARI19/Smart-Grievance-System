import axios from "axios";
import { getStoredToken, removeStoredToken } from "../utils/jwt";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

console.log("API Base URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      removeStoredToken();
      window.location.href = "/login/citizen";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
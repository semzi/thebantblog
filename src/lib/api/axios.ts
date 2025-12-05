import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "https://tikianaly-blog.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - CORS proxy might be slow');
    } else if (error.response?.status === 0) {
      console.error('CORS error - proxy might be blocked');
    } else if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    } else if (error.response?.status === 400) {
      console.error('Bad request:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;
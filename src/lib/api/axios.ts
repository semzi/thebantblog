import axios from "axios";

const API = axios.create({
  baseURL: "https://tikianaly-blog.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token) (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error as any).code === 'ECONNABORTED') {
      console.error('Request timeout - CORS proxy might be slow');
    } else if (error.response?.status === 0) {
      console.error('CORS error - proxy might be blocked');
    }
    return Promise.reject(error);
  }
);

export default API;



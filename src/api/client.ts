import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { topLoaderStart, topLoaderStop } from "../utils/topLoaderBus";

const baseURL = import.meta.env.VITE_API_URL || ''

export const apiClient = axios.create({
  baseURL: baseURL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  topLoaderStart();
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => {
    topLoaderStop();
    return res;
  },
  (err) => {
    topLoaderStop();
    return Promise.reject(err);
  },
);

export default apiClient

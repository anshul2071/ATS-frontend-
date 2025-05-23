import axios from 'axios'
import { store } from '../store'
import type { RootState } from '../store'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = (store.getState() as RootState).user.token
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
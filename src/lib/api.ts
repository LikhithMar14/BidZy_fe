import axios from 'axios'

import Cookies from 'js-cookie'
import { getToken } from './cookie-utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

api.interceptors.request.use(async (config: any) => {
    const token = await getToken()
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        Cookies.remove('token')
        window.location.href = '/auth/login'
      }
      return Promise.reject(error)
    }
)


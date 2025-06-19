import axios from 'axios'

import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

api.interceptors.request.use((config: any) => {
    if(Cookies.get('auth_token')) {
        console.log("AUTH TOKEN FOUND")
        config.headers.Authorization = `Bearer ${Cookies.get('auth_token')}`
    }
    else {
        console.log("NO AUTH TOKEN FOUND")
        config.headers.Authorization = `Bearer ${Cookies.get('token')}`
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


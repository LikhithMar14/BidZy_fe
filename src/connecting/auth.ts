
import { api } from "@/lib/api"
import { AboutUserResponse } from "@/types/user"

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/login', { email, password })
        console.log(response.data)  
        return response.data
    }catch(err:any) {
        console.log(`Error logging in: ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}

export const signup = async (username: string, email: string, password: string) => {
    try {
        const response = await api.post('/register', { user_name: username, email, password })
        return response.data
    }catch(err:any) {
        console.log(`Error signing up: ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}

export const googleLogin = async () => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        window.location.href = `${apiUrl}/auth/google/login`;
      } catch (err: any) {
        console.log(`Error initiating Google login: ${err.message}`);
        throw new Error('Failed to initiate Google login');
      }
}


export const getUserInfo = async () => {
    try {
        const response = await api.get('/about')
        return response.data as AboutUserResponse
    }catch(err:any) {
        console.log(`Error getting user info: ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}
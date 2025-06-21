import { create }  from 'zustand'

import { persist, createJSONStorage } from 'zustand/middleware'

import { User } from '@/types/user'
import { clearAuthCookies, deleteCookie, setCookie } from './utils'

export const useAuthStore = create(
    persist(
        (set,get) => ({
            user:null,
            token:null, 
            isAuthenticated:false,

            login: (userData:User, token:string) => {
                setCookie('auth_token', token , 7)

                set({
                    user: userData, 
                    token, 
                    isAuthenticated:true
                })
            },
            logout: () => {
                deleteCookie('auth_token')
                clearAuthCookies()
                set({
                    user:null,
                    token:null,
                    isAuthenticated:false
                })
            },
            updateUser: (userData:User) => {
                set({user: userData})
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state:any) => ({
                user: state?.user,
                token: state?.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
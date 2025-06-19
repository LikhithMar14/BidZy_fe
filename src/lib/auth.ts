import { create }  from 'zustand'

import { persist, createJSONStorage } from 'zustand/middleware'

import Cookies from 'js-cookie'
import { User } from '@/types/user'
import { clearAuthCookies } from './utils'

export const useAuthStore = create(
    persist(
        (set,get) => ({
            user:null,
            token:null, 
            isAuthenticated:false,

            login: (userData:User, token:string) => {
                Cookies.set('auth_token', token , { expires: 7 })

                set({
                    user: userData, 
                    token, 
                    isAuthenticated:true
                })
            },
            logout: () => {
                Cookies.remove('auth_token')
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
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
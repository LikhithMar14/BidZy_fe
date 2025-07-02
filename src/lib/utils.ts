import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { deleteCookieFromServer } from "./cookie-utils"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}





export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`
}

export function clearAuthCookies(): void {
  deleteCookie('auth_token')
  deleteCookieFromServer('auth_token')
  deleteCookie('user_id') 
  deleteCookie('username')
  deleteCookie('email')
  deleteCookie('is_new_user')
}

'use server'
import { cookies } from "next/headers"

export async function getToken() {
  const token = (await cookies()).get('auth_token')
  return token?.value || null
}

export async function getUserId() {
  const userId = (await cookies()).get('user_id')
  return userId?.value || null
}

export async function getUsername() {
  const username = (await cookies()).get('username')
  return username?.value || null
}

export async function getEmail() {
  const email = (await cookies()).get('email')
  return email?.value || null
}

export async function getIsNewUser() {
  const isNewUser = (await cookies()).get('is_new_user')
  return isNewUser?.value === 'true'
}
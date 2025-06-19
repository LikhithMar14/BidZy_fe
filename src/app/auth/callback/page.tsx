'use client'

import { useEffect, useRef, useCallback, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/auth'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { deleteCookie } from '@/lib/utils'
import { getToken } from '@/lib/cookie-utils'
  
function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const hasProcessed = useRef(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchUserInfoWithToken = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/about`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch user info: ${response.statusText}`)
      }
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }, [])

  const handleAuthError = useCallback((message: string, description: string) => {
    toast.error(message, { description, duration: 4000 })
    router.push('/auth/login')
  }, [router])

  const handleAuthSuccess = useCallback(async (userInfo: any, authToken: string) => {
    try {
      const { user_id: userId, user_name: username, email } = userInfo.data
      
      if (!authToken || !userId || !username || !email) {
        throw new Error('Missing required authentication data')
      }

      const user = {
        id: userId,
        username,
        email,
        createdAt: '',
        updatedAt: ''
      }

      useAuthStore.getState().login(user, authToken)
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user'] }),
        deleteCookie('is_new_user')
      ])

      toast.success('Welcome to BidZy!', {
        description: `Successfully logged in as ${email}`,
        duration: 2000,
      })

      setTimeout(() => router.push('/dashboard'), 1000)
    } catch (error) {
      console.error('Auth success handler error:', error)
      handleAuthError(
        'Authentication failed',
        'Failed to complete login. Please try again.'
      )
    }
  }, [queryClient, router, handleAuthError])

  const processAuth = useCallback(async () => {
    if (hasProcessed.current || isProcessing) return
    
    const success = searchParams.get('success')
    
    if (success !== 'true') {
      handleAuthError(
        'Google authentication failed',
        'Please try again or use email/password login.'
      )
      return
    }

    setIsProcessing(true)
    hasProcessed.current = true

    try {
      const authToken = await getToken()
      
      if (!authToken) {
        throw new Error('No authentication token received')
      }

      const userInfo = await fetchUserInfoWithToken(authToken)
      
      if (!userInfo) {
        throw new Error('No user information received')
      }

      await handleAuthSuccess(userInfo, authToken)
    } catch (error) {
      console.error('Auth processing error:', error)
      handleAuthError(
        'Authentication failed',
        error instanceof Error ? error.message : 'Failed to complete authentication. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }, [searchParams, handleAuthError, handleAuthSuccess, fetchUserInfoWithToken, isProcessing])

  useEffect(() => {
    processAuth()
  }, [processAuth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Completing Authentication</h2>
        <p className="text-rose-100">Please wait while we sign you in...</p>
      </div>
    </div>
  )
}

function AuthCallbackLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
        <p className="text-rose-100">Preparing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  )
}
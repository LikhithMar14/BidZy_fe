import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth'
import {  AboutUserResponse, LoginUserRequest, LoginUserResponseToSend, SignupUserRequest, SignupUserResponseToSend } from '@/types/user'
import { googleLogin, getUserInfo, login } from '@/connecting/auth'
import { signup } from '@/connecting/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'



export const useLogin = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: async (data: LoginUserRequest): Promise<LoginUserResponseToSend> => {
            const response = await login(data.email, data.password)
            return response as LoginUserResponseToSend
        },
        onSuccess: (data: LoginUserResponseToSend) => {
            const { user, token } = data.data
            useAuthStore.getState().login(user, token)
            queryClient.invalidateQueries({ queryKey: ['user'] })
            toast.success('Welcome back!', {
                description: `Successfully logged in as ${user.email}`,
                duration: 1000,
            })
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        },
        onError: (error: any) => {
            console.error('Login error:', error)
            setTimeout(() => {
                if (error?.response?.status === 401) {
                    toast.error('Invalid credentials', {
                        description: 'Please check your email and password and try again.',
                        duration: 4000,
                    })
                } else if (error?.response?.status === 404) {
                    toast.error('Account not found', {
                        description: 'No account exists with this email. Please sign up first.',
                        duration: 4000,
                    })
                } else if (error?.message) {
                    toast.error('Login failed', {
                        description: error.message,
                        duration: 4000,
                    })
                } else {
                    toast.error('Login failed', {
                        description: 'An unexpected error occurred. Please try again later.',
                        duration: 4000,
                    })
                }
            }, 100)
        }
    })
}   


export const useSignup = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: async (data: SignupUserRequest): Promise<SignupUserResponseToSend> => {
            const response = await signup(data.user_name, data.email, data.password)
            return response as SignupUserResponseToSend
        },
        onSuccess: (data: SignupUserResponseToSend) => {
            const { user, token } = data.data
            useAuthStore.getState().login(user, token)
            queryClient.invalidateQueries({ queryKey: ['user'] })
            toast.success('Welcome to BidZy!', {
                description: 'Your account has been created successfully.',
                duration: 1000,
            })
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        },
        onError: (error: any) => {
            console.error('Signup error:', error)
            setTimeout(() => {
                if (error?.response?.status === 409) {
                    toast.error('Email already exists', {
                        description: 'An account with this email already exists. Please try logging in instead.',   
                        duration: 4000,
                    })
                    
                } else if (error?.response?.data?.message) {
                    toast.error('Registration failed', {
                        description: error.response.data.message,
                        duration: 4000,
                    })
                } else if (error?.message) {
                    toast.error('Registration failed', {
                        description: error.message,
                        duration: 4000,
                    })
                } else {
                    toast.error('Registration failed', {
                        description: 'An unexpected error occurred. Please try again later.',
                        duration: 4000,
                    })
                }
            }, 100)
        }
    })
}

export const useGoogleLogin = () => {
    return useMutation({
      mutationFn: async (): Promise<void> => {
        googleLogin();
      },
      onMutate: () => {
        toast.loading('Redirecting to Google login...', {
          id: 'google-login-loading'
        });
      },
      onSuccess: () => {
        toast.dismiss('google-login-loading');
        toast.success('Redirecting to Google login...');
      },
      onError: (error: Error) => {
        toast.dismiss('google-login-loading');
        toast.error('Failed to redirect to Google login', {
          description: error.message
        });
      }
    });
};

export const useGetUserInfo = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<AboutUserResponse> => {
            const response = await getUserInfo()
            return response as AboutUserResponse
        }
    })
}
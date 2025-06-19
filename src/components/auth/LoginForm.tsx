'use client'


import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Shield,
  Zap
} from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { useGoogleLogin, useLogin } from '@/hooks/useAuth'
import { useSignup } from '@/hooks/useAuth'
import { LoginUserRequest, SignupUserRequest     } from '@/types/user'
import { GoogleIcon } from '../../../public/google'



const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})


const registerSchema = z.object({
  user_name: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})


type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>




export const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: register, isPending: isRegisterPending } = useSignup()
  const { mutate: googleLogin, isPending: isGoogleLoginPending } = useGoogleLogin()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onLoginSubmit = (data: LoginFormData) => {
    console.log('Login form submitted:', data)
    login(data as LoginUserRequest)
  }

  const onRegisterSubmit = (data: RegisterFormData) => {
    console.log('Register form submitted:', data)
    const { confirmPassword, ...registerData } = data
    register(registerData as SignupUserRequest)
  }

const handleGoogleLogin = () => {
  googleLogin()
}

  const passwordStrength = (password: string) => {
    if (!password) return { score: 0, color: 'bg-gray-200', text: '' }
   
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
   
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
   
    return {
      score: Math.min(score, 5),
      color: colors[score - 1] || 'bg-gray-200',
      text: texts[score - 1] || ''
    }
  }


  const currentPassword = registerForm.watch('password') || ''


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>


          {/* Social Login */}
          <div className="mb-8">
            <Button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 hover:border-rose-300 transition-all duration-300 rounded-xl font-semibold shadow-lg hover:shadow-xl"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5 mr-2" />
              )}
              Continue with Google
            </Button>
          </div>


          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>


          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...loginForm.register('email')}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-xl transition-all duration-300"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>


                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...loginForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-xl transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>


                  <div className="flex items-center justify-end">
                    <a href="#" className="text-sm text-rose-600 hover:text-rose-500 font-medium transition-colors">
                      Forgot password?
                    </a>
                  </div>


                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl"
                    disabled={isLoginPending}
                  >
                    {isLoginPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...registerForm.register('user_name')}
                        type="text"
                        placeholder="Choose a username"
                        className="pl-10 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-xl transition-all duration-300"
                      />
                    </div>
                    {registerForm.formState.errors.user_name && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {registerForm.formState.errors.user_name.message}
                      </p>
                    )}
                  </div>


                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...registerForm.register('email')}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-xl transition-all duration-300"
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>


                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...registerForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-xl transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                   
                    {/* Password Strength Indicator */}
                    {currentPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => {
                              const strength = passwordStrength(currentPassword)
                              return (
                                <div
                                  key={level}
                                  className={`h-1 w-8 rounded-full transition-colors ${
                                    level <= strength.score ? strength.color : 'bg-gray-200'
                                  }`}
                                />
                              )
                            })}
                          </div>
                          <span className="text-xs text-gray-500 font-medium">{passwordStrength(currentPassword).text}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number
                        </div>
                      </div>
                    )}
                   
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>


                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...registerForm.register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-xl transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>


                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      required
                    />
                    <label className="ml-2 text-sm text-gray-600 font-medium">
                      I agree to the{' '}
                      <a href="#" className="text-rose-600 hover:text-rose-500 font-semibold transition-colors">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-rose-600 hover:text-rose-500 font-semibold transition-colors">Privacy Policy</a>
                    </label>
                  </div>


                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl"
                    disabled={isRegisterPending}
                  >
                    {isRegisterPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-600 font-medium">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Free to join • No hidden fees • Cancel anytime
            </div>
          </div>


          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center">
              <Shield className="w-3 h-3 mr-1 text-emerald-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-3 h-3 mr-1 text-amber-500" />
              <span>Fast</span>
            </div>
            <div className="flex items-center">
              <Star className="w-3 h-3 mr-1 text-rose-500" />
              <span>Trusted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

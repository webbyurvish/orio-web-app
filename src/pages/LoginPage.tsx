import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { GoogleLogin } from '@react-oauth/google'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { AuthFlyoutLayout } from '../components/AuthFlyoutLayout'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const callbackUrl = new URLSearchParams(location.search).get('callbackUrl')

  useEffect(() => {
    if (!isAuthenticated) return
    const destination = callbackUrl || '/dashboard'
    console.info('[WEB-AUTH] Login page auto-redirect for existing session', { destination, callbackUrl })
    navigate(destination, { replace: true })
  }, [isAuthenticated, callbackUrl, navigate])

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      const destination = callbackUrl || '/dashboard'
      console.info('[WEB-AUTH] Login success', { destination, callbackUrl })
      navigate(destination)
    },
    onError: (err: unknown) => {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Login failed'
      setError(msg || 'Login failed')
    },
  })

  const onEmailSubmit = (data: LoginForm) => {
    setError('')
    loginMutation.mutate({ email: data.email, password: data.password })
  }

  const onGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    const token = credentialResponse.credential
    if (!token) {
      setError('Google sign-in did not return a token.')
      return
    }
    setError('')
    try {
      const data = await authApi.googleLogin(token)
      setAuth(data.user, data.token)
      const destination = callbackUrl || '/dashboard'
      console.info('[WEB-AUTH] Google login success', { destination, callbackUrl })
      navigate(destination)
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Google sign-in failed'
      setError(msg || 'Google sign-in failed')
    }
  }

  const onGoogleError = () => {
    setError('Google sign-in was cancelled or failed.')
  }

  const hasGoogleClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <AuthFlyoutLayout>
      {/* Flyout panel - solid background, no transparency */}
      <div className="relative w-full max-w-md rounded-2xl bg-indigo-50 shadow-2xl border border-indigo-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-2 -m-2 rounded-lg text-gray-500 hover:bg-indigo-100 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">Email</label>
              <input
                type="email"
                {...register('email')}
                className="auth-input"
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-800">Password</label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="auth-input pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="auth-btn-primary w-full"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {hasGoogleClientId && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-indigo-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-indigo-50 text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={onGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>
            </>
          )}

          <p className="mt-6 text-center text-gray-700 text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthFlyoutLayout>
  )
}

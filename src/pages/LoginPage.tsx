import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { GoogleLogin } from '@react-oauth/google'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { useBillingStore } from '../store/billingStore'
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
  const setCreditsFromServer = useBillingStore((s) => s.setCreditsFromServer)
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
      setCreditsFromServer(data.user.callCredits ?? 0)
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
      setCreditsFromServer(data.user.callCredits ?? 0)
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
      <div className="auth-card">
        <div className="auth-card-head">
          <div className="auth-card-brand">
            <img className="auth-card-mark" src="/assets/smeed-logo.png" alt="" aria-hidden draggable={false} />
            <div className="auth-card-brandtext">Smeed AI</div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="auth-icon-btn"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5">
          <h1 className="auth-card-title">Welcome back</h1>
          <p className="auth-card-subtitle">Sign in to continue</p>
        </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4 mt-5">
            <div>
              <label className="auth-label">Email</label>
              <input
                type="email"
                {...register('email')}
                className="auth-input"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="auth-field-error">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="auth-label mb-0">Password</label>
                <a href="#" className="auth-link text-sm">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="auth-input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="auth-eye-btn"
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
                <p className="auth-field-error">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="auth-btn-primary w-full"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {hasGoogleClientId && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 auth-divider-pill">Or continue with</span>
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

          <p className="mt-6 text-center text-sm auth-muted">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="auth-link font-semibold">
              Sign up
            </Link>
          </p>
      </div>
    </AuthFlyoutLayout>
  )
}

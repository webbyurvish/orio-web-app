import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { GoogleLogin } from '@react-oauth/google'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { AuthFlyoutLayout } from '../components/AuthFlyoutLayout'

const signupSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Full name is required'),
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [pendingForm, setPendingForm] = useState<SignupForm | null>(null)
  const [resendBusy, setResendBusy] = useState(false)
  const [resendCooldownUntil, setResendCooldownUntil] = useState<number>(0)
  const [cooldownNowTick, setCooldownNowTick] = useState<number>(() => Date.now())

  const resendCooldownSeconds = useMemo(() => {
    const ms = resendCooldownUntil - cooldownNowTick
    return ms > 0 ? Math.ceil(ms / 1000) : 0
  }, [resendCooldownUntil, cooldownNowTick])

  useEffect(() => {
    if (!verifyOpen) return
    if (resendCooldownSeconds <= 0) return
    const t = window.setInterval(() => {
      setCooldownNowTick(Date.now())
    }, 500)
    return () => window.clearInterval(t)
  }, [verifyOpen, resendCooldownSeconds])

  useEffect(() => {
    if (!isAuthenticated) return
    navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const initiateMutation = useMutation({
    mutationFn: authApi.registerInitiate,
    onSuccess: () => {
      setVerifyOpen(true)
      setVerifyCode('')
      setCooldownNowTick(Date.now())
      setResendCooldownUntil(Date.now() + 45_000)
    },
    onError: (err: unknown) => {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Could not send verification code'
      setError(msg || 'Could not send verification code')
    },
  })

  const verifyMutation = useMutation({
    mutationFn: authApi.registerVerify,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      setVerifyOpen(false)
      navigate('/dashboard', { state: { openDiscoveryModal: true } })
    },
    onError: (err: unknown) => {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Verification failed'
      setError(msg || 'Verification failed')
    },
  })

  const onEmailSubmit = (data: SignupForm) => {
    setError('')
    setPendingForm(data)
    initiateMutation.mutate({ email: data.email })
  }

  const submitVerify = () => {
    setError('')
    const d = pendingForm
    if (!d) {
      setError('Please enter your details again.')
      setVerifyOpen(false)
      return
    }
    const trimmed = d.fullName.trim()
    const spaceIndex = trimmed.indexOf(' ')
    const firstName = spaceIndex > 0 ? trimmed.slice(0, spaceIndex) : trimmed
    const lastName = spaceIndex > 0 ? trimmed.slice(spaceIndex + 1).trim() : ''
    verifyMutation.mutate({
      email: d.email,
      password: d.password,
      firstName,
      lastName,
      code: verifyCode.trim(),
    })
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
      navigate('/dashboard')
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

        {!verifyOpen ? (
          <>
            <div className="mt-5">
              <h1 className="auth-card-title">Create your account</h1>
              <p className="auth-card-subtitle">Start acing your interviews today</p>
            </div>

              {error && (
                <div className="auth-alert auth-alert-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4 mt-5">
                <div>
                  <label className="auth-label">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="auth-input"
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                  {errors.fullName && (
                    <p className="auth-field-error">{errors.fullName.message}</p>
                  )}
                </div>
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
                  <label className="auth-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="auth-input pr-10"
                      placeholder="••••••••"
                      autoComplete="new-password"
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
                  disabled={initiateMutation.isPending}
                  className="auth-btn-primary w-full"
                >
                  {initiateMutation.isPending ? 'Sending code...' : 'Continue →'}
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
                      text="signup_with"
                      shape="rectangular"
                    />
                  </div>
                </>
              )}

              <p className="mt-6 text-center text-sm auth-muted">
                Already have an account?{' '}
                <Link to="/login" className="auth-link font-semibold">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
            <div className="auth-otp-head mt-5">
              <button
                type="button"
                onClick={() => {
                  if (verifyMutation.isPending) return
                  setVerifyOpen(false)
                  setError('')
                }}
                className="auth-icon-btn"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="auth-card-title">OTP Verification</h1>
                <p className="auth-card-subtitle">Enter the 6‑digit code we sent you</p>
              </div>
            </div>

              <p className="text-sm text-center auth-muted">
                We sent a verification code to <span className="auth-email-pill">{pendingForm?.email ?? ''}</span>
              </p>

              <div className="mt-5">
                <label className="auth-label">Verification Code</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setVerifyCode(v)
                  }}
                  className="auth-otp-input"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {error && (
                <div className="auth-alert auth-alert-error mt-4">
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={verifyMutation.isPending || verifyCode.trim().length !== 6}
                onClick={submitVerify}
                className="mt-5 auth-btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify & Create Account →'}
              </button>

              <div className="mt-4 text-center text-sm auth-muted">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  disabled={resendBusy || resendCooldownSeconds > 0}
                  onClick={async () => {
                    const email = pendingForm?.email
                    if (!email) return
                    setError('')
                    setResendBusy(true)
                    try {
                      await authApi.registerInitiate({ email })
                      setCooldownNowTick(Date.now())
                      setResendCooldownUntil(Date.now() + 45_000)
                    } catch (err: unknown) {
                      const msg = err && typeof err === 'object' && 'response' in err
                        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                        : 'Resend failed'
                      setError(msg || 'Resend failed')
                    } finally {
                      setResendBusy(false)
                    }
                  }}
                  className="auth-link font-semibold disabled:opacity-60 disabled:no-underline"
                >
                  {resendCooldownSeconds > 0 ? `Resend (${resendCooldownSeconds}s)` : (resendBusy ? 'Resending...' : 'Resend')}
                </button>
              </div>
            </>
          )}
      </div>
    </AuthFlyoutLayout>
  )
}

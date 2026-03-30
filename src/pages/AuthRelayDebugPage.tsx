import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth'

export default function AuthRelayDebugPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const [isOpeningDesktop, setIsOpeningDesktop] = useState(false)
  const [error, setError] = useState('')
  const hasAutoAttemptedRef = useRef(false)

  const query = new URLSearchParams(location.search)
  const client = query.get('client')
  const redirectUri = query.get('redirect_uri')
  const state = query.get('state')
  const safeFirstName = user?.firstName?.trim() || 'there'
  const hasRelayParams = !!redirectUri && !!state
  const callbackPath = useMemo(() => `${location.pathname}${location.search}`, [location.pathname, location.search])

  useEffect(() => {
    if (isAuthenticated) return
    const callbackUrl = encodeURIComponent(callbackPath)
    navigate(`/login?callbackUrl=${callbackUrl}`, { replace: true })
  }, [isAuthenticated, callbackPath, navigate])

  useEffect(() => {
    console.info('[WEB-AUTH] Auth relay route opened', {
      path: location.pathname,
      search: location.search,
      isAuthenticated,
      client,
      hasRedirectUri: !!redirectUri,
      hasState: !!state,
    })
  }, [location.pathname, location.search, isAuthenticated, client, redirectUri, state])

  const openDesktopApp = async () => {
    if (!redirectUri || !state) {
      setError('Missing redirect information. Please retry login from desktop app.')
      console.warn('[WEB-AUTH] Missing redirect_uri/state on auth relay')
      return
    }

    try {
      setError('')
      setIsOpeningDesktop(true)
      console.info('[WEB-AUTH] Initiating desktop auth exchange code issue', { client, redirectUri })
      const response = await authApi.desktopInitiate({
        client: client || 'desktop',
        redirectUri,
        state,
      })
      console.info('[WEB-AUTH] Redirecting browser to desktop callback URL', { redirectUrl: response.redirectUrl })
      window.location.assign(response.redirectUrl)
    } catch (err) {
      console.error('[WEB-AUTH] Desktop auth initiate failed', err)
      setError('Unable to open desktop app right now. Please try again.')
    } finally {
      setIsOpeningDesktop(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !hasRelayParams) return
    if (hasAutoAttemptedRef.current) return
    hasAutoAttemptedRef.current = true
    void openDesktopApp()
  }, [isAuthenticated, hasRelayParams])

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
          <span role="img" aria-label="Parakeet">🦜</span>
          <span>OrioAI</span>
        </div>

        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Authentication Successful</h1>
        <p className="mt-2 text-slate-600">Welcome back, {safeFirstName}!</p>

        <p className="mt-8 text-sm text-slate-700">
          Click &quot;Open OrioAI&quot; in the dialog shown by your browser.
          If you don&apos;t see the dialog, click &quot;Open in Desktop App&quot; below.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={openDesktopApp}
            disabled={!hasRelayParams || isOpeningDesktop}
            className="inline-flex items-center justify-center rounded-md bg-[#111a3a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b2957] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isOpeningDesktop ? 'Opening...' : 'Open in Desktop App'}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-10 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

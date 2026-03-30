import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const DESKTOP_PROTOCOL_URL = 'orioai://start'

export default function AuthDesktopCompletePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const hasAutoAttemptedRef = useRef(false)
  const safeFirstName = user?.firstName?.trim() || 'there'

  const openDesktopApp = () => {
    window.location.href = DESKTOP_PROTOCOL_URL
  }

  useEffect(() => {
    if (hasAutoAttemptedRef.current) return
    hasAutoAttemptedRef.current = true
    const t = window.setTimeout(() => openDesktopApp(), 400)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
          <span role="img" aria-label="Parakeet">
            🦜
          </span>
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
          Click &quot;Open OrioAI&quot; in the dialog shown by your browser. If you don&apos;t see the dialog, click
          &quot;Open in Desktop App&quot; below.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={openDesktopApp}
            className="inline-flex items-center justify-center rounded-md bg-[#111a3a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b2957]"
          >
            Open in Desktop App
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Your desktop app has finished signing in. You can close this tab after you return to the app.
        </p>

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

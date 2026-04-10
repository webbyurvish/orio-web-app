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
    <div className="flex min-h-dvh items-center justify-center orio-workspace-bg px-4 text-[var(--orio-text)]">
      <div className="w-full max-w-xl text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-[var(--orio-text)]">
          <span role="img" aria-label="Parakeet">
            🦜
          </span>
          <span>Smeed AI</span>
        </div>

        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-400/30">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-[var(--orio-text)]">Authentication Successful</h1>
        <p className="mt-2 text-lg text-[var(--orio-teal)]">Welcome back, {safeFirstName}!</p>

        <p className="mt-8 text-sm leading-relaxed text-[var(--orio-muted)]">
          Click &quot;Open Smeed AI&quot; in the dialog shown by your browser. If you don&apos;t see the dialog, click
          &quot;Open in Desktop App&quot; below.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={openDesktopApp}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-gradient-to-r from-teal-600 via-teal-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-950/40 transition hover:from-teal-500 hover:via-teal-500 hover:to-indigo-500"
          >
            Open in Desktop App
          </button>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-[var(--orio-muted)]">
          Your desktop app has finished signing in. You can close this tab after you return to the app.
        </p>

        <div className="mt-10 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--orio-muted)] transition-colors hover:text-[var(--orio-text)]"
          >
            <span aria-hidden>←</span>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

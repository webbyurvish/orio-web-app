import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  callSessionsApi,
  type CallSessionDto,
} from '../api/callSessions'
import { resumesApi } from '../api/resumes'
import {
  fetchDesktopSpeechToken,
  streamDesktopAiAnswer,
  streamDesktopScreenshotAnswer,
} from '../api/desktopSession'
import {
  AZURE_SPEECH_STT_LOCALES,
  DEFAULT_SPEECH_LOCALE,
  normalizeSpeechLocale,
} from '../constants/azureSpeechSttLocales'
import { useDisplayMediaAzureSpeech } from '../hooks/useDisplayMediaAzureSpeech'
import { composeBrowserExtendedSystemPrompt } from './browserSessionPrompts'
import { formatCreditsDisplay, useBillingStore } from '../store/billingStore'
import { InfoTooltip } from '../components/InfoTooltip'

type ChatRole = 'user' | 'interviewer' | 'assistant'

type ChatLine = {
  id: string
  role: ChatRole
  title: string
  body: string
  at: Date
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function shareSurfaceLabel(stream: MediaStream): string {
  const track = stream.getVideoTracks()[0]
  if (!track) return 'Shared content'
  const label = track.label?.trim()
  if (label && (label.includes('http') || label.includes('.'))) return label
  const settings = track.getSettings() as { displaySurface?: string }
  const ds = settings.displaySurface
  if (ds === 'monitor') return 'Entire screen'
  if (ds === 'window') return 'Application window'
  if (ds === 'browser') return 'Browser tab'
  return label || 'Shared content'
}

function formatTimeRemaining(endsAt: string | null | undefined): string {
  if (!endsAt) return '—'
  const end = new Date(endsAt).getTime()
  const ms = end - Date.now()
  if (ms <= 0) return '0:00'
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function BrowserSessionPage({ sessionId }: { sessionId: string }) {
  const navigate = useNavigate()
  const billingCredits = useBillingStore((s) => s.credits)
  const billingUnlimited = useBillingStore((s) => s.unlimitedAccess)

  const [session, setSession] = useState<CallSessionDto | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [resumeContext, setResumeContext] = useState<string | null>(null)
  const [connectLocale, setConnectLocale] = useState(DEFAULT_SPEECH_LOCALE)

  const [showConnectModal, setShowConnectModal] = useState(true)
  const [connectBusy, setConnectBusy] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  const [displayStream, setDisplayStream] = useState<MediaStream | null>(null)
  const [shareLabel, setShareLabel] = useState<string | null>(null)
  const [listeningStatus, setListeningStatus] = useState<string>('')

  const [partialText, setPartialText] = useState('')
  const transcriptRef = useRef('')
  const segmentsRef = useRef<string[]>([])

  const [lines, setLines] = useState<ChatLine[]>([])
  const [manualDraft, setManualDraft] = useState('')
  const [answerBusy, setAnswerBusy] = useState(false)
  const [screenshotBusy, setScreenshotBusy] = useState(false)
  const answerAbortRef = useRef<AbortController | null>(null)
  const activatedOnceRef = useRef(false)

  const [, bumpTimer] = useReducer((c: number) => c + 1, 0)
  const [showEndModal, setShowEndModal] = useState(false)
  const [endMode, setEndMode] = useState<'exit' | 'end'>('exit')

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const previewContainerRef = useRef<HTMLDivElement | null>(null)

  const speech = useDisplayMediaAzureSpeech({
    onRecognizing: (t) => setPartialText(t),
    onRecognized: (t) => {
      setPartialText('')
      segmentsRef.current = [...segmentsRef.current, t].slice(-12)
      transcriptRef.current = [transcriptRef.current, t].filter(Boolean).join(' ')
      setLines((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'interviewer',
          title: 'Transcript',
          body: t,
          at: new Date(),
        },
      ])
      if (session?.saveTranscript) {
        void callSessionsApi.addMessage(sessionId, { role: 'Interviewer', content: t }).catch(() => {})
      }
    },
    onCanceled: (msg) => {
      setListeningStatus(`Speech stopped: ${msg}`)
    },
  })

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const s = await callSessionsApi.get(sessionId)
        if (cancel) return
        setSession(s)
        setConnectLocale(normalizeSpeechLocale(s.language) || DEFAULT_SPEECH_LOCALE)
        if (s.resumeId) {
          try {
            const text = await resumesApi.getPlainText(s.resumeId)
            if (!cancel) setResumeContext(text?.trim() ? text : null)
          } catch {
            if (!cancel) setResumeContext(null)
          }
        } else {
          setResumeContext(null)
        }
      } catch {
        if (!cancel) setLoadError('This session was not found or you no longer have access.')
      }
    })()
    return () => {
      cancel = true
    }
  }, [sessionId])

  useEffect(() => {
    if (!session) return
    const st = (session.status ?? '').toLowerCase()
    const live =
      st === 'active' && session.endsAt != null && new Date(session.endsAt) > new Date()
    if (live) activatedOnceRef.current = true
  }, [session])

  useEffect(() => {
    if (!session?.endsAt) return
    const t = window.setInterval(() => bumpTimer(), 1000)
    return () => window.clearInterval(t)
  }, [session?.endsAt, bumpTimer])

  // Bind capture stream synchronously after paint so the <video> ref exists and frames render immediately.
  useLayoutEffect(() => {
    const el = videoRef.current
    if (!el) return

    if (!displayStream) {
      el.srcObject = null
      return
    }

    el.srcObject = displayStream

    const tryPlay = () => {
      void el.play().catch(() => {})
    }

    tryPlay()
    el.addEventListener('loadeddata', tryPlay)
    el.addEventListener('loadedmetadata', tryPlay)

    return () => {
      el.removeEventListener('loadeddata', tryPlay)
      el.removeEventListener('loadedmetadata', tryPlay)
      el.srcObject = null
    }
  }, [displayStream])

  const systemPrompt = useMemo(
    () => (session ? composeBrowserExtendedSystemPrompt(session, connectLocale) : ''),
    [session, connectLocale],
  )

  const stopSharing = useCallback(async () => {
    await speech.stop()
    displayStream?.getTracks().forEach((tr) => tr.stop())
    setDisplayStream(null)
    setShareLabel(null)
    setListeningStatus('')
    setPartialText('')
  }, [displayStream, speech])

  const cleanupAndLeave = useCallback(async () => {
    answerAbortRef.current?.abort()
    await speech.stop()
    displayStream?.getTracks().forEach((tr) => tr.stop())
    setDisplayStream(null)
  }, [displayStream, speech])

  const pickDisplayMedia = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new Error('Screen sharing is not supported in this browser. Try Chrome or Edge on desktop.')
    }
    // Do not combine `preferCurrentTab` with `selfBrowserSurface: 'exclude'` — Chrome rejects that as self-contradictory.
    return navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 12, max: 30 } },
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      } as MediaTrackConstraints,
    })
  }, [])

  const handleActivateAndConnect = useCallback(async () => {
    if (!session) return
    setConnectError(null)
    setConnectBusy(true)
    try {
      const stream = await pickDisplayMedia()
      const audioOk = stream.getAudioTracks().length > 0

      let nextSession = session
      if (!activatedOnceRef.current) {
        try {
          nextSession = await callSessionsApi.activate(sessionId)
          activatedOnceRef.current = true
        } catch (err) {
          stream.getTracks().forEach((t) => t.stop())
          if (axios.isAxiosError(err) && err.response?.status === 402) {
            const msg =
              (err.response?.data as { message?: string })?.message ||
              'Not enough call credits to start this session.'
            throw new Error(msg)
          }
          throw err instanceof Error ? err : new Error('Could not start the session timer.')
        }
      } else {
        try {
          nextSession = await callSessionsApi.get(sessionId)
        } catch {
          /* keep previous */
        }
      }

      setSession(nextSession)
      setShowConnectModal(false)
      setDisplayStream(stream)
      setShareLabel(shareSurfaceLabel(stream))

      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        void stopSharing()
      })

      const tokenInfo = await fetchDesktopSpeechToken()

      if (audioOk) {
        setListeningStatus('Listening…')
        await speech.start(stream, connectLocale, tokenInfo.token, tokenInfo.region)
      } else {
        setListeningStatus(
          'Video is shared but no audio track was captured. Share a tab with “Also share tab audio” enabled, or include system audio.',
        )
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not connect.'
      if (msg.includes('Permission denied') || msg.includes('NotAllowedError')) {
        setConnectError('Sharing was cancelled or blocked. Allow screen capture when prompted.')
      } else {
        setConnectError(msg)
      }
    } finally {
      setConnectBusy(false)
    }
  }, [connectLocale, pickDisplayMedia, session, sessionId, speech, stopSharing])

  const handleChangeShare = useCallback(async () => {
    await stopSharing()
    setShowConnectModal(false)
    setConnectError(null)
    await handleActivateAndConnect()
  }, [handleActivateAndConnect, stopSharing])

  const latestQuestionText = useCallback(() => {
    const segs = segmentsRef.current
    if (segs.length) return segs[segs.length - 1]?.trim() ?? ''
    const t = transcriptRef.current.trim()
    if (t.length > 400) return t.slice(-400)
    return t
  }, [])

  const runAnswer = useCallback(
    async (userContent: string, heading: string) => {
      if (!session || !userContent.trim()) return
      const status = (session.status ?? '').toLowerCase()
      const ended =
        status === 'ended' ||
        (!!session.endsAt && new Date(session.endsAt) <= new Date())
      if (ended) {
        setConnectError('This session has ended. Open a new call session to continue.')
        return
      }

      answerAbortRef.current?.abort()
      const ac = new AbortController()
      answerAbortRef.current = ac

      setAnswerBusy(true)
      let streamed = ''
      const streamId = uid()
      setLines((prev) => [
        ...prev,
        { id: streamId, role: 'assistant', title: heading, body: '', at: new Date() },
      ])

      try {
        streamed = await streamDesktopAiAnswer(
          {
            userContent: userContent.trim(),
            systemPrompt,
            resumeContext: resumeContext ?? undefined,
          },
          (chunk) => {
            streamed += chunk
            setLines((prev) =>
              prev.map((l) => (l.id === streamId ? { ...l, body: streamed } : l)),
            )
          },
          ac.signal,
        )
        if (session.saveTranscript && streamed.trim()) {
          try {
            await callSessionsApi.addMessage(sessionId, { role: 'Assistant', content: streamed.trim() })
          } catch {
            /* ignore */
          }
        }
        try {
          await callSessionsApi.incrementAiUsage(sessionId)
        } catch {
          /* ignore */
        }
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') {
          setLines((prev) => prev.filter((l) => l.id !== streamId))
          return
        }
        const err = e instanceof Error ? e.message : 'Answer failed.'
        setLines((prev) =>
          prev.map((l) => (l.id === streamId ? { ...l, body: `Error: ${err}` } : l)),
        )
      } finally {
        setAnswerBusy(false)
      }
    },
    [resumeContext, session, sessionId, systemPrompt],
  )

  const handleAiAnswer = useCallback(() => {
    const manual = manualDraft.trim()
    const fromSpeech = latestQuestionText()
    const userContent = manual
      ? `Answer this question. Context from the candidate (typed): ${manual}`
      : `Answer this question (from shared audio transcription). Focus on the latest utterance:\n${fromSpeech || '(no transcript yet — speak in the meeting or type a question first.)'}`

    const heading = manual ? 'Your message' : fromSpeech ? 'Latest from audio' : 'AI answer'
    void runAnswer(userContent, heading)
  }, [latestQuestionText, manualDraft, runAnswer])

  const handleSendManual = useCallback(async () => {
    const t = manualDraft.trim()
    if (!t || !session) return
    setManualDraft('')
    setLines((prev) => [...prev, { id: uid(), role: 'user', title: 'You', body: t, at: new Date() }])
    if (session.saveTranscript) {
      try {
        await callSessionsApi.addMessage(sessionId, { role: 'User', content: t })
      } catch {
        /* ignore */
      }
    }
  }, [manualDraft, session, sessionId])

  const captureVideoFrameBase64 = useCallback((): string | null => {
    const video = videoRef.current
    if (!video || video.videoWidth < 2 || video.videoHeight < 2) return null
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/png')
    const i = dataUrl.indexOf(',')
    return i >= 0 ? dataUrl.slice(i + 1) : null
  }, [])

  const handleScreenshotAnswer = useCallback(async () => {
    if (!session) return
    const b64 = captureVideoFrameBase64()
    if (!b64) {
      setConnectError('No video frame to capture yet. Share your screen first and wait a moment.')
      return
    }
    setConnectError(null)
    answerAbortRef.current?.abort()
    const ac = new AbortController()
    answerAbortRef.current = ac
    setScreenshotBusy(true)
    const streamId = uid()
    setLines((prev) => [
      ...prev,
      { id: streamId, role: 'assistant', title: 'Screenshot', body: '', at: new Date() },
    ])
    let streamed = ''
    try {
      streamed = await streamDesktopScreenshotAnswer(
        {
          imageBase64: b64,
          mimeType: 'image/png',
          systemPrompt,
          resumeContext: resumeContext ?? undefined,
        },
        (chunk) => {
          streamed += chunk
          setLines((prev) =>
            prev.map((l) => (l.id === streamId ? { ...l, body: streamed } : l)),
          )
        },
        ac.signal,
      )
      if (session.saveTranscript && streamed.trim()) {
        try {
          await callSessionsApi.addMessage(sessionId, {
            role: 'Assistant',
            content: `[Screenshot] ${streamed.trim()}`,
          })
        } catch {
          /* ignore */
        }
      }
      try {
        await callSessionsApi.incrementAiUsage(sessionId)
      } catch {
        /* ignore */
      }
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') {
        setLines((prev) => prev.filter((l) => l.id !== streamId))
        return
      }
      const err = e instanceof Error ? e.message : 'Screenshot answer failed.'
      setLines((prev) =>
        prev.map((l) => (l.id === streamId ? { ...l, body: `Error: ${err}` } : l)),
      )
    } finally {
      setScreenshotBusy(false)
    }
  }, [captureVideoFrameBase64, resumeContext, session, sessionId, systemPrompt])

  const clearChat = useCallback(() => {
    setLines([])
    transcriptRef.current = ''
    segmentsRef.current = []
    setPartialText('')
  }, [])

  const openFullscreenPreview = useCallback(() => {
    const el = previewContainerRef.current
    if (!el) return
    void el.requestFullscreen?.().catch(() => {})
  }, [])

  const handleExitConfirm = useCallback(async () => {
    if (endMode === 'end') {
      try {
        await callSessionsApi.end(sessionId)
      } catch {
        /* still navigate */
      }
    }
    await cleanupAndLeave()
    setShowEndModal(false)
    navigate('/dashboard/call-sessions')
  }, [cleanupAndLeave, endMode, navigate, sessionId])

  useEffect(() => {
    return () => {
      void cleanupAndLeave()
    }
  }, [cleanupAndLeave])

  if (loadError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center text-[var(--orio-text)]">
        <p className="text-lg">{loadError}</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/call-sessions')}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10"
        >
          Back to sessions
        </button>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--orio-muted)]">
        Loading session…
      </div>
    )
  }

  const sessionEnded =
    (session.status ?? '').toLowerCase() === 'ended' ||
    (!!session.endsAt && new Date(session.endsAt) <= new Date())

  return (
    <div className="flex min-h-dvh flex-col text-[var(--orio-text)]">
      {/* Top share bar */}
      {displayStream && (
        <div className="flex shrink-0 items-center justify-center gap-3 border-b border-white/10 bg-[var(--orio-elevated)] px-4 py-2.5 text-sm">
          <span className="text-[var(--orio-muted)]">
            Sharing{' '}
            <span className="text-slate-200 font-medium">{shareLabel ?? 'shared content'}</span> to this tab
          </span>
          <button
            type="button"
            onClick={() => void stopSharing()}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:brightness-110"
          >
            Stop sharing
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left: capture + controls */}
        <section className="flex w-full shrink-0 flex-col border-b border-white/10 lg:w-[min(44%,520px)] lg:border-b-0 lg:border-r">
          <div className="border-b border-white/10 p-3 sm:p-4">
            <div
              ref={previewContainerRef}
              className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black"
            >
              <video
                ref={videoRef}
                className="relative z-[1] block h-full w-full object-contain bg-black"
                playsInline
                muted
                autoPlay
              />
              {!displayStream && (
                <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-4 text-center text-sm text-[var(--orio-muted)]">
                  Share a tab or screen to see the preview here
                </div>
              )}
              {displayStream && (
                <div className="absolute bottom-2 left-2 right-2 z-[2] flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openFullscreenPreview}
                    className="rounded-lg bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/80"
                  >
                    Fullscreen
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleChangeShare()}
                    disabled={connectBusy}
                    className="rounded-lg bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/80 disabled:opacity-50"
                  >
                    Change share
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleActivateAndConnect()}
                disabled={connectBusy || sessionEnded}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-teal-500/20 hover:brightness-110 disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                {displayStream ? 'Reconnect audio' : 'Activate & connect'}
              </button>
              <button
                type="button"
                onClick={clearChat}
                className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                title="Clear transcript and answers on this page"
              >
                <span className="text-lg leading-none">×</span>
                Clear
              </button>
              <label className="flex items-center gap-2 text-sm text-[var(--orio-muted)]">
                <span className="hidden sm:inline">Language</span>
                <select
                  value={connectLocale}
                  onChange={(e) => setConnectLocale(e.target.value)}
                  disabled={!!displayStream}
                  className="rounded-lg border border-white/15 bg-[var(--orio-surface)] px-2 py-1.5 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  {AZURE_SPEECH_STT_LOCALES.map((o) => (
                    <option key={o.locale} value={o.locale}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-2 text-xs text-[var(--orio-muted)]">
              {listeningStatus ||
                (displayStream
                  ? partialText
                    ? `Listening… ${partialText}`
                    : 'Listening for audio from your share…'
                  : 'Connect to start your session timer and transcription.')}
            </p>
            {connectError && (
              <p className="mt-2 text-xs text-rose-300" role="alert">
                {connectError}
              </p>
            )}
          </div>
        </section>

        {/* Right: chat + actions */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 via-violet-500 to-fuchsia-500 text-white shadow-md">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8 2 6 5 6 8c0 2 1 4 2 5l-2 6h12l-2-6c1-1 2-3 2-5 0-3-2-6-6-6z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h1 className="truncate font-semibold text-slate-100">Smeed AI</h1>
                <p className="truncate text-xs text-[var(--orio-muted)]">{session.title || 'Browser session'}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-teal-300/90 tabular-nums" suppressHydrationWarning>
                {formatTimeRemaining(session.endsAt)}
                {session.isFreeSession ? ' (Free)' : ''}
              </span>
              {!billingUnlimited && (
                <span className="text-[10px] text-[var(--orio-muted)]">
                  Credits {formatCreditsDisplay(billingCredits)}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setEndMode('exit')
                  setShowEndModal(true)
                }}
                className="rounded-lg border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25"
              >
                Exit
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {lines.length === 0 && !partialText ? (
              <p className="py-8 text-center text-sm text-[var(--orio-muted)]">
                No messages yet. Use <strong className="text-slate-300">Answer</strong> after the interviewer speaks, or type below.
              </p>
            ) : (
              <>
                {lines.map((line) => (
                  <article
                    key={line.id}
                    className={`rounded-xl border px-3 py-2.5 text-sm ${
                      line.role === 'assistant'
                        ? 'border-teal-500/25 bg-teal-500/10'
                        : line.role === 'user'
                          ? 'border-violet-500/25 bg-violet-500/10'
                          : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2 text-xs text-[var(--orio-muted)]">
                      <span className="font-semibold text-slate-200">{line.title}</span>
                      <time dateTime={line.at.toISOString()}>
                        {line.at.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </time>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-100/95">{line.body}</div>
                  </article>
                ))}
                {partialText ? (
                  <p className="text-xs italic text-[var(--orio-muted)]">…{partialText}</p>
                ) : null}
              </>
            )}
          </div>

          <footer className="shrink-0 border-t border-white/10 bg-[var(--orio-elevated)]/80 p-4 backdrop-blur-md">
            <div className="flex gap-2">
              <input
                type="text"
                value={manualDraft}
                onChange={(e) => setManualDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSendManual()
                }}
                placeholder="Type a manual message…"
                className="min-w-0 flex-1 rounded-xl border border-white/12 bg-[var(--orio-surface)] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/35"
              />
              <button
                type="button"
                onClick={() => void handleSendManual()}
                className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/15"
              >
                Send
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleAiAnswer()}
                disabled={answerBusy || sessionEnded}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10 hover:brightness-110 disabled:opacity-50"
              >
                <svg className="h-5 w-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.2H22l-6 4.8 2.3 7L12 17.5 5.7 21l2.3-7-6-4.8h7.6L12 2z" />
                </svg>
                {answerBusy ? 'Answering…' : 'Answer'}
              </button>
              <button
                type="button"
                onClick={() => void handleScreenshotAnswer()}
                disabled={screenshotBusy || !displayStream || sessionEnded}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {screenshotBusy ? 'Analyzing…' : 'Screenshot'}
              </button>
            </div>
          </footer>
        </section>
      </div>

      {/* Connect modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            aria-hidden
            onClick={() => {
              if (!connectBusy) setShowConnectModal(false)
            }}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/12 bg-[var(--orio-elevated)] shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-2 border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-100">Connect</h2>
              <button
                type="button"
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                onClick={() => !connectBusy && setShowConnectModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="max-h-[min(70vh,540px)] space-y-4 overflow-y-auto px-5 py-4 text-sm text-[var(--orio-muted)]">
              <p className="text-slate-300">
                Interview session for{' '}
                <strong className="text-slate-100">{session.title || 'your role'}</strong>
                {session.description ? (
                  <>
                    {' '}
                    · <span className="text-slate-200">{session.description.slice(0, 120)}</span>
                    {session.description.length > 120 ? '…' : ''}
                  </>
                ) : null}
                {session.extraContext ? (
                  <>
                    {' '}
                    and{' '}
                    <span className="text-teal-300/90">extra context</span> in your session settings.
                  </>
                ) : null}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-300">
                    Language
                    <InfoTooltip
                      side="top"
                      label="Transcription language"
                      content="Should match the language spoken in your interview. Same locales as the desktop app (Azure Speech)."
                    />
                  </div>
                  <select
                    value={connectLocale}
                    onChange={(e) => setConnectLocale(e.target.value)}
                    className="w-full rounded-lg border border-white/12 bg-[var(--orio-surface)] px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/35"
                  >
                    {AZURE_SPEECH_STT_LOCALES.map((o) => (
                      <option key={o.locale} value={o.locale}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-300">
                    AI model
                    <InfoTooltip
                      side="top"
                      label="Model"
                      content="Deployment is chosen on the server (Azure OpenAI), matching your dashboard session label."
                    />
                  </div>
                  <div className="rounded-lg border border-white/12 bg-[var(--orio-surface)] px-3 py-2 text-slate-100">
                    {session.aiModel || 'Default'}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-3 text-xs text-amber-100/90">
                <strong className="font-semibold text-amber-200">Audio:</strong> When the browser asks what to share,
                pick your meeting tab and turn on <strong>Also share tab audio</strong> (Chrome/Edge). Without it,
                Smeed AI cannot hear the interviewer.
              </div>

              {connectError && (
                <p className="text-xs text-rose-300" role="alert">
                  {connectError}
                </p>
              )}
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  if (!connectBusy) setShowConnectModal(false)
                }}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="button"
                disabled={connectBusy || sessionEnded}
                onClick={() => void handleActivateAndConnect()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110 disabled:opacity-50"
              >
                {connectBusy ? 'Connecting…' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End session modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/12 bg-[var(--orio-elevated)] p-5 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-100">End Session</h2>
            <p className="mt-1 text-sm text-[var(--orio-muted)]">
              Exit keeps the server session running until the timer ends. End session closes it permanently for this run.
            </p>
            <div className="mt-4 space-y-2">
              <label
                className={`flex cursor-pointer flex-col rounded-xl border px-3 py-3 ${
                  endMode === 'exit' ? 'border-teal-500/50 bg-teal-500/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <input
                    type="radio"
                    name="endMode"
                    checked={endMode === 'exit'}
                    onChange={() => setEndMode('exit')}
                    className="accent-teal-500"
                  />
                  Exit
                </span>
                <span className="mt-1 pl-6 text-xs text-[var(--orio-muted)]">
                  Leave this page without ending the call on the server. The timer keeps counting down.
                </span>
              </label>
              <label
                className={`flex cursor-pointer flex-col rounded-xl border px-3 py-3 ${
                  endMode === 'end' ? 'border-rose-500/45 bg-rose-500/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <input
                    type="radio"
                    name="endMode"
                    checked={endMode === 'end'}
                    onChange={() => setEndMode('end')}
                    className="accent-rose-500"
                  />
                  End session
                </span>
                <span className="mt-1 pl-6 text-xs text-[var(--orio-muted)]">
                  Ends the session on the server now. You will need a new session to continue later.
                </span>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => void handleExitConfirm()}
                className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

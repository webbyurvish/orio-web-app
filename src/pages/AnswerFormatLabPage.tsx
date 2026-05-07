import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDesktopSpeechToken, streamDesktopAiAnswer } from '../api/desktopSession'
import {
  AZURE_SPEECH_STT_LOCALES,
  DEFAULT_SPEECH_LOCALE,
  normalizeSpeechLocale,
} from '../constants/azureSpeechSttLocales'
import { useDisplayMediaAzureSpeech } from '../hooks/useDisplayMediaAzureSpeech'
import DesktopStyleAnswerMarkdown from '../components/DesktopStyleAnswerMarkdown'
import {
  composeDesktopExtendedSystemPrompt,
  DESKTOP_ANSWER_FROM_TRANSCRIPT_SYSTEM_PROMPT,
  DESKTOP_TYPED_FLOW_DEFAULT_BASE,
} from '../lib/desktopAnswerPrompts'

const LS = {
  base: 'orio.answerLab.baseSystemPrompt',
  extra: 'orio.answerLab.sessionExtraContext',
  natural: 'orio.answerLab.naturalSpeaking',
  locale: 'orio.answerLab.answerLocale',
  resume: 'orio.answerLab.resumeContext',
  typedQ: 'orio.answerLab.typedQuestionDraft',
} as const

export default function AnswerFormatLabPage() {
  const [baseSystemPrompt, setBaseSystemPrompt] = useState(DESKTOP_ANSWER_FROM_TRANSCRIPT_SYSTEM_PROMPT)
  const [sessionExtraContext, setSessionExtraContext] = useState('')
  const [naturalSpeakingMode, setNaturalSpeakingMode] = useState(false)
  const [answerLocale, setAnswerLocale] = useState(DEFAULT_SPEECH_LOCALE)
  const [resumeContext, setResumeContext] = useState('')
  const [typedQuestion, setTypedQuestion] = useState('')

  const [partialText, setPartialText] = useState('')
  const [transcriptDisplay, setTranscriptDisplay] = useState('')
  const transcriptRef = useRef('')
  const segmentsRef = useRef<string[]>([])

  const [listening, setListening] = useState(false)
  const [listenError, setListenError] = useState<string | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)

  const [answerBusy, setAnswerBusy] = useState(false)
  const [answerMarkdown, setAnswerMarkdown] = useState('')
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [showRawAnswer, setShowRawAnswer] = useState(false)
  const [showFullSystemPrompt, setShowFullSystemPrompt] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const speech = useDisplayMediaAzureSpeech({
    onRecognizing: (t) => setPartialText(t),
    onRecognized: (t) => {
      setPartialText('')
      segmentsRef.current = [...segmentsRef.current, t].slice(-12)
      transcriptRef.current = [transcriptRef.current, t].filter(Boolean).join(' ')
      setTranscriptDisplay(transcriptRef.current)
    },
    onCanceled: (msg) => {
      setListenError(`Speech: ${msg}`)
    },
  })

  useEffect(() => {
    try {
      const b = localStorage.getItem(LS.base)
      if (b) setBaseSystemPrompt(b)
      const e = localStorage.getItem(LS.extra)
      if (e != null) setSessionExtraContext(e)
      const n = localStorage.getItem(LS.natural)
      if (n === '1') setNaturalSpeakingMode(true)
      const l = localStorage.getItem(LS.locale)
      if (l) setAnswerLocale(normalizeSpeechLocale(l) || DEFAULT_SPEECH_LOCALE)
      const r = localStorage.getItem(LS.resume)
      if (r != null) setResumeContext(r)
      const t = localStorage.getItem(LS.typedQ)
      if (t != null) setTypedQuestion(t)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS.base, baseSystemPrompt)
    } catch {
      /* ignore */
    }
  }, [baseSystemPrompt])
  useEffect(() => {
    try {
      localStorage.setItem(LS.extra, sessionExtraContext)
    } catch {
      /* ignore */
    }
  }, [sessionExtraContext])
  useEffect(() => {
    try {
      localStorage.setItem(LS.natural, naturalSpeakingMode ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [naturalSpeakingMode])
  useEffect(() => {
    try {
      localStorage.setItem(LS.locale, answerLocale)
    } catch {
      /* ignore */
    }
  }, [answerLocale])
  useEffect(() => {
    try {
      localStorage.setItem(LS.resume, resumeContext)
    } catch {
      /* ignore */
    }
  }, [resumeContext])
  useEffect(() => {
    try {
      localStorage.setItem(LS.typedQ, typedQuestion)
    } catch {
      /* ignore */
    }
  }, [typedQuestion])

  const composedSystemPrompt = useMemo(
    () =>
      composeDesktopExtendedSystemPrompt({
        baseSystemPrompt,
        answerLocale,
        sessionExtraContext,
        naturalSpeakingMode,
      }),
    [baseSystemPrompt, answerLocale, sessionExtraContext, naturalSpeakingMode],
  )

  const latestUtterance = useCallback(() => {
    const segs = segmentsRef.current
    if (segs.length) return segs[segs.length - 1]?.trim() ?? ''
    const t = transcriptRef.current.trim()
    if (t.length > 400) return t.slice(-400)
    return t
  }, [])

  const stopMic = useCallback(async () => {
    await speech.stop()
    micStreamRef.current?.getTracks().forEach((tr) => tr.stop())
    micStreamRef.current = null
    setListening(false)
    setPartialText('')
  }, [speech])

  useEffect(() => {
    return () => {
      void stopMic()
    }
  }, [stopMic])

  const startMic = useCallback(async () => {
    setListenError(null)
    if (listening) {
      await stopMic()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      micStreamRef.current = stream
      const tokenInfo = await fetchDesktopSpeechToken()
      const loc = normalizeSpeechLocale(answerLocale) || DEFAULT_SPEECH_LOCALE
      await speech.start(stream, loc, tokenInfo.token, tokenInfo.region)
      setListening(true)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not start microphone.'
      if (msg.includes('Permission') || msg.includes('NotAllowed')) {
        setListenError('Microphone permission was blocked or dismissed.')
      } else {
        setListenError(msg)
      }
      micStreamRef.current?.getTracks().forEach((tr) => tr.stop())
      micStreamRef.current = null
    }
  }, [answerLocale, listening, speech, stopMic])

  const clearTranscript = useCallback(() => {
    transcriptRef.current = ''
    segmentsRef.current = []
    setTranscriptDisplay('')
    setPartialText('')
  }, [])

  const runAnswer = useCallback(async () => {
    const typed = typedQuestion.trim()
    const fromMic = latestUtterance()
    const focus = typed || fromMic
    if (!focus) {
      setAnswerError('Type a question or speak so something appears in the live transcript first.')
      return
    }

    setAnswerError(null)
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setAnswerBusy(true)
    setAnswerMarkdown('')

    const prefix = typed
      ? 'Answer ONLY this question (typed in the lab). Optional live-transcript context may appear below; ignore it unless it clearly helps answer this one question:\n'
      : 'Answer this question (transcribed from your microphone). Focus only on the question(s) below:\n'

    const tail = transcriptRef.current.trim()
    const tailClamped = tail.length > 3500 ? tail.slice(-3500).trimStart() : tail
    const userContent = typed
      ? `${prefix}${typed}\n\nOptional context (may be unrelated; use ONLY if it helps):\n${tailClamped || '(no transcript context)'}`
      : `${prefix}\n\n${focus}`

    let streamed = ''
    try {
      streamed = await streamDesktopAiAnswer(
        {
          userContent,
          systemPrompt: composedSystemPrompt,
          resumeContext: resumeContext.trim() ? resumeContext : undefined,
        },
        (chunk) => {
          streamed += chunk
          setAnswerMarkdown(streamed)
        },
        ac.signal,
      )
      setAnswerMarkdown(streamed)
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return
      setAnswerError(e instanceof Error ? e.message : 'Answer failed.')
    } finally {
      setAnswerBusy(false)
    }
  }, [composedSystemPrompt, latestUtterance, resumeContext, typedQuestion])

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col bg-[var(--orio-workspace-bg,#0a0c10)] text-[var(--orio-text)]">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[var(--orio-elevated)]/90 px-4 py-3 backdrop-blur-md">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-100">Answer format lab</h1>
          <p className="truncate text-xs text-[var(--orio-muted)]">
            Desktop parity: extended system prompt, streaming API, markdown + code cards.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/dashboard/call-sessions"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-2">
          {/* Prompts */}
          <section className="space-y-3 rounded-2xl border border-white/10 bg-[var(--orio-elevated)]/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-100">System prompt (desktop parity)</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
                  onClick={() => setBaseSystemPrompt(DESKTOP_ANSWER_FROM_TRANSCRIPT_SYSTEM_PROMPT)}
                >
                  Preset: transcript base
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
                  onClick={() => setBaseSystemPrompt(DESKTOP_TYPED_FLOW_DEFAULT_BASE)}
                >
                  Preset: typed-flow base
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--orio-muted)]">
              This textarea is the first argument to desktop <code className="rounded bg-black/30 px-1">ComposeExtendedSystemPrompt</code>
              (same as the static transcript prompt or the short appsettings base for typed Ask). The app then appends session extra
              instructions, natural speaking mode, output language, and the strict formatting suffix.
            </p>
            <label className="block text-xs font-medium text-slate-300">
              Base system prompt (editable)
              <textarea
                value={baseSystemPrompt}
                onChange={(e) => setBaseSystemPrompt(e.target.value)}
                spellCheck={false}
                className="mt-1.5 h-48 w-full resize-y rounded-xl border border-white/12 bg-[var(--orio-surface)] p-3 font-mono text-[12px] leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/35"
              />
            </label>

            <label className="block text-xs font-medium text-slate-300">
              Session extra instructions (maps to desktop “Additional instructions”)
              <textarea
                value={sessionExtraContext}
                onChange={(e) => setSessionExtraContext(e.target.value)}
                placeholder="Optional — same as call session extra context on desktop."
                className="mt-1.5 h-24 w-full resize-y rounded-xl border border-white/12 bg-[var(--orio-surface)] p-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/35"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={naturalSpeakingMode}
                onChange={(e) => setNaturalSpeakingMode(e.target.checked)}
                className="accent-teal-500"
              />
              Natural speaking mode (desktop session flag)
            </label>

            <label className="block text-xs font-medium text-slate-300">
              Answer output language (desktop OUTPUT LANGUAGE line)
              <select
                value={answerLocale}
                onChange={(e) => setAnswerLocale(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/12 bg-[var(--orio-surface)] px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/35"
              >
                {AZURE_SPEECH_STT_LOCALES.map((o) => (
                  <option key={o.locale} value={o.locale}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-slate-300">
              Resume context (plain text — sent as <code className="rounded bg-black/30 px-1">resumeContext</code> to the API)
              <textarea
                value={resumeContext}
                onChange={(e) => setResumeContext(e.target.value)}
                placeholder="Paste resume plain text to test grounding…"
                className="mt-1.5 h-32 w-full resize-y rounded-xl border border-white/12 bg-[var(--orio-surface)] p-3 font-mono text-[12px] text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/35"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowFullSystemPrompt((v) => !v)}
              className="text-xs font-semibold text-teal-300/90 hover:underline"
            >
              {showFullSystemPrompt ? 'Hide' : 'Show'} full composed system prompt ({composedSystemPrompt.length} chars)
            </button>
            {showFullSystemPrompt ? (
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-slate-300">
                {composedSystemPrompt}
              </pre>
            ) : null}
          </section>

          {/* Input + answer */}
          <section className="space-y-3 rounded-2xl border border-white/10 bg-[var(--orio-elevated)]/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100">Question</h2>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void startMic()}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md ${
                  listening
                    ? 'bg-rose-500/90 text-white hover:brightness-110'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 hover:brightness-110'
                }`}
              >
                {listening ? 'Stop microphone' : 'Speak (microphone)'}
              </button>
              <button
                type="button"
                onClick={clearTranscript}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                Clear transcript
              </button>
            </div>
            {listenError ? <p className="text-xs text-rose-300">{listenError}</p> : null}

            <div>
              <p className="mb-1 text-xs font-medium text-slate-400">Live transcript</p>
              <div className="min-h-[100px] rounded-xl border border-white/10 bg-black/35 p-3 text-sm text-slate-100/95">
                {transcriptDisplay ? (
                  <p className="whitespace-pre-wrap">{transcriptDisplay}</p>
                ) : (
                  <p className="text-[var(--orio-muted)]">…waiting for speech</p>
                )}
                {partialText ? (
                  <p className="mt-2 border-t border-white/10 pt-2 text-xs italic text-teal-200/80">Listening: {partialText}</p>
                ) : null}
              </div>
            </div>

            <label className="block text-xs font-medium text-slate-300">
              Or type the question (takes priority over latest spoken line when non-empty)
              <textarea
                value={typedQuestion}
                onChange={(e) => setTypedQuestion(e.target.value)}
                placeholder="e.g. Explain how you would debug a slow SQL query in production."
                className="mt-1.5 min-h-[88px] w-full resize-y rounded-xl border border-white/12 bg-[var(--orio-surface)] p-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/35"
              />
            </label>

            <button
              type="button"
              disabled={answerBusy}
              onClick={() => void runAnswer()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10 hover:brightness-110 disabled:opacity-50"
            >
              {answerBusy ? 'Streaming answer…' : 'Answer (same API as desktop)'}
            </button>
            {answerBusy ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="w-full rounded-xl border border-white/15 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Stop stream
              </button>
            ) : null}

            {answerError ? (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{answerError}</p>
            ) : null}
          </section>

          {/* Answer panel — full width on large screens */}
          <section className="lg:col-span-2 space-y-3 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-100">Answer (desktop-style rendering)</h2>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={showRawAnswer}
                  onChange={(e) => setShowRawAnswer(e.target.checked)}
                  className="accent-teal-500"
                />
                Show raw markdown
              </label>
            </div>

            <div className="min-h-[200px] rounded-xl border border-white/10 bg-[#07090d]/90 p-4">
              {!answerMarkdown && !answerBusy ? (
                <p className="text-sm text-[var(--orio-muted)]">Run an answer to preview formatting here.</p>
              ) : showRawAnswer ? (
                <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-slate-200/95">{answerMarkdown}</pre>
              ) : (
                <DesktopStyleAnswerMarkdown markdown={answerMarkdown} stripAltBlock />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

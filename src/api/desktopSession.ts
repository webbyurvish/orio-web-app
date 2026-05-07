import { useAuthStore } from '../store/authStore'

/** Matches axios client: VITE_API_URL or `/api`. */
const apiRoot = () =>
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api'

const desktopBase = () => `${apiRoot()}/desktop`

export interface DesktopSpeechTokenDto {
  region: string
  token: string
  expiresInSeconds: number
}

export async function fetchDesktopSpeechToken(): Promise<DesktopSpeechTokenDto> {
  const token = useAuthStore.getState().token
  const res = await fetch(`${desktopBase()}/speech/token`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText)
    throw new Error(err || `Speech token failed (${res.status})`)
  }
  return res.json() as Promise<DesktopSpeechTokenDto>
}

export interface DesktopAiAnswerPayload {
  userContent: string
  systemPrompt?: string | null
  resumeContext?: string | null
}

function authHeader(): HeadersInit {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function errorTextFromFailedResponse(status: number, body: string): string {
  const t = body.trim()
  if (t.startsWith('{')) {
    try {
      const j = JSON.parse(t) as { message?: string; detail?: string }
      const combined = [j.message, j.detail].filter(Boolean).join(' — ')
      if (combined) return combined
    } catch {
      /* use raw body */
    }
  }
  return t || `Request failed (${status})`
}

/** Reads NDJSON lines `{ "d": "chunk" }` or `{ "error": "..." }`. */
export async function streamDesktopAiAnswer(
  payload: DesktopAiAnswerPayload,
  onDelta: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(`${desktopBase()}/ai/answer-stream`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({
      userContent: payload.userContent,
      systemPrompt: payload.systemPrompt ?? undefined,
      resumeContext: payload.resumeContext ?? undefined,
    }),
    signal,
  })

  if (!res.ok) {
    const t = await res.text().catch(() => res.statusText)
    throw new Error(errorTextFromFailedResponse(res.status, t))
  }

  const reader = res.body?.getReader()
  if (!reader) {
    const t = await res.text()
    throw new Error(t || 'Empty AI response')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      let obj: { d?: string; error?: string; m?: string }
      try {
        obj = JSON.parse(trimmed) as { d?: string; error?: string; m?: string }
      } catch {
        continue
      }
      if (obj.error) throw new Error(obj.error)
      if (obj.m === 'stream-open') continue
      if (obj.d) {
        full += obj.d
        onDelta(obj.d)
      }
    }
  }

  const tail = buffer.trim()
  if (tail) {
    try {
      const obj = JSON.parse(tail) as { d?: string; error?: string; m?: string }
      if (obj.error) throw new Error(obj.error)
      if (obj.m === 'stream-open') {
        /* ignore */
      } else if (obj.d) {
        full += obj.d
        onDelta(obj.d)
      }
    } catch {
      /* ignore */
    }
  }

  return full
}

export async function streamDesktopScreenshotAnswer(
  payload: {
    imageBase64: string
    mimeType?: string
    systemPrompt?: string | null
    resumeContext?: string | null
  },
  onDelta: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(`${desktopBase()}/ai/screenshot-answer-stream`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({
      imageBase64: payload.imageBase64,
      mimeType: payload.mimeType ?? 'image/png',
      systemPrompt: payload.systemPrompt ?? undefined,
      resumeContext: payload.resumeContext ?? undefined,
    }),
    signal,
  })

  if (!res.ok) {
    const t = await res.text().catch(() => res.statusText)
    throw new Error(errorTextFromFailedResponse(res.status, t))
  }

  const reader = res.body?.getReader()
  if (!reader) {
    const t = await res.text()
    throw new Error(t || 'Empty AI response')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      let obj: { d?: string; error?: string; m?: string }
      try {
        obj = JSON.parse(trimmed) as { d?: string; error?: string; m?: string }
      } catch {
        continue
      }
      if (obj.error) throw new Error(obj.error)
      if (obj.m === 'stream-open') continue
      if (obj.d) {
        full += obj.d
        onDelta(obj.d)
      }
    }
  }

  const tail = buffer.trim()
  if (tail) {
    try {
      const obj = JSON.parse(tail) as { d?: string; error?: string; m?: string }
      if (obj.error) throw new Error(obj.error)
      if (obj.m === 'stream-open') {
        /* ignore */
      } else if (obj.d) {
        full += obj.d
        onDelta(obj.d)
      }
    } catch {
      /* ignore */
    }
  }

  return full
}

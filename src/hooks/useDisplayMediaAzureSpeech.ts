import { useCallback, useRef } from 'react'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

function downsampleBuffer(
  buffer: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number,
): Float32Array {
  if (inputSampleRate === outputSampleRate) return buffer
  const sampleRateRatio = inputSampleRate / outputSampleRate
  const newLength = Math.round(buffer.length / sampleRateRatio)
  const result = new Float32Array(newLength)
  let offsetResult = 0
  let offsetBuffer = 0
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
    let accum = 0
    let count = 0
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i]
      count++
    }
    result[offsetResult] = count ? accum / count : 0
    offsetResult++
    offsetBuffer = nextOffsetBuffer
  }
  return result
}

function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(input.length * 2)
  const view = new DataView(buffer)
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return buffer
}

export type DisplayMediaSpeechHandlers = {
  onRecognizing: (text: string) => void
  onRecognized: (text: string) => void
  onCanceled?: (message: string) => void
}

export type DisplayMediaSpeechController = {
  start: (stream: MediaStream, locale: string, token: string, region: string) => Promise<void>
  stop: () => Promise<void>
}

/**
 * Feeds tab/system audio from a display-capture {@link MediaStream} into Azure Speech
 * continuous recognition (same token endpoint as the desktop app).
 */
export function useDisplayMediaAzureSpeech(handlers: DisplayMediaSpeechHandlers): DisplayMediaSpeechController {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null)
  const pushStreamRef = useRef<sdk.PushAudioInputStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  const stop = useCallback(async () => {
    const recognizer = recognizerRef.current
    recognizerRef.current = null
    if (recognizer) {
      try {
        await recognizer.stopContinuousRecognitionAsync()
      } catch {
        /* ignore */
      }
      try {
        recognizer.close()
      } catch {
        /* ignore */
      }
    }

    const push = pushStreamRef.current
    pushStreamRef.current = null
    if (push) {
      try {
        push.close()
      } catch {
        /* ignore */
      }
    }

    try {
      processorRef.current?.disconnect()
    } catch {
      /* ignore */
    }
    processorRef.current = null

    try {
      sourceRef.current?.disconnect()
    } catch {
      /* ignore */
    }
    sourceRef.current = null

    try {
      gainRef.current?.disconnect()
    } catch {
      /* ignore */
    }
    gainRef.current = null

    const ctx = audioContextRef.current
    audioContextRef.current = null
    if (ctx && ctx.state !== 'closed') {
      try {
        await ctx.close()
      } catch {
        /* ignore */
      }
    }
  }, [])

  const start = useCallback(
    async (stream: MediaStream, locale: string, token: string, region: string) => {
      await stop()

      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length === 0) {
        throw new Error(
          'No audio in the shared capture. Pick a browser tab and enable “Also share tab audio” (or system audio) in the share dialog.',
        )
      }

      const format = sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
      const pushStream = sdk.AudioInputStream.createPushStream(format)
      pushStreamRef.current = pushStream

      const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region)
      speechConfig.speechRecognitionLanguage = locale

      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)
      recognizerRef.current = recognizer

      recognizer.recognizing = (_s, e) => {
        const t = e.result?.text?.trim()
        if (t) handlersRef.current.onRecognizing(t)
      }

      recognizer.recognized = (_s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          const t = e.result.text?.trim()
          if (t) handlersRef.current.onRecognized(t)
        }
      }

      recognizer.canceled = (_s, e) => {
        const msg = e.errorDetails || String(e.reason)
        handlersRef.current.onCanceled?.(msg)
      }

      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AC()
      audioContextRef.current = audioContext
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source

      const bufferSize = 4096
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (ev) => {
        const input = ev.inputBuffer.getChannelData(0)
        if (!input?.length) return
        const down = downsampleBuffer(input, audioContext.sampleRate, 16000)
        const pcm = floatTo16BitPCM(down)
        try {
          pushStream.write(pcm.slice(0))
        } catch {
          /* stream may be closed */
        }
      }

      const gain = audioContext.createGain()
      gain.gain.value = 0
      gainRef.current = gain

      source.connect(processor)
      processor.connect(gain)
      gain.connect(audioContext.destination)

      await recognizer.startContinuousRecognitionAsync()
    },
    [stop],
  )

  return { start, stop }
}

export type SpeechLocaleOption = {
  locale: string
  label: string
}

// Curated list of commonly used locales supported by Azure Speech-to-Text (BCP-47).
// Intentionally excludes most country variants to keep the dropdown simple.
export const AZURE_SPEECH_STT_LOCALES: SpeechLocaleOption[] = [
  // Pinned at top
  { locale: 'en-IN', label: 'English (India)' },
  { locale: 'hi-IN', label: 'Hindi (India)' },

  // Commonly used global / regional
  { locale: 'en-US', label: 'English (United States)' },
  { locale: 'en-GB', label: 'English (United Kingdom)' },
  { locale: 'es-ES', label: 'Spanish (Spain)' },
  { locale: 'es-MX', label: 'Spanish (Mexico)' },
  { locale: 'fr-FR', label: 'French (France)' },
  { locale: 'fr-CA', label: 'French (Canada)' },
  { locale: 'pt-BR', label: 'Portuguese (Brazil)' },
  { locale: 'pt-PT', label: 'Portuguese (Portugal)' },
  { locale: 'de-DE', label: 'German (Germany)' },
  { locale: 'it-IT', label: 'Italian (Italy)' },
  { locale: 'nl-NL', label: 'Dutch (Netherlands)' },
  { locale: 'pl-PL', label: 'Polish (Poland)' },
  { locale: 'ru-RU', label: 'Russian (Russia)' },
  { locale: 'tr-TR', label: 'Turkish (Türkiye)' },
  { locale: 'uk-UA', label: 'Ukrainian (Ukraine)' },

  // Asia (commonly used)
  { locale: 'ja-JP', label: 'Japanese (Japan)' },
  { locale: 'ko-KR', label: 'Korean (Korea)' },
  { locale: 'zh-CN', label: 'Chinese (Mandarin, Simplified)' },
  { locale: 'zh-TW', label: 'Chinese (Taiwanese Mandarin, Traditional)' },
  { locale: 'zh-HK', label: 'Chinese (Cantonese, Traditional)' },
  { locale: 'id-ID', label: 'Indonesian (Indonesia)' },
  { locale: 'ms-MY', label: 'Malay (Malaysia)' },
  { locale: 'th-TH', label: 'Thai (Thailand)' },
  { locale: 'vi-VN', label: 'Vietnamese (Vietnam)' },

  // Middle East / Africa (commonly used)
  { locale: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
  { locale: 'ar-EG', label: 'Arabic (Egypt)' },
  { locale: 'fa-IR', label: 'Persian (Iran)' },
  { locale: 'he-IL', label: 'Hebrew (Israel)' },
  { locale: 'sw-KE', label: 'Kiswahili (Kenya)' },
  { locale: 'af-ZA', label: 'Afrikaans (South Africa)' },
  { locale: 'zu-ZA', label: 'Zulu (South Africa)' },

  // India (commonly used)
  { locale: 'bn-IN', label: 'Bengali (India)' },
  { locale: 'gu-IN', label: 'Gujarati (India)' },
  { locale: 'kn-IN', label: 'Kannada (India)' },
  { locale: 'ml-IN', label: 'Malayalam (India)' },
  { locale: 'mr-IN', label: 'Marathi (India)' },
  { locale: 'pa-IN', label: 'Punjabi (India)' },
  { locale: 'ta-IN', label: 'Tamil (India)' },
  { locale: 'te-IN', label: 'Telugu (India)' },
  { locale: 'ur-IN', label: 'Urdu (India)' },
]

export const DEFAULT_SPEECH_LOCALE = 'en-IN'

export function normalizeSpeechLocale(input: string | null | undefined): string {
  const v = (input ?? '').trim()
  if (!v) return DEFAULT_SPEECH_LOCALE

  // Back-compat for old stored values.
  if (v.toLowerCase() === 'english') return 'en-IN'
  if (v.toLowerCase() === 'hindi') return 'hi-IN'

  // If already a locale, keep it.
  return v
}

export function speechLocaleLabel(locale: string | null | undefined): string {
  const normalized = normalizeSpeechLocale(locale)
  return (
    AZURE_SPEECH_STT_LOCALES.find((x) => x.locale === normalized)?.label ??
    normalized
  )
}


/**
 * Mirrors `MainWindow.xaml.cs` in orio-desktop-app:
 * - `AnswerFromTranscriptSystemPrompt` (static)
 * - `ComposeExtendedSystemPrompt(...)`
 * - `stripAltQuestionsForDisplay` strips legacy trailing `<<<ALT_Q>>>` blocks if present
 */

/** Same string as `MainWindow.AnswerFromTranscriptSystemPrompt` (transcript / AI-answer path). */
export const DESKTOP_ANSWER_FROM_TRANSCRIPT_SYSTEM_PROMPT =
  'You are giving interview so Write an answer of this question in detail, and give an answer with bullet points, add examples for any programmibng language, code or anything so example is must and whenever is possible please give code example, give interview friendly answer and dont over explain or under explain and give answer in such a way what interviewr probably expecting, keep answer :\n\n' +
  '* Structured\n' +
  '* Concise\n' +
  '* Impactful\n' +
  '* Easy to speak\n' +
  '* Easy to scan quickly\n\n' +
  '0) Always include the question line first (use the 💬 emoji, no \'Question:\' label):\n' +
  '💬 <one-line cleaned question>\n\n' +
  '1) Then write the answer section:\n' +
  '⭐ **Answer:**\n\n' +
  'STYLE RULES\n' +
  '* No long paragraphs\n' +
  '* No generic statements\n' +
  '* No filler\n' +
  '* Natural spoken tone\n' +
  '* Short sentences\n\n' +
  'Dont use section headings and directly keep bullet points\n\n' +
  'give human like answer so interviewer should not detect it as whatever it is ai generated, like humans can mistake in grammes in some places and also dont use subpoints\n\n' +
  'CRITICAL FORMATTING\n' +
  '* Output after ⭐ **Answer:** must be dash bullets only\n' +
  '* Each bullet is one idea, short and spoken\n' +
  '* No blank lines between bullets\n' +
  '* No sub-bullets / no indentation\n' +
  '* Do not add any other headings\n\n' +
  'EXAMPLES (REQUIRED)\n' +
  '* Always include at least one example\n' +
  '* Whenever possible, include a fenced code block example (any programming language)\n' +
  '* Keep code short and high-signal (8–20 lines)\n' +
  '* If it is not code heavy, still give one real example as a bullet (what i did + result)\n\n' +
  'Do not mention AI. Do not explain formatting. Follow the format strictly.'

/** Default `AzureOpenAISettings.SystemPrompt` when desktop uses typed “Ask” with appsettings base. */
export const DESKTOP_TYPED_FLOW_DEFAULT_BASE = 'You are a helpful AI assistant.'

export function mapSessionLanguageToAzureSpeechLocale(sessionLanguage: string | null | undefined): string {
  const lang = (sessionLanguage ?? '').trim()
  if (!lang) return 'en-IN'
  if (lang.length === 5 && lang[2] === '-' && /[a-zA-Z]{2}-[a-zA-Z]{2}/.test(lang)) {
    return lang
  }
  switch (lang.toLowerCase()) {
    case 'english':
      return 'en-IN'
    case 'hindi':
      return 'hi-IN'
    case 'en':
      return 'en-IN'
    case 'hi':
      return 'hi-IN'
    default:
      return 'en-IN'
  }
}

/** Same mapping as `GetOutputLanguageNameForPrompt` on desktop. */
export function outputLanguageNameForLocale(sessionLanguageOrLocale: string | null | undefined): string {
  const locale = mapSessionLanguageToAzureSpeechLocale(sessionLanguageOrLocale)
  const prefix = locale.split('-')[0]?.toLowerCase() ?? 'en'
  const table: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
    mr: 'Marathi',
    pa: 'Punjabi',
    ta: 'Tamil',
    te: 'Telugu',
    ur: 'Urdu',
    ar: 'Arabic',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    he: 'Hebrew',
    id: 'Indonesian',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    ms: 'Malay',
    nl: 'Dutch',
    pl: 'Polish',
    pt: 'Portuguese',
    ru: 'Russian',
    sw: 'Swahili',
    th: 'Thai',
    tr: 'Turkish',
    uk: 'Ukrainian',
    vi: 'Vietnamese',
    zh: 'Chinese',
    fa: 'Persian',
  }
  return table[prefix] ?? 'English'
}

export type ComposeDesktopExtendedOptions = {
  /** First segment passed into desktop `ComposeExtendedSystemPrompt` (often `AnswerFromTranscriptSystemPrompt` or appsettings base). */
  baseSystemPrompt: string
  /** BCP-47 locale (e.g. `en-IN`) — only the language prefix is used for the OUTPUT LANGUAGE line. */
  answerLocale: string
  sessionExtraContext?: string | null
  naturalSpeakingMode?: boolean
}

/**
 * Verbatim structure of `MainWindow.ComposeExtendedSystemPrompt` (orio-desktop-app).
 */
export function composeDesktopExtendedSystemPrompt(o: ComposeDesktopExtendedOptions): string {
  const basePrompt = (o.baseSystemPrompt ?? '').trim()
  if (!basePrompt) return ''
  const outputLanguage = outputLanguageNameForLocale(o.answerLocale)
  const extraTrim = (o.sessionExtraContext ?? '').trim()
  const extraBlock = extraTrim
    ? '\n\nAdditional instructions:\n' +
      extraTrim +
      '\n\nFollow these Additional instructions on every answer (style, length, examples, tone).'
    : ''
  const naturalSpeakingBlock = o.naturalSpeakingMode
    ? '\n\nNATURAL SPEAKING MODE (enabled for this session — follow strictly):' +
      '\nThe candidate will say your answer out loud in a live interview. It must sound like a real person thinking and talking, not like reading an AI script or essay.' +
      '\n- Under ⭐️ **Answer**, use **spoken, conversational prose**: short clauses, natural rhythm, mild connectors where appropriate (e.g. “so”, “I think”, “for me”, “honestly”, “what I did was”). Slight imperfection is OK; avoid slick corporate polish.' +
      '\n- **Do not** use chatbot openers or tone: avoid “Certainly”, “Great question”, “I\'d be happy to”, “Let me walk you through”, “To summarize / In conclusion”, or blog/wiki cadence.' +
      '\n- **Do not** sound meta (“In this answer I will…”). Start from substance quickly.' +
      '\n- Keep the wording human and spoken. Prefer short bullets and short sentences; no long paragraphs.' +
      '\n- For code/SQL: still use fenced blocks with language tags; introduce them with one casual sentence, not a formal preamble.\n'
    : ''

  return (
    basePrompt +
    '\n\nYou are role-playing as a highly skilled job candidate. Always answer in FIRST PERSON. Never mention AI. ' +
    "Use the resume details (name, experience, skills, education) to answer questions such as 'What is your name?' or 'Introduce yourself' as the candidate." +
    extraBlock +
    naturalSpeakingBlock +
    `\n\nOUTPUT LANGUAGE: Always respond in ${outputLanguage}. If you include code, keep code keywords/identifiers in their original language (usually English), but explain in ${outputLanguage}.`
  )
}

export function stripAltQuestionsForDisplay(raw: string): string {
  if (!raw) return raw
  const idx = raw.indexOf('<<<ALT_Q>>>')
  if (idx < 0) return raw
  return raw.slice(0, idx).trimEnd()
}

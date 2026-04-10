import type { CallSessionDto } from '../api/callSessions'
import { speechLocaleLabel } from '../constants/azureSpeechSttLocales'

const ANSWER_FROM_TRANSCRIPT_SYSTEM =
  'You are role-playing as the job candidate whose resume is provided in the context. ' +
  'Always answer in FIRST PERSON as that candidate (for example: "My name is ...", "I have experience with ..."). ' +
  'Never say you are an AI or language model. ' +
  'The user will give you text that was transcribed from speech. ' +
  'Answer the question fully and in detail, using the resume details whenever relevant. ' +
  "For questions like \"what is your name\" or \"introduce yourself\", answer using the candidate's real name and background from the resume."

export function composeBrowserExtendedSystemPrompt(
  session: CallSessionDto,
  speechLocale: string,
): string {
  const langLabel = speechLocaleLabel(speechLocale)
  const jobParts: string[] = []
  if (session.title?.trim()) jobParts.push(`Interview / role context: ${session.title.trim()}`)
  if (session.description?.trim()) jobParts.push(`Job description:\n${session.description.trim()}`)
  if (session.extraContext?.trim()) jobParts.push(`Additional instructions:\n${session.extraContext.trim()}`)
  if (session.simpleLanguage) jobParts.push('Use simple, clear language appropriate for the candidate.')

  return (
    `${ANSWER_FROM_TRANSCRIPT_SYSTEM}\n\n${jobParts.join('\n\n')}\n\n` +
    `LANGUAGE: Respond in ${langLabel}. If you include code, keep identifiers in English but explanations in ${langLabel}.\n\n` +
    'RESPONSE FORMAT RULES (VERY IMPORTANT):\n' +
    '1) Always answer in clear numbered points (1., 2., 3.) suitable for interview speaking.\n' +
    '2) Keep language interview-friendly, concise, and confident.\n' +
    '3) If code/query is needed, put it in fenced code blocks using triple backticks and a language tag.\n' +
    '4) In code/query blocks, add short inline comments on key lines.\n' +
    "5) For non-code answers, end with a short \"How to say this in interview\" line."
  )
}

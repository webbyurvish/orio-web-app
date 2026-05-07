import { useCallback, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { stripAltQuestionsForDisplay } from '../lib/desktopAnswerPrompts'

function detectLang(className: string | undefined): string {
  const m = /language-(\w+)/.exec(className ?? '')
  return (m?.[1] ?? 'code').toUpperCase()
}

function CodeBlockCard({
  language,
  code,
}: {
  language: string
  code: string
}) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement | null>(null)
  const copy = useCallback(() => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = preRef.current
    if (!el) return

    // Only handle vertical wheel; let horizontal/zoom gestures behave normally.
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return
    if (e.deltaY === 0) return

    const canScroll = el.scrollHeight > el.clientHeight + 1
    const atTop = el.scrollTop <= 0
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1

    // If the code block can't scroll (or has reached an edge), forward the scroll to the
    // nearest app scroll container so the page continues to scroll under the cursor.
    if (!canScroll || (e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      const parent =
        (el.closest('.orio-app-scroll') as HTMLElement | null) ??
        (document.scrollingElement as HTMLElement | null)
      if (parent) {
        parent.scrollTop += e.deltaY
        e.preventDefault()
      }
    }
  }, [])

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f14] shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300/80">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-200/90 hover:bg-white/10"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        ref={preRef}
        onWheel={handleWheel}
        className="max-h-[min(70vh,520px)] overflow-auto px-4 py-3 text-[13px] leading-relaxed text-slate-100 font-mono"
      >
        <code className="block whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}

type Props = {
  markdown: string
  /** When true, strip legacy trailing `<<<ALT_Q>>>` blocks from the source before rendering. */
  stripAltBlock?: boolean
  className?: string
}

/**
 * Renders streamed/desktop-shaped markdown: headings, bold, dash lists, fenced code in a “code card”
 * similar to the desktop RichTextBox code blocks (header + copy + scrollable body).
 */
export default function DesktopStyleAnswerMarkdown({
  markdown,
  stripAltBlock = true,
  className = '',
}: Props) {
  const displaySource = useMemo(
    () => (stripAltBlock ? stripAltQuestionsForDisplay(markdown) : markdown),
    [markdown, stripAltBlock],
  )

  return (
    <div className={`text-[14px] leading-[1.55] text-slate-100/95 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-2 mt-3 text-lg font-semibold text-slate-50 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-semibold text-slate-50 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-1.5 mt-2 text-sm font-semibold text-slate-100 first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="mb-2 last:mb-0 text-slate-100/95">{children}</p>,
          ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0 marker:text-slate-500">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0 marker:text-slate-500">{children}</ol>,
          li: ({ children }) => <li className="text-slate-100/95">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-slate-50">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-200/95">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-teal-500/50 pl-3 text-slate-300/95">{children}</blockquote>
          ),
          hr: () => <hr className="my-4 border-white/10" />,
          a: ({ href, children }) => (
            <a href={href} className="text-teal-300 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          code(props) {
            const { className, children } = props
            const txt = String(children ?? '').replace(/\n$/, '')
            const inline = !className
            if (inline) {
              return (
                <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[13px] text-teal-100/95">{children}</code>
              )
            }
            return <CodeBlockCard language={detectLang(className)} code={txt} />
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {displaySource}
      </ReactMarkdown>
    </div>
  )
}

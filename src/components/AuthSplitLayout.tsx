import type React from 'react'

type AuthSplitLayoutProps = {
  children: React.ReactNode
  /**
   * Left panel headline and supporting bullets.
   * Keep it short; this is the marketing side of the split card.
   */
  left: {
    title: string
    subtitle?: string
    bullets?: string[]
  }
  /**
   * Optional right header brand line (small).
   */
  brand?: string
  /**
   * Which side the form should appear on.
   * - login: typically "left"
   * - signup/verify: typically "right"
   */
  formSide?: 'left' | 'right'
}

export function AuthSplitLayout({ children, left, brand = 'Smeed AI', formSide = 'right' }: AuthSplitLayoutProps) {
  return (
    <div className="auth-shell">
      <div className={`auth-split-page ${formSide === 'left' ? 'auth-split-page--form-left' : ''}`}>
        <aside className="auth-split-left" aria-label="Smeed AI benefits">
          <div className="auth-split-left-inner">
            <div className="auth-brand-row">
              <img className="auth-brand-mark" src="/assets/smeed-logo.png" alt="" aria-hidden draggable={false} />
              <div className="auth-brand-name">{brand}</div>
            </div>

            <div className="auth-left-hero">
              <div className="auth-left-icon" aria-hidden>
                ✦
              </div>
              <h2 className="auth-left-title">{left.title}</h2>
              {left.subtitle ? <p className="auth-left-subtitle">{left.subtitle}</p> : null}
            </div>

            {left.bullets?.length ? (
              <ul className="auth-left-bullets">
                {left.bullets.map((b) => (
                  <li key={b}>
                    <span className="auth-left-check" aria-hidden>
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </aside>

        <main className="auth-split-right" aria-label="Authentication form">
          <div className="auth-split-right-inner">{children}</div>
        </main>
      </div>
    </div>
  )
}


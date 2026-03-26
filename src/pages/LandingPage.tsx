import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { landingApi, type LandingPageDto } from '../api/landing'
import { useAuthStore } from '../store/authStore'

function useLanding() {
  return useQuery({ queryKey: ['landing'], queryFn: landingApi.getLandingPage })
}

function c(key: string, data: LandingPageDto) {
  return data.content[key] ?? key
}

export default function LandingPage() {
  const { data, isLoading, error } = useLanding()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [email, setEmail] = useState('')
  const queryClient = useQueryClient()
  const newsletterMutation = useMutation({
    mutationFn: (e: string) => landingApi.subscribeNewsletter(e),
    onSuccess: () => {
      setEmail('')
      queryClient.invalidateQueries({ queryKey: ['landing'] })
    },
  })

  if (isLoading || error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        {error && <p className="text-red-600">Failed to load the page.</p>}
        {isLoading && <p className="text-primary-700">Loading...</p>}
      </div>
    )
  }

  // Parse promo: **bold** and **CODE** (e.g. INDIA25) as green badge; CTA button on the right
  const promo = data.promoBanners[0]
  const promoText = promo?.text ?? ''
  const renderPromoSegments = () => {
    const parts = promoText.split(/\*\*(.+?)\*\*/g)
    return parts.map((part, i) => {
      if (i % 2 === 0) return part
      const isCode = /^[A-Z0-9]+$/.test(part.trim())
      if (isCode) return <span key={i} className="inline-block ml-1 bg-primary-800 text-white text-xs font-semibold px-2 py-0.5 rounded">{part}</span>
      return <span key={i} className="font-bold underline">{part}</span>
    })
  }

  const stats = data.stats
  const HappyEngineers = stats?.HappyEngineers ?? '1000+'

  console.log('data', data);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Promo: dark purple strip + orange banner with offer and UPI button */}
      {data.promoBanners.length > 0 && promoText && (
        <div className="w-full">
          <div className="h-1 bg-purple-900" />
          <div className="bg-amber-100 text-amber-900 py-2.5 px-4 flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <span className="text-sm text-center md:text-left">
              {renderPromoSegments()}
            </span>
            {(promo?.ctaText ?? 'UPI Supported') && (
              <a
                href={promo?.ctaUrl ?? '#'}
                className="ml-auto flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-blue-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                {promo?.ctaText ?? 'UPI Supported'}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Nav: rounded bar, white + light gradient, shadow */}
      <header className="sticky top-0 z-50 px-4 pt-3 pb-2">
        <div className="max-w-6xl mx-auto rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden bg-gradient-to-b from-white to-sky-50/50">
          <div className="h-14 md:h-16 flex items-center justify-between px-5 md:px-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-800">
              <span className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white" aria-hidden>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 6 5 6 8c0 2 1 4 2 5l-2 6h12l-2-6c1-1 2-3 2-5 0-3-2-6-6-6zm0 2c2.2 0 4 1.8 4 4 0 1.5-.8 3.2-1.5 4.5L14 18h-4l-.5-5.5C8.8 11.2 8 9.5 8 8c0-2.2 1.8-4 4-4z"/></svg>
              </span>
              OrioAI
            </Link>
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-600">
              <a href="#features" className="flex items-center gap-1.5 hover:text-primary-600">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3v10h8V3h-8zM3 21h8v-6H3v6zm0-8h8V3H3v10zm10 0h8v-6h-8v6z"/></svg>
                Features
              </a>
              <a href="#reviews" className="flex items-center gap-1.5 hover:text-primary-600">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                Reviews
              </a>
              <a href="#privacy" className="flex items-center gap-1.5 hover:text-primary-600">
                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                Privacy
              </a>
              <a href="#pricing" className="flex items-center gap-1.5 hover:text-primary-600">
                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7 5.5z"/></svg>
                Pricing
              </a>
              <a href="#desktop" className="flex items-center gap-1.5 hover:text-primary-600">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2h8v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
                Desktop App
                <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              >
                {isAuthenticated ? "Dashboard" : "Sign in"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/30 to-primary-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{c('HeroHeadline', data)}</h1>
            <p className="mt-4 text-lg text-gray-700">{c('HeroSubtitle', data)}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup" className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 shadow-lg">{c('HeroCtaPrimary', data)}</Link>
              <a href={c('HeroCtaSecondaryUrl', data)} className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50">{c('HeroCtaSecondary', data)}</a>
            </div>
            <p className="mt-6 text-gray-600">Join {HappyEngineers} happy engineers.</p>
          </div>
          <div className="relative">
            <div className="aspect-video bg-primary-700/20 rounded-2xl flex items-center justify-center text-primary-800 font-medium">Video / Demo</div>
            <div className="mt-4 p-4 bg-white rounded-xl shadow border border-gray-100 text-sm text-gray-600">AI chat preview</div>
          </div>
        </div>
      </section>

      {/* Featured In */}
      {data.featuredCompanies.length > 0 && (
        <section className="py-8 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-center text-gray-500 text-sm mb-6">Featured In:</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {data.featuredCompanies.map((co, i) => (
                <span key={i} className="text-gray-400 font-semibold text-lg">{co.name}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stop Wasting Time */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{c('FeatureIntroTitle', data)}</h2>
          <p className="mt-3 text-xl text-gray-600">{c('FeatureIntroSubtitle', data)}</p>
          <div className="mt-12 p-8 md:p-12 bg-primary-600 rounded-3xl text-white text-left max-w-4xl mx-auto">
            <p className="text-lg" dangerouslySetInnerHTML={{ __html: (c('FeatureIntroBody', data)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            <Link to="/signup" className="inline-block mt-6 bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50">{c('GetStartedFree', data)}</Link>
            <div className="mt-8 flex flex-wrap gap-4">
              {data.topics.slice(0, 6).map((t, i) => (
                <span key={i} className="bg-white/20 px-4 py-2 rounded-lg text-sm">{t.name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Orio AI Helps */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">{c('HowItHelpsTitle', data)}</h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.featureCardsHowItHelps.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">{card.iconName ? card.iconName[0] : '?'}</div>
                <h3 className="mt-4 font-semibold text-lg text-gray-900">{card.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{card.description}</p>
                {card.extraData && (() => {
                  try {
                    const ex = JSON.parse(card.extraData) as { score?: string; scoreLabel?: string }
                    if (ex.score) return <p className="mt-3 text-2xl font-bold text-primary-600">{ex.score}</p>
                    if (ex.scoreLabel) return <p className="mt-2 text-xs text-gray-500">{ex.scoreLabel}</p>
                  } catch { }
                  return null
                })()}
                {card.buttonText && <Link to={card.buttonUrl ?? '/signup'} className="mt-4 inline-block text-primary-600 font-semibold hover:underline">{card.buttonText}</Link>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">{c('TestimonialsTitle', data)}</h2>
            <div className="mt-12 flex gap-6 overflow-x-auto pb-4">
              {data.testimonials.map((t, i) => (
                <div key={i} className="min-w-[300px] max-w-[340px] bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center text-primary-800 font-bold">{t.name[0]}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-600">{t.title} @ {t.company}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">"{t.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 500+ Questions / Topics */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{(data.stats?.QuestionsCount ?? '500+')} Questions in {(data.stats?.TopicsCount ?? '20+')} Topics</h2>
            <p className="mt-2 text-primary-100">No more searching for questions. Practice what matters.</p>
            <Link to="/signup" className="inline-block mt-6 bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50">{c('GetStartedFree', data)}</Link>
          </div>
          <ul className="flex flex-wrap gap-3">
            {data.topics.map((t, i) => (
              <li key={i} className="bg-white/20 text-white px-4 py-2 rounded-lg">{t.name}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* More Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center">More Features</h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.featureCardsMoreFeatures.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg text-primary-800">{card.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't Just Prepare, Dominate */}
      <section className="py-16 bg-primary-700">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{c('DominateTitle', data)}</h2>
            <p className="mt-2 text-primary-100">{c('DominateSubtitle', data)}</p>
            <Link to="/signup" className="inline-block mt-6 bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50">{c('GetStartedFree', data)}</Link>
          </div>
          <div className="w-48 h-48 bg-white/20 rounded-2xl flex items-center justify-center text-white text-4xl">😊</div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-primary-800 to-primary-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">{c('PricingTitle', data)}</h2>
          <p className="mt-2 text-primary-200">{c('PricingSubtitle', data)}</p>
          <div className="mt-12 flex justify-center gap-4 mb-12">
            <span className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm">{c('PricingMonthlyLabel', data)}</span>
            <span className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm">{c('PricingYearlyLabel', data)}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {data.pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 text-left ${plan.isHighlighted ? 'bg-primary-600 ring-2 ring-white' : 'bg-gray-100'}`}
              >
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">${plan.monthlyPrice} <span className="text-base font-normal text-gray-600">/ month</span></p>
                {plan.yearlyDiscountPercent != null && <p className="text-sm text-primary-700 mt-1">Save {plan.yearlyDiscountPercent}% by paying yearly</p>}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-700"><span className="text-primary-600">✓</span>{f.text}</li>
                  ))}
                </ul>
                <Link
                  to={plan.buttonUrl === '#' ? '/signup' : plan.buttonUrl ?? '/signup'}
                  className={`mt-6 block w-full py-3 rounded-xl font-semibold text-center ${plan.isHighlighted ? 'bg-white text-primary-600 hover:bg-gray-100' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                >
                  {plan.buttonText ?? 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{c('TrustTitle', data)}</h2>
          <button type="button" className="mt-4 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700">{c('TrustCtaText', data)}</button>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-gray-600 text-sm">
            <span>30 day money back guarantee</span>
            <span>Secure payments</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Discover by Role */}
      {data.roles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center">{c('DiscoverByRoleTitle', data)}</h2>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.roles.map((r, i) => (
                <a key={i} href={r.url ?? '#'} className="text-primary-600 font-medium hover:underline">{r.name}</a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Improve Problem Solving */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary-700">{c('ImproveTitle', data)}</h2>
            <p className="mt-4 text-gray-600">{c('ImproveSubtitle', data)}</p>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>• Real-time feedback</li>
              <li>• 20+ topics</li>
              <li>• 500+ questions</li>
              <li>• Interview Simulator</li>
            </ul>
            <Link to="/signup" className="inline-block mt-6 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700">{c('GetStartedFree', data)}</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square bg-primary-100 rounded-xl" />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="font-bold text-xl text-white">Orio AI</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['Product', 'Resources', 'Company'].map((cat) => (
                <div key={cat}>
                  <p className="font-semibold text-white mb-3">{cat}</p>
                  <ul className="space-y-2">
                    {data.footerLinks.filter((f) => f.category === cat).map((f, i) => (
                      <li key={i}><a href={f.url} className="hover:text-white">{f.label}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-primary-700 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
              {data.socialLinks.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary-200 hover:text-white" aria-label={s.platform}>{s.platform[0]}</a>
              ))}
            </div>
            <div className="w-full md:max-w-sm">
              <p className="text-sm text-primary-200 mb-2">{c('FooterNewsletterTitle', data)}</p>
              <form
                className="flex gap-2"
                onSubmit={(e) => { e.preventDefault(); if (email) newsletterMutation.mutate(email); }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary-800 border border-primary-700 text-white placeholder-primary-400 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button type="submit" disabled={newsletterMutation.isPending} className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50">Subscribe</button>
              </form>
              {newsletterMutation.isSuccess && <p className="mt-2 text-sm text-green-400">Subscribed successfully.</p>}
              {newsletterMutation.isError && <p className="mt-2 text-sm text-red-300">Something went wrong.</p>}
            </div>
          </div>
          <p className="mt-6 text-center text-primary-300 text-sm">{c('CopyrightText', data)}</p>
        </div>
      </footer>
    </div>
  )
}

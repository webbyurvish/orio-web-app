import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LandingNavbar from "../components/LandingNavbar";
import { AZURE_SPEECH_STT_LOCALES } from "../constants/azureSpeechSttLocales";
import { LazyMountWhenVisible } from "../components/LazyMountWhenVisible";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { CustomerVoicesSection } from "../components/CustomerVoicesSection";
import { CompetitorPriceShowdownSection } from "../components/CompetitorPriceShowdownSection";
import { LandingFeatureShowcase } from "../components/LandingFeatureShowcase";
import {
  NATURAL_QUESTION_TABS,
  SegmentedTabList,
} from "../components/SegmentedTabList";

const PRICING_SEGMENT_TABS = [
  { id: "credits" as const, label: "Credits" },
  { id: "subscription" as const, label: "Subscribe" },
  { id: "lifetime" as const, label: "Lifetime" },
];

const STATIC_LANDING_DATA = {
  content: {
    HeroHeadline: "Ace Every Interview with Real-Time AI Guidance",
    HeroSubtitle:
      "Practice smarter with live AI support, cleaner answers, and better interview confidence.",
    HeroCtaPrimary: "Get Started Free",
    HeroCtaSecondary: "See Features",
    HeroCtaSecondaryUrl: "#features",
    FeatureIntroTitle: "Stop Wasting Time Preparing",
    FeatureIntroSubtitle:
      "Live assistance, smart context, and fast answers in one workspace — tap any feature to preview.",
    FeatureIntroBody:
      "Smeed AI helps you practice with realistic questions, live guidance, and focused feedback so you can perform better in real interviews.",
    HowItHelpsTitle: "Everything in one interview workspace",
    PricingTitle: "Simple, Transparent Pricing",
    PricingSubtitle: "Start free, then scale as you grow.",
    PricingMonthlyLabel: "Monthly",
    PricingYearlyLabel: "Yearly",
    TrustTitle: "Trusted by Engineers Worldwide",
    TrustCtaText: "Start Free Trial",
    DiscoverByRoleTitle: "Discover by Role",
    ImproveTitle: "Improve Problem Solving",
    ImproveSubtitle:
      "Build practical interview confidence with repeatable, role-specific practice.",
    GetStartedFree: "Get Started Free",
    FooterNewsletterTitle: "Get product updates and interview tips",
    CopyrightText: "© 2026 Smeed AI. All rights reserved.",
    DominateTitle: "Don't Just Prepare, Dominate",
    DominateSubtitle: "Walk into interviews with clarity and confidence.",
  } as Record<string, string>,
  promoBanners: [
    {
      text: "Limited-time launch offer: use **INDIA25** for **25% off**",
      ctaText: "UPI Supported",
      ctaUrl: "#pricing",
    },
  ],
  stats: { HappyEngineers: "10,000+", QuestionsCount: "500+", TopicsCount: "20+" },
} as const;

function c(key: string, data: typeof STATIC_LANDING_DATA) {
  return data.content[key] ?? key;
}

/** Logged-in users go to dashboard checkout; guests continue to signup. */
function planPurchasePath(
  isAuthenticated: boolean,
  tab: "credits" | "subscription" | "lifetime",
  checkoutProductId: string,
) {
  if (!isAuthenticated) return "/signup";
  const q = new URLSearchParams({ tab, openCheckout: checkoutProductId });
  return `/dashboard/buyCredits?${q.toString()}`;
}

export default function LandingPage() {
  const data = STATIC_LANDING_DATA;
  const [desiTab, setDesiTab] = useState<"behavioral" | "technical">("behavioral");
  const [pricingTab, setPricingTab] = useState<"credits" | "subscription" | "lifetime">("credits");

  const faqByCategory = {
    privacy: [
      {
        q: "Which platforms does Smeed AI work with?",
        a: "Smeed AI works with all call platforms and is designed to be private and discreet. Make sure you're running the latest versions of your OS and video calling software, and always test Smeed AI in a safe environment before your actual call.",
      },
      {
        q: "Is Smeed AI visible when I share my screen?",
        a: 'If you\'re using Zoom, update it to the latest version and enable "Advanced capture with window filtering" in your Zoom settings. This ensures Smeed AI stays hidden during screen sharing.\n\nOn other platforms, it is completely invisible and undetectable. 🔒',
      },
      {
        q: "Can proctoring software detect Smeed AI?",
        a: "No. Smeed AI operates invisibly at the system level and is designed to be undetectable by proctoring software, screen-sharing tools, and recording software.",
      },
      {
        q: "Can I use Smeed AI during an online exam?",
        a: "Yes. Smeed AI is invisible and undetectable to the proctoring and screen-sharing tools typically used during online exams.",
      },
      {
        q: "Is there a way to change the Smeed AI process name in Activity Monitor or Task Manager?",
        a: "Unfortunately, there is currently no way to change the Smeed AI process name in Activity Monitor or Task Manager.",
      },
    ],
    features: [
      {
        q: "What languages does Smeed AI support?",
        a: "You can view all supported languages by starting a session and clicking the language dropdown. Smeed AI listens for one language at a time — if you switch languages during your call, update the session language to match.",
      },
      {
        q: "Can Smeed AI listen in one language and respond in another?",
        a: "No. Smeed AI always responds in the same language it is listening in. The transcription and response language cannot be set independently.",
      },
      {
        q: "Does Smeed AI have keyboard shortcuts?",
        a: "Yes, Smeed AI offers shortcuts for most functions you'd use during a call. Hover over any button to see its shortcut. If no shortcut appears on hover, that button does not support shortcuts.",
      },
      {
        q: "Does Smeed AI support coding calls?",
        a: "Yes. Smeed AI offers full coding call support, including code suggestions and explanations.",
      },
      {
        q: "Can I use headphones during the call?",
        a: "Yes. Smeed AI listens directly to system audio, not the sound coming from your speakers, so headphones work perfectly.",
      },
      {
        q: "Can I provide extra context to Smeed AI during the call?",
        a: 'Yes. Smeed AI uses the text you add to the "Extra Context/Instructions" field when creating a session. This allows you to provide guidance, key points, or specific instructions so the AI can respond more accurately during your call.',
      },
      {
        q: "Does Smeed AI have a mobile app?",
        a: "Not yet — Smeed AI does not have a mobile app today. We plan to launch one in the future. For now, use the web dashboard and desktop app for the full experience.",
      },
    ],
    billing: [
      {
        q: "How do I try Smeed AI for free?",
        a: "Smeed AI offers unlimited free trial sessions lasting up to 10 minutes each. You can start a new free trial from the dashboard or the desktop app every 15 minutes.",
      },
      {
        q: "How does the credit system work?",
        a: "Credits are divided into 30-minute sessions. Starting a session deducts 0.5 credits and lasts 30 minutes. One minute before the session ends, it automatically extends for another 30 minutes and deducts another 0.5 credits. Credits never expire. Subscriptions and lifetime plans are also available for unlimited usage.",
      },
      {
        q: "How do I know how many credits I have left?",
        a: 'Your remaining credits are displayed in the "Call Credits" card on the bottom-left side of the screen.',
      },
      {
        q: "Does Smeed AI offer a referral program?",
        a: "Yes. After your first purchase, you'll receive a referral code to share. When someone uses your code at checkout, they receive 1 free credit and you receive 2 free credits. Only first-time buyers can use a referral code. If you're eligible for a discount or promotional code, you'll see an option to enter it at checkout.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We support all major debit and credit cards, as well as Apple Pay and Google Pay. For customers in India, we also support UPI.",
      },
      {
        q: "Can I split a payment across multiple cards?",
        a: "No, payments cannot be split across multiple cards.",
      },
      {
        q: "How do I manage or delete my payment information?",
        a: 'Go to your profile page by clicking your email in the bottom-left corner of the dashboard, then click the "Billing" button in the top-right corner to manage your payment details.',
      },
      {
        q: "Where can I find my invoices?",
        a: 'Go to your profile page by clicking your email in the bottom-left corner of the dashboard, then click the "Billing" button in the top-right corner to view all payment invoices.',
      },
      {
        q: "What is your refund policy?",
        a: "We offer a 30-day money-back guarantee on all purchases. If you're unsatisfied for any reason, you can request a full refund within 30 days of your initial purchase. The guarantee applies to a single refund per user — subsequent purchases are not eligible.",
      },
    ],
    account: [
      {
        q: "My login link has expired. How do I get a new one?",
        a: "Simply visit the website and log in again to receive a new login link.",
      },
    ],
  } as const;

  type FaqCategory = keyof typeof faqByCategory;
  const [faqCategory, setFaqCategory] = useState<FaqCategory>("privacy");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqTabs: { id: FaqCategory; label: string }[] = [
    { id: "privacy", label: "General" },
    { id: "billing", label: "Billing" },
    { id: "account", label: "Account" },
    { id: "features", label: "Product" },
  ];

  const brandLogos = [
    { name: "Facebook", src: "https://cdn.simpleicons.org/facebook/1877F2" },
    { name: "Netflix", src: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" },
    { name: "LinkedIn", src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
    { name: "PayPal", src: "https://cdn.simpleicons.org/paypal/003087" },
    { name: "IBM", src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "MongoDB", src: "https://cdn.simpleicons.org/mongodb/47A248" },
    { name: "X", src: "https://cdn.simpleicons.org/x/1D9BF0" },
    { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" },
    { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  ];

  const interviewLanguageLabels = AZURE_SPEECH_STT_LOCALES.map((o) => o.label);
  const half = Math.ceil(interviewLanguageLabels.length / 2);
  const languageRowOne = interviewLanguageLabels.slice(0, half);
  const languageRowTwo = interviewLanguageLabels.slice(half);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const tryForFreeRoute = isAuthenticated ? "/dashboard" : "/login";

  const socialHandles = [
    { name: "Instagram", url: "https://www.instagram.com/smeedai", icon: "instagram" },
    { name: "X", url: "https://x.com/smeedai", icon: "x" },
    { name: "LinkedIn", url: "https://linkedin.com/company/orioai", icon: "linkedin" },
    { name: "YouTube", url: "https://youtube.com/@orioai", icon: "youtube" },
  ] as const;

  const pricingConfig = {
    credits: {
      benefits: [
        "30-Day Money Back",
        "Used by 10,000+ candidates",
        "Credits Never Expire",
        "1 Credit = 1h Call",
      ],
      plans: [
        {
          name: "Basic",
          icon: "•••",
          priceInr: "899",
          priceUsd: "9.99",
          priceWasInr: "1,199",
          priceWasUsd: "13.32",
          detail: "3 Call Credits",
          cta: "Get Started",
          highlighted: false,
          checkoutProductId: "credits_basic",
        },
        {
          name: "Plus",
          icon: "••••••",
          priceInr: "1,499",
          priceUsd: "16.65",
          priceWasInr: "1,999",
          priceWasUsd: "22.21",
          detail: "6 Call Credits + 2 Free",
          cta: "Get Credits",
          highlighted: false,
          checkoutProductId: "credits_plus",
        },
        {
          name: "Pro",
          icon: "•••••••••",
          priceInr: "2,499",
          priceUsd: "27.77",
          detail: "9 Call Credits + 4 Free",
          cta: "Get Credits",
          highlighted: true,
          badge: "Best Value",
          subtext: "Most chosen by serious candidates",
          priceWasInr: "3,499",
          priceWasUsd: "38.88",
          checkoutProductId: "credits_pro",
        },
      ],
    },
    subscription: {
      benefits: [
        "30-Day Money Back",
        "Unlimited Calls",
        "Cancel Anytime",
        "Used by 10,000+ candidates",
      ],
      plans: [
        {
          name: "Monthly",
          icon: "🗓",
          priceInr: "1,999",
          priceUsd: "22.21",
          priceWasInr: "2,499",
          priceWasUsd: "27.77",
          detail: "Unlimited Calls",
          cta: "Subscribe",
          highlighted: false,
          checkoutProductId: "sub_monthly",
        },
        {
          name: "Yearly",
          icon: "📅",
          priceInr: "12,999",
          priceUsd: "144.43",
          detail: "Unlimited Calls • Save 45%",
          cta: "Subscribe",
          highlighted: true,
          badge: "Best Value",
          subtext: "Recommended for serious job seekers",
          priceWasInr: "16,999",
          priceWasUsd: "188.88",
          checkoutProductId: "sub_yearly",
        },
      ],
    },
    lifetime: {
      benefits: [
        "30-Day Money Back",
        "Unlimited Calls Forever",
        "One-Time Payment",
        "Used by 10,000+ candidates",
      ],
      plans: [
        {
          name: "Lifetime",
          icon: "∞",
          priceInr: "19,999",
          priceUsd: "222.21",
          priceWasInr: "27,999",
          priceWasUsd: "310.00",
          detail: "Unlimited Calls Forever",
          cta: "Get Lifetime",
          highlighted: true,
          badge: "Limited Time Offer",
          checkoutProductId: "lifetime",
        },
      ],
    },
  };

  const HappyEngineers = data.stats?.HappyEngineers ?? "1000+";

  const desiContent = {
    behavioral: {
      question: "Tell me about a time you handled a conflict in your team.",
      normal: '"In my previous role, I encountered a situation where two team members had diverging opinions regarding a technical approach. I facilitated a structured discussion to align on objectives and move forward..."',
      desi: '"Yeah so this happened in my last project actually. Two senior devs couldn\'t agree on REST vs GraphQL for our API. I called a quick sync, asked both to show pros/cons, then we picked what fit timeline best and shipped on time."',
      normalNote: "Sounds rehearsed, not authentic",
      desiNote: "Real, relatable, how people actually talk",
    },
    technical: {
      question: "What is the difference between SQL and NoSQL?",
      normal: '"SQL databases are relational systems that use structured query language and predefined schemas. In contrast, NoSQL databases are non-relational and provide flexible schemas..."',
      desi: '"So SQL is like a fixed Excel sheet, rows and columns predefined. NoSQL is more like JSON, you can store flexible data. SQL is great for strict structure; NoSQL is useful when scale and flexibility matter."',
      normalNote: "Too formal, sounds like textbook",
      desiNote: "Clear, natural, like talking to a colleague",
    },
  } as const;

  return (
    <div className="orio-landing min-h-screen overflow-x-hidden">
      <LandingNavbar theme="dark" />

      {/* HERO */}
      <section className="relative min-h-[calc(100dvh-72px)] flex items-center">
        <div className="orio-hero-mesh" aria-hidden />
        <div className="saas-container relative z-10 w-full py-16 md:py-24 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              Invisible during interviews
            </div>

            <h1 className="orio-font-display mt-6 text-4xl sm:text-5xl md:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-white">
              Your edge in
              <br />
              <span className="orio-shimmer-text">every interview</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-400">{c("HeroSubtitle", data)}</p>

            <div className="mt-9 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link to={tryForFreeRoute} className="orio-btn-aurora w-full sm:w-auto justify-center">
                Start free — no card
              </Link>
              <a href="#features" className="orio-btn-ghost w-full sm:w-auto justify-center">
                {c("HeroCtaSecondary", data)}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {["A", "N", "R"].map((ch, i) => (
                  <span
                    key={ch}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0a0a10] text-xs font-bold ${
                      i === 0 ? "bg-teal-500/20 text-teal-200" : i === 1 ? "bg-violet-500/20 text-violet-200" : "bg-fuchsia-500/20 text-fuchsia-200"
                    }`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-semibold text-slate-200">{HappyEngineers}+ engineers</p>
                <p className="text-xs text-slate-500">Rated 4.8 · Real-time AI answers</p>
              </div>
            </div>
          </div>

          <div className="orio-tilt-wrap relative lg:pl-4">
            <div className="orio-tilt orio-panel orio-card-drift relative overflow-hidden p-1">
              <div className="orio-scan-line" />
              <div className="rounded-[18px] bg-[#08080c] p-5 md:p-6 border border-white/[0.06]">
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-400/80">Live session</p>
                    <p className="mt-1 text-sm font-semibold text-white">Senior Frontend · Acme Corp</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">Listening</span>
                </div>
                <div className="mt-4 space-y-3 font-mono text-[11px] leading-relaxed">
                  <p className="text-slate-500">
                    <span className="text-violet-400/90">Q:</span> Explain how you&apos;d optimize a React list with 10k rows.
                  </p>
                  <p className="rounded-lg border border-teal-500/15 bg-teal-500/[0.06] p-3 text-slate-300">
                    <span className="text-teal-400/90">Smeed AI</span> Virtualize the list (e.g. react-window), memoize row renders, stabilize item keys, and defer non-critical work with{" "}
                    <span className="text-fuchsia-300/80">startTransition</span>…
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-[10px] text-slate-500">
                  <span>Latency</span>
                  <span className="font-mono text-teal-400/90">~1.2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <RevealOnScroll>
        <section className="border-y border-white/[0.06] bg-[#060609]/80 py-10">
          <div className="saas-container">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-6">
              Practice sessions inspired by teams at
            </p>
            <div className="logo-marquee">
              <div className="logo-marquee-track">
                {[...brandLogos, ...brandLogos].map((logo, index) => (
                  <div key={`${logo.name}-${index}`} className="logo-item">
                    <img src={logo.src} alt={logo.name} loading="lazy" className={logo.name === "Google" ? "google-logo-lg" : ""} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* LANGUAGES */}
      <RevealOnScroll>
        <section className="py-20 md:py-28">
          <div className="saas-container">
            <div className="mx-auto max-w-4xl text-center mb-10">
              <h2 className="orio-font-display text-3xl md:text-4xl font-bold text-white">
                Speak your <span className="text-teal-400">language</span>
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                {AZURE_SPEECH_STT_LOCALES.length} locales · Azure Speech + Azure OpenAI aligned to your interview
              </p>
            </div>
            <div className="orio-panel mx-auto max-w-5xl p-6 md:p-8">
              <div className="space-y-3">
                <div className="language-marquee">
                  <div className="language-marquee-track">
                    {[...languageRowOne, ...languageRowOne].map((lang, idx) => (
                      <span key={`t-${lang}-${idx}`} className="language-pill">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="language-marquee">
                  <div className="language-marquee-track reverse">
                    {[...languageRowTwo, ...languageRowTwo].map((lang, idx) => (
                      <span key={`b-${lang}-${idx}`} className="language-pill">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* NATURAL MODE — split comparison showcase */}
      <RevealOnScroll>
        <section
          id="natural-mode"
          className="relative scroll-mt-24 py-24 md:py-32"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(45,212,191,0.08),transparent_55%),radial-gradient(ellipse_60%_40%_at_90%_60%,rgba(167,139,250,0.1),transparent_50%)]"
            aria-hidden
          />
          <div className="saas-container relative max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-400/90">
                Voice &amp; tone
              </p>
              <h2 className="orio-font-display mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl md:leading-[1.1]">
                Same question.{" "}
                <span className="bg-gradient-to-r from-teal-300 via-slate-100 to-violet-300 bg-clip-text text-transparent">
                  Two realities.
                </span>
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-400 md:text-lg">
                <span className="text-slate-300">Natural Mode</span> shapes
                answers the way confident candidates actually speak — direct,
                clear, and easy to say out loud. Flip the scenario to compare.
              </p>
            </div>

            <div className="relative mt-14 md:mt-16">
              <div
                className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-teal-500/25 via-transparent to-violet-500/25 opacity-80 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#07070c]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="flex flex-col gap-6 border-b border-white/[0.06] bg-gradient-to-r from-white/[0.04] to-transparent px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-7">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-500/15 to-violet-600/10 text-teal-200 shadow-[0_0_32px_rgba(45,212,191,0.12)]">
                      <svg
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 3c4 0 7 2.5 7 6v4c0 1.5-.5 3-1.5 4M12 3C8 3 5 5.5 5 9v4c0 1.5.5 3 1.5 4M9 17v2a3 3 0 006 0v-2"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="orio-font-display text-xl font-bold text-white md:text-2xl">
                          Natural Mode
                        </h3>
                        <span className="rounded-full border border-fuchsia-500/35 bg-fuchsia-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fuchsia-200/95">
                          Live compare
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Built for real interviews — not essay mode.
                      </p>
                    </div>
                  </div>
                  <SegmentedTabList
                    value={desiTab}
                    onChange={setDesiTab}
                    tabs={NATURAL_QUESTION_TABS}
                    variant="natural"
                    aria-label="Question type"
                  />
                </div>

                <div className="px-6 py-6 md:px-10 md:py-8">
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent px-5 py-4 md:px-6 md:py-5">
                    <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-teal-400 to-violet-500" />
                    <p className="pl-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Interviewer asks
                    </p>
                    <p className="mt-2 pl-3 font-['DM_Sans',sans-serif] text-base font-medium leading-snug text-slate-100 md:text-lg">
                      &ldquo;{desiContent[desiTab].question}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-0">
                    <div className="relative rounded-2xl border border-white/[0.08] bg-[#0a0a10]/90 p-6 md:rounded-r-none md:border-r-0 md:pr-8">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/40 bg-slate-800/50 text-lg">
                          🤖
                        </span>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Generic AI
                          </p>
                          <p className="text-xs text-slate-600">Template tone</p>
                        </div>
                      </div>
                      <p className="mt-5 text-[14px] leading-relaxed text-slate-400">
                        {desiContent[desiTab].normal}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[10px]"
                          aria-hidden
                        >
                          ✕
                        </span>
                        {desiContent[desiTab].normalNote}
                      </div>
                    </div>

                    <div className="relative rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-500/[0.07] via-[#0c0c12] to-violet-600/[0.08] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:-ml-px md:rounded-l-none md:border-l md:border-teal-500/20">
                      <div
                        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-400/10 blur-3xl"
                        aria-hidden
                      />
                      <div className="relative flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/35 bg-teal-500/15 text-lg shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                          ✨
                        </span>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300/90">
                            Natural Mode
                          </p>
                          <p className="text-xs text-slate-500">
                            Smeed AI answer style
                          </p>
                        </div>
                      </div>
                      <p className="relative mt-5 text-[14px] leading-relaxed text-slate-200">
                        {desiContent[desiTab].desi}
                      </p>
                      <div className="relative mt-5 inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-200"
                          aria-hidden
                        >
                          ✓
                        </span>
                        {desiContent[desiTab].desiNote}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* PLATFORMS */}
      <RevealOnScroll>
        <section className="py-20 md:py-28">
          <div className="saas-container text-center">
            <h2 className="orio-font-display text-3xl md:text-4xl font-bold text-white">Works everywhere you interview</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">Zoom, Meet, Teams, LeetCode, and more — Smeed AI stays in your workflow.</p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {[
                { name: "Zoom", src: "https://img.icons8.com/color/96/zoom.png" },
                { name: "Google Meet", src: "https://img.icons8.com/color/96/google-meet--v1.png" },
                { name: "Microsoft Teams", src: "/assets/Microsoft_Office_Teams_Logo_512px.png" },
                { name: "LeetCode", src: "https://assets.leetcode.com/static_assets/public/icons/favicon-96x96.png" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex h-16 w-24 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-300 hover:scale-110 hover:border-teal-400/30 hover:shadow-[0_0_32px_rgba(45,212,191,0.12)]"
                >
                  <img src={p.src} alt={p.name} className="max-h-9 object-contain opacity-90" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Interactive feature showcase (replaces bento "How it helps") */}
      <RevealOnScroll>
        <LandingFeatureShowcase title={c("HowItHelpsTitle", data)} subtitle={c("FeatureIntroSubtitle", data)} />
      </RevealOnScroll>

      {/* DESKTOP */}
      <RevealOnScroll>
        <section id="desktop" className="py-16 scroll-mt-24">
          <div className="saas-container">
            <div className="orio-panel flex flex-col items-center gap-6 px-8 py-12 text-center md:flex-row md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-3xl">
                🖥
              </div>
              <div className="flex-1">
                <h3 className="orio-font-display text-xl font-bold text-white">Desktop companion</h3>
                <p className="mt-2 text-sm text-slate-400">
                  A focused window for real interviews — pair with your browser session and keep answers one glance away.
                </p>
              </div>
              <Link to={tryForFreeRoute} className="orio-btn-ghost shrink-0">
                Open dashboard
              </Link>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <CompetitorPriceShowdownSection />

      {/* PRICING */}
      <RevealOnScroll>
        <section className="py-20 md:py-32">
          <div className="saas-container text-center">
            <div id="pricing" className="scroll-mt-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400/80">
                Pricing
              </p>
              <h2 className="orio-font-display mt-3 text-3xl md:text-5xl font-bold text-white">
                Invest in your offer
              </h2>
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">Credits, subscription, or lifetime — you choose the runway.</p>

            <SegmentedTabList
              className="mx-auto mt-10"
              value={pricingTab}
              onChange={setPricingTab}
              tabs={PRICING_SEGMENT_TABS}
              variant="pricing"
              aria-label="Pricing plans"
            />

            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-3 text-xs text-slate-400">
              {pricingConfig[pricingTab].benefits.map((b, idx) => (
                <span key={b} className="flex items-center gap-3">
                  {idx > 0 ? <span className="text-slate-600">·</span> : null}
                  {b}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-3 max-w-xl text-center text-[11px] font-medium leading-relaxed text-amber-200/75">
              Limited-time pricing · Price increasing soon
            </p>

            <div
              className={`mx-auto mt-12 grid max-w-5xl items-stretch gap-6 ${
                pricingConfig[pricingTab].plans.length === 3 ? "md:grid-cols-3" : pricingConfig[pricingTab].plans.length === 2 ? "md:grid-cols-2" : "max-w-md"
              }`}
            >
              {pricingConfig[pricingTab].plans.map((plan) => (
                <LazyMountWhenVisible key={plan.name} theme="dark" className="min-h-0 h-full">
                  <div
                    className={`relative flex h-full min-h-[420px] flex-col rounded-[24px] px-8 pb-8 text-center transition-all duration-300 ${
                      plan.highlighted ? "pt-12 orio-glow-ring bg-[#0c0c14]" : "pt-8 border border-white/[0.08] bg-white/[0.02] hover:border-teal-400/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    {"badge" in plan &&
                    (plan.badge === "Best Value" || plan.badge === "Limited Time Offer") ? (
                      <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-green-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
                        {plan.badge}
                      </span>
                    ) : null}
                    <p className="text-lg text-slate-500">{plan.icon}</p>
                    <h3 className="orio-font-display mt-2 text-2xl font-bold text-white">{plan.name}</h3>
                    <div className="mt-3 flex min-h-[2.75rem] flex-col items-center justify-center gap-0.5">
                      <p className="text-base font-semibold text-slate-500 line-through">₹{plan.priceWasInr}</p>
                      <p className="text-xs text-slate-600 line-through">${plan.priceWasUsd}</p>
                    </div>
                    <p className="mt-2 text-4xl font-extrabold text-white">₹{plan.priceInr}</p>
                    <p className="mt-1 text-sm text-slate-500">${plan.priceUsd}</p>
                    <div className="mt-4 flex min-h-0 flex-1 flex-col">
                      <p className="text-sm text-slate-400">{plan.detail}</p>
                      <div className="mt-2 min-h-[2.75rem]">
                        {"subtext" in plan && plan.subtext ? (
                          <p className="text-xs font-medium text-teal-300/80">{plan.subtext}</p>
                        ) : null}
                      </div>
                      <div className="flex-1" aria-hidden />
                    </div>
                    <Link
                      to={planPurchasePath(
                        isAuthenticated,
                        pricingTab,
                        plan.checkoutProductId,
                      )}
                      className={`mt-6 flex w-full shrink-0 items-center justify-center rounded-full py-3 text-sm font-bold transition-all duration-300 ${
                        plan.highlighted ? "orio-btn-aurora" : "orio-btn-ghost border-teal-400/20"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </LazyMountWhenVisible>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {["Visa", "Mastercard", "UPI", "Apple Pay", "Google Pay"].map((m) => (
                <span key={m} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-500">
                  {m}
                </span>
              ))}
            </div>
            <Link to={tryForFreeRoute} className="orio-btn-aurora mt-8 inline-flex">
              Try free first
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      <CustomerVoicesSection />

      {/* FAQ */}
      <RevealOnScroll>
        <section id="privacy" className="py-20 md:py-28 scroll-mt-24 border-t border-white/[0.06] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.08),transparent)]">
          <div className="saas-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="orio-font-display text-3xl md:text-4xl font-bold text-white">Questions, answered</h2>
              <p className="mt-3 text-sm text-slate-400">
                Still unsure?{" "}
                <Link to="/contact" className="text-teal-400 underline-offset-4 hover:underline">
                  Talk to us
                </Link>
              </p>
              <SegmentedTabList
                className="mx-auto mt-8"
                value={faqCategory}
                onChange={(id) => {
                  setFaqCategory(id);
                  setOpenFaqIndex(0);
                }}
                tabs={faqTabs}
                variant="landing"
                aria-label="FAQ categories"
              />
            </div>

            <div
              key={faqCategory}
              className="orio-faq-answer-list mx-auto mt-12 max-w-3xl space-y-2"
            >
              {faqByCategory[faqCategory].map((item, idx) => {
                const open = openFaqIndex === idx;
                return (
                  <div key={item.q} className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20 backdrop-blur-sm transition-colors hover:border-white/10">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(open ? null : idx)}
                      className="grid w-full grid-cols-[2rem_1fr] gap-x-4 gap-y-0 px-5 py-4 text-left"
                    >
                      <span className="col-start-1 row-start-1 flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg bg-gradient-to-br from-teal-500/20 to-violet-600/20 text-xs font-bold text-teal-300">
                        {open ? "−" : "+"}
                      </span>
                      <span className="col-start-2 row-start-1 min-w-0 self-center text-left font-semibold leading-snug text-white">
                        {item.q}
                      </span>
                      <div className="col-start-2 row-start-2 min-w-0">
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <p className="whitespace-pre-line pt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* FOOTER */}
      <footer className="relative border-t border-white/[0.08] bg-gradient-to-b from-[#050508] to-black pt-px">
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" aria-hidden />
        <div className="saas-container pt-16 md:pt-20 pb-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <p className="orio-font-display text-xl font-bold text-white">Smeed AI</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">Invisible AI assistance for real interviews. Built for clarity under pressure.</p>
              <div className="mt-6 flex gap-2">
                {socialHandles.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-all duration-300 hover:border-teal-400/40 hover:text-teal-300 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                  >
                    {item.icon === "instagram" && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
                      </svg>
                    )}
                    {item.icon === "x" && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.9-6.6L6.2 22H3.1l7.24-8.28L.8 2h6.3l4.43 5.98L18.9 2zm-1.1 18.1h1.72L6.2 3.8H4.4L17.8 20.1z" />
                      </svg>
                    )}
                    {item.icon === "linkedin" && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.98 3.5a2.48 2.48 0 1 1 0 4.96 2.48 2.48 0 0 1 0-4.96zM2.75 9h4.46v12H2.75V9zm7.1 0h4.28v1.64h.06c.6-1.12 2.06-2.3 4.24-2.3 4.54 0 5.38 2.98 5.38 6.85V21h-4.46v-5.16c0-1.23-.02-2.82-1.72-2.82-1.73 0-2 1.35-2 2.73V21H9.86V9z" />
                      </svg>
                    )}
                    {item.icon === "youtube" && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 12s0-3.4-.43-5.03a2.9 2.9 0 0 0-2.04-2.05C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.53.42A2.9 2.9 0 0 0 1.43 6.97C1 8.6 1 12 1 12s0 3.4.43 5.03a2.9 2.9 0 0 0 2.04 2.05c1.63.42 8.53.42 8.53.42s6.9 0 8.53-.42a2.9 2.9 0 0 0 2.04-2.05C23 15.4 23 12 23 12zm-13.2 3.87V8.13L16.27 12 9.8 15.87z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Product</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <a href="#pricing" className="hover:text-teal-400 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Legal</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <Link to="/terms" className="hover:text-teal-400 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/refunds-cancellation" className="hover:text-teal-400 transition-colors">
                    Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/delivery-policy" className="hover:text-teal-400 transition-colors">
                    Delivery
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Support</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <Link to="/contact" className="hover:text-teal-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-14 border-t border-white/[0.06] pt-8 text-center text-[11px] text-slate-600">
            © 2026 Smeed AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

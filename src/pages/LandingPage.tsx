import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  SaasCard,
  SaasSection,
} from "../components/SaasPrimitives";

const STATIC_LANDING_DATA = {
  content: {
    HeroHeadline: "Ace Every Interview with Real-Time AI Guidance",
    HeroSubtitle:
      "Practice smarter with live AI support, cleaner answers, and better interview confidence.",
    HeroCtaPrimary: "Get Started Free",
    HeroCtaSecondary: "See Features",
    HeroCtaSecondaryUrl: "#features",
    FeatureIntroTitle: "Stop Wasting Time Preparing",
    FeatureIntroSubtitle: "Structured guidance, faster prep, better outcomes.",
    FeatureIntroBody:
      "Orio helps you practice with realistic questions, live guidance, and focused feedback so you can perform better in real interviews.",
    HowItHelpsTitle: "How Orio AI Helps",
    TestimonialsTitle: "From Our Customers",
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
    CopyrightText: "© 2026 Orio AI. All rights reserved.",
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
  stats: {
    HappyEngineers: "1000+",
    QuestionsCount: "500+",
    TopicsCount: "20+",
  },
  featuredCompanies: [{ name: "Fintech Daily" }, { name: "Dev Weekly" }, { name: "Hiring Pulse" }],
  topics: [
    { name: "JavaScript" },
    { name: "System Design" },
    { name: "React" },
    { name: "Data Structures" },
    { name: "Behavioral" },
    { name: "SQL" },
  ],
  featureCardsHowItHelps: [
    { iconName: "R", title: "Real-time Guidance", description: "Get instant support while practicing live interview questions.", extraData: null, buttonText: "", buttonUrl: "#" },
    { iconName: "P", title: "Personalized Responses", description: "Answers adapt to your resume and target role context.", extraData: null, buttonText: "", buttonUrl: "#" },
    { iconName: "F", title: "Focused Practice", description: "Use structured sessions to improve weak areas quickly.", extraData: null, buttonText: "", buttonUrl: "#" },
    { iconName: "T", title: "Track Progress", description: "Review sessions and improve with measurable iteration.", extraData: null, buttonText: "", buttonUrl: "#" },
  ],
  testimonials: [
    { name: "Aarav Patel", title: "Frontend Engineer", company: "TechStack", quote: "Orio made my prep structured and significantly reduced interview anxiety." },
    { name: "Nisha Verma", title: "SDE-2", company: "CloudNova", quote: "The live assistant flow feels practical and helped me answer confidently." },
    { name: "Rahul Sharma", title: "Backend Engineer", company: "DataForge", quote: "I improved clarity and speed in technical rounds after using Orio." },
  ],
  featureCardsMoreFeatures: [
    { title: "Session History", description: "Revisit past calls and continue improving with context." },
    { title: "Resume-aware Mode", description: "Generate answers aligned with your real background." },
    { title: "Desktop Companion", description: "Use a focused desktop window during live interviews." },
    { title: "Fast Setup", description: "Start practicing in minutes with simple onboarding." },
  ],
  pricingPlans: [
    {
      name: "Starter",
      monthlyPrice: 0,
      yearlyDiscountPercent: null,
      isHighlighted: false,
      features: [{ text: "Basic interview practice" }, { text: "Limited call sessions" }, { text: "Community support" }],
      buttonText: "Start Free",
      buttonUrl: "/signup",
    },
    {
      name: "Pro",
      monthlyPrice: 19,
      yearlyDiscountPercent: 20,
      isHighlighted: true,
      features: [{ text: "Unlimited practice sessions" }, { text: "Priority answer quality" }, { text: "Advanced analytics" }],
      buttonText: "Upgrade to Pro",
      buttonUrl: "/signup",
    },
  ],
  roles: [{ name: "Frontend Engineer", url: "#" }, { name: "Backend Engineer", url: "#" }, { name: "Full Stack Engineer", url: "#" }],
  footerLinks: [
    { category: "Product", label: "Features", url: "#features" },
    { category: "Product", label: "Pricing", url: "#pricing" },
    { category: "Resources", label: "Help Center", url: "#" },
    { category: "Resources", label: "Blog", url: "#" },
    { category: "Company", label: "About", url: "#" },
    { category: "Company", label: "Contact", url: "mailto:support@parakeet.ai" },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "#" },
    { platform: "X", url: "#" },
    { platform: "YouTube", url: "#" },
  ],
};

function c(key: string, data: typeof STATIC_LANDING_DATA) {
  return data.content[key] ?? key;
}

export default function LandingPage() {
  const data = STATIC_LANDING_DATA;
  const [desiTab, setDesiTab] = useState<"behavioral" | "technical">("behavioral");
  const [desiExpanded, setDesiExpanded] = useState(false);
  const [pricingTab, setPricingTab] = useState<"credits" | "subscription" | "lifetime">("credits");
  const faqByCategory = {
    privacy: [
      {
        q: "Which platforms does Orio AI work with?",
        a: "Orio AI works with common interview platforms including Zoom, Google Meet, and Microsoft Teams.",
      },
      {
        q: "Is Orio AI visible when I share my screen?",
        a: "Orio AI is designed to be lightweight and practical. Use it according to your interview policy and company guidelines.",
      },
      {
        q: "Can proctoring software detect Orio AI?",
        a: "Different systems behave differently. Always follow exam/interview rules and allowed tool policies.",
      },
      {
        q: "Can I use Orio AI during an online exam?",
        a: "Use only where permitted. For exams or assessments, always follow the official instructions.",
      },
      {
        q: "Can I rename the process in Task Manager?",
        a: "No, Orio AI keeps standard app behavior and does not provide process masking features.",
      },
    ],
    features: [
      {
        q: "What languages does Orio AI support?",
        a: "Orio AI supports English-first interview workflows and can handle mixed conversational context.",
      },
      {
        q: "Can Orio AI listen in one language and respond in another?",
        a: "Yes, you can guide response style and language preference in your session context.",
      },
      {
        q: "Does Orio AI have keyboard shortcuts?",
        a: "Yes, core actions are optimized for quick interaction and minimal switching overhead.",
      },
      {
        q: "Does Orio AI support coding calls?",
        a: "Yes. It is designed for both behavioral and technical interview rounds.",
      },
      {
        q: "Can I use headphones during the call?",
        a: "Yes, headphones are supported and often recommended for cleaner audio input.",
      },
      {
        q: "Can I provide extra context during the call?",
        a: "Yes, you can add role and interview context to tailor answer quality.",
      },
      {
        q: "Can I use Orio AI for a phone call?",
        a: "Yes, if your setup captures audio input/output correctly.",
      },
      {
        q: "Does Orio AI have a mobile app?",
        a: "Currently, the primary experience is web + desktop-focused.",
      },
    ],
    billing: [
      {
        q: "How do I try Orio AI for free?",
        a: "Start from the free plan and explore core features before upgrading.",
      },
      {
        q: "How does the credit system work?",
        a: "Credits are consumed based on usage/session type and plan configuration.",
      },
      {
        q: "How do I know how many credits I have left?",
        a: "Your remaining credits are visible in dashboard account sections.",
      },
      {
        q: "Does Orio AI offer a referral program?",
        a: "Referral programs may vary over time; check current offers in product updates.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Standard online payment methods are supported based on region availability.",
      },
      {
        q: "Can I split a payment across multiple cards?",
        a: "At present, split-card support is not guaranteed across all payment gateways.",
      },
      {
        q: "How do I manage payment information?",
        a: "You can manage billing details from your account billing settings.",
      },
    ],
    account: [
      {
        q: "My login link expired. How do I get a new one?",
        a: "Request a fresh login link from the sign-in flow and retry immediately.",
      },
    ],
  } as const;
  type FaqCategory = keyof typeof faqByCategory;
  const [faqCategory, setFaqCategory] = useState<FaqCategory>("privacy");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const brandLogos = [
    { name: "Facebook", src: "https://cdn.simpleicons.org/facebook/1877F2" },
    {
      name: "Netflix",
      src: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
    },
    {
      name: "LinkedIn",
      src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    },
    { name: "PayPal", src: "https://cdn.simpleicons.org/paypal/003087" },
    {
      name: "IBM",
      src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    },
    { name: "MongoDB", src: "https://cdn.simpleicons.org/mongodb/47A248" },
    { name: "X", src: "https://cdn.simpleicons.org/x/1D9BF0" },
    {
      name: "Google",
      src: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    },
    {
      name: "Microsoft",
      src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
  ];
  const supportedLanguages = [
    "English",
    "Hindi",
    "Bengali",
    "Marathi",
    "Telugu",
    "Tamil",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Urdu",
    "Odia",
    "Assamese",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Dutch",
    "Russian",
    "Polish",
    "Czech",
    "Slovak",
    "Romanian",
    "Hungarian",
    "Ukrainian",
    "Turkish",
    "Arabic",
    "Persian",
    "Hebrew",
    "Swahili",
    "Afrikaans",
    "Indonesian",
    "Malay",
    "Thai",
    "Vietnamese",
    "Filipino",
    "Japanese",
    "Korean",
    "Chinese",
    "Greek",
    "Serbian",
    "Croatian",
    "Slovenian",
    "Danish",
    "Norwegian",
    "Swedish",
    "Finnish",
    "Lithuanian",
    "Latvian",
    "Estonian",
    "Bulgarian",
  ] as const;
  const languageRowOne = supportedLanguages.slice(0, 26);
  const languageRowTwo = supportedLanguages.slice(26);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const tryForFreeRoute = isAuthenticated ? "/dashboard" : "/login";
  const goToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const socialHandles = [
    { name: "Instagram", url: "https://instagram.com/orioai.official", icon: "instagram" },
    { name: "X", url: "https://x.com/orioai", icon: "x" },
    { name: "LinkedIn", url: "https://linkedin.com/company/orioai", icon: "linkedin" },
    { name: "YouTube", url: "https://youtube.com/@orioai", icon: "youtube" },
  ] as const;
  const pricingConfig = {
    credits: {
      benefits: ["30-Day Money Back", "Credits Never Expire", "1 Credit = 1h Call"],
      plans: [
        {
          name: "Basic",
          icon: "• • •",
          priceInr: "3,749",
          priceUsd: "39.50",
          detail: "3 Call Credits",
          cta: "Get Credits",
          highlighted: false,
        },
        {
          name: "Plus",
          icon: "••••••",
          priceInr: "7,499",
          priceUsd: "79.90",
          detail: "6 Call Credits + 2 Free",
          cta: "Get Credits",
          highlighted: true,
        },
        {
          name: "Pro",
          icon: "•••••••••",
          priceInr: "10,799",
          priceUsd: "114.90",
          detail: "9 Call Credits + 6 Free",
          cta: "Get Credits",
          highlighted: false,
        },
      ],
    },
    subscription: {
      benefits: ["30-Day Money Back", "Unlimited Calls", "Cancel Anytime"],
      plans: [
        {
          name: "Monthly",
          icon: "🗓",
          priceInr: "9,399",
          priceUsd: "99.90",
          detail: "Unlimited Calls",
          cta: "Subscribe",
          highlighted: false,
        },
        {
          name: "Yearly",
          icon: "📅",
          priceInr: "27,999",
          priceUsd: "299.90",
          detail: "Unlimited Calls • Save 75%",
          cta: "Subscribe",
          highlighted: true,
        },
      ],
    },
    lifetime: {
      benefits: ["30-Day Money Back", "Unlimited Calls Forever", "One-Time Payment"],
      plans: [
        {
          name: "Lifetime",
          icon: "∞",
          priceInr: "56,399",
          priceUsd: "599.90",
          detail: "Unlimited Calls Forever",
          cta: "Get Lifetime",
          highlighted: true,
        },
      ],
    },
  } as const;
  const videoTestimonials = [
    {
      name: "Aarav P.",
      role: "Frontend Engineer",
      badge: "",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Nisha V.",
      role: "SDE-2",
      badge: "Landed a job at MNC",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Rahul S.",
      role: "Backend Engineer",
      badge: "",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Daniel M.",
      role: "Data Engineer",
      badge: "",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    },
  ] as const;

  const stats = data.stats;
  const HappyEngineers = stats?.HappyEngineers ?? "1000+";
  const desiContent = {
    behavioral: {
      question: "Tell me about a time you handled a conflict in your team.",
      normal:
        '"In my previous role, I encountered a situation where two team members had diverging opinions regarding a technical approach. I facilitated a structured discussion to align on objectives and move forward..."',
      desi:
        '"Yeah so this happened in my last project actually. Two senior devs couldn\'t agree on REST vs GraphQL for our API. I called a quick sync, asked both to show pros/cons, then we picked what fit timeline best and shipped on time."',
      normalNote: "Sounds rehearsed, not authentic",
      desiNote: "Real, relatable, how people actually talk",
    },
    technical: {
      question: "What is the difference between SQL and NoSQL?",
      normal:
        '"SQL databases are relational systems that use structured query language and predefined schemas. In contrast, NoSQL databases are non-relational and provide flexible schemas..."',
      desi:
        '"So SQL is like a fixed Excel sheet, rows and columns predefined. NoSQL is more like JSON, you can store flexible data. SQL is great for strict structure; NoSQL is useful when scale and flexibility matter."',
      normalNote: "Too formal, sounds like textbook",
      desiNote: "Clear, natural, like talking to a colleague",
    },
  } as const;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav: rounded bar, white + light gradient, shadow */}
      <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2 bg-white/90 backdrop-blur">
        <div className="saas-container rounded-2xl bg-white border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-14 md:h-16 flex items-center justify-between px-3 sm:px-5 md:px-8 gap-2">
            <Link
              to="/"
              onClick={goToTop}
              className="flex items-center gap-2 font-bold text-xl text-indigo-800"
            >
              <span
                className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white"
                aria-hidden
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8 2 6 5 6 8c0 2 1 4 2 5l-2 6h12l-2-6c1-1 2-3 2-5 0-3-2-6-6-6zm0 2c2.2 0 4 1.8 4 4 0 1.5-.8 3.2-1.5 4.5L14 18h-4l-.5-5.5C8.8 11.2 8 9.5 8 8c0-2.2 1.8-4 4-4z" />
                </svg>
              </span>
              OrioAI
            </Link>
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-600">
              <a
                href="#features"
                className="flex items-center gap-1.5 hover:text-indigo-600"
              >
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 3v10h8V3h-8zM3 21h8v-6H3v6zm0-8h8V3H3v10zm10 0h8v-6h-8v6z" />
                </svg>
                Features
              </a>
              <a
                href="#reviews"
                className="flex items-center gap-1.5 hover:text-indigo-600"
              >
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                Reviews
              </a>
              <a
                href="#privacy"
                className="flex items-center gap-1.5 hover:text-indigo-600"
              >
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                Privacy
              </a>
              <a
                href="#pricing"
                className="flex items-center gap-1.5 hover:text-indigo-600"
              >
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7 5.5z" />
                </svg>
                Pricing
              </a>
              <a
                href="#desktop"
                className="flex items-center gap-1.5 hover:text-indigo-600"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2h8v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
                </svg>
                Desktop App
                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  New
                </span>
              </a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              >
                {isAuthenticated ? "Dashboard" : "Sign in"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <SaasSection className="min-h-[calc(100vh-88px)] flex items-center bg-gradient-to-b from-white to-violet-50">
        <div className="saas-container w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden />
              Full Coding Interview Support
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              <span className="text-gray-900">Ace Every </span>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Interview
              </span>
              <span className="text-gray-900"> with </span>
              <span className="text-emerald-600">Real-Time</span>
              <span className="text-gray-900"> AI </span>
              <span className="text-amber-600">Guidance</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-700">
              {c("HeroSubtitle", data)}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
              <Link
                to={tryForFreeRoute}
                className="saas-btn-primary w-full sm:w-auto shadow-[0_10px_24px_rgba(124,58,237,0.22)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(124,58,237,0.30)]"
              >
                Try for Free →
              </Link>
              <a
                href={c("HeroCtaSecondaryUrl", data)}
                className="saas-btn-secondary w-full sm:w-auto"
              >
                {c("HeroCtaSecondary", data)}
              </a>
              <div className="sm:ml-1 text-xs sm:text-sm text-gray-600 leading-5">
                <p className="flex items-center gap-2">
                  <span className="text-indigo-500" aria-hidden>▢</span>
                  No Credit Card Required
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-indigo-500" aria-hidden>▢</span>
                  Credits, Subscriptions, Lifetime
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-gray-600">
              <div className="flex -space-x-2">
                {["A", "R", "N"].map((ch, idx) => (
                  <span
                    key={ch}
                    className={`h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold ${
                      idx === 0
                        ? "bg-indigo-100 text-indigo-700"
                        : idx === 1
                          ? "bg-violet-100 text-violet-700"
                          : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <p>
                Used by <span className="font-semibold text-gray-900">{HappyEngineers}</span> engineers
              </p>
              <span className="text-amber-400" aria-hidden>★★★★★</span>
              <p>
                <span className="font-semibold text-gray-900">4.8</span> / 5 reviews
              </p>
            </div>
          </div>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.32) 0%, rgba(124,58,237,0.14) 42%, transparent 74%)",
              }}
              aria-hidden
            />
            <SaasCard className="saas-card-hover">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                Live Product Preview
              </p>
              <h3 className="mt-3 text-base sm:text-lg font-semibold text-gray-900">
                Real-time Interview Assistant
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Ask follow-up questions, get instant AI answers, and review your
                full call session transcript.
              </p>
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Current Session</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  Senior Frontend Engineer at Acme
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-600">AI Response Time</span>
                  <span className="text-xs font-semibold text-indigo-600">
                    ~1.2s
                  </span>
                </div>
              </div>
            </SaasCard>
          </div>
        </div>
      </SaasSection>

      <section className="py-7 border-b border-gray-100 bg-[#F9FAFB]">
        <div className="saas-container">
          <p className="text-center text-gray-700 text-lg font-semibold mb-5">
            Used for 10,000+ interviews
          </p>
          <div className="logo-marquee">
            <div className="logo-marquee-track">
              {[...brandLogos, ...brandLogos].map((logo, index) => (
                <div key={`${logo.name}-${index}`} className="logo-item">
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className={logo.name === "Google" ? "google-logo-lg" : ""}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#F9FAFB] border-b border-gray-100">
        <div className="saas-container">
          <div className="max-w-5xl mx-auto rounded-2xl border border-indigo-100/70 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-7 shadow-[0_8px_24px_rgba(79,70,229,0.08)]">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Interview in{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Your Language
                </span>
              </h3>
              <p className="mt-1.5 text-sm text-gray-600">
                Real-time transcription in 52 languages
              </p>
            </div>

            <div className="mt-6 space-y-2.5">
              <div className="language-marquee">
                <div className="language-marquee-track">
                  {[...languageRowOne, ...languageRowOne].map((lang, idx) => (
                    <span key={`${lang}-top-${idx}`} className="language-pill">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="language-marquee">
                <div className="language-marquee-track reverse">
                  {[...languageRowTwo, ...languageRowTwo].map((lang, idx) => (
                    <span key={`${lang}-bottom-${idx}`} className="language-pill">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#F9FAFB] border-b border-gray-100">
        <div className="saas-container">
          <div className="max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
            <button
              type="button"
              onClick={() => setDesiExpanded((v) => !v)}
              className="w-full px-6 md:px-8 py-6 border-b border-gray-200 text-left"
              aria-expanded={desiExpanded}
              aria-controls="desi-mode-content"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 via-white to-green-500 border border-gray-200 flex items-center justify-center text-lg">
                    🇮🇳
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-none">
                      Natural Mode
                      <span className="ml-2 align-middle rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        NEW
                      </span>
                    </h3>
                    <p className="mt-2 text-gray-600">
                      AI answers that sound like you, not a textbook. Simple, direct, the way Indians actually speak in interviews.
                    </p>
                  </div>
                </div>
                <span
                  className={`text-gray-400 text-xl leading-none transition-transform duration-200 ${
                    desiExpanded ? "rotate-0" : "rotate-180"
                  }`}
                  aria-hidden
                >
                  ⌃
                </span>
              </div>
            </button>

            {desiExpanded && (
              <div id="desi-mode-content" className="px-6 md:px-8 py-6 bg-gray-50/40">
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setDesiTab("behavioral")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                    desiTab === "behavioral"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Behavioral Question
                </button>
                <button
                  type="button"
                  onClick={() => setDesiTab("technical")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                    desiTab === "technical"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Technical Question
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 font-semibold">
                  Interview Question
                </p>
                <p className="mt-1 text-gray-900">{desiContent[desiTab].question}</p>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Normal AI
                  </p>
                  <p className="mt-3 text-gray-700 leading-relaxed">
                    {desiContent[desiTab].normal}
                  </p>
                  <p className="mt-3 text-sm text-rose-500 font-medium">
                    ✕ {desiContent[desiTab].normalNote}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-300 bg-amber-50/30 p-5">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    Natural Mode
                  </p>
                  <p className="mt-3 text-gray-800 leading-relaxed">
                    {desiContent[desiTab].desi}
                  </p>
                  <p className="mt-3 text-sm text-emerald-600 font-medium">
                    ✓ {desiContent[desiTab].desiNote}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
                {["Straight to the point", "Sounds like you", "Indian examples", "Structured answers"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-gray-100">
        <div className="saas-container">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Works with any interview platform
            </h3>
            <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">
              You can use <span className="font-semibold text-indigo-700">ChikuAI</span> with any
              video or coding platform including Zoom, Google Meet,
              Microsoft Teams, HackerRank, LeetCode, and Apache Superset.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                { name: "Zoom", src: "https://img.icons8.com/color/96/zoom.png" },
                {
                  name: "Google Meet",
                  src: "https://img.icons8.com/color/96/google-meet--v1.png",
                },
                {
                  name: "Microsoft Teams",
                  src: "/assets/Microsoft_Office_Teams_Logo_512px.png",
                },
                  {
                    name: "LeetCode",
                    src: "https://assets.leetcode.com/static_assets/public/icons/favicon-96x96.png",
                  },
                {
                  name: "Apache Superset",
                    src: "https://cdn.simpleicons.org/apachesuperset/4F46E5",
                    textLabel: "superset",
                },
                ].map((platform) => (
                <div
                  key={platform.name}
                  className="platform-logo-chip"
                  title={platform.name}
                  aria-label={platform.name}
                >
                    <img src={platform.src} alt={platform.name} loading="lazy" />
                    {"textLabel" in platform && (
                      <span className="ml-2 text-3xl leading-none font-medium text-gray-700 lowercase">
                        {platform.textLabel}
                      </span>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#F9FAFB] border-b border-gray-100">
        <div className="saas-container">
          <div className="max-w-5xl mx-auto rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-violet-700 p-3 md:p-4 shadow-[0_10px_24px_rgba(79,70,229,0.22)]">
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-white/18 via-white/10 to-white/5 border border-white/20 p-5 md:p-6 text-white">
                <h3 className="text-xl md:text-3xl font-bold leading-tight">
                  Why Choose
                  <br />
                  Orio AI
                </h3>
                <p className="mt-3 text-indigo-100 text-xs md:text-sm max-w-[26rem] leading-relaxed">
                  Built for real interviews: fast responses, personalized answers, and
                  practical support across coding and behavioral rounds.
                </p>
                <Link
                  to={tryForFreeRoute}
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-white text-indigo-700 px-5 py-3 font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    ▶
                  </span>
                  Try Orio AI Free
                </Link>
              </div>

              <div className="space-y-2.5">
                {[
                  "Universal Role Compatibility",
                  "Lightning Fast Responses",
                  "Smart Intent Recognition",
                  "Advanced Code Assistance",
                  "Resume-Based Answers",
                  "Headphone Mode",
                ].map((feature, idx) => (
                  <div
                    key={feature}
                    className="rounded-2xl bg-white border border-indigo-100 px-3.5 py-2.5 md:px-4 md:py-3 flex items-center justify-between shadow-[0_6px_14px_rgba(79,70,229,0.10)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <p className="text-gray-900 font-semibold text-sm md:text-base leading-tight">
                        {feature}
                      </p>
                    </div>
                    <span className="text-indigo-600 text-lg font-bold" aria-hidden>
                      →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-10 bg-gradient-to-b from-[#FAF7EF] to-[#FDFBF6] border-y border-amber-100/60">
        <div className="saas-container">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              People Love{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Orio AI
              </span>
            </h2>
            <p className="mt-2 text-gray-600">Real stories from real users</p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {videoTestimonials.map((item) => (
              <div
                key={item.name}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-violet-200/80 via-indigo-100/60 to-violet-300/80 shadow-[0_10px_28px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(79,70,229,0.20)]"
              >
                <div className="relative h-full overflow-hidden rounded-2xl bg-white">
                  {item.badge ? (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide">
                      {item.badge}
                    </span>
                  ) : null}
                  <video
                    controls
                    preload="metadata"
                    poster={item.poster}
                    className="w-full aspect-[9/16] object-cover bg-black"
                  >
                    <source src={item.videoUrl} type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3">
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-indigo-100">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="saas-section bg-white">
        <div className="saas-container text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Buy Credits or
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Go Unlimited
            </span>{" "}
            ✨
          </h2>

          <div className="mt-8 inline-flex rounded-full border border-gray-200 bg-gray-100 p-1.5">
            {(
              [
                { key: "credits", label: "Credits Only", icon: "◌" },
                { key: "subscription", label: "Subscription", icon: "↻" },
                { key: "lifetime", label: "Lifetime", icon: "∞" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setPricingTab(tab.key)}
                className={`px-5 sm:px-7 h-11 rounded-full text-sm font-semibold transition-all ${
                  pricingTab === tab.key
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_6px_16px_rgba(79,70,229,0.25)]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 mx-auto max-w-4xl rounded-full bg-gray-100 text-gray-600 px-5 py-3 text-sm">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {pricingConfig[pricingTab].benefits.map((benefit, idx) => (
                <div key={benefit} className="flex items-center gap-3">
                  {idx > 0 && <span className="hidden sm:inline text-gray-300">|</span>}
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-10 grid gap-5 max-w-5xl mx-auto ${
              pricingConfig[pricingTab].plans.length === 3
                ? "md:grid-cols-3"
                : pricingConfig[pricingTab].plans.length === 2
                  ? "md:grid-cols-2 md:max-w-3xl"
                  : "md:grid-cols-1 md:max-w-xl"
            }`}
          >
            {pricingConfig[pricingTab].plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 text-center transition-all duration-200 ${
                  plan.highlighted
                    ? "border-transparent bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)]"
                    : "border-gray-200 bg-white text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                }`}
              >
                <p
                  className={`text-base font-semibold ${
                    plan.highlighted ? "text-indigo-100" : "text-indigo-600"
                  }`}
                >
                  {plan.icon}
                </p>
                <h3
                  className={`mt-2 text-2xl font-bold ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-4 text-4xl font-bold leading-none ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₹{plan.priceInr}
                </p>
                <p
                  className={`mt-2 text-xl ${
                    plan.highlighted ? "text-indigo-100" : "text-gray-500"
                  }`}
                >
                  (${plan.priceUsd})
                </p>
                <p
                  className={`mt-5 text-lg ${
                    plan.highlighted ? "text-indigo-50" : "text-gray-600"
                  }`}
                >
                  {plan.detail}
                </p>
                <Link
                  to="/signup"
                  className={`mt-8 w-full ${
                    plan.highlighted ? "saas-btn-secondary" : "saas-btn-primary"
                  }`}
                >
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-10 bg-white">
        <div className="saas-container">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm font-medium">Accepted Payment Methods</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                "Visa",
                "Mastercard",
                "Amex",
                "Apple Pay",
                "Google Pay",
                "UPI",
                "GPay",
                "PhonePe",
              ].map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs sm:text-sm text-gray-600"
                >
                  <span className="text-gray-400">◳</span>
                  {method}
                </span>
              ))}
            </div>
            <Link to={tryForFreeRoute} className="saas-btn-primary mt-8 min-w-[210px] justify-center">
              TRY FOR FREE →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-10 bg-[#F5F6FA] border-y border-gray-100">
        <div className="saas-container">
          <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
            <div>
              <p className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">
                Support
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-[1.1] text-gray-900">
                Frequently
                <br />
                Asked
                <br />
                Questions
              </h2>
              <div className="mt-6 rounded-2xl bg-white p-2 border border-gray-200 w-full max-w-[260px]">
                <div className="grid grid-cols-2 gap-2">
                  {(["privacy", "features", "billing", "account"] as FaqCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFaqCategory(cat);
                          setOpenFaqIndex(0);
                        }}
                        className={`h-9 rounded-full text-sm font-medium capitalize transition ${
                          faqCategory === cat
                            ? "bg-white border border-gray-900 text-gray-900 shadow-sm"
                            : "bg-gray-100 text-gray-500 border border-transparent hover:text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {faqByCategory[faqCategory].map((item, idx) => {
                const open = openFaqIndex === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(open ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                    >
                      <span className="text-base md:text-lg leading-snug font-semibold text-gray-900">
                        {item.q}
                      </span>
                      <span
                        className={`text-gray-500 text-xl transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      >
                        ˅
                      </span>
                    </button>
                    {open && (
                      <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                        <p className="pt-3">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="saas-container py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="font-semibold text-gray-900">Orio AI</p>
              <p className="mt-3 text-sm text-gray-600 max-w-xs">
                Your AI-powered interview assistant for better career outcomes.
              </p>
              <p className="mt-3 text-sm text-gray-500">@orioai.official</p>
              <div className="mt-4 flex items-center gap-2.5">
                {socialHandles.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${item.name}`}
                    title={item.name}
                    className="h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 flex items-center justify-center"
                  >
                    {item.icon === "instagram" && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
                      </svg>
                    )}
                    {item.icon === "x" && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.9-6.6L6.2 22H3.1l7.24-8.28L.8 2h6.3l4.43 5.98L18.9 2zm-1.1 18.1h1.72L6.2 3.8H4.4L17.8 20.1z" />
                      </svg>
                    )}
                    {item.icon === "linkedin" && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M4.98 3.5a2.48 2.48 0 1 1 0 4.96 2.48 2.48 0 0 1 0-4.96zM2.75 9h4.46v12H2.75V9zm7.1 0h4.28v1.64h.06c.6-1.12 2.06-2.3 4.24-2.3 4.54 0 5.38 2.98 5.38 6.85V21h-4.46v-5.16c0-1.23-.02-2.82-1.72-2.82-1.73 0-2 1.35-2 2.73V21H9.86V9z" />
                      </svg>
                    )}
                    {item.icon === "youtube" && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M23 12s0-3.4-.43-5.03a2.9 2.9 0 0 0-2.04-2.05C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.53.42A2.9 2.9 0 0 0 1.43 6.97C1 8.6 1 12 1 12s0 3.4.43 5.03a2.9 2.9 0 0 0 2.04 2.05c1.63.42 8.53.42 8.53.42s6.9 0 8.53-.42a2.9 2.9 0 0 0 2.04-2.05C23 15.4 23 12 23 12zm-13.2 3.87V8.13L16.27 12 9.8 15.87z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#features" className="hover:text-gray-900">Compare Tools</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Refunds & Cancellation</a></li>
                <li><a href="#" className="hover:text-gray-900">Delivery Policy</a></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Support</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a href="mailto:support@parakeet.ai" className="hover:text-gray-900">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
            Orio AI is a trademark of OrioAI.
            <br />
            © 2026 OrioAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

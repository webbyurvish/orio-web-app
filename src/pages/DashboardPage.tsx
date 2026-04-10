import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
  matchPath,
} from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { formatCreditsDisplay, useBillingStore } from "../store/billingStore";
import { CHECKOUT_PRODUCTS } from "../billing/plans";
import type { CheckoutProduct } from "../billing/plans";
import { PaymentCheckoutModal } from "../components/PaymentCheckoutModal";
import { resumesApi, type ResumeDto } from "../api/resumes";
import type { ResumeDetailDto } from "../types/resumeStructured";
import NotFoundPage from "./NotFoundPage";
import { DashboardDesktopAppContent } from "./DesktopAppPage";
import { AppRouteFallback } from "../components/AppRouteFallback";
import { LazyMountWhenVisible } from "../components/LazyMountWhenVisible";
import { RevealOnScroll } from "../components/RevealOnScroll";
import {
  NATURAL_QUESTION_TABS,
  SegmentedTabList,
} from "../components/SegmentedTabList";
import { DashboardNotificationBell } from "../components/DashboardNotificationBell";
import { useNotificationsStore } from "../store/notificationsStore";
import { Skeleton, SkeletonText } from "../components/Skeleton";

const ResumeEditorPage = lazy(() => import("./ResumeEditorPage"));
const BrowserSessionPage = lazy(() => import("./BrowserSessionPage"));
import { ResumeParsingModal } from "../components/ResumeParsingModal";
import {
  callSessionsApi,
  type CallSessionDto,
  type CallSessionMessageDto,
} from "../api/callSessions";
import type { AiNotesDto } from "../api/callSessions";
import { verifyStripeCheckoutSession } from "../api/stripePayments";
import { authApi } from "../api/auth";
import { DiscoveryOverlayModal } from "../components/DiscoveryOverlayModal";
import { ThankYouModal } from "../components/ThankYouModal";
import { FeedbackFab } from "../components/FeedbackFab";
import { InfoTooltip } from "../components/InfoTooltip";
import { trackWeb, AnalyticsEvents } from "../analytics/track";
import {
  AZURE_SPEECH_STT_LOCALES,
  DEFAULT_SPEECH_LOCALE,
  normalizeSpeechLocale,
} from "../constants/azureSpeechSttLocales";
import { FEATURE_BROWSER_SESSION_ENABLED } from "../constants/featureFlags";

const SESSIONS_VIEW_TABS = [
  { id: "all" as const, label: "All Sessions" },
  { id: "live" as const, label: "Live" },
  { id: "ended" as const, label: "Ended" },
];

const BUY_CREDITS_SEGMENT_TABS = [
  // Keep identical to LandingPage pricing tabs for 1:1 UX.
  { id: "credits" as const, label: "Credits" },
  { id: "subscription" as const, label: "Subscribe" },
  { id: "lifetime" as const, label: "Lifetime" },
];

const DASHBOARD_PRICING_CONFIG = {
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
        detail: "Unlimited Calls Forever",
        cta: "Get Lifetime",
        highlighted: true,
        badge: "Limited Time Offer",
        subtext: "Best for long-term career growth",
        priceWasInr: "29,999",
        priceWasUsd: "333.21",
      },
    ],
  },
} as const;

function getCheckoutProductForPricing(
  tab: (typeof BUY_CREDITS_SEGMENT_TABS)[number]["id"],
  planName: string,
): CheckoutProduct {
  if (tab === "credits") {
    if (planName === "Basic") return CHECKOUT_PRODUCTS.credits_basic;
    if (planName === "Plus") return CHECKOUT_PRODUCTS.credits_plus;
    return CHECKOUT_PRODUCTS.credits_pro;
  }
  if (tab === "subscription") {
    if (planName === "Monthly") return CHECKOUT_PRODUCTS.sub_monthly;
    return CHECKOUT_PRODUCTS.sub_yearly;
  }
  return CHECKOUT_PRODUCTS.lifetime;
}

function IconHome() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function IconCall() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function IconEnvelope() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function IconChart() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeModalStep, setResumeModalStep] = useState<
    "options" | "upload-pdf"
  >("options");
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSelected, setFileSelected] = useState(false);
  const [uploadingToServer] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualEntryBusy, setManualEntryBusy] = useState(false);
  const [resumeModalError, setResumeModalError] = useState<string | null>(null);
  const [resumesList, setResumesList] = useState<ResumeDto[]>([]);
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  const [deleteSessionTarget, setDeleteSessionTarget] =
    useState<CallSessionDto | null>(null);
  const [deleteSessionBusy, setDeleteSessionBusy] = useState(false);
  const [parsingJob, setParsingJob] = useState<{
    file: File;
    title: string;
  } | null>(null);
  const [parsingExistingId, setParsingExistingId] = useState<string | null>(
    null,
  );
  const [resumeCardMenuId, setResumeCardMenuId] = useState<string | null>(null);
  const [cvsDropActive, setCvsDropActive] = useState(false);
  const cvsDropDragDepth = useRef(0);
  const cvsDropInputRef = useRef<HTMLInputElement>(null);

  const resumeEditorMatch = /^\/dashboard\/cvs\/([^/]+)\/edit$/.exec(
    location.pathname,
  );
  const resumeEditorId = resumeEditorMatch?.[1] ?? null;

  const onParsingComplete = useCallback(
    (detail: ResumeDetailDto) => {
      setParsingJob(null);
      resumesApi
        .list()
        .then(setResumesList)
        .catch(() => setResumesList([]));
      navigate(`/dashboard/cvs/${detail.id}/edit`);
    },
    [navigate],
  );

  useEffect(() => {
    const onTitleUpdated = (e: Event) => {
      const ev = e as CustomEvent<{ id: string; title: string }>;
      if (!ev.detail?.id) return;
      setResumesList((prev) =>
        prev.map((r) => (r.id === ev.detail.id ? { ...r, title: ev.detail.title } : r)),
      );
    };
    window.addEventListener("resume:title-updated", onTitleUpdated);
    return () => window.removeEventListener("resume:title-updated", onTitleUpdated);
  }, []);

  const openCvsQuickUpload = useCallback((file: File) => {
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("File must be 10MB or smaller.");
      return;
    }
    const lower = file.name.toLowerCase();
    const ok =
      lower.endsWith(".pdf") ||
      lower.endsWith(".docx") ||
      file.type === "application/pdf" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!ok) {
      setUploadError("Please use a PDF or DOCX file.");
      return;
    }
    setUploadError(null);
    setResumeFile(file);
    setResumeTitle(
      file.name.replace(/\.[^.]+$/i, "").trim() || "My Resume",
    );
    setResumeModalStep("upload-pdf");
    setShowResumeModal(true);
  }, []);
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [createSessionStep, setCreateSessionStep] = useState(1);
  const [createSessionMode, setCreateSessionMode] = useState<
    "create" | "update"
  >("create");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [createSessionForm, setCreateSessionForm] = useState({
    company: "",
    jobDescription: "",
    resumeId: "",
    language: DEFAULT_SPEECH_LOCALE,
    simpleLanguage: true,
    extraContext: "Keep answers to the point and with a coding example",
    aiModel: "GPT-4.1 Mini",
    saveTranscript: true,
  });
  const [createSessionSubmitting, setCreateSessionSubmitting] = useState(false);
  const [createdSessionIdForLaunch, setCreatedSessionIdForLaunch] = useState<
    string | null
  >(null);
  const [sessionsList, setSessionsList] = useState<CallSessionDto[]>([]);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsNowTick, setSessionsNowTick] = useState(0);
  const [sessionsViewTab, setSessionsViewTab] = useState<
    "all" | "live" | "ended"
  >("all");
  const [sessionsSearchQuery, setSessionsSearchQuery] = useState("");
  const [sessionForPlatformModal, setSessionForPlatformModal] =
    useState<CallSessionDto | null>(null);
  const [conversationModalSession, setConversationModalSession] =
    useState<CallSessionDto | null>(null);
  const [conversationMessages, setConversationMessages] = useState<
    CallSessionMessageDto[]
  >([]);
  const [conversationMessagesLoading, setConversationMessagesLoading] =
    useState(false);
  const [conversationTab, setConversationTab] = useState<
    "transcription" | "ai-notes"
  >("transcription");
  const [conversationAiNotes, setConversationAiNotes] =
    useState<AiNotesDto | null>(null);
  const [conversationAiNotesLoading, setConversationAiNotesLoading] =
    useState(false);
  const [buyCreditsTab, setBuyCreditsTab] = useState<
    "credits" | "subscription" | "lifetime"
  >("credits");
  const [createSessionIsPaid, setCreateSessionIsPaid] = useState(false);
  const [checkoutProduct, setCheckoutProduct] =
    useState<CheckoutProduct | null>(null);
  const [homeNaturalTab, setHomeNaturalTab] = useState<
    "behavioral" | "technical"
  >("behavioral");
  const [showHomeNaturalModal, setShowHomeNaturalModal] = useState(false);
  const billingCredits = useBillingStore((s) => s.credits);
  const billingUnlimited = useBillingStore((s) => s.unlimitedAccess);
  const billingPlanDisplay = useBillingStore((s) => s.planDisplay);
  const setCreditsFromServer = useBillingStore((s) => s.setCreditsFromServer);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "User";
  const userEmail = user?.email ?? "";

  const userInitials = useMemo(() => {
    const a = user?.firstName?.trim()?.[0];
    const b = user?.lastName?.trim()?.[0];
    if (a && b) return `${a}${b}`.toUpperCase();
    const fn = user?.firstName?.trim() || "";
    if (fn.length >= 2) return fn.slice(0, 2).toUpperCase();
    if (a) return `${a}${a}`.toUpperCase();
    const email = user?.email?.trim();
    if (email?.length) return email.slice(0, 2).toUpperCase();
    return "U";
  }, [user?.firstName, user?.lastName, user?.email]);

  // Server applies All/Live/Ended; we only filter by search on the current page here.
  const filteredSessionsList = useMemo(() => {
    let list = sessionsList;
    const q = sessionsSearchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          (s.title || "").toLowerCase().includes(q) ||
          (s.description || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [sessionsList, sessionsSearchQuery]);

  const sessionAiUsageClass = (n: number) => {
    if (!Number.isFinite(n)) return "text-slate-400";
    if (n >= 80) return "text-teal-400";
    if (n >= 40) return "text-violet-300";
    return "text-amber-300";
  };

  const homeNaturalContent = {
    behavioral: {
      question: "Tell me about a time you handled a conflict in your team.",
      normal:
        '"In my previous role, I encountered a situation where two team members had diverging opinions regarding a technical approach. I facilitated a structured discussion to align on objectives and move forward..."',
      natural:
        '"Yeah so this happened in my last project. Two devs had different opinions on the approach, so I set up a quick sync, listed pros/cons, aligned on what fits our timeline, and we shipped without drama."',
      normalNote: "Sounds rehearsed, not authentic",
      naturalNote: "Real, relatable, how people actually speak",
    },
    technical: {
      question: "What is the difference between SQL and NoSQL?",
      normal:
        '"SQL databases are relational systems that use structured query language and predefined schemas. In contrast, NoSQL databases are non-relational and provide flexible schemas..."',
      natural:
        '"SQL is like tables with a fixed structure. NoSQL is more flexible (often JSON-like). SQL is great for strict relationships; NoSQL helps when your data shape changes or you need scale."',
      normalNote: "Too formal, sounds like textbook",
      naturalNote: "Clear, natural, like talking to a colleague",
    },
  } as const;

  useEffect(() => {
    if (user?.callCredits == null) return;
    setCreditsFromServer(user.callCredits);
  }, [user?.callCredits]);

  // Refresh persisted user credits once on dashboard entry so refresh doesn't lose post-purchase credits.
  const didRefreshMeRef = useRef(false);
  useEffect(() => {
    if (didRefreshMeRef.current) return;
    if (!useAuthStore.getState().isAuthenticated) return;
    didRefreshMeRef.current = true;
    void (async () => {
      try {
        const me = await authApi.getCurrentUser();
        setUser(me);
        setCreditsFromServer(me.callCredits ?? 0);
      } catch {
        /* ignore */
      }
    })();
  }, [setUser, setCreditsFromServer]);

  const openPaidSessionFlow = () => {
    // 30 mins = 0.5 credits. If user has no credits (and no unlimited), show modal instead.
    if (!billingUnlimited && billingCredits < 0.5) {
      setShowOutOfCreditsModal(true);
      return;
    }
    // Open the same paid-session modal flow regardless of current route.
    resumesApi
      .list()
      .then(setResumesList)
      .catch(() => setResumesList([]));
    setCreateSessionIsPaid(true);
    setShowCreateSessionModal(true);
    setCreateSessionStep(1);
    setCreateSessionMode("create");
    setEditingSessionId(null);
    setCreatedSessionIdForLaunch(null);
    // Ensure the user lands on the Call Sessions page (so the background matches expectations).
    if (!location.pathname.startsWith("/dashboard/call-sessions")) {
      navigate("/dashboard/call-sessions");
    }
  };

  const mainNavItems = [
    { id: "home", label: "Home", Icon: IconHome },
    { id: "call-sessions", label: "Call Sessions", Icon: IconCall },
    { id: "cvs", label: "CVs / Resumes", Icon: IconClipboard },
  ];

  // Keep activeNav in sync with the URL
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.startsWith("/dashboard/call-sessions")) {
      setActiveNav("call-sessions");
    } else if (pathname.startsWith("/dashboard/desktop-app")) {
      setActiveNav("desktop-app");
    } else if (pathname.startsWith("/dashboard/cvs")) {
      setActiveNav("cvs");
    } else if (pathname.startsWith("/dashboard/profile")) {
      setActiveNav("profile");
    } else if (
      pathname.startsWith("/dashboard/buyCredits") ||
      pathname.startsWith("/dashboard/purchase")
    ) {
      setActiveNav("buy-credits");
    } else {
      setActiveNav("home");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      trackWeb(AnalyticsEvents.DashboardViewed, { path: location.pathname });
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Sync buyCreditsTab from URL when on buy credits page
  useEffect(() => {
    if (activeNav !== "buy-credits") return;
    const tab = searchParams.get("tab");
    if (tab === "subscription" || tab === "lifetime" || tab === "credits") {
      setBuyCreditsTab(tab);
    } else {
      setBuyCreditsTab("credits");
      // Canonical URL: ensure we have ?tab= when on buyCredits or redirect old /purchase to /buyCredits
      if (location.pathname.startsWith("/dashboard/purchase")) {
        navigate("/dashboard/buyCredits?tab=credits", { replace: true });
      } else if (!tab) {
        setSearchParams({ tab: "credits" }, { replace: true });
      }
    }
  }, [activeNav, searchParams, location.pathname, navigate, setSearchParams]);

  // After Stripe Checkout redirect: verify session once, update billing store, clean URL.
  useEffect(() => {
    if (activeNav !== "buy-credits") return;
    const pay = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");
    if (pay !== "success" || !sessionId) return;

    const key = `orio_stripe_ok_${sessionId}`;
    const stripSuccessParams = () => {
      const next = new URLSearchParams(searchParams);
      next.delete("payment");
      next.delete("session_id");
      setSearchParams(next, { replace: true });
    };

    if (
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(key) === "1"
    ) {
      stripSuccessParams();
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const r = await verifyStripeCheckoutSession(sessionId);
        if (cancelled) return;
        if (r.paid && r.productId && CHECKOUT_PRODUCTS[r.productId]) {
          useBillingStore
            .getState()
            .applySuccessfulPurchase(CHECKOUT_PRODUCTS[r.productId]);
          if (typeof r.creditsBalance === "number") {
            useBillingStore.getState().setCreditsFromServer(r.creditsBalance);
          }
          // Refresh persisted auth user so a full page refresh keeps the latest credits.
          try {
            const me = await authApi.getCurrentUser();
            setUser(me);
            setCreditsFromServer(me.callCredits ?? 0);
          } catch {
            /* ignore */
          }
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.setItem(key, "1");
          }
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) stripSuccessParams();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeNav, searchParams, setSearchParams]);

  useEffect(() => {
    if (activeNav !== "buy-credits") return;
    if (searchParams.get("payment") !== "cancelled") return;
    const next = new URLSearchParams(searchParams);
    next.delete("payment");
    setSearchParams(next, { replace: true });
  }, [activeNav, searchParams, setSearchParams]);

  // When navigated to call-sessions with state to open create session modal, open it and clear state
  useEffect(() => {
    const state = location.state as {
      openCreateSessionModal?: "free" | "paid";
      openDiscoveryModal?: boolean;
    } | null;
    if (
      location.pathname.startsWith("/dashboard/call-sessions") &&
      state?.openCreateSessionModal
    ) {
      setCreateSessionIsPaid(state.openCreateSessionModal === "paid");
      resumesApi
        .list()
        .then(setResumesList)
        .catch(() => setResumesList([]));
      setShowCreateSessionModal(true);
      setCreateSessionStep(1);
      setCreateSessionMode("create");
      setEditingSessionId(null);
      setCreatedSessionIdForLaunch(null);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const state = location.state as { openDiscoveryModal?: boolean } | null;
    if (!user) return;
    if (user.hasDiscoveryResponse === true) return;

    if (state?.openDiscoveryModal) {
      setShowDiscoveryModal(true);
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    // Safety: prompt once per tab/session.
    const key = "orio-discovery-prompted";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      setShowDiscoveryModal(true);
    }
  }, [location.pathname, location.state, navigate, user]);

  // Fetch resumes when on CVs tab
  useEffect(() => {
    if (activeNav !== "cvs") return;
    resumesApi
      .list()
      .then(setResumesList)
      .catch(() => setResumesList([]));
  }, [activeNav]);

  // If user returns from editor → list, refresh once so renamed titles show immediately.
  const prevPathRef = useRef<string>(location.pathname);
  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = location.pathname;
    const now = location.pathname;
    if (now !== "/dashboard/cvs" && now !== "/dashboard/cvs/") return;
    if (!/^\/dashboard\/cvs\/[^/]+\/edit\/?$/.test(prev)) return;
    resumesApi
      .list()
      .then(setResumesList)
      .catch(() => setResumesList([]));
  }, [location.pathname]);

  useEffect(() => {
    if (activeNav !== "cvs") setResumeCardMenuId(null);
  }, [activeNav]);

  useEffect(() => {
    if (!resumeCardMenuId) return;
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(`[data-resume-card-menu="${resumeCardMenuId}"]`)) return;
      setResumeCardMenuId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [resumeCardMenuId]);

  // Search is client-side on the loaded page — reset to page 1 when the query changes.
  useEffect(() => {
    setSessionsPage(1);
  }, [sessionsSearchQuery]);

  // Fetch call sessions when on Call Sessions tab
  useEffect(() => {
    if (activeNav !== "call-sessions") return;
    setSessionsLoading(true);
    callSessionsApi
      .list(sessionsPage, 10, sessionsViewTab)
      .then((r) => {
        setSessionsList(r.items);
        setSessionsTotal(r.totalCount);
      })
      .catch(() => {
        setSessionsList([]);
        setSessionsTotal(0);
      })
      .finally(() => setSessionsLoading(false));
  }, [activeNav, sessionsPage, sessionsViewTab]);

  // Keep Ends In countdown live while on call-sessions.
  useEffect(() => {
    if (activeNav !== "call-sessions") return;
    const t = window.setInterval(() => setSessionsNowTick((x) => x + 1), 1000);
    return () => window.clearInterval(t);
  }, [activeNav]);

  // Fetch conversation messages when conversation modal is opened
  useEffect(() => {
    if (!conversationModalSession) {
      setConversationMessages([]);
      setConversationAiNotes(null);
      setConversationTab("transcription");
      return;
    }
    setConversationMessagesLoading(true);
    callSessionsApi
      .getMessages(conversationModalSession.id)
      .then(setConversationMessages)
      .catch(() => setConversationMessages([]))
      .finally(() => setConversationMessagesLoading(false));
  }, [conversationModalSession]);

  useEffect(() => {
    if (!conversationModalSession) return;
    const session = conversationModalSession;
    setConversationAiNotesLoading(true);
    callSessionsApi
      .getAiNotes(session.id)
      .then((data) => {
        setConversationAiNotes(data);
        if (data.notes?.trim()) {
          useNotificationsStore.getState().add({
            kind: "summary",
            title: "Your interview summary is ready",
            body: `AI notes are available for “${session.title || "your session"}”. Open the conversation to read them.`,
            dedupeKey: `summary-${session.id}`,
            href: "/dashboard/call-sessions",
          });
        }
      })
      .catch(() => setConversationAiNotes(null))
      .finally(() => setConversationAiNotesLoading(false));
  }, [conversationModalSession]);

  // Warn once per browser session when credits drop into the “running low” band.
  useEffect(() => {
    if (billingUnlimited) return;
    if (billingCredits >= 1 || billingCredits <= 0) {
      if (billingCredits >= 1) {
        try {
          sessionStorage.removeItem("orio_low_credit_warned");
        } catch {
          /* ignore */
        }
      }
      return;
    }
    try {
      if (sessionStorage.getItem("orio_low_credit_warned") === "1") return;
      sessionStorage.setItem("orio_low_credit_warned", "1");
    } catch {
      /* ignore */
    }
    useNotificationsStore.getState().add({
      kind: "credits",
      title: "Call credits running low",
      body: `You have ${formatCreditsDisplay(billingCredits)} credit${billingCredits === 1 ? "" : "s"} left. Consider topping up before your next session.`,
      href: "/dashboard/buyCredits?tab=credits",
      dedupeKey: "low-credits-session",
    });
  }, [billingCredits, billingUnlimited]);

  // When a file is selected, simulate upload progress then show selected state
  useEffect(() => {
    if (!resumeFile) {
      setUploadProgress(0);
      setFileSelected(false);
      return;
    }
    setUploadProgress(0);
    setFileSelected(false);
    const steps = [20, 50, 80, 100];
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      if (i <= steps.length) {
        setUploadProgress(steps[i - 1] ?? 100);
      }
      if (i >= steps.length) {
        clearInterval(t);
        setFileSelected(true);
        setResumeTitle((prev) =>
          prev === "My Resume" ? resumeFile.name : prev,
        );
      }
    }, 200);
    return () => clearInterval(t);
  }, [resumeFile]);

  const openUpdateSessionModal = (s: CallSessionDto) => {
    resumesApi
      .list()
      .then(setResumesList)
      .catch(() => setResumesList([]));
    setCreateSessionForm((f) => ({
      ...f,
      company: s.title ?? "",
      jobDescription: s.description ?? "",
      resumeId: s.resumeId ?? "",
      language: normalizeSpeechLocale(s.language) || DEFAULT_SPEECH_LOCALE,
      simpleLanguage: s.simpleLanguage,
      extraContext:
        s.extraContext || "Keep answers to the point and with a coding example",
      aiModel: s.aiModel || "GPT-4.1 Mini",
      saveTranscript: s.saveTranscript,
    }));
    setCreateSessionMode("update");
    setEditingSessionId(s.id);
    setShowCreateSessionModal(true);
    setCreateSessionStep(1);
  };

  const closeCreateSessionModal = () => {
    setShowCreateSessionModal(false);
    setCreateSessionStep(1);
    setCreateSessionMode("create");
    setEditingSessionId(null);
    setCreatedSessionIdForLaunch(null);
    setCreateSessionIsPaid(false);
    setCreateSessionForm({
      company: "",
      jobDescription: "",
      resumeId: "",
      language: DEFAULT_SPEECH_LOCALE,
      simpleLanguage: true,
      extraContext: "Keep answers to the point and with a coding example",
      aiModel: "GPT-4.1 Mini",
      saveTranscript: true,
    });
  };

  const handleCreateFreeSession = async () => {
    setCreateSessionSubmitting(true);
    try {
      const created = await callSessionsApi.create({
        title: createSessionForm.company,
        description: createSessionForm.jobDescription,
        resumeId: createSessionForm.resumeId || undefined,
        language: createSessionForm.language,
        simpleLanguage: createSessionForm.simpleLanguage,
        extraContext: createSessionForm.extraContext,
        aiModel: createSessionForm.aiModel,
        saveTranscript: createSessionForm.saveTranscript,
        isFreeSession: !createSessionIsPaid,
      });
      setCreatedSessionIdForLaunch(created.id);
      setCreateSessionStep(5);
      useNotificationsStore.getState().add({
        kind: "session",
        title: createSessionIsPaid ? "Paid session created" : "Free session created",
        body: `“${createSessionForm.company || created.title || "Session"}” is ready. Connect from desktop or browser when you start.`,
        href: "/dashboard/call-sessions",
      });
    } finally {
      setCreateSessionSubmitting(false);
    }
  };

  const handleUpdateSession = async () => {
    if (!editingSessionId) return;
    setCreateSessionSubmitting(true);
    try {
      await callSessionsApi.update(editingSessionId, {
        title: createSessionForm.company,
        description: createSessionForm.jobDescription,
        resumeId: createSessionForm.resumeId || undefined,
        language: createSessionForm.language,
        simpleLanguage: createSessionForm.simpleLanguage,
        extraContext: createSessionForm.extraContext,
        aiModel: createSessionForm.aiModel,
        saveTranscript: createSessionForm.saveTranscript,
      });

      closeCreateSessionModal();
      if (activeNav === "call-sessions") {
        const r = await callSessionsApi.list(sessionsPage, 10);
        setSessionsList(r.items);
        setSessionsTotal(r.totalCount);
      }
      useNotificationsStore.getState().add({
        kind: "session",
        title: "Session updated",
        body: `Your changes to “${createSessionForm.company}” were saved.`,
        href: "/dashboard/call-sessions",
      });
    } finally {
      setCreateSessionSubmitting(false);
    }
  };

  const finishChoosePlatform = () => {
    closeCreateSessionModal();
    setActiveNav("call-sessions");
    setSessionsPage(1);
    callSessionsApi
      .list(1, 10, sessionsViewTab)
      .then((r) => {
        setSessionsList(r.items);
        setSessionsTotal(r.totalCount);
      })
      .catch(() => {});
  };

  /** Build orioai:// URL and navigate so the installed desktop app opens with this session (and token). */
  const launchDesktopApp = (
    sessionId: string,
    resumeId?: string | null,
    language?: string | null,
  ) => {
    // Desktop app needs an absolute URL. In production we serve the dashboard on the VM and proxy /api to the API container.
    // So we pass the dashboard origin + "/api/" (works on both localhost dev and VM prod).
    const apiBase = `${window.location.origin.replace(/\/$/, "")}/api/`;
    const params = new URLSearchParams({ sessionId, apiBaseUrl: apiBase });
    if (resumeId) params.set("resumeId", resumeId);
    const lang = (language ?? "").trim();
    if (lang) params.set("language", lang);
    const url = `orioai://start?${params.toString()}`;
    window.location.href = url;
  };

  const closeResumeModal = () => {
    setShowResumeModal(false);
    setResumeModalStep("options");
    setResumeFile(null);
    setResumeTitle("My Resume");
    setUploadProgress(0);
    setFileSelected(false);
    setUploadSuccess(null);
    setUploadError(null);
    setManualEntryBusy(false);
    setResumeModalError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveResumeFile = () => {
    setResumeFile(null);
    setFileSelected(false);
    setUploadProgress(0);
    setResumeTitle("My Resume");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteResume = async (id: string) => {
    const prev = resumesList;
    setResumesList((p) => p.filter((r) => r.id !== id));
    try {
      await resumesApi.delete(id);
    } catch {
      setResumesList(prev);
    }
  };

  const isSidebarExpanded = true;

  const navigateFromSidebar = (path: string) => {
    setMobileSidebarOpen(false);
    navigate(path);
  };

  const browserSessionPathMatch = useMemo(
    () =>
      matchPath(
        { path: "/dashboard/browser-session/:sessionId", end: true },
        location.pathname,
      ),
    [location.pathname],
  );

  if (!FEATURE_BROWSER_SESSION_ENABLED && browserSessionPathMatch) {
    return <Navigate to="/dashboard/call-sessions" replace />;
  }

  const isDashboardPathValid = useMemo(() => {
    const pathname = location.pathname;
    if (pathname === "/dashboard" || pathname === "/dashboard/") return true;
    if (pathname.startsWith("/dashboard/call-sessions")) return true;
    if (pathname.startsWith("/dashboard/desktop-app")) return true;
    if (pathname.startsWith("/dashboard/profile")) return true;
    if (pathname.startsWith("/dashboard/buyCredits")) return true;
    if (pathname.startsWith("/dashboard/purchase")) return true;
    if (
      FEATURE_BROWSER_SESSION_ENABLED &&
      matchPath(
        { path: "/dashboard/browser-session/:sessionId", end: true },
        pathname,
      )
    )
      return true;
    if (pathname.startsWith("/dashboard/cvs")) {
      if (pathname === "/dashboard/cvs" || pathname === "/dashboard/cvs/")
        return true;
      return /^\/dashboard\/cvs\/[^/]+\/edit\/?$/.test(pathname);
    }
    return false;
  }, [location.pathname]);

  const browserSessionId = FEATURE_BROWSER_SESSION_ENABLED
    ? browserSessionPathMatch?.params?.sessionId
    : undefined;

  if (!isDashboardPathValid) {
    return (
      <div className="min-h-dvh orio-workspace-bg">
        <NotFoundPage scope="dashboard" />
      </div>
    );
  }

  if (browserSessionId) {
    return (
      <div className="orio-workspace-bg relative h-dvh max-h-dvh min-h-0 overflow-hidden">
        <Suspense fallback={<AppRouteFallback />}>
          <BrowserSessionPage sessionId={browserSessionId} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="orio-workspace-bg relative flex h-dvh max-h-dvh min-h-0 overflow-hidden">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      {/* Sidebar - Smeed AI style */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-white/10 bg-[var(--orio-elevated)]/92 backdrop-blur-xl transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-full lg:max-h-dvh lg:min-h-0 lg:translate-x-0 lg:z-auto lg:w-64`}
      >
        {/* Logo */}
        <div className="flex min-h-14 items-center gap-2.5 border-b border-white/10 px-3 sm:px-4">
          <Link
            to="/"
            onClick={() => {
              setMobileSidebarOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 min-w-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-teal-500/25">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8 2 6 5 6 8c0 2 1 4 2 5l-2 6h12l-2-6c1-1 2-3 2-5 0-3-2-6-6-6zm0 2c2.2 0 4 1.8 4 4 0 1.5-.8 3.2-1.5 4.5L14 18h-4l-.5-5.5C8.8 11.2 8 9.5 8 8c0-2.2 1.8-4 4-4z" />
              </svg>
            </span>
            {isSidebarExpanded && (
              <span className="orio-font-display text-base font-semibold text-slate-100">
                Smeed AI
              </span>
            )}
          </Link>
          <button
            type="button"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {mainNavItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (id === "call-sessions")
                  navigateFromSidebar("/dashboard/call-sessions");
                else if (id === "cvs") navigateFromSidebar("/dashboard/cvs");
                else navigateFromSidebar("/dashboard");
              }}
              className={`w-full flex items-center ${isSidebarExpanded ? "gap-3 px-4 justify-start" : "justify-center px-0"} py-2.5 text-left transition ${activeNav === id ? "border-l-2 border-teal-400/80 bg-teal-500/10 text-slate-100" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}`}
            >
              <span className="shrink-0 text-slate-500">
                <Icon />
              </span>
              {isSidebarExpanded && (
                <span className="text-sm font-medium">{label}</span>
              )}
            </button>
          ))}

          {user?.isAdmin ? (
            <button
              type="button"
              onClick={() => navigateFromSidebar("/admin")}
              className={`w-full flex items-center ${isSidebarExpanded ? "gap-3 px-4 justify-start" : "justify-center px-0"} py-2.5 text-left transition ${
                location.pathname.startsWith("/admin")
                  ? "border-l-2 border-violet-400/80 bg-violet-500/12 text-violet-100"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <span className="shrink-0 text-violet-300">
                <IconChart />
              </span>
              {isSidebarExpanded && (
                <span className="text-sm font-medium">Admin analytics</span>
              )}
            </button>
          ) : null}

          <div className="my-2 border-t border-white/10" />

          <button
            type="button"
            onClick={() => navigateFromSidebar("/dashboard/desktop-app")}
            className={`w-full flex items-center ${isSidebarExpanded ? "gap-3 px-4 justify-start" : "justify-center px-0"} py-2.5 text-left transition ${
              activeNav === "desktop-app"
                ? "border-l-2 border-teal-400/80 bg-teal-500/10 text-slate-100"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            <span className="shrink-0 text-slate-500">
              <IconDownload />
            </span>
            {isSidebarExpanded && (
              <span className="text-sm font-medium">Download Desktop App</span>
            )}
          </button>
          <a
            href="mailto:support@parakeet.ai"
            className={`w-full flex items-center ${isSidebarExpanded ? "gap-3 px-4 justify-start" : "justify-center px-0"} py-2.5 text-left text-slate-400 transition hover:bg-white/5 hover:text-slate-100`}
          >
            <span className="shrink-0">
              <IconEnvelope />
            </span>
            {isSidebarExpanded && (
              <span className="text-sm font-medium">Email Support</span>
            )}
          </a>
        </nav>

        {/* Credits card + user */}
        {isSidebarExpanded && (
          <div className="space-y-4 border-t border-white/10 p-4">
            <div className="orio-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-black/30">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-teal-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-slate-100">
                    Credits
                  </span>
                  <InfoTooltip
                    side="top"
                    label="How credits work"
                    content="Call credits are used for paid sessions (about 0.5 credits per 30 minutes on standard timing). Subscription plans may include unlimited access instead of a balance. Top up anytime from Buy Credits."
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {billingUnlimited ? (
                  <>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 font-semibold">
                      Unlimited calls
                    </span>
                    {billingPlanDisplay ? (
                      <span className="block mt-1 text-xs text-gray-500">
                        Plan: {billingPlanDisplay}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>
                    You have{" "}
                    <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-semibold">
                      {formatCreditsDisplay(billingCredits)}
                    </span>{" "}
                    credits.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => navigate("/dashboard/buyCredits?tab=credits")}
                className="orio-btn-aurora mt-3 w-full !py-2.5 !text-sm hover:scale-[1.02]"
              >
                Buy Credits
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              className="flex w-full items-center gap-2 text-left text-sm text-slate-400 hover:text-slate-100"
            >
              <span className="shrink-0">
                <IconUser />
              </span>
              <span className="truncate">{userEmail}</span>
            </button>
          </div>
        )}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header - Smeed AI Home style (sticky within column; main scrolls below) */}
        <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[var(--orio-elevated)]/88 px-3 py-2 backdrop-blur-xl sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="min-w-0 flex flex-col gap-0.5">
              <h1 className="truncate text-base font-semibold text-slate-100 sm:text-lg">
                {activeNav === "desktop-app"
                  ? "Desktop App"
                  : (mainNavItems.find((i) => i.id === activeNav)?.label ??
                    (activeNav === "profile"
                      ? "Profile"
                      : activeNav === "buy-credits"
                        ? "Plans & billing"
                        : "Home"))}
              </h1>
              {activeNav === "desktop-app" ? (
                <p className="line-clamp-2 text-xs leading-snug text-slate-400 sm:text-sm">
                  Download the companion app for live interviews
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <DashboardNotificationBell />
            {activeNav === "cvs" ? (
              <button
                type="button"
                onClick={() => setShowResumeModal(true)}
                className="rounded-lg bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-teal-500/20 hover:brightness-110"
              >
                Upload Resume
              </button>
            ) : activeNav === "profile" ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard/call-sessions", {
                      state: { openCreateSessionModal: "free" },
                    })
                  }
                  className="hidden rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 sm:inline-flex md:px-4 sm:text-sm"
                >
                  Start Free Session
                </button>
                <button
                  type="button"
                  onClick={openPaidSessionFlow}
                  className="rounded-lg bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 px-3 py-2 text-xs font-medium text-white shadow-md shadow-teal-500/20 hover:brightness-110 md:px-4 sm:text-sm"
                >
                  Start Session
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-violet-500 to-fuchsia-600 text-xs font-bold text-white shadow-md shadow-teal-500/15 ring-1 ring-white/10 transition hover:brightness-110"
              title="Profile"
              aria-label="Open profile"
            >
              {userInitials}
            </button>
          </div>
        </header>

        {/* Main content — id used by ScrollToTop when route changes */}
        <main
          id="dashboard-main-scroll"
          className="orio-app-scroll flex min-h-0 flex-1 flex-col overflow-auto overscroll-y-contain bg-[var(--orio-void)]/35"
        >
          {resumeEditorId ? (
            <Suspense
              fallback={
                <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 md:p-8">
                  <div className="orio-panel rounded-2xl p-5 md:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <Skeleton className="h-5 w-44" rounded="full" />
                      <Skeleton className="h-9 w-24" rounded="full" />
                    </div>
                    <div className="mt-5 grid grid-cols-12 gap-4">
                      <div className="col-span-12 lg:col-span-8 space-y-3">
                        <Skeleton className="h-12 w-full rounded-2xl" />
                        <Skeleton className="h-10 w-full rounded-2xl" />
                        <Skeleton className="h-10 w-full rounded-2xl" />
                        <Skeleton className="h-56 w-full rounded-2xl" />
                      </div>
                      <div className="col-span-12 lg:col-span-4 space-y-3">
                        <Skeleton className="h-36 w-full rounded-2xl" />
                        <Skeleton className="h-44 w-full rounded-2xl" />
                        <Skeleton className="h-28 w-full rounded-2xl" />
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <RevealOnScroll key={resumeEditorId}>
                <ResumeEditorPage
                  resumeId={resumeEditorId}
                  onBack={() => navigate("/dashboard/cvs")}
                />
              </RevealOnScroll>
            </Suspense>
          ) : activeNav === "home" ? (
            <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
              {/* Greeting */}
              <h2 className="text-2xl font-bold text-gray-900 mt-2 text-center">
                Hi, {user?.firstName || displayName.split(" ")[0] || "User"} 👋
              </h2>

              {/* Step cards - horizontal flow with bold arrows, uniform height */}
              <div className="mt-8 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-3">
                {[
                  {
                    id: "cvs",
                    title: "Optional: Resume",
                    emoji: "📄",
                    desc: "Upload your resume so Smeed AI can generate custom answers to the interview questions.",
                    btn: "Upload Resume",
                    primary: false,
                  },
                  {
                    id: "home",
                    title: "Step 1: Free Session",
                    emoji: "⏰",
                    desc: "See how easy Smeed AI is to use. Free Sessions are free and limited to 10 minutes.",
                    btn: "Create Session",
                    primary: false,
                  },
                  {
                    id: "buy-credits",
                    title: "Step 2: Buy Credits",
                    emoji: "💳",
                    desc: "Buy credits to use for the real interview or get unlimited access to all features by subscribing.",
                    btn: "Purchase",
                    primary: false,
                  },
                  {
                    id: "home",
                    title: "Step 3: Real Interview",
                    emoji: "🌿",
                    desc: "Use Smeed AI for a real interview to get the job you have always dreamed of.",
                    btn: "Start",
                    primary: true,
                  },
                ].map((card, i) => (
                  <RevealOnScroll
                    key={i}
                    delay={i * 85}
                    className="flex items-stretch gap-2 flex-1 min-w-0"
                  >
                    <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                      <h3 className="text-base font-bold text-gray-900">
                        {card.title} {card.emoji}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 flex-1 min-h-0">
                        {card.desc}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          card.primary
                            ? openPaidSessionFlow()
                            : card.btn === "Create Session"
                              ? navigate("/dashboard/call-sessions", {
                                  state: { openCreateSessionModal: "free" },
                                })
                              : card.id === "cvs"
                                ? navigate("/dashboard/cvs")
                                : card.id === "buy-credits"
                                  ? navigate(
                                      "/dashboard/buyCredits?tab=credits",
                                    )
                                  : undefined
                        }
                        className={`mt-4 w-full py-2.5 text-sm font-medium rounded-lg border transition shrink-0 ${
                          card.primary
                            ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-700 shadow-[0_0_20px_rgba(139,92,246,0.45)]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {card.btn}
                      </button>
                    </div>
                    {i < 3 && (
                      <span
                        className="hidden lg:inline-flex items-center shrink-0 text-gray-500"
                        aria-hidden
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </RevealOnScroll>
                ))}
              </div>

              {/* Smeed AI at a glance — dark surface so text isn’t remapped to light-on-light under .orio-app */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--orio-elevated)] via-[var(--orio-surface)] to-[#14101c] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6 backdrop-blur-md ring-1 ring-teal-500/10">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-100">
                  <span aria-hidden className="text-lg">
                    ⚡
                  </span>{" "}
                  Smeed AI at a Glance
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Your real-time AI interview assistant that is{" "}
                  <span className="font-semibold text-teal-200">
                    completely invisible
                  </span>{" "}
                  and stealth — interviewers cannot see it.
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                  {[
                    {
                      text: (
                        <>
                          <span className="font-semibold">
                            100% undetectable
                          </span>{" "}
                          — invisible to interviewers, screen shares, and
                          screenshots
                        </>
                      ),
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M12 5c6.5 0 10 7 10 7s-3.5 7-10 7S2 12 2 12s3.5-7 10-7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M4 4l16 16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "Listens to interview questions and gives you instant answers on your screen",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M8 10a4 4 0 1 1 8 0v4a4 4 0 1 1-8 0v-4Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 18v3m-4 0h8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6 12v2a6 6 0 0 0 12 0v-2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "Works with any type of interview — behavioral, coding, system design, HR, and more",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6 7h12a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M9 12h6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "Captures LeetCode-style coding questions being shared with you",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M8 17l-3-3 3-3M16 11l3 3-3 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 7l-4 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "Works with Zoom, Google Meet, Microsoft Teams, and more",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M3 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M15 10l5-3v10l-5-3V10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: (
                        <>
                          <span className="font-semibold">
                            {AZURE_SPEECH_STT_LOCALES.length} languages
                            supported
                          </span>{" "}
                          — pick your locale when you create a session
                        </>
                      ),
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M3 12h18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 3c3 3.5 3 14 0 18-3-4-3-14 0-18Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "Available on Desktop app, Web app, and Mobile",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M8 21h8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 17v4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span
                        className="mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-teal-500/30 bg-teal-500/10 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.08)]"
                        aria-hidden
                      >
                        <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">
                          {item.icon}
                        </span>
                      </span>
                      <span className="leading-6 text-slate-300 [&_span.font-semibold]:text-slate-100">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/call-sessions")}
                    className="text-sm font-semibold text-teal-400 transition hover:text-teal-300 hover:underline"
                  >
                    Learn how to use →
                  </button>
                </div>
              </div>

              {/* Natural Mode — dashboard teaser */}
              <button
                type="button"
                onClick={() => setShowHomeNaturalModal(true)}
                className="group mt-6 w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--orio-elevated)] via-[var(--orio-surface)] to-[#12081a] text-left shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:border-teal-500/25 hover:shadow-[0_24px_60px_rgba(45,212,191,0.08)]"
              >
                <div className="relative flex items-start justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6">
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition group-hover:bg-teal-500/10"
                    aria-hidden
                  />
                  <div className="relative flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/20 to-violet-600/15 text-teal-200 shadow-[0_0_28px_rgba(45,212,191,0.12)]">
                      <svg
                        className="h-6 w-6"
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
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01"
                        />
                      </svg>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="orio-font-display text-xl font-bold leading-tight text-slate-100 sm:text-2xl">
                          Natural Mode
                        </h3>
                        <span className="rounded-full border border-fuchsia-500/35 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fuchsia-200/90">
                          Compare
                        </span>
                      </div>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                        See how answers shift from{" "}
                        <span className="text-slate-500">robotic</span> to{" "}
                        <span className="font-medium text-teal-300/90">
                          interview-ready
                        </span>{" "}
                        — tap for a live side-by-side.
                      </p>
                    </div>
                  </div>
                  <span
                    className="relative mt-1 text-2xl text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-teal-400"
                    aria-hidden
                  >
                    →
                  </span>
                </div>
              </button>
            </div>
          ) : activeNav === "buy-credits" ? (
            <RevealOnScroll key="dashboard-billing">
            <div className="orio-app-scroll flex-1 overflow-auto">
              <section className="py-14 md:py-20">
                <div className="saas-container text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400/80">
                    Pricing
                  </p>
                  <h2 className="orio-font-display mt-3 text-3xl font-bold text-white md:text-5xl">
                    Invest in your offer
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                    Credits, subscription, or lifetime — you choose the runway.
                  </p>

                  <SegmentedTabList
                    className="mx-auto mt-10"
                    value={buyCreditsTab}
                    onChange={(id) => {
                      setBuyCreditsTab(id);
                      setSearchParams(
                        (prev) => {
                          const next = new URLSearchParams(prev);
                          next.set("tab", id);
                          return next;
                        },
                        { replace: true },
                      );
                    }}
                    tabs={BUY_CREDITS_SEGMENT_TABS}
                    variant="pricing"
                    aria-label="Pricing plans"
                  />

                  <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-3 text-xs text-slate-400">
                    {DASHBOARD_PRICING_CONFIG[buyCreditsTab].benefits.map(
                      (b, idx) => (
                        <span key={b} className="flex items-center gap-3">
                          {idx > 0 ? (
                            <span className="text-slate-600">·</span>
                          ) : null}
                          {b}
                        </span>
                      ),
                    )}
                  </div>
                  <p className="mx-auto mt-3 max-w-xl text-center text-[11px] font-medium leading-relaxed text-amber-200/75">
                    Limited-time pricing · Price increasing soon
                  </p>

                  <div
                    key={buyCreditsTab}
                    className={`mx-auto mt-12 grid max-w-5xl items-stretch gap-6 ${
                      DASHBOARD_PRICING_CONFIG[buyCreditsTab].plans.length === 3
                        ? "md:grid-cols-3"
                        : DASHBOARD_PRICING_CONFIG[buyCreditsTab].plans.length ===
                            2
                          ? "md:grid-cols-2"
                          : "max-w-md"
                    }`}
                    style={{
                      animation:
                        "sectionFadeIn 320ms cubic-bezier(0.33, 1, 0.68, 1) both",
                    }}
                  >
                    {DASHBOARD_PRICING_CONFIG[buyCreditsTab].plans.map(
                      (plan) => (
                        <LazyMountWhenVisible
                          key={plan.name}
                          theme="dark"
                          className="min-h-0 h-full"
                        >
                          <div
                            className={`relative flex h-full min-h-[420px] flex-col rounded-[24px] px-8 pb-8 text-center transition-all duration-300 ${
                              plan.highlighted
                                ? "pt-12 orio-glow-ring bg-[#0c0c14]"
                                : "pt-8 border border-white/[0.08] bg-white/[0.02] hover:border-teal-400/20 hover:bg-white/[0.04]"
                            }`}
                          >
                            {"badge" in plan &&
                            (plan.badge === "Best Value" ||
                              plan.badge === "Limited Time Offer") ? (
                              <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-green-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
                                {plan.badge}
                              </span>
                            ) : null}

                            <p className="text-lg text-slate-500">{plan.icon}</p>
                            <h3 className="orio-font-display mt-2 text-2xl font-bold text-white">
                              {plan.name}
                            </h3>
                            <div className="mt-3 flex min-h-[2.75rem] flex-col items-center justify-center gap-0.5">
                              {"priceWasInr" in plan ? (
                                <>
                                  <p className="text-base font-semibold text-slate-500 line-through">
                                    ₹{plan.priceWasInr}
                                  </p>
                                  {"priceWasUsd" in plan ? (
                                    <p className="text-xs text-slate-600 line-through">
                                      ${plan.priceWasUsd}
                                    </p>
                                  ) : null}
                                </>
                              ) : (
                                <div aria-hidden />
                              )}
                            </div>
                            <p className="mt-2 text-4xl font-extrabold text-white">
                              ₹{plan.priceInr}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              ${plan.priceUsd}
                            </p>
                            <div className="mt-4 flex min-h-0 flex-1 flex-col">
                              <p className="text-sm text-slate-400">
                                {plan.detail}
                              </p>
                              <div className="mt-2 min-h-[2.75rem]">
                                {"subtext" in plan && plan.subtext ? (
                                  <p className="text-xs font-medium text-teal-300/80">
                                    {plan.subtext}
                                  </p>
                                ) : null}
                              </div>
                              <div className="flex-1" aria-hidden />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setCheckoutProduct(
                                  getCheckoutProductForPricing(
                                    buyCreditsTab,
                                    plan.name,
                                  ),
                                )
                              }
                              className={`mt-6 flex w-full shrink-0 items-center justify-center rounded-full py-3 text-sm font-bold transition-all duration-300 ${
                                plan.highlighted
                                  ? "orio-btn-aurora"
                                  : "orio-btn-ghost border-teal-400/20"
                              }`}
                            >
                              {plan.cta}
                            </button>
                          </div>
                        </LazyMountWhenVisible>
                      ),
                    )}
                  </div>

                  <div className="mt-12 flex flex-wrap justify-center gap-2">
                    {["Visa", "Mastercard", "UPI", "Apple Pay", "Google Pay"].map(
                      (m) => (
                        <span
                          key={m}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-500"
                        >
                          {m}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </section>
            </div>
            </RevealOnScroll>
          ) : activeNav === "cvs" ? (
            <RevealOnScroll key="dashboard-cvs">
            <div className="mx-auto w-full min-w-0 max-w-3xl px-4 py-8 sm:px-6">
              <div className="mb-6">
                <p className="text-sm text-slate-400">
                  Drop a file below or use <span className="font-semibold text-slate-200">Upload Resume</span> in the header.
                </p>
              </div>

              {uploadError && (
                <div className="mb-6 rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {uploadError}
                  <button
                    type="button"
                    className="ml-3 font-semibold text-red-200 underline decoration-red-200/50 hover:text-white"
                    onClick={() => setUploadError(null)}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {resumesList.map((r) => {
                  const fn = r.fileName.toLowerCase();
                  const formatLabel = fn.endsWith(".docx")
                    ? "DOCX"
                    : fn.endsWith(".orio")
                      ? "Manual"
                      : "PDF";
                  const updated =
                    r.updatedAt && !Number.isNaN(Date.parse(r.updatedAt))
                      ? new Date(r.updatedAt)
                      : new Date(r.createdAt);
                  const tagLine = [
                    formatLabel,
                    r.hasStructuredData ? "Structured profile" : "File backup",
                    r.hasStructuredData
                      ? "Ready for sessions"
                      : "Parse to unlock AI fields",
                  ];
                  const canParse =
                    !r.hasStructuredData &&
                    (fn.endsWith(".pdf") || fn.endsWith(".docx"));
                  const menuOpen = resumeCardMenuId === r.id;

                  return (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-white/10 bg-[var(--orio-elevated)]/70 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition hover:border-teal-500/20 hover:shadow-[0_20px_48px_rgba(0,0,0,0.35)]"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-teal-500/25 bg-gradient-to-br from-teal-500/15 to-violet-600/10 text-teal-200 shadow-inner shadow-black/20">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.75}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-bold text-slate-100">
                                  {r.title}
                                </h3>
                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                                    r.hasStructuredData
                                      ? "border border-teal-500/35 bg-teal-500/15 text-teal-200"
                                      : "border border-white/10 bg-white/[0.06] text-slate-400"
                                  }`}
                                >
                                  {r.hasStructuredData ? "AI-ready" : "Original"}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Updated{" "}
                                {updated.toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>
                            <div
                              className="flex shrink-0 items-center gap-2"
                              data-resume-card-menu={r.id}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setResumeCardMenuId(null);
                                  navigate(`/dashboard/cvs/${r.id}/edit`);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-teal-500/30 hover:bg-white/[0.1] hover:text-white"
                              >
                                <svg
                                  className="h-3.5 w-3.5 text-teal-400/90"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                                Edit
                              </button>
                              <div className="relative">
                                <button
                                  type="button"
                                  id={`resume-menu-trigger-${r.id}`}
                                  onClick={() =>
                                    setResumeCardMenuId((id) =>
                                      id === r.id ? null : r.id,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-slate-300 transition hover:border-violet-500/30 hover:bg-white/[0.08] hover:text-white"
                                  aria-expanded={menuOpen}
                                  aria-haspopup="true"
                                  aria-label="More actions"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden
                                  >
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                  </svg>
                                </button>
                                {menuOpen ? (
                                  <div
                                    id={`resume-menu-${r.id}`}
                                    className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[11rem] overflow-hidden rounded-xl border border-white/10 bg-[#0f0f16] py-1 shadow-2xl shadow-black/60"
                                    role="menu"
                                  >
                                    {canParse ? (
                                      <button
                                        type="button"
                                        role="menuitem"
                                        disabled={parsingExistingId === r.id}
                                        onClick={async () => {
                                          setResumeCardMenuId(null);
                                          setUploadError(null);
                                          setParsingExistingId(r.id);
                                          try {
                                            await resumesApi.parseExisting(
                                              r.id,
                                            );
                                            const list = await resumesApi.list();
                                            setResumesList(list);
                                            navigate(
                                              `/dashboard/cvs/${r.id}/edit`,
                                            );
                                          } catch {
                                            setUploadError(
                                              "AI parsing failed for this file. Try re-uploading with “Upload & parse with AI”.",
                                            );
                                          } finally {
                                            setParsingExistingId(null);
                                          }
                                        }}
                                        className="flex w-full px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-50"
                                      >
                                        {parsingExistingId === r.id
                                          ? "Parsing…"
                                          : "Run AI parser"}
                                      </button>
                                    ) : null}
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        setResumeCardMenuId(null);
                                        setDeleteResumeId(r.id);
                                      }}
                                      className="flex w-full px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                                    >
                                      Delete resume
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                            {tagLine.map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {resumesList.length === 0 ? (
                <p className="mb-6 text-center text-sm text-slate-500">
                  No resumes yet — add your first file with the drop zone below.
                </p>
              ) : null}

              <div className="mt-2">
                <input
                  id="cvs-drop-zone-input"
                  ref={cvsDropInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) openCvsQuickUpload(f);
                    e.target.value = "";
                  }}
                />
                <label
                  htmlFor="cvs-drop-zone-input"
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cvsDropDragDepth.current += 1;
                    setCvsDropActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cvsDropDragDepth.current -= 1;
                    if (cvsDropDragDepth.current <= 0) {
                      cvsDropDragDepth.current = 0;
                      setCvsDropActive(false);
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cvsDropDragDepth.current = 0;
                    setCvsDropActive(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) openCvsQuickUpload(f);
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
                    cvsDropActive
                      ? "border-teal-400/50 bg-teal-500/[0.08] ring-2 ring-teal-500/20"
                      : "border-white/[0.14] bg-white/[0.02] hover:border-teal-500/35 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-teal-500/15 to-violet-600/10 text-teal-200">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <p className="mt-5 text-base font-bold text-slate-100">
                    Drop your resume here
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    PDF or DOCX — max 10MB. Click to browse, or refine the title
                    in the next step.
                  </p>
                </label>
                <p className="mt-4 text-center text-xs text-slate-600">
                  Or{" "}
                  <button
                    type="button"
                    className="font-semibold text-teal-400/90 underline decoration-teal-400/30 hover:text-teal-300"
                    onClick={() => {
                      setShowResumeModal(true);
                      setResumeModalStep("options");
                    }}
                  >
                    open import options
                  </button>{" "}
                  (parse with AI, manual entry).
                </p>
              </div>
            </div>
            </RevealOnScroll>
          ) : activeNav === "call-sessions" ? (
            <RevealOnScroll key="dashboard-sessions">
              <div className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-2 sm:px-6">
                <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                  <SegmentedTabList
                    value={sessionsViewTab}
                    onChange={(v) => {
                      setSessionsPage(1);
                      setSessionsViewTab(v);
                    }}
                    tabs={SESSIONS_VIEW_TABS}
                    variant="dashboard"
                    aria-label="Session filters"
                  />
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 lg:shrink-0">
                    <label className="relative min-w-0 flex-1 sm:min-w-[200px] sm:max-w-xs">
                      <span className="sr-only">Search sessions</span>
                      <svg
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="search"
                        value={sessionsSearchQuery}
                        onChange={(e) => setSessionsSearchQuery(e.target.value)}
                        placeholder="Search…"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => openPaidSessionFlow()}
                      className="orio-btn-aurora inline-flex w-full shrink-0 items-center justify-center gap-2 !px-5 !py-2.5 !text-sm sm:w-auto"
                    >
                      <svg
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M8 5v14l11-7L8 5z" />
                      </svg>
                      New Session
                    </button>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[var(--orio-surface)]/80 shadow-xl shadow-black/20 backdrop-blur-md">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-5 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Title
                          </th>
                          <th className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Description
                          </th>
                          <th className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Ends In
                          </th>
                          <th className="px-4 pb-2 pt-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            AI Usage
                          </th>
                          <th className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Created At
                          </th>
                          <th className="min-w-[7.5rem] px-4 pb-2 pt-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessionsLoading ? (
                          <>
                            {Array.from({ length: 7 }).map((_, i) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <tr key={i} className="border-b border-white/5">
                                <td className="px-5 py-4">
                                  <Skeleton className="h-4 w-44" rounded="full" />
                                </td>
                                <td className="px-4 py-4">
                                  <Skeleton className="h-4 w-64 max-w-[22rem]" rounded="full" />
                                </td>
                                <td className="px-4 py-4">
                                  <Skeleton className="h-4 w-24" rounded="full" />
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <Skeleton className="ml-auto h-4 w-16" rounded="full" />
                                </td>
                                <td className="px-4 py-4">
                                  <Skeleton className="h-4 w-28" rounded="full" />
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <Skeleton className="ml-auto h-9 w-24" rounded="full" />
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : sessionsList.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-5 py-16 text-center text-slate-500"
                            >
                              No sessions yet.
                            </td>
                          </tr>
                        ) : filteredSessionsList.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-5 py-16 text-center text-slate-500"
                            >
                              No sessions match this filter or search.
                            </td>
                          </tr>
                        ) : (
                          filteredSessionsList.map((s) => {
                            void sessionsNowTick;

                            const status = (s.status || "")
                              .trim()
                              .toLowerCase();
                            const isNotActivated =
                              status === "not activated";
                            const endsAtMs = s.endsAt
                              ? Date.parse(s.endsAt)
                              : NaN;
                            const hasEndsAt = Number.isFinite(endsAtMs);
                            const remainingMs = hasEndsAt
                              ? endsAtMs - Date.now()
                              : NaN;
                            const isEnded =
                              status === "ended" ||
                              (hasEndsAt && remainingMs <= 0);

                            let endsInDisplay = s.endsIn;
                            if (isNotActivated) {
                              endsInDisplay = "Not Activated";
                            } else if (isEnded) {
                              endsInDisplay = "Ended";
                            } else if (hasEndsAt) {
                              const totalSeconds = Math.max(
                                0,
                                Math.floor(remainingMs / 1000),
                              );
                              const mm = Math.floor(totalSeconds / 60);
                              const ss = totalSeconds % 60;
                              endsInDisplay = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
                            }

                            const rowClass = isEnded
                              ? "cursor-pointer border-b border-white/5 bg-white/[0.02] text-slate-500 transition hover:bg-white/[0.04]"
                              : "cursor-pointer border-b border-white/5 transition hover:bg-white/[0.06]";
                            return (
                              <tr
                                key={s.id}
                                onClick={() =>
                                  isEnded
                                    ? setConversationModalSession(s)
                                    : setSessionForPlatformModal(s)
                                }
                                className={rowClass}
                              >
                                <td className="max-w-[220px] px-5 py-2.5 pr-4 align-middle">
                                  <div className="flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-teal-500/25 bg-teal-500/10 text-teal-300">
                                      <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                      </svg>
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div
                                        className={`text-[13px] font-semibold leading-tight ${isEnded ? "text-slate-500" : "text-slate-100"}`}
                                      >
                                        {s.title || "—"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={`max-w-xs px-4 py-2.5 align-middle text-[13px] leading-snug ${isEnded ? "text-slate-500" : "text-slate-400"}`}
                                >
                                  <span className="line-clamp-2">
                                    {s.description || "—"}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2.5 align-middle text-[13px]">
                                  <span
                                    className={
                                      isEnded
                                        ? "text-slate-500"
                                        : "text-slate-300"
                                    }
                                  >
                                    {endsInDisplay}
                                  </span>
                                  {s.isFreeSession ? (
                                    <span className="ml-2 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-teal-200/90">
                                      Free
                                    </span>
                                  ) : (
                                    <span className="ml-2 inline-flex items-center rounded-md border border-violet-500/25 bg-violet-500/10 px-1.5 py-0.5 text-[11px] font-medium text-violet-200">
                                      Credits: 0.5
                                    </span>
                                  )}
                                </td>
                                <td
                                  className={`px-4 py-2.5 text-right align-middle text-[13px] tabular-nums font-medium ${sessionAiUsageClass(Number(s.aiUsage))}`}
                                >
                                  {s.aiUsage}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2.5 align-middle text-[13px] text-slate-500">
                                  {new Date(s.createdAt).toLocaleDateString(
                                    undefined,
                                    { dateStyle: "medium" },
                                  )}
                                </td>
                                <td
                                  className="px-4 py-2.5 text-right align-middle"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-end gap-0.5">
                                    <button
                                      type="button"
                                      className={`rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-100 ${isNotActivated ? "cursor-not-allowed opacity-40" : ""}`}
                                      aria-label="Conversation"
                                      onClick={() => {
                                        if (isNotActivated) return;
                                        setConversationModalSession(s);
                                      }}
                                      disabled={isNotActivated}
                                    >
                                      <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isEnded) return;
                                        openUpdateSessionModal(s);
                                      }}
                                      className={`rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-200 ${isEnded ? "cursor-not-allowed opacity-40" : ""}`}
                                      aria-label="Edit"
                                      disabled={isEnded}
                                    >
                                      <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.464 3.964z"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteSessionTarget(s);
                                      }}
                                      className="rounded-md p-1 text-rose-400/90 transition hover:bg-rose-500/15 hover:text-rose-300"
                                      aria-label="Delete session"
                                      title="Delete session"
                                    >
                                      <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {sessionsTotal > 0 ? (
                  <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Page {sessionsPage} • Showing{" "}
                      {(sessionsPage - 1) * 10 + 1}-
                      {Math.min(sessionsPage * 10, sessionsTotal)} of{" "}
                      {sessionsTotal}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={sessionsPage <= 1}
                        onClick={() =>
                          setSessionsPage((p) => Math.max(1, p - 1))
                        }
                        className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={sessionsPage * 10 >= sessionsTotal}
                        onClick={() => setSessionsPage((p) => p + 1)}
                        className="rounded-lg bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-500/15 transition hover:brightness-110 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

            </RevealOnScroll>
          ) : activeNav === "desktop-app" ? (
            <RevealOnScroll key="dashboard-desktop-app">
              <DashboardDesktopAppContent />
            </RevealOnScroll>
          ) : activeNav === "profile" ? (
            <RevealOnScroll key="dashboard-profile">
            <div className="p-8 max-w-5xl mx-auto">
              <div className="space-y-6 mt-2">
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    General
                  </h3>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
                  />
                </section>
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Credits
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard/buyCredits?tab=credits")
                      }
                      className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      Buy Credits →
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {billingUnlimited ? (
                      <>
                        Call credits:{" "}
                        <span className="inline-block px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 font-semibold">
                          Unlimited (plan)
                        </span>
                      </>
                    ) : (
                      <>
                        Call Credits:{" "}
                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-semibold">
                          {formatCreditsDisplay(billingCredits)}
                        </span>
                      </>
                    )}
                  </p>
                </section>
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Subscriptions
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {billingUnlimited && billingPlanDisplay
                      ? `Active (demo): ${billingPlanDisplay} — unlimited calls`
                      : "No active subscription"}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/dashboard/buyCredits?tab=subscription")
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Buy Subscription
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
                  </button>
                </section>
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Lifetime Access
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    No lifetime access purchased
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/dashboard/buyCredits?tab=lifetime")
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Buy Lifetime
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
                  </button>
                </section>
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Delete Account
                    </h3>
                    <button className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500 text-xs font-medium text-white hover:bg-red-600">
                      Delete Account
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Deleting your account will permanently remove your data,
                    credits, active subscriptions, and lifetime plans. This
                    action cannot be undone.
                  </p>
                </section>
              </div>
            </div>
            </RevealOnScroll>
          ) : null}
        </main>

        {/* Upload Resume flyout */}
        {showResumeModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeResumeModal}
              aria-hidden
            />
            <div className="relative z-50 w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">
              <button
                type="button"
                onClick={closeResumeModal}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Upload Resume
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                The contents of the resume will be used to generate interview
                answers.
              </p>
              {resumeModalError ? (
                <p className="mt-3 text-sm text-red-600">{resumeModalError}</p>
              ) : null}

              {resumeModalStep === "options" ? (
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => setResumeModalStep("upload-pdf")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 hover:bg-gray-800"
                  >
                    Upload PDF / DOCX
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
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    disabled={manualEntryBusy}
                    onClick={async () => {
                      setManualEntryBusy(true);
                      setResumeModalError(null);
                      setUploadError(null);
                      try {
                        const detail = await resumesApi.createManual();
                        try {
                          const list = await resumesApi.list();
                          setResumesList(list);
                        } catch {
                          /* list refresh is best-effort */
                        }
                        useNotificationsStore.getState().add({
                          kind: "system",
                          title: "Manual resume started",
                          body: "A new resume draft was created. Fill in your details and save when you’re done.",
                          href: `/dashboard/cvs/${detail.id}/edit`,
                        });
                        closeResumeModal();
                        navigate(`/dashboard/cvs/${detail.id}/edit`);
                      } catch (e) {
                        const message =
                          (e as { response?: { data?: { message?: string } } })
                            ?.response?.data?.message ??
                          "Could not start manual resume. Try again.";
                        setResumeModalError(message);
                        setManualEntryBusy(false);
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 py-2.5 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {manualEntryBusy ? "Opening editor…" : "Input Manually"}
                  </button>

                  <div className="h-px bg-gray-200 my-2" />

                  <button
                    type="button"
                    onClick={() => setResumeModalStep("upload-pdf")}
                    className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium py-2.5 shadow-md"
                  >
                    Upload
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  />

                  {uploadSuccess ? (
                    <div className="py-6 text-center">
                      <p className="text-base font-medium text-violet-600">
                        {uploadSuccess}
                      </p>
                    </div>
                  ) : uploadError ? (
                    <div className="py-4 text-center">
                      <p className="text-base font-medium text-red-600">
                        {uploadError}
                      </p>
                      <button
                        type="button"
                        onClick={() => setUploadError(null)}
                        className="mt-2 text-sm text-gray-600 underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : fileSelected && resumeFile ? (
                    <>
                      <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 py-4 px-4">
                        <span className="text-sm text-gray-600 truncate flex-1 min-w-0">
                          {resumeFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveResumeFile}
                          className="shrink-0 w-9 h-9 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                          aria-label="Remove file"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={resumeTitle}
                          onChange={(e) => setResumeTitle(e.target.value)}
                          placeholder="My Resume"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setResumeModalStep("options");
                              handleRemoveResumeFile();
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium py-2.5 hover:bg-gray-50"
                          >
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
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Back
                          </button>
                          <button
                            type="button"
                            disabled={uploadingToServer}
                            onClick={() => {
                              if (!resumeFile) return;
                              setParsingJob({
                                file: resumeFile,
                                title: resumeTitle.trim() || resumeFile.name,
                              });
                              closeResumeModal();
                            }}
                            className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          !resumeFile && fileInputRef.current?.click()
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !resumeFile &&
                          fileInputRef.current?.click()
                        }
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (!file) return;
                          const ok =
                            file.type === "application/pdf" ||
                            file.type ===
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                            file.name.toLowerCase().endsWith(".pdf") ||
                            file.name.toLowerCase().endsWith(".docx");
                          if (ok) setResumeFile(file);
                        }}
                        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 py-10 px-4 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
                      >
                        <svg
                          className="w-10 h-10 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        {resumeFile && !fileSelected ? (
                          <p className="text-sm text-gray-600 text-center mb-3">
                            Uploading... {uploadProgress}%
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 text-center mb-3">
                              Drop your PDF resume here or click to browse.
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300"
                            >
                              Upload Files
                            </button>
                          </>
                        )}
                      </div>

                      {!resumeFile && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={resumeTitle}
                              onChange={(e) => setResumeTitle(e.target.value)}
                              placeholder="My Resume"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setResumeModalStep("options")}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium py-2.5 hover:bg-gray-50"
                            >
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
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              Back
                            </button>
                            <button
                              type="button"
                              className="flex-1 rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 hover:bg-gray-800"
                              disabled
                            >
                              Upload Resume
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Session modal - 5 steps */}
        {showCreateSessionModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeCreateSessionModal}
              aria-hidden
            />
            <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-visible">
              <button
                type="button"
                onClick={closeCreateSessionModal}
                className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {createSessionStep === 1 && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span>{createSessionIsPaid ? "💳" : "⏰"}</span>
                    {createSessionIsPaid
                      ? "New Session (0.5 credit)"
                      : "Free Session (10 min)"}
                  </h2>
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company{" "}
                        <InfoTooltip
                          content="Company you’re interviewing with. Used to label the session and tailor answers (e.g., tone and examples)."
                          label="About Company"
                        />
                      </label>
                      <input
                        type="text"
                        value={createSessionForm.company}
                        onChange={(e) =>
                          setCreateSessionForm((f) => ({
                            ...f,
                            company: e.target.value,
                          }))
                        }
                        placeholder="Microsoft..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description{" "}
                        <InfoTooltip
                          content="Paste the role description or requirements. The AI uses this to align answers to the role and keywords."
                          label="About Job Description"
                        />
                      </label>
                      <textarea
                        value={createSessionForm.jobDescription}
                        onChange={(e) =>
                          setCreateSessionForm((f) => ({
                            ...f,
                            jobDescription: e.target.value,
                          }))
                        }
                        placeholder="Software Engineer versed in Python, SQL, and AWS..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resume{" "}
                        <InfoTooltip
                          content="Optional. Choose a resume so answers match your real experience (name, projects, skills)."
                          label="About Resume"
                        />{" "}
                        📎
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <select
                            value={createSessionForm.resumeId}
                            onChange={(e) =>
                              setCreateSessionForm((f) => ({
                                ...f,
                                resumeId: e.target.value,
                              }))
                            }
                            className="orio-select w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                          >
                            <option value="">Select resume</option>
                            {resumesList.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.title || r.fileName}
                              </option>
                            ))}
                          </select>
                          <svg
                            className="orio-select-chevron pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        {createSessionForm.resumeId && (
                          <button
                            type="button"
                            onClick={() =>
                              setCreateSessionForm((f) => ({
                                ...f,
                                resumeId: "",
                              }))
                            }
                            className="p-2 rounded text-gray-400 hover:bg-gray-100"
                            aria-label="Clear resume"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeCreateSessionModal}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateSessionStep(2)}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 inline-flex items-center gap-1.5"
                    >
                      Next
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
                    </button>
                  </div>
                </div>
              )}

              {createSessionStep === 2 && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Language & AI Settings
                  </h2>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Language{" "}
                          <InfoTooltip
                            content="Interview language for transcription + answers. Pick what you and the interviewer mostly speak."
                            label="About Language"
                          />
                        </label>
                        <select
                          value={createSessionForm.language}
                          onChange={(e) =>
                            setCreateSessionForm((f) => ({
                              ...f,
                              language: e.target.value,
                            }))
                          }
                          className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-gray-400 outline-none bg-white"
                        >
                          {AZURE_SPEECH_STT_LOCALES.map((opt) => (
                            <option key={opt.locale} value={opt.locale}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Natural Mode{" "}
                          <InfoTooltip
                            content="When ON: answers are easier to speak (simpler words, shorter sentences). When OFF: more detailed/technical wording."
                            label="About Natural Mode"
                          />
                        </label>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={createSessionForm.simpleLanguage}
                          onClick={() =>
                            setCreateSessionForm((f) => ({
                              ...f,
                              simpleLanguage: !f.simpleLanguage,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${createSessionForm.simpleLanguage ? "bg-gray-900" : "bg-gray-200"}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition translate-x-0.5 translate-y-0.5 ${createSessionForm.simpleLanguage ? "translate-x-5" : "translate-x-0"}`}
                          />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extra Context/Instructions{" "}
                        <InfoTooltip
                          content="Optional. Add constraints like ‘be concise’, ‘include a code example’, ‘sound confident’, or ‘answer like a senior engineer’."
                          label="About extra context"
                        />
                      </label>
                      <textarea
                        value={createSessionForm.extraContext}
                        onChange={(e) =>
                          setCreateSessionForm((f) => ({
                            ...f,
                            extraContext: e.target.value,
                          }))
                        }
                        placeholder="Keep answers to the point and with a coding example"
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 outline-none resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AI Model{" "}
                        <InfoTooltip
                          side="top"
                          content="Model used to generate answers. Faster models respond quicker; larger models can be more detailed."
                          label="About AI model"
                        />
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
                        <span className="text-sm font-medium text-gray-900">
                          GPT-4.1 Mini
                        </span>
                        <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs font-medium text-white">
                          Recommended
                        </span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                          Fast
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCreateSessionStep(1)}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 inline-flex items-center gap-1.5"
                    >
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateSessionStep(3)}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 inline-flex items-center gap-1.5"
                    >
                      Next
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
                    </button>
                  </div>
                </div>
              )}

              {createSessionStep === 3 && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Save Transcript
                  </h2>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Save Transcript
                      </label>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={createSessionForm.saveTranscript}
                        onClick={() =>
                          setCreateSessionForm((f) => ({
                            ...f,
                            saveTranscript: !f.saveTranscript,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${createSessionForm.saveTranscript ? "bg-gray-900" : "bg-gray-200"}`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition translate-x-0.5 translate-y-0.5 ${createSessionForm.saveTranscript ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      If you check this option, a transcript of the call session
                      will be saved. You will be able to view the transcript in
                      your dashboard after the call session has ended.
                    </p>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Legal Disclaimer
                      </p>
                      <p className="text-sm text-gray-600">
                        You must comply with all applicable transcribing laws
                        when using this transcription app. Many jurisdictions
                        require consent from all parties being recorded.
                        Transcribing without proper consent may be illegal.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCreateSessionStep(2)}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 inline-flex items-center gap-1.5"
                    >
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateSessionStep(4)}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 inline-flex items-center gap-1.5"
                    >
                      Next
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
                    </button>
                  </div>
                </div>
              )}

              {createSessionStep === 4 && (
                <div className="p-6">
                  {createSessionMode === "update" ? (
                    <>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Ready to Update
                      </h2>
                      <p className="mt-3 text-sm text-gray-600">
                        Review your changes and click &quot;Update Session&quot;
                        to save the changes to your session.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Ready to Create
                      </h2>
                      {createSessionIsPaid ? (
                        <div className="mt-5 space-y-2 text-sm text-gray-700">
                          <p>
                            💳 This session uses <strong>0.5 credit</strong>{" "}
                            from your balance.
                          </p>
                          <p>
                            The timer will not start until you connect your
                            screen sharing.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-5 space-y-2 text-sm text-gray-700">
                          <p>⏰ This is a 10 minute free session.</p>
                          <p>
                            The timer will not start until you connect your
                            screen sharing.
                          </p>
                          <p>
                            You won&apos;t be able to create another free
                            session for the next 12 minutes.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCreateSessionStep(3)}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 inline-flex items-center gap-1.5"
                    >
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={createSessionSubmitting}
                      onClick={
                        createSessionMode === "update"
                          ? handleUpdateSession
                          : handleCreateFreeSession
                      }
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60 inline-flex items-center gap-1.5"
                    >
                      {createSessionMode === "update"
                        ? createSessionSubmitting
                          ? "Updating…"
                          : "Update Session"
                        : createSessionSubmitting
                          ? "Creating…"
                          : createSessionIsPaid
                            ? "Create Session"
                            : "Create Free Session"}
                    </button>
                  </div>
                </div>
              )}

              {createSessionMode !== "update" && createSessionStep === 5 && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Open desktop app
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Launch Smeed AI on your computer to run this call session.
                    Your conversation is saved to this session automatically.
                  </p>
                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (createdSessionIdForLaunch)
                          launchDesktopApp(
                            createdSessionIdForLaunch,
                            createSessionForm.resumeId || undefined,
                            createSessionForm.language,
                          );
                        finishChoosePlatform();
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-3 px-4"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Desktop App
                    </button>
                    <p className="text-center text-xs text-gray-400">
                      If the app doesn’t open, install it from Download Desktop
                      App in the sidebar, then try again.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        finishChoosePlatform();
                        navigate("/dashboard/desktop-app");
                      }}
                      className="w-full flex items-center justify-center gap-2 text-gray-600 underline hover:text-gray-900 text-sm"
                    >
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
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Browser vs Desktop App
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Out of Call Credits modal */}
        {showOutOfCreditsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowOutOfCreditsModal(false)}
              aria-hidden
            />
            <div className="relative z-50 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowOutOfCreditsModal(false)}
                className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Out of Call Credits
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  You don&apos;t have any Call Credits. To start a Call Session
                  you need to get some credits.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOutOfCreditsModal(false)}
                    className="sm:w-40 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOutOfCreditsModal(false);
                      navigate("/dashboard/buyCredits?tab=credits");
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 shadow-sm"
                  >
                    Get Credits
                  </button>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-emerald-300/40 via-sky-200/40 to-emerald-300/40" />
            </div>
          </div>
        )}

        {/* Open desktop app (session row) */}
        {sessionForPlatformModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSessionForPlatformModal(null)}
              aria-hidden
            />
            <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setSessionForPlatformModal(null)}
                className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Open desktop app
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Launch Smeed AI on your computer for this session. Transcript
                  and answers sync to your dashboard.
                </p>
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      launchDesktopApp(
                        sessionForPlatformModal.id,
                        sessionForPlatformModal.resumeId,
                        sessionForPlatformModal.language,
                      );
                      setSessionForPlatformModal(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-3 px-4"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Desktop App
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    If the app doesn’t open, install it from Download Desktop
                    App in the sidebar, then try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSessionForPlatformModal(null);
                      navigate("/dashboard/desktop-app");
                    }}
                    className="w-full flex items-center justify-center gap-2 text-gray-600 underline hover:text-gray-900 text-sm"
                  >
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
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Browser vs Desktop App
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation modal (menu icon on session row) */}
        {conversationModalSession && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setConversationModalSession(null)}
              aria-hidden
            />
            <div className="relative z-50 w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Conversation{" "}
                  {conversationModalSession.title &&
                    `· ${conversationModalSession.title}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setConversationModalSession(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="px-4 pt-3">
                <div className="inline-flex rounded-full border border-gray-200 bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setConversationTab("transcription")}
                    className={`px-4 h-9 rounded-full text-sm font-semibold transition ${
                      conversationTab === "transcription"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Transcription
                  </button>
                  <button
                    type="button"
                    onClick={() => setConversationTab("ai-notes")}
                    className={`px-4 h-9 rounded-full text-sm font-semibold transition ${
                      conversationTab === "ai-notes"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    AI Notes
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {conversationTab === "transcription" ? (
                  <div className="space-y-3">
                    {conversationMessagesLoading ? (
                      <div className="py-2 space-y-3">
                        <div className="mr-8 rounded-lg bg-gray-100 px-3 py-2">
                          <Skeleton className="h-3 w-24" rounded="full" />
                          <div className="mt-2">
                            <SkeletonText lines={3} />
                          </div>
                        </div>
                        <div className="ml-8 rounded-lg bg-gray-900/85 px-3 py-2">
                          <Skeleton className="h-3 w-16 bg-white/15" rounded="full" />
                          <div className="mt-2 space-y-2">
                            <Skeleton className="h-3.5 w-full bg-white/10" rounded="full" />
                            <Skeleton className="h-3.5 w-3/4 bg-white/10" rounded="full" />
                          </div>
                        </div>
                        <div className="mr-8 rounded-lg bg-gray-100 px-3 py-2">
                          <Skeleton className="h-3 w-28" rounded="full" />
                          <div className="mt-2">
                            <SkeletonText lines={4} />
                          </div>
                        </div>
                      </div>
                    ) : conversationMessages.filter((m) => {
                        const r = (m.role || "").toLowerCase()
                        return r === "user" || r === "interviewer" || r === "system"
                      }).length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No conversation yet. Start the desktop app and run a
                        session to see the transcript here.
                      </p>
                    ) : (
                      conversationMessages
                        .filter((m) => {
                          const r = (m.role || "").toLowerCase()
                          return r === "user" || r === "interviewer" || r === "system"
                        })
                        .map((msg) => {
                          const roleNorm = (msg.role || "").toLowerCase()
                          const isYou = roleNorm === "user"
                          const isInterviewer =
                            roleNorm === "interviewer" || roleNorm === "system"
                          const label = isYou ? "You" : isInterviewer ? "Interviewer" : msg.role
                          return (
                        <div
                          key={msg.id}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isYou
                              ? "bg-gray-900 text-white ml-8 mr-0"
                              : "bg-gray-100 text-gray-900 ml-0 mr-8"
                          }`}
                        >
                          <div className="font-medium text-xs opacity-80 mb-0.5">
                            {label}
                          </div>
                          <div className="whitespace-pre-wrap break-words">
                            {msg.content}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </div>
                        </div>
                          )
                        })
                    )}
                  </div>
                ) : (
                  <div>
                    {conversationAiNotesLoading ? (
                      <div className="py-2">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <Skeleton className="h-4 w-36" rounded="full" />
                          <div className="mt-4">
                            <SkeletonText lines={7} />
                          </div>
                        </div>
                      </div>
                    ) : !conversationAiNotes?.notes ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-600">
                          No notes yet. Smeed AI will automatically create notes
                          after the call ends.
                        </p>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!conversationModalSession) return;
                            const sess = conversationModalSession;
                            setConversationAiNotesLoading(true);
                            try {
                              const res = await callSessionsApi.generateAiNotes(
                                sess.id,
                              );
                              setConversationAiNotes(res);
                              const title = sess.title || "your session";
                              useNotificationsStore.getState().add({
                                kind: "summary",
                                title: "Your interview summary is ready",
                                body: `AI notes for “${title}” are ready. Open AI Notes in this session to review.`,
                                dedupeKey: `summary-${sess.id}`,
                                href: "/dashboard/call-sessions",
                              });
                              try {
                                const me = await authApi.getCurrentUser();
                                setUser(me);
                                setCreditsFromServer(me.callCredits ?? 0);
                                if (!useBillingStore.getState().unlimitedAccess) {
                                  const c = me.callCredits ?? 0;
                                  useNotificationsStore.getState().add({
                                    kind: "credits",
                                    title: "Credits after your session",
                                    body: `You have ${formatCreditsDisplay(c)} call credit${c === 1 ? "" : "s"} remaining.`,
                                    dedupeKey: `credits-after-${sess.id}`,
                                    href: "/dashboard/buyCredits?tab=credits",
                                  });
                                }
                              } catch {
                                /* summary notification still shown */
                              }
                            } finally {
                              setConversationAiNotesLoading(false);
                            }
                          }}
                          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 hover:bg-gray-800"
                        >
                          Generate notes
                        </button>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-900">
                          {conversationAiNotes.notes}
                        </pre>
                        {conversationAiNotes.updatedAt ? (
                          <p className="mt-3 text-xs text-gray-500">
                            Updated{" "}
                            {new Date(
                              conversationAiNotes.updatedAt,
                            ).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <PaymentCheckoutModal
          product={checkoutProduct}
          billingTab={buyCreditsTab}
          onClose={() => setCheckoutProduct(null)}
        />

        {/* Natural Mode modal (Home) — Aurora / landing parity */}
        {showHomeNaturalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowHomeNaturalModal(false)}
              aria-hidden
            />
            <div
              className="relative z-50 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#07070c]/98 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="natural-modal-title"
            >
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-teal-500/15 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-600/12 blur-3xl"
                aria-hidden
              />

              <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.06] bg-gradient-to-r from-white/[0.04] to-transparent px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-500/15 to-violet-600/10 text-teal-200 shadow-[0_0_28px_rgba(45,212,191,0.12)]">
                    <svg
                      className="h-6 w-6"
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
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        id="natural-modal-title"
                        className="orio-font-display text-xl font-bold text-white sm:text-2xl"
                      >
                        Natural Mode
                      </h2>
                      <span className="rounded-full border border-fuchsia-500/35 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fuchsia-200/90">
                        Live compare
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Answers that sound like{" "}
                      <span className="font-semibold text-slate-300">you</span>,
                      not a textbook.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHomeNaturalModal(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-400/90">
                  Voice &amp; tone
                </p>
                <h3 className="orio-font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Same question.{" "}
                  <span className="bg-gradient-to-r from-teal-300 via-slate-100 to-violet-300 bg-clip-text text-transparent">
                    Two realities.
                  </span>
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">
                  Most tools sound robotic in live rounds. Natural Mode keeps
                  replies{" "}
                  <span className="font-medium text-slate-300">
                    clear, spoken, and interview-ready
                  </span>
                  — flip the scenario below.
                </p>

                <div className="relative mt-8">
                  <div
                    className="absolute -inset-px rounded-[1.35rem] bg-gradient-to-br from-teal-500/20 via-transparent to-violet-500/20 opacity-70 blur-sm"
                    aria-hidden
                  />
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a10]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <p className="text-xs font-semibold text-slate-500">
                        Pick a round type
                      </p>
                      <SegmentedTabList
                        value={homeNaturalTab}
                        onChange={setHomeNaturalTab}
                        tabs={NATURAL_QUESTION_TABS}
                        variant="natural"
                        className="!bg-black/35"
                        aria-label="Question type"
                      />
                    </div>

                    <div className="px-5 py-5 sm:px-6 sm:py-6">
                      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent px-4 py-4 sm:px-5">
                        <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-teal-400 to-violet-500" />
                        <p className="pl-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Interviewer asks
                        </p>
                        <p className="mt-2 pl-3 text-base font-medium leading-snug text-slate-100 sm:text-lg">
                          &ldquo;{homeNaturalContent[homeNaturalTab].question}
                          &rdquo;
                        </p>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-0">
                        <div className="relative rounded-xl border border-white/[0.08] bg-[#08080e]/95 p-5 md:rounded-r-none md:border-r-0 md:pr-6">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/40 bg-slate-800/50 text-lg">
                              🤖
                            </span>
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Generic AI
                              </p>
                              <p className="text-xs text-slate-600">
                                Template tone
                              </p>
                            </div>
                          </div>
                          <p className="mt-4 text-[14px] leading-relaxed text-slate-400">
                            {homeNaturalContent[homeNaturalTab].normal}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
                            <span
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[10px]"
                              aria-hidden
                            >
                              ✕
                            </span>
                            {homeNaturalContent[homeNaturalTab].normalNote}
                          </div>
                        </div>

                        <div className="relative rounded-xl border border-teal-500/25 bg-gradient-to-br from-teal-500/[0.07] via-[#0c0c12] to-violet-600/[0.08] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:-ml-px md:rounded-l-none md:border-l md:border-teal-500/20">
                          <div
                            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-400/10 blur-2xl"
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
                          <p className="relative mt-4 text-[14px] leading-relaxed text-slate-200">
                            {homeNaturalContent[homeNaturalTab].natural}
                          </p>
                          <div className="relative mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
                            <span
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-200"
                              aria-hidden
                            >
                              ✓
                            </span>
                            {homeNaturalContent[homeNaturalTab].naturalNote}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-5 sm:p-6">
                  <h4 className="orio-font-display text-lg font-bold text-white">
                    Why it works better
                  </h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        title: "Straight to the point",
                        desc: "No unnecessary jargon or filler words",
                        icon: (
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M12 2l2.2 6.3 6.7.3-5.2 4 1.9 6.4L12 15.8 6.4 19l1.9-6.4-5.2-4 6.7-.3L12 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ),
                      },
                      {
                        title: "Sounds like you",
                        desc: "Natural, conversational English",
                        icon: (
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M21 12c0 4.4-4 8-9 8a10 10 0 0 1-4-.9L3 20l1.4-3.7A7.5 7.5 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ),
                      },
                      {
                        title: "Indian examples",
                        desc: "Relatable references when helpful",
                        icon: (
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M12 3v18M3 12h18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7 7h10v10H7V7Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        ),
                      },
                      {
                        title: "Structured answers",
                        desc: "“3 key points” format interviewers love",
                        icon: (
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M7 6h14M7 12h14M7 18h14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M3 6h.01M3 12h.01M3 18h.01"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                      },
                    ].map((f) => (
                      <div
                        key={f.title}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0c0c12]/80 p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-300">
                          {f.icon}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-100">
                            {f.title}
                          </div>
                          <div className="text-sm text-slate-500">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ResumeParsingModal
          open={!!parsingJob}
          file={parsingJob?.file ?? null}
          title={parsingJob?.title ?? ""}
          onClose={() => setParsingJob(null)}
          onComplete={onParsingComplete}
        />

        {/* Delete session confirmation */}
        {deleteSessionTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                if (!deleteSessionBusy) setDeleteSessionTarget(null);
              }}
              aria-hidden
            />
            <div className="relative z-50 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  if (!deleteSessionBusy) setDeleteSessionTarget(null);
                }}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                aria-label="Close"
                disabled={deleteSessionBusy}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete session
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Delete &ldquo;
                {deleteSessionTarget.title?.trim() || "this session"}
                &rdquo;? Transcripts and notes for this call will be removed.
                This cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!deleteSessionBusy) setDeleteSessionTarget(null);
                  }}
                  disabled={deleteSessionBusy}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteSessionBusy}
                  onClick={async () => {
                    const id = deleteSessionTarget.id;
                    setDeleteSessionBusy(true);
                    try {
                      await callSessionsApi.delete(id);
                      if (conversationModalSession?.id === id) {
                        setConversationModalSession(null);
                      }
                      if (sessionForPlatformModal?.id === id) {
                        setSessionForPlatformModal(null);
                      }
                      setDeleteSessionTarget(null);
                      const r = await callSessionsApi.list(
                        sessionsPage,
                        10,
                        sessionsViewTab,
                      );
                      setSessionsList(r.items);
                      setSessionsTotal(r.totalCount);
                      if (
                        r.items.length === 0 &&
                        sessionsPage > 1 &&
                        r.totalCount > 0
                      ) {
                        setSessionsPage((p) => Math.max(1, p - 1));
                      }
                      useNotificationsStore.getState().add({
                        kind: "session",
                        title: "Session deleted",
                        body: "The call session was removed from your list.",
                        href: "/dashboard/call-sessions",
                      });
                    } catch {
                      useNotificationsStore.getState().add({
                        kind: "session",
                        title: "Could not delete session",
                        body: "Please try again in a moment.",
                        href: "/dashboard/call-sessions",
                      });
                    } finally {
                      setDeleteSessionBusy(false);
                    }
                  }}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {deleteSessionBusy ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Resume confirmation modal */}

        {deleteResumeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteResumeId(null)}
              aria-hidden
            />
            <div className="relative z-50 w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">
              <button
                type="button"
                onClick={() => setDeleteResumeId(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Resume
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Are you sure you want to delete this resume? This action cannot
                be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteResumeId(null)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium py-2.5 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (deleteResumeId) {
                      await handleDeleteResume(deleteResumeId);
                      setDeleteResumeId(null);
                    }
                  }}
                  className="flex-1 rounded-lg bg-red-500 text-white text-sm font-medium py-2.5 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <DiscoveryOverlayModal
          open={showDiscoveryModal}
          onClose={() => setShowDiscoveryModal(false)}
          onSubmit={async (data) => {
            await authApi.saveDiscovery(data);
            const me = await authApi.getCurrentUser();
            setUser(me);
            setShowThankYouModal(true);
            window.setTimeout(() => setShowThankYouModal(false), 1800);
          }}
        />
        <ThankYouModal open={showThankYouModal} />
        <FeedbackFab />
      </div>
    </div>
  );
}

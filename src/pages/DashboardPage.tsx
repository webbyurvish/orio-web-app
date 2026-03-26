import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { resumesApi, type ResumeDto } from "../api/resumes";
import {
  callSessionsApi,
  type CallSessionDto,
  type CallSessionMessageDto,
} from "../api/callSessions";

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

function IconChevronDown() {
  return (
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
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function IconInfo() {
  return (
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
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function IconMoreVertical() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("home");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeModalStep, setResumeModalStep] = useState<
    "options" | "upload-pdf"
  >("options");
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSelected, setFileSelected] = useState(false);
  const [uploadingToServer, setUploadingToServer] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumesList, setResumesList] = useState<ResumeDto[]>([]);
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [createSessionStep, setCreateSessionStep] = useState(1);
  const [createSessionMode, setCreateSessionMode] = useState<
    "create" | "update"
  >("create");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [createSessionForm, setCreateSessionForm] = useState({
    company: "",
    jobDescription: "",
    resumeId: "",
    language: "English",
    simpleLanguage: true,
    extraContext: "Keep answers to the point and with a coding example",
    aiModel: "GPT-4.1 Mini",
    saveTranscript: false,
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
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sessionForPlatformModal, setSessionForPlatformModal] =
    useState<CallSessionDto | null>(null);
  const [conversationModalSession, setConversationModalSession] =
    useState<CallSessionDto | null>(null);
  const [conversationMessages, setConversationMessages] = useState<
    CallSessionMessageDto[]
  >([]);
  const [conversationMessagesLoading, setConversationMessagesLoading] =
    useState(false);
  const [buyCreditsTab, setBuyCreditsTab] = useState<
    "credits" | "subscription" | "lifetime"
  >("credits");
  const [createSessionIsPaid, setCreateSessionIsPaid] = useState(false);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "User";
  const userEmail = user?.email ?? "";

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

  // When navigated to call-sessions with state to open create session modal, open it and clear state
  useEffect(() => {
    const state = location.state as {
      openCreateSessionModal?: "free" | "paid";
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

  // Fetch resumes when on CVs tab
  useEffect(() => {
    if (activeNav !== "cvs") return;
    resumesApi
      .list()
      .then(setResumesList)
      .catch(() => setResumesList([]));
  }, [activeNav]);

  // Fetch call sessions when on Call Sessions tab
  useEffect(() => {
    if (activeNav !== "call-sessions") return;
    setSessionsLoading(true);
    callSessionsApi
      .list(sessionsPage, 10)
      .then((r) => {
        setSessionsList(r.items);
        setSessionsTotal(r.totalCount);
      })
      .catch(() => {
        setSessionsList([]);
        setSessionsTotal(0);
      })
      .finally(() => setSessionsLoading(false));
  }, [activeNav, sessionsPage]);

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
      return;
    }
    setConversationMessagesLoading(true);
    callSessionsApi
      .getMessages(conversationModalSession.id)
      .then(setConversationMessages)
      .catch(() => setConversationMessages([]))
      .finally(() => setConversationMessagesLoading(false));
  }, [conversationModalSession]);

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

  // Load PDF when preview is opened; revoke blob URL when closed or when switching resume
  useEffect(() => {
    if (!previewResumeId) {
      setPreviewPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setPreviewFileName("");
      setPreviewLoading(false);
      return;
    }
    setPreviewLoading(true);
    setPreviewPdfUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    resumesApi
      .getFileUrl(previewResumeId)
      .then((url) => setPreviewPdfUrl(url))
      .catch(() => {})
      .finally(() => setPreviewLoading(false));
  }, [previewResumeId]);

  const closePreview = () => {
    setPreviewResumeId(null);
  };

  const openPreview = (r: ResumeDto) => {
    setPreviewResumeId(r.id);
    setPreviewFileName(r.fileName);
  };

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
      language: s.language || "English",
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
      language: "English",
      simpleLanguage: true,
      extraContext: "Keep answers to the point and with a coding example",
      aiModel: "GPT-4.1 Mini",
      saveTranscript: false,
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
    } finally {
      setCreateSessionSubmitting(false);
    }
  };

  const finishChoosePlatform = () => {
    closeCreateSessionModal();
    setActiveNav("call-sessions");
    setSessionsPage(1);
    callSessionsApi
      .list(1, 10)
      .then((r) => {
        setSessionsList(r.items);
        setSessionsTotal(r.totalCount);
      })
      .catch(() => {});
  };

  /** Build orioai:// URL and navigate so the installed desktop app opens with this session (and token). */
  const launchDesktopApp = (sessionId: string, resumeId?: string | null) => {
    // Desktop app needs an absolute URL. In production we serve the dashboard on the VM and proxy /api to the API container.
    // So we pass the dashboard origin + "/api/" (works on both localhost dev and VM prod).
    const apiBase = `${window.location.origin.replace(/\/$/, "")}/api/`;
    const params = new URLSearchParams({ sessionId, apiBaseUrl: apiBase });
    if (resumeId) params.set("resumeId", resumeId);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveResumeFile = () => {
    setResumeFile(null);
    setFileSelected(false);
    setUploadProgress(0);
    setResumeTitle("My Resume");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadResumeSubmit = async () => {
    if (!resumeFile || !resumeTitle.trim()) return;
    setUploadingToServer(true);
    setUploadSuccess(null);
    setUploadError(null);
    try {
      await resumesApi.upload(resumeFile, resumeTitle.trim());
      setUploadSuccess("Resume uploaded successfully.");
      const list = await resumesApi.list();
      setResumesList(list);
      setTimeout(() => {
        closeResumeModal();
      }, 1500);
    } catch (e) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Upload failed. Please try again.";
      setUploadError(message);
    } finally {
      setUploadingToServer(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    const prev = resumesList;
    setResumesList((p) => p.filter((r) => r.id !== id));
    if (id === previewResumeId) setPreviewResumeId(null);
    try {
      await resumesApi.delete(id);
    } catch {
      setResumesList(prev);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - OrioAI style */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8 2 6 5 6 8c0 2 1 4 2 5l-2 6h12l-2-6c1-1 2-3 2-5 0-3-2-6-6-6zm0 2c2.2 0 4 1.8 4 4 0 1.5-.8 3.2-1.5 4.5L14 18h-4l-.5-5.5C8.8 11.2 8 9.5 8 8c0-2.2 1.8-4 4-4z" />
            </svg>
          </span>
          {sidebarOpen && (
            <span className="font-semibold text-gray-800 text-base">
              OrioAI
            </span>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {mainNavItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (id === "call-sessions")
                  navigate("/dashboard/call-sessions");
                else if (id === "cvs") navigate("/dashboard/cvs");
                else navigate("/dashboard");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${activeNav === id ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span className="shrink-0 text-gray-600">
                <Icon />
              </span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{label}</span>
              )}
            </button>
          ))}

          <div className="my-2 border-t border-gray-100" />

          <a
            href="https://github.com/webbyurvish/orio-desktop-app/releases/latest/download/orio-desktop-setup.exe"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <span className="shrink-0">
              <IconDownload />
            </span>
            {sidebarOpen && (
              <>
                <span className="text-sm font-medium flex-1">
                  Download Desktop App
                </span>
                <IconChevronDown />
              </>
            )}
          </a>
          <a
            href="mailto:support@parakeet.ai"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <span className="shrink-0">
              <IconEnvelope />
            </span>
            {sidebarOpen && (
              <span className="text-sm font-medium">Email Support</span>
            )}
          </a>
        </nav>

        {/* Credits card + user */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-100 space-y-4">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary-500">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    Credits
                  </span>
                  <button
                    type="button"
                    className="p-0.5 text-gray-400 hover:text-gray-600"
                    aria-label="Info"
                  >
                    <IconInfo />
                  </button>
                </div>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="More"
                >
                  <IconMoreVertical />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                You have{" "}
                <span className="inline-block px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 font-semibold">
                  2.5
                </span>{" "}
                credits.
              </p>
              <button
                type="button"
                onClick={() => navigate("/dashboard/buyCredits?tab=credits")}
                className="mt-3 w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
              >
                Buy Credits
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              className="flex items-center gap-2 text-gray-600 text-sm w-full text-left hover:text-gray-900"
            >
              <span className="shrink-0">
                <IconUser />
              </span>
              <span className="truncate">{userEmail}</span>
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - OrioAI Home style */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
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
            {previewResumeId ? (
              <button
                type="button"
                onClick={closePreview}
                className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            ) : (
              <h1 className="text-lg font-semibold text-gray-800">
                {mainNavItems.find((i) => i.id === activeNav)?.label ??
                  (activeNav === "profile" ? "Profile" : "Home")}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            {previewResumeId ? (
              <>
                <span className="text-sm text-gray-600 inline-flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">
                    ✓
                  </span>
                  Auto Saved
                </span>
                <button
                  type="button"
                  onClick={() => setDeleteResumeId(previewResumeId)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                  aria-label="Delete resume"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </>
            ) : activeNav === "cvs" ? (
              <button
                type="button"
                onClick={() => setShowResumeModal(true)}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
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
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Start Free Session
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard/call-sessions", {
                      state: { openCreateSessionModal: "free" },
                    })
                  }
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 shadow-sm"
                >
                  Start Session
                </button>
              </>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-white flex flex-col min-h-0">
          {previewResumeId ? (
            /* Preview Original PDF - in-dashboard layout, no Edit tab */
            <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
              {/* Single tab: Original PDF */}
              <div className="flex items-center border-b border-gray-300 bg-gray-200 shrink-0">
                <span className="px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-b-2 border-primary-500 shadow-sm">
                  Original PDF
                </span>
              </div>
              {/* Toolbar - match screenshot: hamburger, filename, page, zoom, rotate, download, print, more */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-700 text-gray-200 text-sm shrink-0">
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-600"
                  aria-label="Menu"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <span
                  className="truncate max-w-[180px] text-gray-300"
                  title={previewFileName}
                >
                  {previewFileName
                    ? `${previewFileName.slice(0, 20)}${previewFileName.length > 20 ? "..." : ""}`
                    : "…"}
                </span>
                <span className="text-gray-400 text-xs">1 / 1</span>
                <span className="text-gray-400">100%</span>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-600"
                  aria-label="Zoom out"
                >
                  −
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-600"
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-600"
                  aria-label="Rotate left"
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
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-600"
                  aria-label="Rotate right"
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
                      d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
                    />
                  </svg>
                </button>
                {previewPdfUrl && (
                  <>
                    <a
                      href={previewPdfUrl}
                      download={previewFileName || "resume.pdf"}
                      className="p-1.5 rounded hover:bg-gray-600"
                      aria-label="Download"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="p-1.5 rounded hover:bg-gray-600"
                      aria-label="Print"
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
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-600 ml-auto"
                  aria-label="More"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
              {/* PDF content */}
              <div className="flex-1 min-h-0 bg-gray-500 flex items-center justify-center p-4">
                {previewLoading && (
                  <div className="text-white">Loading PDF…</div>
                )}
                {!previewLoading && previewPdfUrl && (
                  <iframe
                    src={previewPdfUrl}
                    title="Resume PDF"
                    className="w-full h-full max-w-4xl bg-white rounded shadow-lg"
                  />
                )}
                {!previewLoading && !previewPdfUrl && previewResumeId && (
                  <div className="text-white">Failed to load PDF.</div>
                )}
              </div>
            </div>
          ) : activeNav === "home" ? (
            <div className="p-8 max-w-6xl mx-auto">
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
                    desc: "Upload your resume so OrioAI can generate custom answers to the interview questions.",
                    btn: "Upload Resume",
                    primary: false,
                  },
                  {
                    id: "home",
                    title: "Step 1: Free Session",
                    emoji: "⏰",
                    desc: "See how easy OrioAI is to use. Free Sessions are free and limited to 10 minutes.",
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
                    desc: "Use OrioAI for a real interview to get the job you have always dreamed of.",
                    btn: "Start",
                    primary: true,
                  },
                ].map((card, i) => (
                  <div
                    key={i}
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
                            ? navigate("/dashboard/call-sessions", {
                                state: { openCreateSessionModal: "paid" },
                              })
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
                            ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
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
                  </div>
                ))}
              </div>
            </div>
          ) : activeNav === "buy-credits" ? (
            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="bg-amber-100 text-amber-900 text-sm py-2 px-6 border-b border-amber-200">
                <span className="font-semibold">
                  Special offer for IN India users:
                </span>{" "}
                Use code{" "}
                <span className="font-mono font-semibold bg-amber-200 px-1 rounded">
                  INDIA25
                </span>{" "}
                for 25% off!{" "}
                <span className="ml-2 inline-flex items-center rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">
                  UPI Supported
                </span>
              </div>
              <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">
                <div className="text-center space-y-2">
                  <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500">
                    PRICING
                  </p>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Buy Credits or{" "}
                    <span className="text-emerald-500">Go Unlimited ✨</span>
                  </h2>
                </div>
                <div className="flex justify-center">
                  <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs font-medium text-gray-700">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard/buyCredits?tab=credits")
                      }
                      className={`px-4 py-1 rounded-full ${buyCreditsTab === "credits" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                    >
                      Credits Only
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard/buyCredits?tab=subscription")
                      }
                      className={`px-4 py-1 rounded-full ${buyCreditsTab === "subscription" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                    >
                      Subscription
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard/buyCredits?tab=lifetime")
                      }
                      className={`px-4 py-1 rounded-full ${buyCreditsTab === "lifetime" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                    >
                      Lifetime
                    </button>
                  </div>
                </div>
                {/* Same card layout for all 3 tabs; only amount and labels differ */}
                {buyCreditsTab === "credits" ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-8 w-fit bg-gray-50 rounded-full py-2 px-6">
                      <span className="flex items-center gap-1.5">
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        30-Day Money Back
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1.5">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Credits Never Expire
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1.5">
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        1 Credit = 1h Call →
                      </span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto w-full">
                      {/* Basic */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
                        <div className="mb-2 text-emerald-500">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mx-auto block"
                          >
                            <circle cx="12" cy="6" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="18" r="2" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-emerald-500 mb-4">
                          Basic
                        </h3>
                        <div className="flex flex-col items-center justify-center mb-6">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹2,650
                          </span>
                          <span className="text-sm text-gray-500">
                            ($29.50)
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-8 mt-auto">
                          3 Call Credits
                        </p>
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                        >
                          Get Credits{" "}
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

                      {/* Plus (Highlighted) */}
                      <div className="bg-emerald-700 rounded-xl shadow-md border-0 p-8 flex flex-col items-center text-center transform scale-105 z-10 relative">
                        <div className="mb-2 text-white">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mx-auto block text-yellow-400 opacity-90"
                          >
                            <circle cx="8" cy="8" r="2" />
                            <circle cx="12" cy="8" r="2" />
                            <circle cx="16" cy="8" r="2" />
                            <circle cx="8" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="16" cy="12" r="2" />
                            <circle cx="8" cy="16" r="2" />
                            <circle cx="12" cy="16" r="2" />
                            <circle cx="16" cy="16" r="2" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-4">
                          Plus
                        </h3>
                        <div className="flex flex-col items-center justify-center mb-6">
                          <span className="text-4xl font-bold text-white">
                            ₹5,300
                          </span>
                          <span className="text-sm text-green-100">
                            ($59.00)
                          </span>
                        </div>
                        <p className="text-sm text-white mb-8 mt-auto font-medium">
                          6 Call Credits + 2 Free
                        </p>
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-3 bg-white hover:bg-gray-50 text-emerald-800 transition-colors"
                        >
                          Get Credits{" "}
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

                      {/* Pro */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
                        <div className="mb-2 flex items-center justify-center">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-emerald-500 block"
                          >
                            <circle cx="6" cy="10" r="1.5" />
                            <circle cx="10" cy="10" r="1.5" />
                            <circle
                              cx="14"
                              cy="10"
                              r="1.5"
                              className="text-yellow-400"
                            />
                            <circle
                              cx="18"
                              cy="10"
                              r="1.5"
                              className="text-yellow-400"
                            />
                            <circle cx="6" cy="14" r="1.5" />
                            <circle cx="10" cy="14" r="1.5" />
                            <circle
                              cx="14"
                              cy="14"
                              r="1.5"
                              className="text-yellow-400"
                            />
                            <circle
                              cx="18"
                              cy="14"
                              r="1.5"
                              className="text-yellow-400"
                            />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-emerald-500 mb-4">
                          Pro
                        </h3>
                        <div className="flex flex-col items-center justify-center mb-6">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹7,950
                          </span>
                          <span className="text-sm text-gray-500">
                            ($88.50)
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-8 mt-auto">
                          9 Call Credits + 6 Free
                        </p>
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                        >
                          Get Credits{" "}
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
                  </div>
                ) : buyCreditsTab === "subscription" ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-8 w-fit bg-gray-50 rounded-full py-2 px-6">
                      <span className="flex items-center gap-1.5">
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        30-Day Money Back
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1.5">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Unlimited Calls
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1.5">
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
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                        Cancel Anytime
                      </span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto w-full">
                      {/* Monthly */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
                        <div className="mb-2 text-emerald-500">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto block"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <rect x="8" y="14" width="8" height="4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-emerald-500 mb-4">
                          Monthly
                        </h3>
                        <div className="flex flex-col items-center justify-center mb-6">
                          <span className="text-4xl font-bold text-gray-900">
                            ₹6,730
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            ($74.90)
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            per month
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-8 mt-auto">
                          Unlimited Calls
                        </p>
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white transition-colors"
                        >
                          Subscribe{" "}
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

                      {/* Yearly (Highlighted) */}
                      <div className="bg-emerald-800 rounded-xl shadow-md border-0 p-8 flex flex-col items-center text-center transform scale-105 z-10 relative">
                        <div className="mb-2 text-white">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto block"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="8" y1="14" x2="16" y2="14" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Yearly
                        </h3>
                        <div className="flex flex-col items-center justify-center mb-6">
                          <span className="text-4xl font-bold text-white">
                            ₹20,190
                          </span>
                          <span className="text-sm text-green-100 mt-1">
                            ($224.90)
                          </span>
                          <span className="text-xs text-green-100 mt-1">
                            per year
                          </span>
                        </div>
                        <p className="text-sm text-white mb-8 mt-auto font-medium">
                          Unlimited Calls • Save 75%
                        </p>
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-3 bg-white hover:bg-gray-50 text-emerald-900 transition-colors"
                        >
                          Subscribe{" "}
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
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-8 w-fit bg-gray-50 rounded-full py-2 px-6">
                      <span className="flex items-center gap-1.5">
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        30-Day Money Back
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1.5">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Unlimited Calls Forever
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1.5">
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        One-Time Payment
                      </span>
                    </div>
                    <div className="w-full max-w-sm mx-auto">
                      <div className="bg-emerald-800 rounded-xl shadow-md border-0 p-8 flex flex-col items-center text-center">
                        <div className="mb-2 text-white">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto block text-white"
                          >
                            <path d="M10 21V14a2 2 0 00-2-2H4a2 2 0 00-2 2v7" />
                            <path d="M10 10V3a2 2 0 012-2h4a2 2 0 012 2v7" />
                            <path d="M14 21V14a2 2 0 012-2h4a2 2 0 012 2v7" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M14.5 10c0-1.5-1-3-2.5-3s-2.5 1.5-2.5 3 1 3 2.5 3 2.5-1.5 2.5-3z" />
                            <path d="M7 10c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3-1 3-2.5 3S7 11.5 7 10z" />
                            <path d="M14 6c0-1.5 1-3 2.5-3S19 4.5 19 6s-1 3-2.5 3-2.5-1.5-2.5-3z" />
                            <path d="M5 6c0-1.5 1-3 2.5-3S10 4.5 10 6s-1 3-2.5 3S5 7.5 5 6z" />
                            <path d="M19 18c0-1.5-1-3-2.5-3s-2.5 1.5-2.5 3 1 3 2.5 3S19 19.5 19 18z" />
                            <path d="M10 18c0-1.5-1-3-2.5-3s-2.5 1.5-2.5 3 1 3 2.5 3S10 19.5 10 18z" />
                            <path d="M14.5 14c0-1.5-1-3-2.5-3s-2.5 1.5-2.5 3 1 3 2.5 3 2.5-1.5 2.5-3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Lifetime
                        </h3>
                        <div className="flex flex-col items-center justify-center mb-6">
                          <span className="text-4xl font-bold text-white">
                            ₹40,990
                          </span>
                          <span className="text-sm text-green-100 mt-1">
                            ($449.90)
                          </span>
                          <span className="text-xs text-green-100 mt-1">
                            once
                          </span>
                        </div>
                        <p className="text-sm text-white mb-8 mt-auto font-medium">
                          Unlimited Calls Forever
                        </p>
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-3 bg-white hover:bg-gray-50 text-emerald-900 transition-colors"
                        >
                          Get Lifetime{" "}
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
                  </div>
                )}
              </div>
            </div>
          ) : activeNav === "cvs" ? (
            <div className="p-6 w-full min-w-0">
              <div className="flex justify-between text-sm font-medium text-gray-500 border-b border-gray-200 pb-2 mb-4">
                <span>Title</span>
                <span>Created At</span>
              </div>
              {resumesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <p className="text-base">No Resumes yet.</p>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200">
                    {resumesList.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between py-3"
                      >
                        <button
                          type="button"
                          onClick={() => openPreview(r)}
                          className="flex items-center gap-2 min-w-0 text-left group"
                        >
                          <span className="text-gray-900 text-sm font-medium truncate group-hover:text-primary-600 group-hover:underline">
                            {r.title}
                          </span>
                          <span className="shrink-0 inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-[11px] font-semibold">
                            Original
                          </span>
                          <span className="shrink-0 inline-flex items-center rounded-full bg-gray-900 text-white px-2 py-0.5 text-[11px] font-semibold">
                            PDF
                          </span>
                        </button>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-gray-500">
                            {new Date(r.createdAt).toLocaleDateString(
                              undefined,
                              { dateStyle: "medium" },
                            )}
                          </span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-md bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                            aria-label="Delete resume"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteResumeId(r.id);
                            }}
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
                      </li>
                    ))}
                  </ul>
                  <p className="mt-10 text-center text-xs text-gray-400">
                    A list of your Resumes.
                  </p>
                </>
              )}
            </div>
          ) : activeNav === "call-sessions" ? (
            <div className="p-6 w-full min-w-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-medium">
                      <th className="pb-3 pr-4">Title</th>
                      <th className="pb-3 pr-4">Description</th>
                      <th className="pb-3 pr-4">Ends In</th>
                      <th className="pb-3 pr-4">AI Usage</th>
                      <th className="pb-3 pr-4">Created At</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionsLoading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-gray-500"
                        >
                          Loading…
                        </td>
                      </tr>
                    ) : sessionsList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-gray-500"
                        >
                          No sessions yet.
                        </td>
                      </tr>
                    ) : (
                      sessionsList.map((s) =>
                        (() => {
                          // read sessionsNowTick so this row re-renders every second while on call-sessions
                          void sessionsNowTick;

                          const status = (s.status || "").trim().toLowerCase();
                          const isNotActivated = status === "not activated";
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
                            ? "border-b border-gray-100 bg-gray-50/60 text-gray-400 cursor-pointer"
                            : "border-b border-gray-100 hover:bg-gray-50 cursor-pointer";
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
                              <td
                                className={`py-3 pr-4 font-medium ${isEnded ? "text-gray-500" : "text-gray-900"}`}
                              >
                                {s.title || "—"}
                              </td>
                              <td
                                className={`py-3 pr-4 ${isEnded ? "text-gray-500" : "text-gray-600"}`}
                              >
                                {s.description || "—"}
                              </td>
                              <td className="py-3 pr-4">
                                <span className="text-gray-600">
                                  {endsInDisplay}
                                </span>
                                {s.isFreeSession ? (
                                  <span className="ml-1.5 inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                                    Free
                                  </span>
                                ) : (
                                  <span className="ml-1.5 inline-flex items-center rounded bg-gray-800 px-1.5 py-0.5 text-xs font-medium text-white">
                                    Credits: 0.5
                                  </span>
                                )}
                              </td>
                              <td className="py-3 pr-4 text-gray-600">
                                {s.aiUsage}
                              </td>
                              <td className="py-3 pr-4 text-gray-500">
                                {new Date(s.createdAt).toLocaleDateString(
                                  undefined,
                                  { dateStyle: "medium" },
                                )}
                              </td>
                              <td
                                className="py-3 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    className={`p-1.5 rounded text-gray-500 ${isNotActivated ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                                    aria-label="Conversation"
                                    onClick={() => {
                                      if (isNotActivated) return;
                                      setConversationModalSession(s);
                                    }}
                                    disabled={isNotActivated}
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
                                    className={`p-1.5 rounded text-gray-400 ${isEnded ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                                    aria-label="Edit"
                                    disabled={isEnded}
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
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.464 3.964z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    className="p-1.5 rounded text-red-500 hover:bg-red-50"
                                    aria-label="Delete"
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
                              </td>
                            </tr>
                          );
                        })(),
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {sessionsTotal > 0 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Page {sessionsPage} • Showing {(sessionsPage - 1) * 10 + 1}-
                    {Math.min(sessionsPage * 10, sessionsTotal)} of{" "}
                    {sessionsTotal}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={sessionsPage <= 1}
                      onClick={() => setSessionsPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={sessionsPage * 10 >= sessionsTotal}
                      onClick={() => setSessionsPage((p) => p + 1)}
                      className="px-3 py-1.5 rounded bg-gray-900 text-white disabled:opacity-50 hover:bg-gray-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeNav === "profile" ? (
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
                    Call Credits:{" "}
                    <span className="inline-block px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 font-semibold">
                      2.5
                    </span>
                  </p>
                </section>
                <section className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Subscriptions
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    No active subscription
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

              {resumeModalStep === "options" ? (
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => setResumeModalStep("upload-pdf")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 hover:bg-gray-800"
                  >
                    Upload PDF Resume
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
                    className="w-full rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 py-2.5 hover:bg-gray-50"
                  >
                    Input Manually
                  </button>

                  <div className="h-px bg-gray-200 my-2" />

                  <button
                    type="button"
                    className="w-full rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 shadow-[0_0_18px_rgba(34,197,94,0.7)]"
                  >
                    Build with AI
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  />

                  {uploadSuccess ? (
                    <div className="py-6 text-center">
                      <p className="text-base font-medium text-green-600">
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
                      <div className="flex gap-3 pt-2">
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
                          onClick={handleUploadResumeSubmit}
                          className="flex-1 rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 hover:bg-gray-800 disabled:opacity-60"
                        >
                          {uploadingToServer ? "Uploading…" : "Upload Resume"}
                        </button>
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
                          if (file?.type === "application/pdf")
                            setResumeFile(file);
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
            <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
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
                        <span
                          className="inline-flex items-center text-gray-400"
                          title="Company name"
                        >
                          ⓘ
                        </span>
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
                        <span
                          className="inline-flex items-center text-gray-400"
                          title="Job description"
                        >
                          ⓘ
                        </span>
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
                        <span
                          className="inline-flex items-center text-gray-400"
                          title="Select resume"
                        >
                          ⓘ
                        </span>{" "}
                        📎
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={createSessionForm.resumeId}
                          onChange={(e) =>
                            setCreateSessionForm((f) => ({
                              ...f,
                              resumeId: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                        >
                          <option value="">Select resume</option>
                          {resumesList.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.title || r.fileName}
                            </option>
                          ))}
                        </select>
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
                          Language <span className="text-gray-400">ⓘ</span>
                        </label>
                        <select
                          value={createSessionForm.language}
                          onChange={(e) =>
                            setCreateSessionForm((f) => ({
                              ...f,
                              language: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-gray-400 outline-none"
                        >
                          <option>English</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Simple Language{" "}
                          <span className="text-gray-400">ⓘ</span>
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
                        <span className="text-gray-400">ⓘ</span>
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
                        AI Model <span className="text-gray-400">ⓘ</span>
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
                    Choose Platform
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    How would you like to connect to your call session?
                  </p>
                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (createdSessionIdForLaunch)
                          launchDesktopApp(
                            createdSessionIdForLaunch,
                            createSessionForm.resumeId || undefined,
                          );
                        finishChoosePlatform();
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-3 px-4 relative"
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
                      <span className="absolute right-3 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
                        Recommended
                      </span>
                    </button>
                    <p className="text-center text-xs text-gray-400">
                      Opens the app and saves conversation to this session.
                      Install the app if it doesn’t open.
                    </p>
                    <p className="text-center text-sm text-gray-500">or</p>
                    <button
                      type="button"
                      onClick={finishChoosePlatform}
                      className="w-full flex items-center justify-center gap-2 text-gray-700 underline hover:text-gray-900 text-sm"
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
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      Open in Browser
                    </button>
                    <button
                      type="button"
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

        {/* Choose Platform modal (when clicking a session row) */}
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
                  Choose Platform
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  How would you like to connect to your call session?
                </p>
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      launchDesktopApp(
                        sessionForPlatformModal.id,
                        sessionForPlatformModal.resumeId,
                      );
                      setSessionForPlatformModal(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-3 px-4 relative"
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
                    <span className="absolute right-3 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
                      Recommended
                    </span>
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    Opens the app and saves conversation to this session.
                    Install the app if it doesn’t open.
                  </p>
                  <p className="text-center text-sm text-gray-500">or</p>
                  <button
                    type="button"
                    onClick={() => setSessionForPlatformModal(null)}
                    className="w-full flex items-center justify-center gap-2 text-gray-700 underline hover:text-gray-900 text-sm"
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
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Open in Browser
                  </button>
                  <button
                    type="button"
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
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {conversationMessagesLoading ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Loading conversation…
                  </p>
                ) : conversationMessages.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No conversation yet. Start the desktop app and run a session
                    to see the transcript here.
                  </p>
                ) : (
                  conversationMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        msg.role === "Assistant" || msg.role === "AI"
                          ? "bg-gray-100 text-gray-900 ml-0 mr-8"
                          : msg.role === "User"
                            ? "bg-gray-900 text-white ml-8 mr-0"
                            : "bg-gray-50 text-gray-600 ml-4 mr-4"
                      }`}
                    >
                      <div className="font-medium text-xs opacity-80 mb-0.5">
                        {msg.role}
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
                  ))
                )}
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
      </div>
    </div>
  );
}

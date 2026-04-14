/**
 * Dashboard > Desktop App — download hero + live-mode UI mockup (replace mockup with image/video later).
 */

import { useState } from "react";
import {
  DesktopSmartScreenHelpModal,
  triggerWindowsInstallerDownload,
} from "../components/DesktopSmartScreenHelpModal";
import { WINDOWS_DESKTOP_INSTALLER_URL } from "../constants/desktopWindowsInstaller";

// macOS build is not published yet (CTA shows "coming soon").

function IconMonitor() {
  return (
    <svg
      className="h-8 w-8 text-teal-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconApple() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function IconWindows() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 5.548l7.14-1.001v6.86H3V5.548zm0 12.904l7.14 1.001v-6.86H3v5.859zM11.14 4.41L21 3v8.26h-9.86V4.41zM21 20.59l-9.86 1.59V13.9H21v6.69z" />
    </svg>
  );
}

/**
 * Placeholder for future screenshot or video embed.
 */
function DesktopLiveModeMockup() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a10] shadow-2xl shadow-black/50 ring-1 ring-white/5"
      aria-label="Desktop app preview (placeholder)"
    >
      {/* Window title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#12121c]/95 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="flex-1 text-center text-xs font-medium text-slate-400 sm:text-sm">
          Smeed AI — Live Mode
        </p>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="hidden sm:inline">Listening</span>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Live transcript
          </p>
          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 sm:px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-300/90">
              Interviewer
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-200">
              Can you describe your experience with distributed systems?
            </p>
          </div>
        </section>

        <section>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.7)]" />
            Suggested answer
          </p>
          <div className="mt-2 rounded-xl border border-indigo-500/35 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent px-3 py-3 sm:px-4">
            <p className="text-sm leading-relaxed text-slate-100">
              In my role at Acme Corp, I designed a microservices architecture
              handling 10M+ daily requests using Kafka, Redis, and Kubernetes…
            </p>
          </div>
        </section>
      </div>

      {/* Bottom toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-[#0c0c12]/90 px-4 py-2.5">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </span>
        </div>
        <div className="flex min-w-[140px] flex-1 items-center gap-2 sm:min-w-[200px]">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Opacity
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-white/10">
            <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-teal-400 to-indigo-400" />
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-400/90">Auto ON</span>
      </div>
    </div>
  );
}

export function DashboardDesktopAppContent() {
  const [smartScreenHelpOpen, setSmartScreenHelpOpen] = useState(false);

  const handleWindowsDownload = () => {
    triggerWindowsInstallerDownload(WINDOWS_DESKTOP_INSTALLER_URL);
    setSmartScreenHelpOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-4 sm:px-6 md:pt-6">
      {/* Hero card */}
      <div className="orio-panel rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8 text-center shadow-xl shadow-black/30 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
          <IconMonitor />
        </div>
        <h2 className="orio-font-display mt-6 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          Smeed AI Desktop Companion
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
          Lightweight overlay for live interviews. Always-on-top, invisible to
          screen share.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleWindowsDownload}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:brightness-110"
          >
            <IconWindows />
            Download for Windows
          </button>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-400 shadow-inner shadow-black/20"
            aria-label="Download for Mac (coming soon)"
          >
            <IconApple />
            macOS coming soon
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Windows: direct installer download. macOS: coming soon.
        </p>
      </div>

      {/* Preview placeholder — swap for image or video later */}
      <div className="mt-10">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
          App preview
        </p>
        <DesktopLiveModeMockup />
      </div>

      <DesktopSmartScreenHelpModal open={smartScreenHelpOpen} onClose={() => setSmartScreenHelpOpen(false)} />
    </div>
  );
}

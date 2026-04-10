import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  selectUnreadCount,
  useNotificationsStore,
  type AppNotification,
} from "../store/notificationsStore";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function kindIcon(kind: AppNotification["kind"]) {
  const cls = "h-4 w-4 shrink-0";
  switch (kind) {
    case "summary":
      return (
        <svg className={`${cls} text-teal-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "credits":
      return (
        <svg className={`${cls} text-violet-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "billing":
      return (
        <svg className={`${cls} text-fuchsia-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "session":
      return (
        <svg className={`${cls} text-cyan-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className={`${cls} text-slate-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export function DashboardNotificationBell() {
  const navigate = useNavigate();
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const dismiss = useNotificationsStore((s) => s.dismiss);
  const clearAll = useNotificationsStore((s) => s.clearAll);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unread = selectUnreadCount(items);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openItem = (n: AppNotification) => {
    markRead(n.id);
    setOpen(false);
    if (n.href) navigate(n.href);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-teal-500/30 hover:bg-white/[0.1] hover:text-white"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unread > 0 ? (
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-teal-400 to-violet-500 shadow-[0_0_8px_rgba(45,212,191,0.6)] ring-2 ring-[var(--orio-elevated,#0f0f14)]"
            aria-hidden
          />
        ) : null}
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <p className="text-sm font-semibold text-slate-100">Notifications</p>
            <div className="flex items-center gap-2">
              {items.length > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => markAllRead()}
                    className="text-xs font-medium text-teal-400/90 hover:text-teal-300"
                  >
                    Mark read
                  </button>
                  <button
                    type="button"
                    onClick={() => clearAll()}
                    className="text-xs font-medium text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="max-h-[min(70vh,24rem)] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                You&apos;re all caught up. We&apos;ll notify you about summaries, credits, and account updates here.
              </p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {items.map((n) => (
                  <li key={n.id}>
                    <div
                      className={`flex gap-3 px-4 py-3 transition hover:bg-white/[0.04] ${
                        !n.read ? "bg-teal-500/[0.06]" : ""
                      }`}
                    >
                      <div className="mt-0.5">{kindIcon(n.kind)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-100">{n.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{n.body}</p>
                        <p className="mt-1.5 text-[11px] text-slate-600">{timeAgo(n.createdAt)}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {n.href ? (
                            <button
                              type="button"
                              onClick={() => openItem(n)}
                              className="text-xs font-semibold text-teal-400 hover:text-teal-300"
                            >
                              Open
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => markRead(n.id)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-300"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => dismiss(n.id)}
                            className="text-xs font-medium text-slate-600 hover:text-slate-400"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

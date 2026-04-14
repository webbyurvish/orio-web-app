import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  SMARTSCREEN_HELP_IMAGE_STEP1,
  SMARTSCREEN_HELP_IMAGE_STEP2,
} from "../constants/desktopWindowsInstaller";

type Props = {
  open: boolean;
  onClose: () => void;
};

function InfoGlyph() {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal-400/35 bg-teal-500/15 text-sm font-bold text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.15)]"
      aria-hidden
    >
      i
    </span>
  );
}

function StepBadge({ n }: { n: 1 | 2 }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0a0a10] shadow-sm">
      {n}
    </span>
  );
}

function SmartScreenFigure({ src, alt }: { src: string; alt: string }) {
  type ImgState = "loading" | "ready" | "error";
  const [state, setState] = useState<ImgState>("loading");

  useEffect(() => {
    setState("loading");
  }, [src]);

  return (
    <figure className="mt-3 overflow-hidden rounded-xl border border-white/[0.08] bg-black/40 ring-1 ring-white/[0.04]">
      {state !== "error" ? (
        <img
          src={src}
          alt={alt}
          className={`w-full object-contain object-top transition-opacity duration-300 ${
            state === "ready" ? "opacity-100" : "h-0 min-h-0 opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
        />
      ) : null}
      {state === "loading" ? (
        <div className="flex min-h-[120px] items-center justify-center py-8">
          <span
            className="h-6 w-6 animate-spin rounded-full border-2 border-teal-400/25 border-t-teal-400"
            aria-hidden
          />
        </div>
      ) : null}
      {state === "error" ? (
        <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <p className="text-xs font-medium text-slate-400">Screenshot not added yet</p>
          <p className="max-w-xs text-[11px] leading-relaxed text-slate-500">
            Add your image to{" "}
            <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-slate-300">public{src}</code>
          </p>
        </div>
      ) : null}
    </figure>
  );
}

export function DesktopSmartScreenHelpModal({ open, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setReachedEnd(false);
      return;
    }
    setReachedEnd(false);
  }, [open]);

  /** Fits without scroll → show button. If content grows (e.g. images), hide until bottom unless already there. */
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    const checkLayout = () => {
      if (el.scrollHeight <= el.clientHeight + 2) {
        setReachedEnd(true);
        return;
      }
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 12;
      setReachedEnd(atBottom);
    };
    checkLayout();
    const ro = new ResizeObserver(checkLayout);
    ro.observe(el);
    el.addEventListener("scroll", checkLayout, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", checkLayout);
    };
  }, [open]);

  /** Reveal “Got it” when the bottom sentinel scrolls into view. */
  useEffect(() => {
    if (!open) return;
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setReachedEnd(true);
      },
      { root, rootMargin: "0px 0px 8px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [open]);

  if (!open) return null;

  /* Portal to body so fixed + z-index cover the full app (escapes dashboard stacking / overflow). */
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex min-h-0 items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="relative z-[1] flex w-full max-w-lg max-h-[calc(100dvh-3rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07070c] shadow-[0_32px_100px_rgba(0,0,0,0.65)] ring-1 ring-teal-500/10 sm:max-h-[calc(100dvh-4rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="smartscreen-modal-title"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-teal-500/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl"
          aria-hidden
        />

        <div className="relative flex shrink-0 items-start gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6 sm:py-5">
          <InfoGlyph />
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id="smartscreen-modal-title" className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Windows may show a warning
            </h2>
            <p className="mt-1 text-sm text-slate-400">This is normal. Here&apos;s how to install safely.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-m-2 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5"
        >
          <div className="rounded-xl border border-teal-500/25 bg-teal-500/[0.06] px-4 py-3 text-sm leading-relaxed text-slate-300">
            <p>
              Windows shows this warning for all new apps that haven&apos;t built up enough download history yet.{" "}
              <span className="font-semibold text-teal-100">Smeed AI is 100% safe</span>
              <span className="text-slate-400"> — </span>
              it&apos;s the same app used by thousands of users daily.
            </p>
          </div>

          <section className="mt-6">
            <div className="flex items-start gap-3">
              <StepBadge n={1} />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white sm:text-base">Click &apos;More info&apos;</h3>
                <SmartScreenFigure
                  src={SMARTSCREEN_HELP_IMAGE_STEP1}
                  alt="Windows SmartScreen dialog with More info link highlighted"
                />
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-start gap-3">
              <StepBadge n={2} />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white sm:text-base">Click &apos;Run anyway&apos;</h3>
                <SmartScreenFigure
                  src={SMARTSCREEN_HELP_IMAGE_STEP2}
                  alt="Windows SmartScreen dialog with Run anyway button highlighted"
                />
              </div>
            </div>
          </section>

          <div ref={sentinelRef} className="h-1 w-full shrink-0" aria-hidden />

          {reachedEnd ? (
            <div className="mt-8 border-t border-white/[0.06] pt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/15 transition hover:brightness-110"
              >
                Got it
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function triggerWindowsInstallerDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

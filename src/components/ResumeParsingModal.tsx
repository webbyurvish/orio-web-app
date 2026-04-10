import { useEffect, useRef, useState } from "react";
import { resumesApi } from "../api/resumes";
import type { ResumeDetailDto } from "../types/resumeStructured";

const STEPS = [
  "Reading your file…",
  "Extracting text…",
  "Parsing resume with AI…",
  "Mapping sections & skills…",
] as const;

type Props = {
  open: boolean;
  file: File | null;
  title: string;
  onClose: () => void;
  onComplete: (detail: ResumeDetailDto) => void;
};

export function ResumeParsingModal({
  open,
  file,
  title,
  onClose,
  onComplete,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!open || !file) return;

    setStepIndex(0);
    setProgress(5);
    setError(null);

    const stepTimer = window.setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 4500);

    const progTimer = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + Math.random() * 8 + 2;
      });
    }, 600);

    let cancelled = false;
    (async () => {
      try {
        const detail = await resumesApi.parseUpload(
          file,
          title.trim() || file.name,
        );
        if (cancelled) return;
        setProgress(100);
        setStepIndex(STEPS.length - 1);
        window.setTimeout(() => onCompleteRef.current(detail), 400);
      } catch (e: unknown) {
        if (cancelled) return;
        const msg =
          e && typeof e === "object" && "response" in e
            ? String(
                (e as { response?: { data?: { message?: string } } }).response
                  ?.data?.message,
              )
            : "Parsing failed. Try another file or format.";
        setError(msg || "Parsing failed.");
        setProgress(0);
      } finally {
        window.clearInterval(stepTimer);
        window.clearInterval(progTimer);
      }
    })();

    return () => {
      cancelled = true;
      window.clearInterval(stepTimer);
      window.clearInterval(progTimer);
    };
  }, [open, file, title]);

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
        aria-label="Close"
        onClick={error ? onClose : undefined}
        disabled={!error}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--orio-elevated)]/95 via-[#12121c]/92 to-[#08080f]/95 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl p-6 md:p-8 ring-1 ring-teal-500/10">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-100">Upload Resume</h2>
          {error ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
              aria-label="Close"
            >
              ✕
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="mt-4 text-sm text-rose-200">{error}</p>
        ) : (
          <>
            <p className="mt-4 text-center text-sm font-semibold text-teal-200/90">
              {STEPS[stepIndex]}
            </p>
            <p className="mt-2 text-center text-xs text-slate-400">
              Please don&apos;t leave this page. This usually takes 10–30
              seconds.
            </p>
            <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-[width] duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.round(progress))}%` }}
              />
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">
              {Math.min(100, Math.round(progress))}% complete
            </p>
          </>
        )}
      </div>
    </div>
  );
}

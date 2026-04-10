import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

export type SegmentedTabItem<T extends string> = { id: T; label: string };

/** Behavioral / Technical toggle (Natural Mode compare cards). */
export const NATURAL_QUESTION_TABS = [
  { id: "behavioral" as const, label: "Behavioral" },
  { id: "technical" as const, label: "Technical" },
];

type SegmentedTabListProps<T extends string> = {
  value: T;
  onChange: (id: T) => void;
  tabs: readonly SegmentedTabItem<T>[];
  /** dashboard = Call Sessions; landing = FAQ; pricing = gradient pills; buyCredits = dashboard billing (light shell, sliding thumb); natural = Behavioral/Technical (same thumb as pricing) */
  variant?: "dashboard" | "landing" | "pricing" | "buyCredits" | "natural";
  className?: string;
  "aria-label"?: string;
};

/**
 * Segmented tabs with a sliding selection thumb (smooth width / position).
 */
export function SegmentedTabList<T extends string>({
  value,
  onChange,
  tabs,
  variant = "dashboard",
  className = "",
  "aria-label": ariaLabel,
}: SegmentedTabListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [thumb, setThumb] = useState({ left: 0, width: 0 });

  const updateThumb = useCallback(() => {
    const el = containerRef.current;
    const active = tabRefs.current.get(value);
    if (!el || !active) return;
    const er = el.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    setThumb({
      left: ar.left - er.left,
      width: ar.width,
    });
  }, [value]);

  useLayoutEffect(() => {
    updateThumb();
  }, [updateThumb, tabs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateThumb);
      return () => window.removeEventListener("resize", updateThumb);
    }
    const ro = new ResizeObserver(() => updateThumb());
    ro.observe(el);
    window.addEventListener("resize", updateThumb);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateThumb);
    };
  }, [updateThumb]);

  const containerBase =
    variant === "dashboard"
      ? "relative inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-1"
      : variant === "pricing"
        ? "relative inline-flex flex-nowrap justify-center rounded-full border border-white/10 bg-black/30 p-1.5 backdrop-blur-md"
        : variant === "buyCredits"
          ? "relative inline-flex flex-nowrap justify-center rounded-full border border-gray-200 bg-gray-100 p-1.5"
          : variant === "natural"
            ? "relative inline-flex w-full flex-nowrap justify-center rounded-full border border-white/10 bg-black/30 p-1 backdrop-blur-md sm:w-auto"
            : "relative inline-flex flex-nowrap justify-center rounded-full border border-white/10 bg-black/25 p-1";

  const thumbBase =
    variant === "dashboard"
      ? "absolute rounded-lg border border-teal-500/35 bg-white/10 shadow-sm shadow-teal-500/10"
      : variant === "pricing" || variant === "natural"
        ? "absolute rounded-full bg-gradient-to-r from-teal-500 to-violet-600 shadow-lg shadow-teal-500/20"
        : variant === "buyCredits"
          ? "absolute rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_6px_16px_rgba(79,70,229,0.25)]"
          : "absolute rounded-full bg-white shadow-sm shadow-black/20";

  const thumbInset =
    variant === "pricing" || variant === "natural" || variant === "buyCredits"
      ? 6
      : 4;

  const thumbStyle: CSSProperties = {
    left: thumb.width > 0 ? thumb.left : 0,
    width: thumb.width,
    top: thumbInset,
    bottom: thumbInset,
    transitionProperty: "left, width, opacity",
    transitionDuration: "320ms",
    transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
    opacity: thumb.width > 0 ? 1 : 0,
  };

  return (
    <div
      ref={containerRef}
      className={[containerBase, className].filter(Boolean).join(" ")}
      role="tablist"
      aria-label={ariaLabel}
    >
      <span className={thumbBase} style={thumbStyle} aria-hidden />
      {tabs.map((t) => {
        const active = value === t.id;
        const btnClass =
          variant === "dashboard"
            ? `relative z-10 rounded-lg px-4 py-2 text-sm font-semibold outline-none transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-teal-400/40 ${
                active
                  ? "text-slate-100"
                  : "text-slate-500 hover:text-slate-200"
              }`
            : variant === "pricing"
              ? `relative z-10 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider outline-none transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-teal-400/40 ${
                  active ? "text-white" : "text-slate-400 hover:text-white"
                }`
              : variant === "buyCredits"
                ? `relative z-10 inline-flex min-h-[2.75rem] items-center justify-center rounded-full px-5 text-sm font-semibold outline-none transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:px-7 ${
                    active
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                : variant === "natural"
                ? `relative z-10 flex-1 min-w-0 rounded-full px-4 py-2.5 text-sm font-semibold outline-none transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-teal-400/40 sm:flex-none sm:px-5 ${
                    active
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-200"
                  }`
                : `relative z-10 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider outline-none transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-teal-400/40 ${
                    active ? "text-black" : "text-slate-400 hover:text-white"
                  }`;

        return (
          <button
            key={t.id}
            ref={(node) => {
              if (node) tabRefs.current.set(t.id, node);
              else tabRefs.current.delete(t.id);
            }}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={btnClass}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

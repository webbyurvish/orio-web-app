import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyMountWhenVisibleProps = {
  children: ReactNode;
  /** Extra classes on the observer root (e.g. grid cell sizing). */
  className?: string;
  /** Prefetch window (IntersectionObserver rootMargin). */
  rootMargin?: string;
  /** Placeholder styling: dark = landing pricing, light = dashboard cards. */
  theme?: "dark" | "light";
};

/**
 * Mounts children only after the root nears the viewport (one-shot).
 * Reduces initial work for below-the-fold pricing cards.
 */
export function LazyMountWhenVisible({
  children,
  className = "",
  rootMargin = "200px 0px",
  theme = "dark",
}: LazyMountWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  const skeletonClass =
    theme === "light"
      ? "min-h-[480px] w-full rounded-xl border border-gray-100 bg-gray-100 animate-pulse"
      : "min-h-[420px] w-full rounded-[24px] bg-white/[0.06] animate-pulse";

  return (
    <div ref={ref} className={className}>
      {mounted ? (
        children
      ) : (
        <div className={skeletonClass} aria-hidden />
      )}
    </div>
  );
}

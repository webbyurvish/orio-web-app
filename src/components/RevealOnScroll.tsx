import type { CSSProperties, ReactNode } from "react";
import { useRevealInView } from "../hooks/useRevealInView";

/**
 * Scroll-driven entrance using `.orio-reveal` (see `index.css`).
 */
export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const { ref, visible } = useRevealInView<HTMLDivElement>();
  const delayStyle =
    delay > 0 ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined;
  return (
    <div
      ref={ref}
      className={`orio-reveal ${visible ? "orio-reveal--in" : ""} ${className}`.trim()}
      style={delayStyle ? { ...style, ...delayStyle } : style}
    >
      {children}
    </div>
  );
}

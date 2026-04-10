import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type InfoTooltipSide = "top" | "bottom";

type InfoTooltipProps = {
  content: string;
  /** Preferred side of the trigger; may flip if there is not enough space. */
  side?: InfoTooltipSide;
  label?: string;
  className?: string;
};

const margin = 8;

function computePosition(
  trigger: DOMRect,
  tip: DOMRect,
  preferred: InfoTooltipSide,
): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = trigger.left + trigger.width / 2 - tip.width / 2;
  left = Math.max(margin, Math.min(left, vw - tip.width - margin));

  let top: number;
  if (preferred === "bottom") {
    top = trigger.bottom + margin;
    if (top + tip.height > vh - margin) {
      const above = trigger.top - tip.height - margin;
      top = above >= margin ? above : Math.max(margin, vh - tip.height - margin);
    }
  } else {
    top = trigger.top - tip.height - margin;
    if (top < margin) {
      const below = trigger.bottom + margin;
      top =
        below + tip.height <= vh - margin
          ? below
          : Math.max(margin, vh - tip.height - margin);
    }
  }
  top = Math.max(margin, Math.min(top, vh - tip.height - margin));
  return { top, left };
}

export function InfoTooltip({
  content,
  side = "bottom",
  label = "More information",
  className = "",
}: InfoTooltipProps) {
  const reactId = useId();
  const tooltipId = `orio-info-${reactId.replace(/:/g, "")}`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const reposition = useCallback(() => {
    const btn = buttonRef.current;
    const tip = tooltipRef.current;
    if (!btn || !tip) return;
    const br = btn.getBoundingClientRect();
    const tr = tip.getBoundingClientRect();
    if (tr.width === 0 && tr.height === 0) return;
    setCoords(computePosition(br, tr, side));
  }, [side]);

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const tip = tooltipRef.current;
    const ro = new ResizeObserver(() => reposition());
    if (tip) ro.observe(tip);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition, content]);

  return (
    <span
      className={`relative inline-flex items-center align-middle ${className}`}
    >
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-3.5 w-3.5 shrink-0 cursor-default touch-manipulation items-center justify-center rounded border border-white/10 bg-white/[0.05] text-[7px] font-semibold leading-none text-slate-500/75 shadow-none transition hover:border-white/15 hover:bg-white/[0.09] hover:text-slate-400/90 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400/25 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--orio-void,#050508)]"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      <span
        id={tooltipId}
        ref={tooltipRef}
        role="tooltip"
        className={`fixed z-[200] w-max max-w-[min(20rem,calc(100vw-2rem))] max-lg:max-w-[min(18rem,calc(100vw-1rem))] origin-top scale-95 opacity-0 transition duration-150 ease-out will-change-transform ${
          open
            ? "visible scale-100 opacity-100 pointer-events-none"
            : "invisible pointer-events-none"
        }`}
        style={{ top: coords.top, left: coords.left }}
        aria-hidden={!open}
      >
        <span className="orio-popover-paper relative block rounded-lg border px-2.5 py-2 text-left text-[11px] font-normal leading-snug ring-1 ring-white/10">
          {content}
        </span>
      </span>
    </span>
  );
}

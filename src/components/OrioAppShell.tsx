import type { ReactNode } from "react";

/**
 * Aurora Stealth shell for dashboard, admin, auth, and marketing subpages.
 * Pairs with `.orio-app` in `index.css` (tokens, dark surfaces, Tailwind remaps).
 */
export default function OrioAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="orio-app relative min-h-dvh w-full overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="orio-hero-mesh absolute inset-0" />
      </div>
      <div className="relative z-[1] flex min-h-dvh w-full flex-col">{children}</div>
    </div>
  );
}

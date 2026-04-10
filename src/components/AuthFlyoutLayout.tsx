/**
 * Centered auth flyout over the Aurora shell (mesh from parent OrioAppShell).
 * Dark scrim + blur outside; children should use a solid panel (e.g. orio-panel).
 */
export function AuthFlyoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#050508]/80 backdrop-blur-xl"
        aria-hidden
      />
      <div className="relative z-[1] w-full max-w-lg">{children}</div>
    </div>
  )
}

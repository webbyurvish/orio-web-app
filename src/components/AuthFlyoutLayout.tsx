import LandingPage from '../pages/LandingPage'

/**
 * Renders the landing page as background and a blurred overlay (outside only).
 * Transparency/blur is on the outside; children (the flyout card) should be solid.
 */
export function AuthFlyoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingPage />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 backdrop-blur-md bg-primary-100/30"
          aria-hidden
        />
        {children}
      </div>
    </>
  )
}

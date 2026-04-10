/**
 * Product feature toggles (keep code paths; flip when ready to ship).
 *
 * In-browser call session: screen share + Azure STT + web AI (`BrowserSessionPage`).
 * Desktop app stays the recommended path while this is off.
 *
 * Enable without code changes: set `VITE_FEATURE_BROWSER_SESSION=true` in `.env`.
 */
export const FEATURE_BROWSER_SESSION_ENABLED =
  import.meta.env.VITE_FEATURE_BROWSER_SESSION === 'true'

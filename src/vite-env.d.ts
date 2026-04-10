/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  /** Set to `"true"` to enable in-dashboard browser call sessions. */
  readonly VITE_FEATURE_BROWSER_SESSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

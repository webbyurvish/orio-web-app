import { create } from 'zustand'
import type { UserDto } from '../api/auth'

interface AuthState {
  user: UserDto | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: UserDto, token: string) => void
  logout: () => void
}

const STORAGE_TOKEN = 'pkeet-dashboard-token'
const STORAGE_USER = 'pkeet-dashboard-user'
let tokenExpiryTimer: ReturnType<typeof setTimeout> | null = null

function clearTokenExpiryTimer() {
  if (tokenExpiryTimer) {
    clearTimeout(tokenExpiryTimer)
    tokenExpiryTimer = null
  }
}

function getTokenExpiryMs(token: string): number | null {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null
    const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(normalized)) as { exp?: number }
    if (!payload.exp || Number.isNaN(payload.exp)) return null
    return payload.exp * 1000
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const expMs = getTokenExpiryMs(token)
  if (!expMs) return false
  return Date.now() >= expMs
}

function scheduleAutoLogout(token: string) {
  clearTokenExpiryTimer()
  const expMs = getTokenExpiryMs(token)
  if (!expMs) return
  const delayMs = expMs - Date.now()
  if (delayMs <= 0) {
    useAuthStore.getState().logout()
    return
  }
  tokenExpiryTimer = setTimeout(() => {
    useAuthStore.getState().logout()
  }, delayMs)
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    if (isTokenExpired(token)) {
      localStorage.removeItem(STORAGE_TOKEN)
      localStorage.removeItem(STORAGE_USER)
      set({ user: null, token: null, isAuthenticated: false })
      return
    }
    localStorage.setItem(STORAGE_TOKEN, token)
    localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
    scheduleAutoLogout(token)
  },
  logout: () => {
    clearTokenExpiryTimer()
    localStorage.removeItem(STORAGE_TOKEN)
    localStorage.removeItem(STORAGE_USER)
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

if (typeof window !== 'undefined') {
  const token = localStorage.getItem(STORAGE_TOKEN)
  const userStr = localStorage.getItem(STORAGE_USER)
  if (token && userStr) {
    try {
      if (isTokenExpired(token)) {
        localStorage.removeItem(STORAGE_TOKEN)
        localStorage.removeItem(STORAGE_USER)
      } else {
      const user = JSON.parse(userStr) as UserDto
      useAuthStore.setState({ user, token, isAuthenticated: true })
      scheduleAutoLogout(token)
      }
    } catch {
      localStorage.removeItem(STORAGE_TOKEN)
      localStorage.removeItem(STORAGE_USER)
    }
  }
}

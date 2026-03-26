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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem(STORAGE_TOKEN, token)
    localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
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
      const user = JSON.parse(userStr) as UserDto
      useAuthStore.setState({ user, token, isAuthenticated: true })
    } catch {
      localStorage.removeItem(STORAGE_TOKEN)
      localStorage.removeItem(STORAGE_USER)
    }
  }
}

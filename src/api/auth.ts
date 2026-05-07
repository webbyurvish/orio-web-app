import apiClient from './client'

export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  profilePictureUrl?: string
  isEmailVerified: boolean
  callCredits: number
  unlimitedAccess?: boolean
  planDisplay?: string | null
  hasDiscoveryResponse?: boolean
  isAdmin?: boolean
}

export interface AuthResponse {
  token: string
  user: UserDto
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface RegisterInitiateRequest {
  email: string
}

export interface RegisterVerifyRequest extends RegisterRequest {
  code: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface DesktopAuthInitiateRequest {
  client: string
  redirectUri: string
  state: string
}

export interface DesktopAuthInitiateResponse {
  redirectUrl: string
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data)
    return res.data
  },
  registerInitiate: async (data: RegisterInitiateRequest): Promise<void> => {
    await apiClient.post('/auth/register/initiate', data)
  },
  registerVerify: async (data: RegisterVerifyRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register/verify', data)
    return res.data
  },
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data)
    return res.data
  },
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/google-login', { idToken })
    return res.data
  },
  getCurrentUser: async (): Promise<UserDto> => {
    const res = await apiClient.get<UserDto>('/auth/me')
    return res.data
  },
  saveDiscovery: async (data: { source: string; otherText?: string }): Promise<void> => {
    await apiClient.post('/auth/discovery', data)
  },
  desktopInitiate: async (data: DesktopAuthInitiateRequest): Promise<DesktopAuthInitiateResponse> => {
    const res = await apiClient.post<DesktopAuthInitiateResponse>('/auth/desktop/initiate', data)
    return res.data
  },
}

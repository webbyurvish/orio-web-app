import apiClient from './client'

export interface CallSessionDto {
  id: string
  title: string
  description: string
  resumeId?: string | null
  language: string
  simpleLanguage: boolean
  naturalSpeakingMode?: boolean
  extraContext?: string | null
  aiModel: string
  saveTranscript: boolean
  status: string
  endsAt?: string | null
  endsIn: string
  isFreeSession: boolean
  aiUsage: number
  createdAt: string
}

export interface CreateCallSessionRequest {
  title?: string
  description?: string
  resumeId?: string
  language?: string
  simpleLanguage?: boolean
  naturalSpeakingMode?: boolean
  extraContext?: string
  aiModel?: string
  saveTranscript?: boolean
  isFreeSession?: boolean
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
}

export interface CallSessionMessageDto {
  id: string
  role: string
  content: string
  createdAt: string
}

export interface AiNotesDto {
  notes?: string | null
  updatedAt?: string | null
}

export interface AddCallSessionMessageRequest {
  role?: string
  content?: string
}

export type CallSessionsListView = 'all' | 'live' | 'ended'

export const callSessionsApi = {
  list: async (
    page = 1,
    pageSize = 10,
    view: CallSessionsListView = 'all',
  ): Promise<PagedResult<CallSessionDto>> => {
    const res = await apiClient.get<PagedResult<CallSessionDto>>('/callsessions', {
      params: { page, pageSize, view },
    })
    return res.data
  },

  create: async (data: CreateCallSessionRequest): Promise<CallSessionDto> => {
    const res = await apiClient.post<CallSessionDto>('/callsessions', data)
    return res.data
  },

  update: async (id: string, data: CreateCallSessionRequest): Promise<CallSessionDto> => {
    const res = await apiClient.put<CallSessionDto>(`/callsessions/${id}`, data)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/callsessions/${id}`)
  },

  get: async (sessionId: string): Promise<CallSessionDto> => {
    const res = await apiClient.get<CallSessionDto>(`/callsessions/${sessionId}`)
    return res.data
  },

  getMessages: async (sessionId: string): Promise<CallSessionMessageDto[]> => {
    const res = await apiClient.get<CallSessionMessageDto[]>(`/callsessions/${sessionId}/messages`)
    return res.data
  },

  activate: async (sessionId: string): Promise<CallSessionDto> => {
    const res = await apiClient.post<CallSessionDto>(`/callsessions/${sessionId}/activate`)
    return res.data
  },

  end: async (sessionId: string): Promise<CallSessionDto> => {
    const res = await apiClient.post<CallSessionDto>(`/callsessions/${sessionId}/end`)
    return res.data
  },

  incrementAiUsage: async (sessionId: string): Promise<CallSessionDto> => {
    const res = await apiClient.post<CallSessionDto>(`/callsessions/${sessionId}/ai-usage`)
    return res.data
  },

  getAiNotes: async (sessionId: string): Promise<AiNotesDto> => {
    const res = await apiClient.get<AiNotesDto>(`/callsessions/${sessionId}/ai-notes`)
    return res.data
  },

  generateAiNotes: async (sessionId: string): Promise<AiNotesDto> => {
    const res = await apiClient.post<AiNotesDto>(`/callsessions/${sessionId}/ai-notes/generate`)
    return res.data
  },

  addMessage: async (sessionId: string, data: AddCallSessionMessageRequest): Promise<CallSessionMessageDto> => {
    const res = await apiClient.post<CallSessionMessageDto>(`/callsessions/${sessionId}/messages`, data)
    return res.data
  },

  addMessagesBulk: async (sessionId: string, messages: AddCallSessionMessageRequest[]): Promise<CallSessionMessageDto[]> => {
    const res = await apiClient.post<CallSessionMessageDto[]>(`/callsessions/${sessionId}/messages/bulk`, messages)
    return res.data
  },
}

import apiClient from './client'
import type {
  ResumeDetailDto,
  ResumeDto,
  ResumeInsightsDto,
  ResumeStructuredDocument,
} from '../types/resumeStructured'

export type { ResumeDto, ResumeDetailDto, ResumeStructuredDocument } from '../types/resumeStructured'

const longTimeout = { timeout: 180_000 }

export const resumesApi = {
  list: async (): Promise<ResumeDto[]> => {
    const res = await apiClient.get<ResumeDto[]>('/resumes')
    return res.data
  },

  upload: async (file: File, title: string): Promise<ResumeDto> => {
    const form = new FormData()
    form.append('file', file)
    form.append('title', title)
    const res = await apiClient.post<ResumeDto>('/resumes/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  parseUpload: async (file: File, title: string): Promise<ResumeDetailDto> => {
    const form = new FormData()
    form.append('file', file)
    form.append('title', title)
    const res = await apiClient.post<ResumeDetailDto>('/resumes/parse-upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...longTimeout,
    })
    return res.data
  },

  parseExisting: async (id: string): Promise<ResumeDetailDto> => {
    const res = await apiClient.post<ResumeDetailDto>(`/resumes/${id}/parse`, {}, {
      ...longTimeout,
    })
    return res.data
  },

  /** Blank resume (no file) for manual structured entry in the editor. */
  createManual: async (title?: string): Promise<ResumeDetailDto> => {
    const res = await apiClient.post<ResumeDetailDto>('/resumes/manual', {
      title: title?.trim() || undefined,
    })
    return res.data
  },

  getDetail: async (id: string): Promise<ResumeDetailDto> => {
    const res = await apiClient.get<ResumeDetailDto>(`/resumes/${id}/detail`)
    return res.data
  },

  /** Plain text extracted from the uploaded resume file (for AI context). */
  getPlainText: async (id: string): Promise<string> => {
    const res = await apiClient.get<string>(`/resumes/${id}/text`)
    return res.data ?? ''
  },

  saveStructured: async (id: string, structured: ResumeStructuredDocument): Promise<ResumeDetailDto> => {
    const res = await apiClient.put<ResumeDetailDto>(`/resumes/${id}/structured`, structured)
    return res.data
  },

  patchTitle: async (id: string, title: string): Promise<ResumeDto> => {
    const res = await apiClient.patch<ResumeDto>(`/resumes/${id}`, { title })
    return res.data
  },

  getInsights: async (id: string): Promise<ResumeInsightsDto> => {
    const res = await apiClient.get<ResumeInsightsDto>(`/resumes/${id}/insights`)
    return res.data
  },

  improve: async (
    id: string,
    body: { target: string; text: string },
  ): Promise<{ text: string }> => {
    const res = await apiClient.post<{ text: string }>(`/resumes/${id}/ai/improve`, body, {
      timeout: 90_000,
    })
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`)
  },

  getFileUrl: async (id: string): Promise<string> => {
    const res = await apiClient.get<Blob>(`/resumes/${id}/file`, {
      responseType: 'blob',
    })
    return URL.createObjectURL(res.data)
  },
}

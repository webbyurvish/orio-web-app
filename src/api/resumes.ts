import apiClient from './client'

export interface ResumeDto {
  id: string
  title: string
  fileName: string
  createdAt: string
}

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

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`)
  },

  /** Returns an object URL for the PDF file (revoke with URL.revokeObjectURL when done). */
  getFileUrl: async (id: string): Promise<string> => {
    const res = await apiClient.get<Blob>(`/resumes/${id}/file`, {
      responseType: 'blob',
    })
    return URL.createObjectURL(res.data)
  },
}

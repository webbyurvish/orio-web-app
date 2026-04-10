export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'tools'
  | 'softSkills'
  | 'aiAutomation'
  | 'other'

export interface PersonalBlock {
  fullName: string
  email: string
  phone: string
  location: string
}

export interface SkillGroupDto {
  category: SkillCategory | string
  items: string[]
}

export interface ExperienceEntryDto {
  company: string
  role: string
  duration: string
  location: string
  description: string
  bullets: string[]
}

export interface EducationEntryDto {
  school: string
  degree: string
  timePeriod: string
  location: string
  description: string
}

export interface ProjectEntryDto {
  title: string
  description: string
  technologies: string
}

export interface CertificationEntryDto {
  title: string
  issuer: string
  date: string
  description: string
}

export interface OtherSectionDto {
  title: string
  description: string
}

export interface ParseMetaDto {
  overallConfidence: number
  fieldConfidence: Record<string, number>
  warnings: string[]
  aiFilledFieldPaths: string[]
}

export interface ResumeStructuredDocument {
  personal: PersonalBlock
  summary: string
  skills: SkillGroupDto[]
  experience: ExperienceEntryDto[]
  education: EducationEntryDto[]
  projects: ProjectEntryDto[]
  certifications: CertificationEntryDto[]
  otherSections: OtherSectionDto[]
  sectionOrder: string[]
  parseMeta?: ParseMetaDto | null
}

export interface ResumeDto {
  id: string
  title: string
  fileName: string
  createdAt: string
  updatedAt?: string | null
  hasStructuredData: boolean
}

export interface ResumeDetailDto extends ResumeDto {
  structured: ResumeStructuredDocument
}

export interface ResumeInsightsDto {
  missingFields: string[]
  improvementTips: string[]
}

export const DEFAULT_SECTION_ORDER = [
  'personal',
  'summary',
  'skills',
  'experience',
  'education',
  'projects',
  'certifications',
  'other',
] as const

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  tools: 'Tools',
  softSkills: 'Soft skills',
  aiAutomation: 'AI / Automation',
  other: 'Other',
}

export function emptyResumeStructured(): ResumeStructuredDocument {
  return {
    personal: { fullName: '', email: '', phone: '', location: '' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    otherSections: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    parseMeta: { overallConfidence: 0, fieldConfidence: {}, warnings: [], aiFilledFieldPaths: [] },
  }
}

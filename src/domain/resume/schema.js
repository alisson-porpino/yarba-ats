import { z } from 'zod'
import { DEFAULT_SECTION_ORDER, MAX_BULLETS_PER_JOB, MAX_SKILL_ITEMS_PER_CATEGORY } from './constants.js'

const nonEmpty = (label) => z.string().trim().min(1, `${label} is required`)

const contactSchema = z.object({
  email: z.string().trim().email('Email must be valid').or(z.literal('')),
  github: z.string().trim(),
  linkedin: z.string().trim(),
  website: z.string().trim(),
  location: z.string().trim(),
})

const sectionOrderSchema = z
  .array(z.enum(DEFAULT_SECTION_ORDER))
  .superRefine((value, ctx) => {
    const unique = new Set(value)
    if (unique.size !== DEFAULT_SECTION_ORDER.length || value.length !== DEFAULT_SECTION_ORDER.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'sectionOrder must contain each section exactly once',
      })
    }
  })

const skillCategorySchema = z.object({
  id: z.string().trim().optional(),
  category: nonEmpty('Skill category'),
  items: z.array(z.string().trim().min(1, 'Skill item cannot be empty')).max(MAX_SKILL_ITEMS_PER_CATEGORY),
})

const experienceSchema = z.object({
  id: z.string().trim().optional(),
  company: nonEmpty('Company'),
  period: nonEmpty('Period'),
  role: nonEmpty('Role'),
  bullets: z
    .array(z.string().trim().min(1, 'Bullet cannot be empty'))
    .min(1, 'At least one bullet is required')
    .max(MAX_BULLETS_PER_JOB),
})

const educationSchema = z.object({
  id: z.string().trim().optional(),
  degree: nonEmpty('Degree'),
  institution: nonEmpty('Institution'),
  period: nonEmpty('Education period'),
})

const languageSchema = z.object({
  id: z.string().trim().optional(),
  language: nonEmpty('Language'),
  level: nonEmpty('Language level'),
})

const normalizeResumeLang = (value) => {
  if (typeof value !== 'string') return value
  const lang = value.trim().toLowerCase()
  if (lang === 'pt' || lang === 'br' || lang === 'pt-br' || lang === 'pt_br') return 'pt_br'
  return lang
}

const resumeLangSchema = z.preprocess(
  normalizeResumeLang,
  z.enum(['en', 'pt_br', 'es'])
)

export const resumeSchema = z.object({
  meta: z.object({ lang: resumeLangSchema }),
  header: z.object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters'),
    title: z.string().trim().min(2, 'Professional title must have at least 2 characters'),
    contact: contactSchema,
  }),
  show: z.object({
    linkedin: z.boolean(),
    website: z.boolean(),
    location: z.boolean(),
  }),
  labels: z.object({
    summary: nonEmpty('Summary label'),
    skills: nonEmpty('Skills label'),
    experience: nonEmpty('Experience label'),
    education: nonEmpty('Education label'),
    languages: nonEmpty('Languages label'),
  }),
  sectionOrder: sectionOrderSchema.default(DEFAULT_SECTION_ORDER),
  summary: z.string().trim().min(30, 'Summary must have at least 30 characters'),
  skills: z.array(skillCategorySchema).min(1, 'At least one skills category is required'),
  experience: z.array(experienceSchema).min(1, 'At least one experience entry is required'),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
  languages: z.array(languageSchema).min(1, 'At least one language entry is required'),
})

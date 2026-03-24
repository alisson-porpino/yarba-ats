import { resumeSchema } from './schema.js'

function mapIssue(issue) {
  return `${issue.path.join('.') || 'resume'}: ${issue.message}`
}

function normalizeResumeLanguage(data) {
  const lang = data?.meta?.lang
  if (typeof lang !== 'string') return data

  const normalized = lang.trim().toLowerCase()
  const canonical = (
    normalized === 'pt' ||
    normalized === 'br' ||
    normalized === 'pt-br' ||
    normalized === 'pt_br'
  ) ? 'pt_br' : normalized

  if (canonical === lang) return data
  return { ...data, meta: { ...data.meta, lang: canonical } }
}

export function validateResume(data) {
  return resumeSchema.parse(normalizeResumeLanguage(data))
}

export function validateResumeSafe(data) {
  const result = resumeSchema.safeParse(normalizeResumeLanguage(data))
  if (result.success) return { success: true, data: result.data, errors: [] }

  return {
    success: false,
    data: null,
    errors: result.error.issues.map(mapIssue),
  }
}


import { templates as staticTemplates } from '../templates/index.js'
import { uid } from './uid.js'
import { formatTemplateLanguage } from './i18n.js'

const IS_ONLINE = import.meta.env.VITE_APP_MODE === 'online'
const STORAGE_KEY = 'yarba_user_templates'


export function getAllTemplates() {
  if (!IS_ONLINE) return staticTemplates

  const userTemplates = loadFromStorage()
  return [...staticTemplates, ...userTemplates]
}


export function saveTemplate(data, filename, name, description) {
  if (!IS_ONLINE) {
    return { mode: 'download' }
  }

  const lang = formatTemplateLanguage(data.meta?.lang)
  const tags = (data.skills?.[0]?.items?.slice(0, 3) || [])
    .concat(data.skills?.[1]?.items?.slice(0, 2) || [])

  const template = {
    id:          filename + '-' + uid(),
    name,
    description: description || `${name} • ${lang}`,
    lang,
    tags,
    isUserSaved: true,
    data: stripIds(data),
  }

  const existing = loadFromStorage()
  const updated = existing.filter(t => !t.id.startsWith(filename))
  updated.push(template)
  saveToStorage(updated)

  return { mode: 'saved', template }
}

export function deleteUserTemplate(id) {
  if (!IS_ONLINE) return
  const existing = loadFromStorage()
  saveToStorage(existing.filter(t => t.id !== id))
}

export const isOnlineMode = IS_ONLINE


function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return parsed.map(template => {
      const normalizedLang = formatTemplateLanguage(template?.lang || template?.data?.meta?.lang)
      const normalizedDescription = typeof template?.description === 'string'
        ? template.description.replace(/\bPT[_-]?BR\b/gi, 'BR')
        : template?.description

      return {
        ...template,
        lang: normalizedLang,
        description: normalizedDescription,
      }
    })
  } catch {
    return []
  }
}

function saveToStorage(templates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch {
  }
}

function stripIds(data) {
  const strip = arr => (arr || []).map(({ id: _id, ...rest }) => rest)
  return {
    ...data,
    skills:     strip(data.skills),
    experience: strip(data.experience),
    education:  strip(data.education),
    languages:  strip(data.languages),
  }
}

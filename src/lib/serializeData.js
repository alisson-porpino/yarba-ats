import { uid } from './uid.js'
import { formatTemplateLanguage } from './i18n.js'

const stripIds = (arr) => arr.map(({ id: _id, ...rest }) => rest)

const addIds = (arr) => (arr || []).map(item => ({ ...item, id: uid() }))
export function toJSON(data) {
  const clean = {
    meta:         data.meta,
    header:       data.header,
    show:         data.show,
    labels:       data.labels,
    sectionOrder: data.sectionOrder || ['summary', 'skills', 'experience', 'education', 'languages'],
    summary:      data.summary,
    skills:       stripIds(data.skills).map(s => ({ ...s })),
    experience:   stripIds(data.experience).map(e => ({ ...e })),
    education:    stripIds(data.education),
    languages:    stripIds(data.languages),
  }
  return JSON.stringify(clean, null, 2)
}

export function fromJSON(jsonStr) {
  let parsed

  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    throw new Error('Invalid JSON file. Make sure you are loading a resume .json file saved from this editor.')
  }

  const required = ['meta', 'header', 'summary', 'skills', 'experience', 'education', 'languages']
  for (const key of required) {
    if (!(key in parsed)) {
      throw new Error(`Missing field "${key}". This file doesn't look like a resume file saved from this editor.`)
    }
  }

  return {
    meta:       parsed.meta,
    header:     parsed.header,
    show:         parsed.show         ?? { linkedin: true, website: true, location: true },
    labels:       parsed.labels,
    sectionOrder: parsed.sectionOrder ?? ['summary', 'skills', 'experience', 'education', 'languages'],
    summary:    parsed.summary    ?? '',
    skills:     addIds(parsed.skills),
    experience: addIds(parsed.experience),
    education:  addIds(parsed.education),
    languages:  addIds(parsed.languages),
  }
}

export function fromData(data) {
  return fromJSON(JSON.stringify(data))
}

export function toTemplateFile(data, id, name, description) {
  const clean = {
    meta:       data.meta,
    header:     data.header,
    show:       data.show,
    labels:     data.labels,
    summary:    data.summary,
    skills:     stripIds(data.skills),
    experience: stripIds(data.experience),
    education:  stripIds(data.education),
    languages:  stripIds(data.languages),
  }

  const lang = formatTemplateLanguage(data.meta?.lang)

  const tags = (data.skills?.[0]?.items?.slice(0, 3) || [])
    .concat(data.skills?.[1]?.items?.slice(0, 2) || [])

  return `export default {
  id: '${id}',
  name: '${name}',
  description: '${description}',
  lang: '${lang}',
  tags: ${JSON.stringify(tags)},

  data: ${JSON.stringify(clean, null, 2)},
}
`
}

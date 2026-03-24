
import { uid } from './uid.js'
import { DEFAULT_LABELS } from './i18n.js'


export async function extractTextFromPdf(file) {
  const pdfjsLib = await import('pdfjs-dist')
  const { default: pdfWorkerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

  const pdf      = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise
  const allLines = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page    = await pdf.getPage(p)
    const content = await page.getTextContent()

    const byY = new Map()
    for (const item of content.items) {
      if (!item.str.trim()) continue
      const y = Math.round(item.transform[5])
      let bucket = null
      for (const [key] of byY) {
        if (Math.abs(key - y) <= 3) { bucket = key; break }
      }
      const k = bucket ?? y
      if (!byY.has(k)) byY.set(k, [])
      byY.get(k).push({ str: item.str, x: item.transform[4] })
    }

    const sorted = [...byY.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, items]) =>
        items.sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim()
      )
      .filter(Boolean)

    allLines.push(...sorted, '')
  }

  return allLines
}


const SECTION_MAP = {
  summary:    /^(professional\s+)?summary$|^resumo\s+profissional$|^perfil$|^objective$|^sobre\s+mim$|^resumen\s+profesional$/i,
  skills:     /^(technical\s+)?skills$|^habilidades\s+t[eé]cnicas$|^competencias$|^stack$|^technologies$/i,
  experience: /^(professional\s+)?experience$|^experi[eê]ncia\s+profissional$|^experiencia\s+profesional$|^work\s+history$/i,
  education:  /^education$|^educa[cç][aã]o$|^forma[cç][aã]o\s+acad[eê]mica$|^educaci[oó]n$/i,
  languages:  /^languages$|^idiomas$|^l[íi]nguas$/i,
  projects:   /^projects?$|^projetos?$|^proyectos?$/i,
}

function detectSection(line) {
  const clean = line.replace(/[:\-–—*#]/g, '').trim()
  for (const [type, re] of Object.entries(SECTION_MAP)) {
    if (re.test(clean)) return type
  }
  return null
}

function isSectionHeader(line) {
  if (!line || line.length > 70) return false
  const clean = line.replace(/[:\-–—*#]/g, '').trim()
  if (detectSection(clean)) return true

  return /^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖÙÚÛÜÝÞŸ\s&/]+$/.test(clean) &&
         clean.length > 3 &&
         clean.length < 50
}


const EMAIL_RE    = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i
const GITHUB_RE   = /github\.com\/([\w-]+)/i
const LINKEDIN_RE = /linkedin\.com\/in\/([\w-]+)/i
const WEBSITE_RE  = /(?:https?:\/\/)?(?!linkedin|github)([\w-]+\.(?:com|io|dev|me|co|net|org|app)(?:\/[\w/-]*)?)/i
const DATE_RANGE  = /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\w*\.?\s+\d{4}|\d{4}|\d{2}\/\d{4})\s*[-–—]\s*(\b(?:present|atual|current|now|hoje|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\w*\.?\s*\d{0,4}|\d{4}|\d{2}\/\d{4})/i

function parseContact(lines) {
  const text    = lines.join(' ')
  const contact = { email: '', github: '', linkedin: '', website: '', location: '' }

  const emailM    = text.match(EMAIL_RE)
  const githubM   = text.match(GITHUB_RE)
  const linkedinM = text.match(LINKEDIN_RE)

  if (emailM)    contact.email    = emailM[0]
  if (githubM)   contact.github   = `github.com/${githubM[1]}`
  if (linkedinM) contact.linkedin = `linkedin.com/in/${linkedinM[1]}`

  for (const line of lines) {
    if (!line.includes('|') && !EMAIL_RE.test(line)) continue
    const parts = line.split('|').map(s => s.trim()).filter(Boolean)

    for (const part of parts) {
      if (EMAIL_RE.test(part))    { if (!contact.email)    contact.email    = part.match(EMAIL_RE)[0]; continue }
      if (GITHUB_RE.test(part))   { if (!contact.github)   contact.github   = `github.com/${part.match(GITHUB_RE)[1]}`; continue }
      if (LINKEDIN_RE.test(part)) { if (!contact.linkedin) contact.linkedin = `linkedin.com/in/${part.match(LINKEDIN_RE)[1]}`; continue }

      const webM = part.match(/(?:https?:\/\/)?([a-z0-9][a-z0-9-]*\.[a-z]{2,}(?:\/[^\s]*)?)/i)
      if (webM && !GITHUB_RE.test(part) && !LINKEDIN_RE.test(part) && !EMAIL_RE.test(part)) {
        if (!contact.website && part.length > 5 && part.length < 60) {
          contact.website = part.replace(/^https?:\/\//, '')
          continue
        }
      }

      if (!contact.location && part.length > 2 && part.length < 60) {
        if (/[,\/]/.test(part) || /\bremote\b/i.test(part) || /\b[A-Z][a-z]/.test(part)) {
          if (!/^[A-Z\s]+$/.test(part)) {
            contact.location = part
          }
        }
      }
    }
  }

  return contact
}


function parseExperience(lines) {
  const jobs = []
  let current = null
  let roleSet = false

  const flush = () => {
    if (current) {
      current.bullets = current.bullets.filter(b => b.trim())
      jobs.push(current)
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const dateMatch = line.match(DATE_RANGE)

    if (dateMatch) {
      flush()
      const period    = dateMatch[0]
      const remainder = line.replace(period, '').replace(/\s{2,}/g, ' ').trim()

      let company = '', role = ''

      if (remainder.includes('|')) {
        ;[company, role] = remainder.split('|').map(s => s.trim())
      } else if (remainder.includes('·')) {
        ;[company, role] = remainder.split('·').map(s => s.trim())
      } else {
        company = remainder

        const nextLine = lines[i + 1]?.trim() || ''
        if (nextLine && !DATE_RANGE.test(nextLine) && !isSectionHeader(nextLine) && nextLine.length < 80) {
          role = nextLine
          i++
        }
      }

      current  = { company, period, role, bullets: [] }
      roleSet  = !!role
    } else if (current) {
      if (!roleSet && !line.startsWith('•') && line.length < 80) {
        current.role = line
        roleSet = true
        continue
      }

      const hasBulletMarker = /^[•·\-–—]\s/.test(line)
      const looksLikeBullet = line.length >= 35 && /^[A-ZÁÉÍÓÚÀÂÊÔ]/i.test(line)
      const prev = current.bullets[current.bullets.length - 1]

      if (hasBulletMarker) {
        current.bullets.push(line.replace(/^[•·\-–—]\s*/, '').trim())
      } else if (prev && !prev.match(/[.!?]\s*$/) && line.length < 150) {
        current.bullets[current.bullets.length - 1] = prev + ' ' + line
      } else if (looksLikeBullet && roleSet) {
        current.bullets.push(line)
      }
    }
  }

  flush()
  return jobs.filter(j => j.company || j.role)
}


function parseSkills(lines) {
  const categories = []

  for (const line of lines) {
    const clean = line.trim()
    if (!clean) continue

    const colonIdx = clean.indexOf(':')

    if (colonIdx > 0 && colonIdx < 40) {
      const cat   = clean.slice(0, colonIdx).trim()
      const rest  = clean.slice(colonIdx + 1).trim()
      const items = rest.split(/[,;]/).map(s => s.trim()).filter(Boolean)
      if (cat && !/^skills?$/i.test(cat) && items.length >= 1) {
        categories.push({ id: uid(), category: cat, items })
        continue
      }
    }

    const last = categories[categories.length - 1]
    const items = clean.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1)

    if (items.length >= 1 && last) {
      const looksLikeContinuation =
        !clean.match(/^[A-Z][a-z].*:/) ||
        clean.startsWith('(') ||
        /^[a-z(]/.test(clean)
      if (looksLikeContinuation) {
        last.items.push(...items)
        continue
      }
    }

    if (items.length >= 2) {
      categories.push({ id: uid(), category: 'Skills', items })
    }
  }

  return categories.length ? categories : [{ id: uid(), category: 'Skills', items: [] }]
}


function parseEducation(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    const clean = line.trim()
    if (!clean) continue

    const isDegree = /bachelor|master|phd|doctorat|associate|bacharelado|licenciatura|mestrado|doutorado|técnico|technician|degree|diploma|certificad|certificate|graduação/i.test(clean)
    const periodMatch = clean.match(DATE_RANGE) || clean.match(/\b(\d{4})\s*[-–]\s*(\d{4}|present|atual)\b/i)

    if (isDegree) {
      if (current) entries.push(current)
      const period = periodMatch ? periodMatch[0] : ''
      const withoutPeriod = clean.replace(period, '').replace(/\|\s*$/, '').trim()
      const parts = withoutPeriod.split('|').map(s => s.trim())
      current = {
        degree:      parts[0] || clean,
        institution: parts[1] || '',
        period,
      }
    } else if (current) {
      if (!current.institution && clean.length < 80 && !periodMatch) {
        current.institution = clean
      } else if (periodMatch && !current.period) {
        current.period = periodMatch[0]
      }
    }
  }

  if (current) entries.push(current)
  return entries.filter(e => e.degree).map(e => ({ ...e, id: uid() }))
}


function parseLanguages(lines) {
  const langs = []

  for (const line of lines) {
    const clean = line.trim()
    if (!clean || clean.length > 120) continue

    const segments = clean.split(/\s*[|]\s*/)
    for (const seg of segments) {
      const parts = seg.split(/\s*[-–—:()\s]+\s*/).filter(Boolean)
      if (parts.length >= 1 && parts[0].length < 30 && /^[A-ZÀ-Ú]/i.test(parts[0])) {
        langs.push({
          id:       uid(),
          language: parts[0].trim(),
          level:    parts.slice(1).join(' ').trim(),
        })
      }
    }
  }

  return langs
}


export function parseResumeText(lines) {

  const sections  = { _header: [] }
  let currentSec  = '_header'

  for (const line of lines) {
    if (!line.trim()) continue
    const secType = isSectionHeader(line) ? detectSection(line) : null
    if (secType) {
      currentSec = secType
      if (!sections[currentSec]) sections[currentSec] = []
    } else {
      if (!sections[currentSec]) sections[currentSec] = []
      sections[currentSec].push(line)
    }
  }

  const headerLines = sections._header || []

  const name = headerLines[0]?.trim() || ''

  const titleCandidate = headerLines[1]?.trim() || ''
  const title = (
    titleCandidate &&
    !EMAIL_RE.test(titleCandidate) &&
    titleCandidate.length < 80
  ) ? titleCandidate : ''

  const contact = parseContact(headerLines)

  const allText   = lines.join(' ')
  const detectedLang =
    /\b(experiência|habilidades|resumo|formação|idiomas)\b/i.test(allText) ? 'pt_br' :
    /\b(experiencia|habilidades|educación)\b/i.test(allText)              ? 'es' : 'en'

  return {
    meta:        { lang: detectedLang },
    header:      { name, title, contact },
    show:        {
      linkedin: !!contact.linkedin,
      website:  !!contact.website,
      location: !!contact.location,
    },
    labels:       DEFAULT_LABELS[detectedLang] || DEFAULT_LABELS.en,
    sectionOrder: ['summary', 'skills', 'experience', 'education', 'languages'],
    summary:      (sections.summary   || []).join(' ').trim(),
    skills:       parseSkills(sections.skills     || []),
    experience:   parseExperience(sections.experience || []),
    education:    parseEducation(sections.education  || []),
    languages:    parseLanguages(sections.languages  || []),
  }
}


export async function importPdfToData(file, onProgress = () => {}) {
  onProgress('reading')
  const lines = await extractTextFromPdf(file)

  if (!lines || lines.join('').length < 30) {
    throw new Error(
      'No text found. The PDF may be a scanned image. ' +
      'Try a PDF generated from a text editor.'
    )
  }

  onProgress('parsing')
  const data = parseResumeText(lines)

  if (!data.header.name && !data.summary && !data.experience.length) {
    throw new Error(
      'Could not extract resume data. Try a single-column text-based PDF.'
    )
  }

  onProgress('done')
  return data
}

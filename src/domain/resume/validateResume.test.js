import { describe, expect, it } from 'vitest'
import { makeBlankPreset } from '../../lib/blankPreset.js'
import { validateResumeSafe } from './validateResume.js'

function makeValidResume() {
  const data = makeBlankPreset('en')

  data.header.name = 'John Doe'
  data.header.title = 'Software Engineer'
  data.header.contact.email = 'john@doe.com'
  data.summary = 'Senior engineer with over ten years building reliable web systems and APIs.'

  data.skills = [{ id: 'a', category: 'Languages', items: ['JavaScript', 'Python'] }]
  data.experience = [{
    id: 'b',
    company: 'ACME',
    period: '2021 - Present',
    role: 'Senior Engineer',
    bullets: ['Built scalable backend services with measurable impact.'],
  }]
  data.education = [{ id: 'c', degree: 'BSc Computer Science', institution: 'University', period: '2014 - 2018' }]
  data.languages = [{ id: 'd', language: 'English', level: 'Fluent' }]

  return data
}

describe('validateResumeSafe', () => {
  it('returns success for a valid resume', () => {
    const result = validateResumeSafe(makeValidResume())
    expect(result.success).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('returns errors for invalid required fields', () => {
    const invalid = makeBlankPreset('en')
    const result = validateResumeSafe(invalid)

    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})

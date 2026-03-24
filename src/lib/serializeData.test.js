import { describe, expect, it } from 'vitest'
import { toJSON, fromJSON } from './serializeData.js'
import { makeBlankPreset } from './blankPreset.js'

function makeResume() {
  const d = makeBlankPreset('en')
  d.header.name = 'John Doe'
  d.header.title = 'Engineer'
  d.summary = 'Senior engineer with extensive experience in frontend and backend systems.'
  d.skills = [{ id: 's1', category: 'Languages', items: ['JS', 'Python'] }]
  d.experience = [{ id: 'e1', company: 'ACME', period: '2020 - Present', role: 'Engineer', bullets: ['Did important work.'] }]
  d.education = [{ id: 'ed1', degree: 'BSc CS', institution: 'Uni', period: '2014 - 2018' }]
  d.languages = [{ id: 'l1', language: 'English', level: 'Fluent' }]
  return d
}

describe('serializeData', () => {
  it('round-trips resume data via JSON', () => {
    const original = makeResume()
    const raw = toJSON(original)
    const loaded = fromJSON(raw)

    expect(loaded.header.name).toBe(original.header.name)
    expect(loaded.skills[0].category).toBe('Languages')
    expect(loaded.experience[0].bullets[0]).toBe('Did important work.')
  })

  it('throws a descriptive error for invalid JSON', () => {
    expect(() => fromJSON('{invalid')).toThrow('Invalid JSON file')
  })
})

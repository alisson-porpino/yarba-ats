import { describe, expect, it } from 'vitest'
import { generateHTML } from './generateHTML.js'

const baseData = {
  meta: { lang: 'en' },
  header: {
    name: 'John Doe',
    title: 'Senior Engineer',
    contact: {
      email: 'john@doe.com',
      github: 'github.com/johndoe',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.dev',
      location: 'Remote',
    },
  },
  show: { linkedin: true, website: true, location: true },
  labels: {
    summary: 'Summary',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    languages: 'Languages',
  },
  sectionOrder: ['summary', 'skills', 'experience', 'education', 'languages'],
  summary: 'Built **critical system** for global customers.',
  skills: [{ id: '1', category: 'Languages', items: ['JavaScript'] }],
  experience: [{ id: '2', company: 'Acme', period: '2020 - Present', role: 'Engineer', bullets: ['Improved uptime to **99.99%**.'] }],
  education: [{ id: '3', degree: 'BSc', institution: 'Uni', period: '2014 - 2018' }],
  languages: [{ id: '4', language: 'English', level: 'Fluent' }],
}

describe('generateHTML', () => {
  it('renders ATS-safe semantic structure', () => {
    const html = generateHTML(baseData)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<h1')
    expect(html).toContain('Summary')
    expect(html).toContain('Skills')
  })

  it('renders markdown bold as strong tags', () => {
    const html = generateHTML(baseData)
    expect(html).toContain('<strong>critical system</strong>')
    expect(html).toContain('<strong>99.99%</strong>')
  })
})

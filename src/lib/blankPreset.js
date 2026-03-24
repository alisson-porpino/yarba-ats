
import { uid } from './uid.js'
import { DEFAULT_LABELS } from './i18n.js'

export function makeBlankPreset(lang = 'en') {
  const labels = DEFAULT_LABELS[lang] || DEFAULT_LABELS.en

  return {
    meta: { lang },

    header: {
      name:  '',
      title: '',
      contact: {
        email:    '',
        github:   '',
        linkedin: '',
        website:  '',
        location: '',
      },
    },

    show: { linkedin: true, website: true, location: true },

    labels,

    sectionOrder: ['summary', 'skills', 'experience', 'education', 'languages'],

    summary: '',

    skills: [
      { id: uid(), category: 'Languages & Frameworks', items: [] },
    ],

    experience: [
      { id: uid(), company: '', period: '', role: '', bullets: [''] },
    ],

    education: [
      { id: uid(), degree: '', institution: '', period: '' },
    ],

    languages: [
      { id: uid(), language: '', level: '' },
    ],
  }
}

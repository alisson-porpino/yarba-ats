import { useState } from 'react'
import { T, S } from '../../styles/tokens.js'
import { Field } from '../ui/Field.jsx'
import { uid } from '../../lib/uid.js'
import { SectionLabelField } from '../ui/SectionLabelField.jsx'

export function ExperienceEditor({ data, update, ui }) {
  const [openId, setOpenId] = useState(null)

  const setLabel = (val) =>
    update({ ...data, labels: { ...data.labels, experience: val } })

  const toggleOpen = (id) => setOpenId(prev => prev === id ? null : id)

  const updateJob = (id, key, val) =>
    update({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, [key]: val } : e) })

  const updateBullet = (jobId, idx, val) =>
    update({
      ...data,
      experience: data.experience.map(e =>
        e.id !== jobId ? e : { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) }
      ),
    })

  const addBullet = (jobId) =>
    update({
      ...data,
      experience: data.experience.map(e =>
        e.id === jobId ? { ...e, bullets: [...e.bullets, ''] } : e
      ),
    })

  const removeBullet = (jobId, idx) =>
    update({
      ...data,
      experience: data.experience.map(e =>
        e.id !== jobId ? e : { ...e, bullets: e.bullets.filter((_, i) => i !== idx) }
      ),
    })

  const addJob = () => {
    const id = uid()
    update({
      ...data,
      experience: [
        ...data.experience,
        { id, company: ui.expCompany, period: '', role: ui.expRole, bullets: [''] },
      ],
    })
    setOpenId(id)
  }

  const removeJob = (id) =>
    update({ ...data, experience: data.experience.filter(e => e.id !== id) })

  return (
    <div>
      <SectionLabelField value={data.labels?.experience} onChange={setLabel} hint={ui.sectionTitleHint} label={ui.sectionTitle} />

      {data.experience.map(job => (
        <div key={job.id} style={S.card}>
          
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleOpen(job.id)}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: T.text, fontFamily: T.font }}>
                {job.company || ui.expCompany}
              </div>
              <div style={{ fontSize: '11px', color: T.muted, fontFamily: T.font }}>
                {job.role} · {job.period}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ color: T.muted, fontSize: '11px' }}>{openId === job.id ? '▲' : '▼'}</span>
              <button type="button" style={S.btnGhost} onClick={e => { e.stopPropagation(); removeJob(job.id) }} aria-label="Remove experience item">✕</button>
            </div>
          </div>

          
          {openId === job.id && (
            <div style={{ marginTop: '13px', borderTop: `1px solid ${T.border}`, paddingTop: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label={ui.expCompany} value={job.company} onChange={v => updateJob(job.id, 'company', v)} />
                <Field label={ui.expRole}    value={job.role}    onChange={v => updateJob(job.id, 'role', v)} />
              </div>
              <Field
                label={ui.expPeriod}
                value={job.period}
                onChange={v => updateJob(job.id, 'period', v)}
                placeholder="Jan 2023 - Present"
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={S.label}>{ui.expBullets}</span>
                <span style={{ fontSize: '10px', color: T.muted, fontFamily: T.font }}>
                  {ui.expBulletsHint.replace('**text**', '').trim()}{' '}
                  <code style={{ color: T.accent, background: '#1a1a1a', padding: '1px 4px', borderRadius: '3px' }}>**text**</code>
                </span>
              </div>
              {job.bullets.map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <textarea
                    style={{ ...S.textarea, flex: 1, minHeight: '54px', marginBottom: 0, fontSize: '11px' }}
                    value={bullet}
                    onChange={e => updateBullet(job.id, idx, e.target.value)}
                    placeholder="Start with action verb + metric..."
                  />
                  <button type="button" style={{ ...S.btnGhost, alignSelf: 'flex-start' }} onClick={() => removeBullet(job.id, idx)} aria-label="Remove bullet">✕</button>
                </div>
              ))}
              <button type="button" style={{ ...S.btnPrimary, fontSize: '11px', marginTop: '2px' }} onClick={() => addBullet(job.id)}>
                {ui.expAddBullet}
              </button>
            </div>
          )}
        </div>
      ))}

      <button type="button" style={{ ...S.btnPrimary, width: '100%', marginTop: '2px' }} onClick={addJob}>
        {ui.expAddJob}
      </button>
    </div>
  )
}

import { T, S } from '../../styles/tokens.js'
import { Field } from '../ui/Field.jsx'
import { uid } from '../../lib/uid.js'
import { SectionLabelField } from '../ui/SectionLabelField.jsx'

export function EducationEditor({ data, update, ui }) {
  const setLabel = (val) =>
    update({ ...data, labels: { ...data.labels, education: val } })


  const setEdu = (id, key, val) =>
    update({ ...data, education: data.education.map(e => e.id === id ? { ...e, [key]: val } : e) })

  const addEdu = () =>
    update({ ...data, education: [...data.education, { id: uid(), degree: '', institution: '', period: '' }] })

  const removeEdu = (id) =>
    update({ ...data, education: data.education.filter(e => e.id !== id) })

  return (
    <div>
      <SectionLabelField value={data.labels?.education} onChange={setLabel} hint={ui.sectionTitleHint} label={ui.sectionTitle} />

      {data.education.map(edu => (
        <div key={edu.id} style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button type="button" style={S.btnGhost} onClick={() => removeEdu(edu.id)}>✕ {ui.expRemove}</button>
          </div>
          <Field
            label={ui.degreeLabel}
            value={edu.degree}
            onChange={v => setEdu(edu.id, 'degree', v)}
            placeholder="Bachelor's in Computer Science"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <Field label={ui.institutionLabel} value={edu.institution} onChange={v => setEdu(edu.id, 'institution', v)} placeholder="University Name" />
            <Field label={ui.periodLabel}      value={edu.period}      onChange={v => setEdu(edu.id, 'period', v)}      placeholder="2017 - 2021" />
          </div>
        </div>
      ))}
      <button type="button" style={{ ...S.btnPrimary, width: '100%' }} onClick={addEdu}>
        {ui.addEducation}
      </button>


    </div>
  )
}

import { useState } from 'react'
import { T, S } from '../../styles/tokens.js'
import { uid } from '../../lib/uid.js'
import { SectionLabelField } from '../ui/SectionLabelField.jsx'

export function SkillsEditor({ data, update, ui }) {
  const [draft, setDraft] = useState({})

  const setLabel = (val) =>
    update({ ...data, labels: { ...data.labels, skills: val } })

  const addItem = (catId) => {
    const val = (draft[catId] || '').trim()
    if (!val) return
    update({ ...data, skills: data.skills.map(s => s.id === catId ? { ...s, items: [...s.items, val] } : s) })
    setDraft(prev => ({ ...prev, [catId]: '' }))
  }

  const removeItem = (catId, item) =>
    update({ ...data, skills: data.skills.map(s => s.id === catId ? { ...s, items: s.items.filter(i => i !== item) } : s) })

  const updateCategory = (id, val) =>
    update({ ...data, skills: data.skills.map(s => s.id === id ? { ...s, category: val } : s) })

  const removeCategory = (id) =>
    update({ ...data, skills: data.skills.filter(s => s.id !== id) })

  const addCategory = () =>
    update({ ...data, skills: [...data.skills, { id: uid(), category: ui.skillsCategory, items: [] }] })

  return (
    <div>
      <SectionLabelField value={data.labels?.skills} onChange={setLabel} hint={ui.sectionTitleHint} label={ui.sectionTitle} />

      {data.skills.map(cat => (
        <div key={cat.id} style={S.card}>
          <div style={{ display: 'flex', gap: '7px', marginBottom: '10px', alignItems: 'center' }}>
            <input
              style={{ ...S.input, fontWeight: 600 }}
              value={cat.category}
              onChange={e => updateCategory(cat.id, e.target.value)}
              placeholder={ui.skillsCategory}
            />
            <button type="button" style={S.btnGhost} onClick={() => removeCategory(cat.id)} aria-label="Remove skills category">✕</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '9px' }}>
            {cat.items.map(item => (
              <span key={item} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: '#1e1e1e', border: `1px solid ${T.border}`,
                borderRadius: '4px', padding: '3px 8px',
                fontSize: '11px', color: '#c8c6c0', fontFamily: T.font,
              }}>
                {item}
                <button type="button" onClick={() => removeItem(cat.id, item)} aria-label="Remove skill item" style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: '13px', lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              style={{ ...S.input, flex: 1, fontSize: '11px' }}
              value={draft[cat.id] || ''}
              onChange={e => setDraft(prev => ({ ...prev, [cat.id]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addItem(cat.id)}
              placeholder="Type skill and press Enter →"
            />
            <button type="button" style={S.btnPrimary} onClick={() => addItem(cat.id)} aria-label="Add skill item">+</button>
          </div>
        </div>
      ))}

      <button type="button" style={{ ...S.btnPrimary, width: '100%', marginTop: '2px' }} onClick={addCategory}>
        + {ui.skillsCategory}
      </button>
    </div>
  )
}

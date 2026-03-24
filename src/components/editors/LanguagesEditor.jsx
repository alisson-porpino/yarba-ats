import { T, S } from '../../styles/tokens.js'
import { uid } from '../../lib/uid.js'
import { SectionLabelField } from '../ui/SectionLabelField.jsx'

export function LanguagesEditor({ data, update, ui }) {
  const setLabel = (val) =>
    update({ ...data, labels: { ...data.labels, languages: val } })

  const setLang = (id, key, val) =>
    update({ ...data, languages: data.languages.map(l => l.id === id ? { ...l, [key]: val } : l) })

  const addLang = () =>
    update({ ...data, languages: [...data.languages, { id: uid(), language: '', level: '' }] })

  const removeLang = (id) =>
    update({ ...data, languages: data.languages.filter(l => l.id !== id) })

  return (
    <div>
      <SectionLabelField
        value={data.labels?.languages}
        onChange={setLabel}
        hint={ui.sectionTitleHint}
        label={ui.sectionTitle}
      />

      {data.languages.map((lang, idx) => (
        <div key={lang.id} style={{ ...S.card, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            fontSize: '11px', color: T.muted, fontFamily: T.font,
            flexShrink: 0, width: '18px', textAlign: 'center',
          }}>
            {idx + 1}
          </span>
          <input
            style={{ ...S.input, flex: '0 0 140px' }}
            value={lang.language}
            onChange={e => setLang(lang.id, 'language', e.target.value)}
            placeholder={ui.languageName}
          />
          <input
            style={{ ...S.input, flex: 1 }}
            value={lang.level}
            onChange={e => setLang(lang.id, 'level', e.target.value)}
            placeholder={ui.languageLevel}
          />
          <button type="button" style={S.btnGhost} onClick={() => removeLang(lang.id)} aria-label="Remove language">✕</button>
        </div>
      ))}

      <button type="button" style={{ ...S.btnPrimary, width: '100%', marginTop: '4px' }} onClick={addLang}>
        {ui.addLanguage}
      </button>
    </div>
  )
}

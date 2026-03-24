import { T, S } from '../../styles/tokens.js'
import { SectionLabelField } from '../ui/SectionLabelField.jsx'

export function SummaryEditor({ data, update, ui }) {
  const setLabel = (val) =>
    update({ ...data, labels: { ...data.labels, summary: val } })

  return (
    <div>
      <SectionLabelField
        value={data.labels?.summary}
        onChange={setLabel}
        hint={ui.sectionTitleHint}
        label={ui.sectionTitle}
      />

      
      <div style={{
        background: 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '6px', padding: '10px 12px', marginBottom: '14px',
      }}>
        <p style={{ fontSize: '11px', color: T.accent, fontFamily: T.font, lineHeight: 1.5 }}>
          <strong>ATS TIP</strong> — {ui.atsTip.replace('**keyword**', '').replace(/Use .+ to bold/, 'Use')}
          {' '}<span style={{ color: '#fff', background: '#2a2a2a', padding: '1px 5px', borderRadius: '3px', fontFamily: T.font }}>**keyword**</span>
          {' '}to bold key terms.
        </p>
      </div>

      <span style={S.label}>{ui.nav.summary}</span>
      <textarea
        style={{ ...S.textarea, minHeight: '180px', lineHeight: 1.55 }}
        value={data.summary}
        onChange={e => update({ ...data, summary: e.target.value })}
        placeholder={ui.summaryPlaceholder}
      />
    </div>
  )
}

import { T, S } from '../../styles/tokens.js'
import { useId } from 'react'

export function SectionLabelField({ value, onChange, hint, label = 'Section title' }) {
  const id = useId()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: '#0f0f0f',
      border: `1px solid #2a2a2a`,
      borderRadius: '6px',
      padding: '8px 11px',
      marginBottom: '18px',
    }}>
      <label htmlFor={id} style={{
        fontSize: '10px', fontWeight: 600, color: T.muted,
        fontFamily: T.font, letterSpacing: '0.06em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          ...S.input,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid #2a2a2a`,
          borderRadius: 0,
          padding: '2px 4px',
          fontSize: '12px',
          fontWeight: 600,
          color: T.accent,
          outline: 'none',
          flex: 1,
        }}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        title={hint}
      />
    </div>
  )
}

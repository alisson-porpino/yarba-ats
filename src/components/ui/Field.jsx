import { useId } from 'react'
import { S } from '../../styles/tokens.js'

export function Field({ label, value, onChange, textarea, placeholder, rows = 3, style = {} }) {
  const id = useId()

  return (
    <div style={{ marginBottom: '12px' }}>
      {label && <label htmlFor={id} style={S.label}>{label}</label>}
      {textarea ? (
        <textarea
          id={id}
          style={{ ...S.textarea, minHeight: `${rows * 22}px`, ...style }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          style={{ ...S.input, ...style }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

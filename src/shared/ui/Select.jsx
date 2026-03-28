import { T } from '../../styles/tokens.js'

export function Select({ value, onChange, options, style, ariaLabel = 'Select option' }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
        style={{
          background: '#1a1a1a',
          border: `1px solid ${T.border}`,
          borderRadius: '5px',
          color: T.text,
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: T.font,
          padding: '5px 28px 5px 10px',
          cursor: 'pointer',
          outline: 'none',
          letterSpacing: '0.04em',
          appearance: 'none',
          WebkitAppearance: 'none',
          width: '100%',
        }}
      >
        {options.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
      </select>
      <span style={{
        position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: T.muted, fontSize: '9px',
      }}>▾</span>
    </div>
  )
}

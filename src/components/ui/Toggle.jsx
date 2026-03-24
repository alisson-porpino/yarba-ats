import { T } from '../../styles/tokens.js'

export function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      aria-label={on ? 'Hide field' : 'Show field'}
      style={{
        width: '34px', height: '19px', borderRadius: '10px', flexShrink: 0,
        background: on ? T.accent : T.border,
        position: 'relative', border: 'none', cursor: 'pointer',
        transition: 'background .2s',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: on ? '17px' : '3px',
        width: '13px', height: '13px',
        borderRadius: '50%',
        background: on ? '#0d0d0d' : T.muted,
        transition: 'left .2s',
      }} />
    </button>
  )
}

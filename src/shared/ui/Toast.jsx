import { T } from '../../styles/tokens.js'

export function Toast({ message, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 200, background: '#2a1a1a', border: '1px solid #6b2020',
      borderRadius: '7px', padding: '12px 18px', maxWidth: '460px', width: 'max-content',
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }} role="alert" aria-live="assertive">
      <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#f87171', fontFamily: T.font, marginBottom: '3px' }}>Error</div>
        <div style={{ fontSize: '11px', color: T.muted, fontFamily: T.font, lineHeight: 1.5 }}>{message}</div>
      </div>
      <button type="button" onClick={onClose} aria-label="Close error message" style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: '14px', lineHeight: 1, padding: 0, flexShrink: 0 }}>✕</button>
    </div>
  )
}

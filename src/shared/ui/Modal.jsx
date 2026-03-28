import { T } from '../../styles/tokens.js'

export function Modal({ title, subtitle, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#1a1a1a', border: `1px solid ${T.border}`,
        borderRadius: '10px', padding: '28px 32px', width: '420px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }} role="dialog" aria-modal="true" aria-label={title}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: '5px' }}>
          {title}
        </div>
        {subtitle && (
          <p style={{ fontSize: '11px', color: T.muted, fontFamily: T.font, lineHeight: 1.6, marginBottom: '20px' }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

import { T, S } from '../../styles/tokens.js'

export function ErrorFallback({ onReset }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      color: T.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: T.font,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        border: `1px solid ${T.border}`,
        background: T.panel,
        borderRadius: '10px',
        padding: '20px',
      }}>
        <h1 style={{ fontSize: '14px', marginBottom: '8px', color: T.accent }}>Unexpected error</h1>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.6, marginBottom: '14px' }}>
          The UI crashed while rendering. Your last autosaved state should still be available after reload.
        </p>
        <button type="button" onClick={onReset} style={S.btnPrimary}>
          Reload app
        </button>
      </div>
    </div>
  )
}

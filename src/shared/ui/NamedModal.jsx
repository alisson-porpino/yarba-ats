import { useState } from 'react'
import { S, T } from '../../styles/tokens.js'
import { Modal } from './Modal.jsx'

export function NamedModal({ title, subtitle, placeholder, fileNameLabel, hint, confirmLabel, cancelLabel, onConfirm, onClose }) {
  const [name, setName] = useState('')
  const isValid = /^[a-z0-9-]+$/.test(name) && name.length > 0

  return (
    <Modal title={title} subtitle={subtitle}>
      <span style={S.label}>{fileNameLabel}</span>
      <input
        style={{ ...S.input, marginBottom: '14px' }}
        value={name}
        onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
        placeholder={placeholder}
        autoFocus
        onKeyDown={e => e.key === 'Enter' && isValid && onConfirm(name)}
        aria-label={fileNameLabel}
      />
      {hint && (
        <div style={{
          background: '#0d0d0d', borderRadius: '5px', padding: '9px 12px',
          marginBottom: '16px', fontSize: '11px', color: T.muted, fontFamily: T.font, lineHeight: 1.7,
        }}>
          {hint(name)}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" style={S.btnGhost} onClick={onClose}>{cancelLabel}</button>
        <button
          type="button"
          style={{ ...S.btnPrimary, opacity: isValid ? 1 : 0.4, cursor: isValid ? 'pointer' : 'default' }}
          onClick={() => isValid && onConfirm(name)}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

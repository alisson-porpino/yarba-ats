import { useState } from 'react'
import { S, T } from '../../styles/tokens.js'
import { Modal } from './Modal.jsx'

export function ExportModal({ defaultName, ui, onExport, onClose }) {
  const [name, setName] = useState(defaultName)
  const isValid = name.trim().length > 0

  return (
    <Modal title={ui.buttons.exportPdf}>
      <span style={S.label}>{ui.modals.fileNameLabel}</span>
      <input
        style={{ ...S.input, marginBottom: '14px' }}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="resume-en"
        autoFocus
        onKeyDown={e => e.key === 'Enter' && isValid && onExport(name.trim())}
        aria-label={ui.modals.fileNameLabel}
      />
      <div style={{
        background: '#0d0d0d', borderRadius: '5px', padding: '9px 12px',
        marginBottom: '16px', fontSize: '11px', color: T.muted, fontFamily: T.font, lineHeight: 1.7,
      }}>
        Will save: <span style={{ color: T.text }}>{name.trim() || 'filename'}.pdf</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" style={S.btnGhost} onClick={onClose}>{ui.modals.cancel}</button>
        <button
          type="button"
          style={{ ...S.btnPrimary, opacity: isValid ? 1 : 0.4, cursor: isValid ? 'pointer' : 'default' }}
          onClick={() => isValid && onExport(name.trim())}
        >
          {ui.buttons.exportPdf}
        </button>
      </div>
    </Modal>
  )
}

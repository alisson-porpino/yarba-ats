import { useState } from 'react'
import { T } from '../styles/tokens.js'
import { getAllTemplates, deleteUserTemplate, isOnlineMode } from '../lib/templateStore.js'
import { UI_LANGUAGES, formatTemplateLanguage } from '../lib/i18n.js'
import { ThemeToggleButton } from '../shared/ui/ThemeToggleButton.jsx'

function MiniPreview({ data }) {
  const lines = [
    data?.header?.name || 'YOUR NAME',
    data?.header?.title || '',
    '---',
    ...(data?.skills?.slice(0, 2).map(s => `• ${s.category}: ${s.items?.slice(0,2).join(', ')}...`) || []),
    '',
    data?.experience?.[0]?.company || '',
    data?.experience?.[0]?.role    || '',
  ].filter(Boolean)

  return (
    <div style={{
      background: '#fff', borderRadius: '4px', padding: '10px 12px',
      fontSize: '7px', lineHeight: 1.6, color: '#222',
      fontFamily: 'Arial, sans-serif', height: '130px',
      overflow: 'hidden', userSelect: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{
          fontWeight: i === 0 ? 700 : 400,
          fontSize: i === 0 ? '9px' : '7px',
          textAlign: i === 0 ? 'center' : 'left',
          borderBottom: l === '---' ? '1px solid #000' : 'none',
          margin: l === '---' ? '3px 0' : 0,
          color: l === '---' ? 'transparent' : '#222',
        }}>{l}</div>
      ))}
    </div>
  )
}

function TemplateCard({ template, onSelect, onDelete, isHovered, onHover, text, muted, ui }) {
  const bg = isHovered ? '#222222' : T.card
  const langBadge = formatTemplateLanguage(template.lang)

  return (
    <div
      onClick={() => onSelect(template)}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      style={{ position: 'relative',
        background: bg,
        border: `1px solid ${isHovered ? T.accent : T.border}`,
        borderRadius: '10px', padding: '20px', cursor: 'pointer',
        transition: 'all .18s',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 8px 32px rgba(245,158,11,0.12)' : '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', gap: '14px',
      }}
    >
      {onDelete && (
        <button
          onClick={onDelete}
          title="Delete template"
          style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(0,0,0,0.4)', border: 'none',
            borderRadius: '3px', cursor: 'pointer',
            color: '#888', fontSize: '11px', padding: '2px 6px',
            lineHeight: 1, zIndex: 1,
          }}
        >✕</button>
      )}
      <MiniPreview data={template.data} />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: text, fontFamily: T.font }}>
            {template.name}
          </span>
          <span style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
            color: T.accent, background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: '3px', padding: '2px 6px', fontFamily: T.font,
          }}>{langBadge}</span>
        </div>

        <p style={{ fontSize: '11px', color: muted, fontFamily: T.font, lineHeight: 1.5, marginBottom: '10px' }}>
          {template.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {template.tags?.slice(0, 5).map(tag => (
            <span key={tag} style={{
              fontSize: '9px', color: '#888880',
              background: '#1e1e1e', border: '1px solid #2a2a2a',
              borderRadius: '3px', padding: '2px 6px', fontFamily: T.font,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{
        fontSize: '11px', fontWeight: 600,
        color: isHovered ? T.accent : muted,
        fontFamily: T.font, letterSpacing: '0.04em', transition: 'color .18s',
      }}>
        {ui.picker.useThis}
      </div>
    </div>
  )
}

function ScratchCard({ onSelect, isHovered, onHover, text, muted, ui }) {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => onHover('scratch')}
      onMouseLeave={() => onHover(null)}
      style={{
        border: `1.5px dashed ${isHovered ? T.accent : '#2a2a2a'}`,
        borderRadius: '10px', padding: '20px', cursor: 'pointer',
        transition: 'all .18s',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        background: isHovered ? 'rgba(245,158,11,0.06)' : 'transparent',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '12px', minHeight: '240px',
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        background: isHovered ? 'rgba(245,158,11,0.15)' : T.card,
        border: `1px solid ${isHovered ? T.accent : '#2a2a2a'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', transition: 'all .18s',
      }}>+</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: text, fontFamily: T.font, marginBottom: '5px' }}>
          {ui.picker.scratch}
        </div>
        <div style={{ fontSize: '11px', color: muted, fontFamily: T.font, lineHeight: 1.5 }}>
          {ui.picker.scratchSub}
        </div>
      </div>
    </div>
  )
}

export function TemplatePicker({ onSelect, onScratch, darkMode, onToggleDark, uiLang, onSetUiLang, ui }) {
  const [hovered,   setHovered]   = useState(null)
  const [templates, setTemplates] = useState(() => getAllTemplates())

  const handleDelete = (e, id) => {
    e.stopPropagation()
    deleteUserTemplate(id)
    setTemplates(getAllTemplates())
  }

  const bg    = T.bg
  const text  = T.text
  const muted_ = T.muted

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', fontFamily: T.font }}>

      
      <div style={{
        padding: '12px 32px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center',
        background: T.panel,
      }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: T.accent, letterSpacing: '0.08em' }}>YARBA</span>
        <div style={{ flex: 1 }} />

        
        <div style={{ position: 'relative', marginRight: '8px' }}>
          <select
            value={uiLang}
            onChange={e => onSetUiLang(e.target.value)}
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: '5px',
              color: text,
              fontSize: '11px', fontWeight: 600,
              fontFamily: T.font,
              padding: '5px 28px 5px 10px',
              cursor: 'pointer', outline: 'none',
              appearance: 'none', WebkitAppearance: 'none',
            }}
          >
            {UI_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <span style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', color: muted_, fontSize: '9px',
          }}>▾</span>
        </div>

        
        <ThemeToggleButton darkMode={darkMode} onToggle={onToggleDark} />
      </div>

      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px 80px' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: text, fontFamily: T.font, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            {ui.picker.title}
          </h1>
          <p style={{ fontSize: '13px', color: muted_, fontFamily: T.font, lineHeight: 1.6 }}>
            {ui.picker.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(templates.length + 1, 3)}, 280px)`,
          gap: '18px',
          width: '100%',
          maxWidth: `${Math.min(templates.length + 1, 3) * 298}px`,
        }}>
          {templates.map(tpl => (
            <TemplateCard
              key={tpl.id} template={tpl}
              onSelect={onSelect}
              onDelete={isOnlineMode && tpl.isUserSaved ? (e) => handleDelete(e, tpl.id) : null}
              isHovered={hovered === tpl.id}
              onHover={setHovered}
              text={text} muted={muted_} ui={ui}
            />
          ))}
          <ScratchCard
            onSelect={onScratch}
            isHovered={hovered === 'scratch'}
            onHover={setHovered}
            text={text} muted={muted_} ui={ui}
          />
        </div>

        <p style={{ marginTop: '48px', fontSize: '11px', color: '#888', fontFamily: T.font, textAlign: 'center' }}>
          {ui.picker.addHint}
        </p>
      </div>
    </div>
  )
}

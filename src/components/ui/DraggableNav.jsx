import { useState, useRef } from 'react'
import { T } from '../../styles/tokens.js'

export function DraggableNav({ section, onSelect, sectionOrder, onReorder, ui }) {
  const [dragOver, setDragOver] = useState(null)
  const dragRef  = useRef(null)

  const pinnedTab = { id: 'header', label: ui.nav.header }

  const sectionLabels = {
    summary:    ui.nav.summary,
    skills:     ui.nav.skills,
    experience: ui.nav.experience,
    education:  ui.nav.education,
    languages:  ui.nav.languages,
  }

  const draggableTabs = sectionOrder.map(id => ({ id, label: sectionLabels[id] || id }))

  const handleDragStart = (id) => {
    dragRef.current = id
  }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    if (dragRef.current !== id) setDragOver(id)
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    const sourceId = dragRef.current
    if (!sourceId || sourceId === targetId) {
      setDragOver(null)
      return
    }

    const newOrder = [...sectionOrder]
    const fromIdx  = newOrder.indexOf(sourceId)
    const toIdx    = newOrder.indexOf(targetId)
    if (fromIdx === -1 || toIdx === -1) return

    newOrder.splice(fromIdx, 1)
    newOrder.splice(toIdx, 0, sourceId)

    onReorder(newOrder)
    setDragOver(null)
    dragRef.current = null
  }

  const handleDragEnd = () => {
    setDragOver(null)
    dragRef.current = null
  }

  const tabStyle = (id, isDraggable) => ({
    padding: '5px 11px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '4px',
    cursor: isDraggable ? 'grab' : 'pointer',
    border: 'none',
    fontFamily: T.font,
    background:   section === id
      ? T.accentDim
      : dragOver === id
        ? 'rgba(245,158,11,0.06)'
        : 'transparent',
    color:        section === id ? T.accent : T.muted,
    borderBottom: section === id
      ? `2px solid ${T.accent}`
      : dragOver === id
        ? `2px solid rgba(245,158,11,0.4)`
        : '2px solid transparent',
    outline:    dragOver === id ? `1px dashed rgba(245,158,11,0.4)` : 'none',
    outlineOffset: '-1px',
    transition: 'all .12s',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  })

  return (
    <div className="no-scrollbar" role="tablist" aria-label="Resume sections" style={{
      display: 'flex', padding: '0 16px', gap: '2px',
      background: T.panel, borderBottom: `1px solid ${T.border}`,
      flexShrink: 0, alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto',
      height: '38px',
    }}>
      
      <button
        type="button"
        role="tab"
        aria-selected={section === 'header'}
        onClick={() => onSelect('header')}
        style={tabStyle('header', false)}
      >
        {pinnedTab.label}
      </button>

      
      {draggableTabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={section === tab.id}
          draggable
          onDragStart={() => handleDragStart(tab.id)}
          onDragOver={e => handleDragOver(e, tab.id)}
          onDrop={e => handleDrop(e, tab.id)}
          onDragEnd={handleDragEnd}
          onClick={() => onSelect(tab.id)}
          style={tabStyle(tab.id, true)}
          title="Drag to reorder"
        >
          
          <span style={{
            fontSize: '9px', color: dragOver === tab.id ? T.accent : T.muted,
            opacity: 0.6, letterSpacing: '-1px', lineHeight: 1,
          }}>
            ⠿
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { T, S, DARK_PREVIEW, LIGHT_PREVIEW } from './styles/tokens.js'
import { makeBlankPreset }                 from './lib/blankPreset.js'
import { generateHTML }                        from './lib/generateHTML.js'
import { fromData, toTemplateFile }              from './lib/serializeData.js'
import { saveTemplate as storeTemplate,
         isOnlineMode }                          from './lib/templateStore.js'
import { t, DEFAULT_LABELS, LANGUAGES,
         UI_LANGUAGES, normalizeLanguageCode,
         formatTemplateLanguage }            from './lib/i18n.js'
import { importPdfToData }                   from './lib/importPdf.js'
import { validateResumeSafe }                  from './domain/resume/index.js'
import { TemplatePicker }                      from './features/template-picker/index.js'
import { HeaderEditor, SummaryEditor, SkillsEditor,
         ExperienceEditor, EducationEditor, LanguagesEditor,
         DraggableNav }                        from './features/resume-editor/index.js'
import { ResumePreview }                       from './features/resume-preview/index.js'
import { ExportModal }                         from './shared/ui/ExportModal.jsx'
import { NamedModal }                          from './shared/ui/NamedModal.jsx'
import { Select }                              from './shared/ui/Select.jsx'
import { ThemeToggleButton }                  from './shared/ui/ThemeToggleButton.jsx'
import { Toast }                               from './shared/ui/Toast.jsx'


function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}


export default function App() {
  const [view,      setView]      = useState('picker')
  const [data,      setData]      = useState(() => {
    try {
      const saved = localStorage.getItem('yarba_autosave')
      if (saved) {
        const { data: d } = JSON.parse(saved)
        if (d?.header) {
          const loaded = fromData(d)
          const validated = validateResumeSafe(loaded)
          if (validated.success) return validated.data
        }
      }
    } catch {}
    return makeBlankPreset('en')
  })
  const [lang,      setLang]      = useState(() => {
    try {
      const savedLang = JSON.parse(localStorage.getItem('yarba_autosave'))?.lang
      return normalizeLanguageCode(savedLang)
    } catch {
      return 'en'
    }
  })
  const [uiLang,    setUiLang]    = useState(() => {
    try {
      const savedUiLang = JSON.parse(localStorage.getItem('yarba_autosave'))?.uiLang
      return normalizeLanguageCode(savedUiLang, 'pt_br')
    } catch {
      return 'pt_br'
    }
  })
  const [section,   setSection]   = useState('header')
  const [resumeName, setResumeName] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yarba_autosave'))?.resumeName || '' } catch { return '' }
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [pdfImport,  setPdfImport]  = useState('idle')
  const [pdfImportError, setPdfImportError] = useState(null)
  const [darkMode,  setDarkMode]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('yarba_autosave'))?.darkMode || false } catch { return false }
  })
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [templateSaved,     setTemplateSaved]     = useState(false)
  const [loadError, setLoadError] = useState(null)
  const pdfImportRef    = useRef(null)

  const ui           = t(uiLang)
  const previewTheme = darkMode ? DARK_PREVIEW : LIGHT_PREVIEW
  const STORAGE_KEY  = 'yarba_autosave'

  const ensureValidResume = () => {
    const result = validateResumeSafe(data)
    if (result.success) return { ok: true, data: result.data }

    const firstErrors = result.errors.slice(0, 4).join(' | ')
    setLoadError(`Please fix required fields before continuing: ${firstErrors}`)
    return { ok: false, data: null }
  }

  useEffect(() => {
    try {
      const toSave = { data, lang, uiLang, section, darkMode, resumeName }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {}
  }, [data, lang, uiLang, section, darkMode])

  const switchLang = (code) => {
    const normalizedCode = normalizeLanguageCode(code)
    setLang(normalizedCode)
    setData(prev => ({
      ...prev,
      meta:   { ...prev.meta, lang: normalizedCode },
      labels: DEFAULT_LABELS[normalizedCode] || DEFAULT_LABELS.en,
    }))
  }

  const handleReorder = (newOrder) =>
    setData(prev => ({ ...prev, sectionOrder: newOrder }))

  const handlePickTemplate = (template) => {
    const loaded = fromData(template.data)
    const validated = validateResumeSafe(loaded)
    if (!validated.success) {
      setLoadError('Template data is invalid. Please choose another template.')
      return
    }
    setData(validated.data)
    setLang(normalizeLanguageCode(validated.data.meta?.lang))
    setSection('header')
    setView('editor')
  }
  const handleScratch = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const { data: d, lang: l, uiLang: ul, section: s } = JSON.parse(saved)
        if (d?.header) {
          const loaded = fromData(d)
          const validated = validateResumeSafe(loaded)
          if (!validated.success) throw new Error('Invalid autosave data')

          setData(validated.data)
          setLang(normalizeLanguageCode(l))
          if (ul) setUiLang(normalizeLanguageCode(ul, 'pt_br'))
          setSection(s || 'header')
          setView('editor')
          return
        }
      }
    } catch {}
    setData(makeBlankPreset('en'))
    setLang('en')
    setSection('header')
    setView('editor')
  }

  const handleExportPDF = (filename) => {
    const validated = ensureValidResume()
    if (!validated.ok) return

    const html = generateHTML(validated.data)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const win  = window.open(url, '_blank')

    if (!win) {
      setLoadError('Pop-up blocked. Allow pop-ups for this site and try again.')
      return
    }

    win.onload = () => {
      win.document.title = filename
      setTimeout(() => {
        win.print()
        URL.revokeObjectURL(url)
      }, 300)
    }
  }

  const handleSaveTemplate = (filename) => {
    const validated = ensureValidResume()
    if (!validated.ok) return

    const name = filename.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const desc = `${name} • ${formatTemplateLanguage(lang)}`

    if (isOnlineMode) {
      storeTemplate(validated.data, filename, name, desc)
      setShowSaveTemplate(false)
      setTemplateSaved(true)
      setTimeout(() => setTemplateSaved(false), 2500)
    } else {
      downloadBlob(
        toTemplateFile(validated.data, filename, name, desc),
        `${filename}.js`,
        'text/javascript;charset=utf-8'
      )
      setShowSaveTemplate(false)
    }
  }


  const handlePdfImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setPdfImportError(null)
    setPdfImport('reading')

    try {
      const data = await importPdfToData(file, setPdfImport)
      const loaded = fromData(data)
      const validated = validateResumeSafe(loaded)
      if (!validated.success) {
        throw new Error('Imported PDF generated incomplete resume data. Fill missing required fields and try again.')
      }
      setData(validated.data)
      setLang(normalizeLanguageCode(validated.data.meta?.lang))
      setSection('header')
      setPdfImport('done')
      setTimeout(() => setPdfImport('idle'), 3000)
    } catch (err) {
      setPdfImportError(err.message)
      setPdfImport('idle')
    }
  }

  if (view === 'picker') {
    return (
      <TemplatePicker
        onSelect={handlePickTemplate}
        onScratch={handleScratch}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        uiLang={uiLang}
        onSetUiLang={setUiLang}
        ui={ui}
      />
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: T.font, background: T.bg, color: T.text, overflow: 'hidden',
    }}>

      

      {showSaveTemplate && (
        <NamedModal
          title={ui.modals.saveTemplate.title}
          subtitle={ui.modals.saveTemplate.subtitle + (isOnlineMode ? ' ' + (ui.modals.saveTemplate.onlineNote || '(Saved to this browser.)') : '')}
          placeholder="my-template-name"
          fileNameLabel={ui.modals.fileNameLabel}
          confirmLabel={ui.modals.saveTemplate.confirm}
          cancelLabel={ui.modals.cancel}
          hint={(name) => (
            <>
              {ui.modals.saveTemplate.hintSave}: <span style={{ color: T.text }}>{name || 'filename'}.js</span><br/>
              {ui.modals.saveTemplate.hintDrop}: <span style={{ color: T.accent }}>src/templates/data/</span>
            </>
          )}
          onConfirm={handleSaveTemplate}
          onClose={() => setShowSaveTemplate(false)}
        />
      )}
      {showExportModal && (
        <ExportModal
          defaultName={resumeName || `resume-${lang}`}
          ui={ui}
          onExport={(name) => { setShowExportModal(false); handleExportPDF(name) }}
          onClose={() => setShowExportModal(false)}
        />
      )}
      {loadError     && <Toast message={loadError}     onClose={() => setLoadError(null)} />}
      {pdfImportError && <Toast message={pdfImportError} onClose={() => setPdfImportError(null)} />}
      <input ref={pdfImportRef}  type="file" accept=".pdf"  style={{ display: 'none' }} onChange={handlePdfImport} />

      
      <div style={{
        height: '46px', flexShrink: 0,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '10px',
      }}>
        
        <button
          type="button"
          onClick={() => setView('picker')}
          aria-label="Back to template picker"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: '16px', padding: '0 4px 0 0', lineHeight: 1 }}
          onMouseEnter={e => e.target.style.color = T.text}
          onMouseLeave={e => e.target.style.color = T.muted}
        >←</button>

        <span style={{ fontSize: '13px', fontWeight: 700, color: T.accent, letterSpacing: '0.08em' }}>YARBA</span>

        
        <input
          value={resumeName}
          onChange={e => setResumeName(e.target.value)}
          placeholder={ui.header?.resumeName || 'Resume name…'}
          aria-label={ui.header?.resumeName || 'Resume name'}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${T.border}`,
            borderRadius: 0,
            color: T.text,
            fontSize: '11px',
            fontFamily: T.font,
            padding: '3px 6px',
            outline: 'none',
            width: '180px',
            opacity: resumeName ? 1 : 0.5,
          }}
        />

        <div style={{ flex: 1 }} />

        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '9px', color: T.muted, fontFamily: T.font, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            UI
          </span>
          <Select
            value={uiLang}
            onChange={setUiLang}
            options={UI_LANGUAGES}
            style={{ width: '176px' }}
            ariaLabel="Interface language"
          />
        </div>

        <div style={{ width: '1px', height: '20px', background: T.border }} />

        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '9px', color: T.muted, fontFamily: T.font, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            CV
          </span>
          <Select
            value={lang}
            onChange={switchLang}
            options={LANGUAGES}
            style={{ width: '176px' }}
            ariaLabel="Resume language"
          />
        </div>

        
        <ThemeToggleButton
          darkMode={darkMode}
          onToggle={() => setDarkMode(d => !d)}
        />

        
        <div style={{ width: '1px', height: '20px', background: T.border }} />

        

        
        <button
          type="button"
          onClick={() => { setPdfImportError(null); pdfImportRef.current?.click() }}
          disabled={pdfImport === 'reading' || pdfImport === 'parsing'}
          style={{
            ...S.btnGhost,
            color: pdfImport === 'done'
              ? T.success
              : pdfImport !== 'idle'
                ? T.muted
                : T.accent,
            borderColor: pdfImport === 'done' ? T.success : T.border,
            opacity: (pdfImport === 'reading' || pdfImport === 'parsing') ? 0.6 : 1,
            cursor: (pdfImport === 'reading' || pdfImport === 'parsing') ? 'wait' : 'pointer',
            transition: 'all .3s',
          }}
          title={ui.buttons.importPdfHint}
        >
          {pdfImport === 'reading'
            ? (ui.buttons.importPdfReading || 'Reading…')
            : pdfImport === 'parsing'
              ? (ui.buttons.importPdfParsing || 'Extracting…')
              : pdfImport === 'done'
                ? '✓ Imported'
                : ui.buttons.importPdf}
        </button>




        <button type="button" onClick={() => setShowSaveTemplate(true)} style={{ ...S.btnGhost, color: T.text }}>
          {ui.buttons.saveTemplate}
        </button>

        <button
          type="button"
          onClick={() => setShowExportModal(true)}
          style={{ ...S.btnPrimary }}
        >{ui.buttons.exportPdf}</button>
      </div>

      {templateSaved && (
        <div style={{
          height: '30px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: '11px',
          color: T.success,
          fontFamily: T.font,
          background: 'rgba(52,211,153,0.06)',
        }} role="status" aria-live="polite">
          {ui.buttons.templateSaved}
        </div>
      )}

      
      <DraggableNav
        section={section}
        onSelect={setSection}
        sectionOrder={data.sectionOrder || ['summary', 'skills', 'experience', 'education', 'languages']}
        onReorder={handleReorder}
        ui={ui}
      />

      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        
        <div style={{
          width: '420px', flexShrink: 0,
          borderRight: `1px solid ${T.border}`,
          overflowY: 'auto',
          padding: '20px 20px 40px',
          background: T.bg,
        }}>
          {section === 'header'     && <HeaderEditor     data={data} update={setData} ui={ui} />}
          {section === 'summary'    && <SummaryEditor    data={data} update={setData} ui={ui} />}
          {section === 'skills'     && <SkillsEditor     data={data} update={setData} ui={ui} />}
          {section === 'experience' && <ExperienceEditor data={data} update={setData} ui={ui} />}
          {section === 'education'  && <EducationEditor  data={data} update={setData} ui={ui} />}
          {section === 'languages'  && <LanguagesEditor  data={data} update={setData} ui={ui} />}
        </div>

        
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          background: previewTheme.bg,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          padding: '32px 24px 48px',
          minWidth: 0,
        }}>
          <div style={{ width: '100%', maxWidth: '700px' }}>
            <ResumePreview data={data} theme={previewTheme} />
          </div>
        </div>

      </div>
    </div>
  )
}

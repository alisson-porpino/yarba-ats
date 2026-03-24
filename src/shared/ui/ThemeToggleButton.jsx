import { T, S } from '../../styles/tokens.js'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.2A8 8 0 1 1 9.8 4 6.6 6.6 0 1 0 20 14.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ThemeToggleButton({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={darkMode ? 'Light mode' : 'Dark mode'}
      aria-label={darkMode ? 'Enable light mode' : 'Enable dark mode'}
      style={{
        ...S.btnGhost,
        width: '30px',
        height: '30px',
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: darkMode ? T.accent : T.text,
        borderColor: darkMode ? T.accent : T.border,
      }}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

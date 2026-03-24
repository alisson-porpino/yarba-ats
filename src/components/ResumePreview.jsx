import { parseBoldNodes } from '../lib/parseBold.js'

function RichText({ text }) {
  const nodes = parseBoldNodes(text || '')
  return (
    <span>
      {nodes.map(n =>
        n.type === 'strong'
          ? <strong key={n.key}>{n.content}</strong>
          : n.content
      )}
    </span>
  )
}

export function ResumePreview({ data, theme }) {
  const {
    header, labels, show, summary, skills,
    experience, education, languages,
    sectionOrder = ['summary', 'skills', 'experience', 'education', 'languages'],
  } = data

  const textColor    = theme?.text        || '#000'
  const mutedColor   = theme?.muted       || '#444'
  const sectionColor = theme?.sectionLine || '#000'
  const paperBg      = theme?.paper       || '#fff'

  const contactParts = [
    header.contact.email,
    header.contact.github,
    show.linkedin ? header.contact.linkedin : null,
    show.website  ? header.contact.website  : null,
    show.location ? header.contact.location : null,
  ].filter(Boolean)

  const secTitle = {
    fontSize: '10.5pt', fontWeight: 'bold', textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${sectionColor}`,
    paddingBottom: '2px', marginBottom: '6px',
    color: textColor,
  }
  const secWrap = { marginBottom: '12px' }

  const sections = {
    summary: (
      <div key="summary" style={secWrap}>
        <div style={secTitle}>{labels.summary}</div>
        <p style={{ textAlign: 'justify', lineHeight: 1.4 }}>
          <RichText text={summary} />
        </p>
      </div>
    ),

    skills: (
      <div key="skills" style={secWrap}>
        <div style={secTitle}>{labels.skills}</div>
        {skills.map(s => (
          <p key={s.id} style={{ marginBottom: '3px', lineHeight: 1.5 }}>
            <strong>{s.category}:</strong> {s.items.join(', ')}
          </p>
        ))}
      </div>
    ),

    experience: (
      <div key="experience" style={secWrap}>
        <div style={secTitle}>{labels.experience}</div>
        {experience.map(job => (
          <div key={job.id} style={{ marginBottom: '9px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong>{job.company}</strong>
              <span style={{ fontStyle: 'italic', fontSize: '9.5pt', color: mutedColor }}>{job.period}</span>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '10pt', marginBottom: '3px', color: mutedColor }}>{job.role}</div>
            <ul style={{ marginLeft: '17px' }}>
              {job.bullets.filter(Boolean).map((b, i) => (
                <li key={i} style={{ marginBottom: '2px', lineHeight: 1.35 }}>
                  <RichText text={b} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),

    education: (
      <div key="education" style={secWrap}>
        <div style={secTitle}>{labels.education}</div>
        {education.map(e => (
          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>
              <strong>{e.degree}</strong>
              {e.institution ? ` | ${e.institution}` : ''}
            </span>
            <span style={{ fontStyle: 'italic', fontSize: '9.5pt', color: mutedColor }}>{e.period}</span>
          </div>
        ))}
      </div>
    ),

    languages: (
      <div key="languages" style={secWrap}>
        <div style={secTitle}>{labels.languages}</div>
        <p style={{ lineHeight: 1.5 }}>
          {languages.map(l => `${l.language} (${l.level})`).join(' | ')}
        </p>
      </div>
    ),
  }

  return (
    <div style={{
      background: paperBg,
      width: '100%',
      padding: '36px 48px',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '10.5pt', lineHeight: 1.3,
      color: textColor,
      boxShadow: theme?.paperShadow || '0 4px 24px rgba(0,0,0,0.14)',
      border: theme?.paperBorder || 'none',
    }}>

      
      <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: `1px solid ${sectionColor}`, paddingBottom: '8px' }}>
        <div style={{ fontSize: '19pt', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '3px' }}>
          {header.name || 'YOUR NAME'}
        </div>
        <div style={{ fontSize: '11pt', marginBottom: '5px' }}>{header.title}</div>
        <div style={{ fontSize: '9.5pt', lineHeight: 1.5, color: mutedColor }}>
          {contactParts.join(' | ')}
        </div>
      </div>

      
      {sectionOrder.map(id => sections[id] ?? null)}

    </div>
  )
}

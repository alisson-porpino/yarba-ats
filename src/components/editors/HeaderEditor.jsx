import { T, S } from '../../styles/tokens.js'
import { Field } from '../ui/Field.jsx'
import { Toggle } from '../ui/Toggle.jsx'

export function HeaderEditor({ data, update, ui }) {
  const h = ui.header

  const setHeader = (key, val) =>
    update({ ...data, header: { ...data.header, [key]: val } })

  const setContact = (key, val) =>
    update({ ...data, header: { ...data.header, contact: { ...data.header.contact, [key]: val } } })

  const setShow = (key, val) =>
    update({ ...data, show: { ...data.show, [key]: val } })

  const ContactRow = ({ label, contactKey, placeholder, showKey }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
      <div style={{ flex: 1, marginBottom: 0 }}>
        <span style={S.label}>{label}</span>
        <input
          style={S.input}
          value={data.header.contact[contactKey]}
          onChange={e => setContact(contactKey, e.target.value)}
          placeholder={placeholder}
          aria-label={label}
        />
      </div>
      {showKey && (
        <div style={{ paddingBottom: '4px' }}>
          <Toggle on={data.show[showKey]} onChange={v => setShow(showKey, v)} />
        </div>
      )}
    </div>
  )

  return (
    <div>
      <Field
        label={h.fullName}
        value={data.header.name}
        onChange={v => setHeader('name', v)}
        placeholder="YOUR NAME"
        style={{ fontWeight: 600, fontSize: '13px' }}
      />
      <Field
        label={h.profTitle}
        value={data.header.title}
        onChange={v => setHeader('title', v)}
        placeholder="Senior Software Engineer"
      />

      <div style={S.divider} />

      <Field
        label={h.email}
        value={data.header.contact.email}
        onChange={v => setContact('email', v)}
        placeholder="you@email.com"
      />
      <Field
        label={h.github}
        value={data.header.contact.github}
        onChange={v => setContact('github', v)}
        placeholder="github.com/username"
      />
      <ContactRow label={h.linkedin} contactKey="linkedin" placeholder="linkedin.com/in/username" showKey="linkedin" />
      <ContactRow label={h.website}  contactKey="website"  placeholder="yourwebsite.com"          showKey="website" />
      <ContactRow label={h.location} contactKey="location" placeholder="City, State / Remote"      showKey="location" />

      <p style={{ fontSize: '11px', color: T.muted, fontFamily: T.font, marginTop: '-4px' }}>
        {h.toggleHint}
      </p>
    </div>
  )
}

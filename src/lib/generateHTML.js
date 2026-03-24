
import { parseBoldHTML } from './parseBold.js'

const sec = (title, html) => `
  <div style="margin-bottom:14px">
    <div style="font-weight:bold;text-transform:uppercase;letter-spacing:.5px;
                border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;font-size:11pt">
      ${title}
    </div>
    ${html}
  </div>`

export function generateHTML(data) {
  const { meta, header, labels, show, summary, skills, experience, education, languages,
          sectionOrder = ['summary', 'skills', 'experience', 'education', 'languages'] } = data

  const contactParts = [
    header.contact.email
      ? `<a href="mailto:${header.contact.email}" style="color:#000;text-decoration:none">${header.contact.email}</a>`
      : '',
    header.contact.github
      ? `<a href="https://${header.contact.github}" style="color:#000;text-decoration:none">${header.contact.github}</a>`
      : '',
    show.linkedin && header.contact.linkedin
      ? `<a href="https://${header.contact.linkedin}" style="color:#000;text-decoration:none">${header.contact.linkedin}</a>`
      : '',
    show.website && header.contact.website
      ? `<a href="https://${header.contact.website}" style="color:#000;text-decoration:none">${header.contact.website}</a>`
      : '',
    show.location && header.contact.location
      ? `<span>${header.contact.location}</span>`
      : '',
  ].filter(Boolean).join(' <span style="margin:0 3px">|</span> ')

  const skillsHTML = skills
    .map(s => `<p style="margin-bottom:3px;line-height:1.5"><strong>${s.category}:</strong> ${s.items.join(', ')}</p>`)
    .join('')

  const experienceHTML = experience
    .map(e => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <strong style="font-size:10.5pt">${e.company}</strong>
          <span style="font-style:italic;font-size:9.5pt;color:#333">${e.period}</span>
        </div>
        <div style="font-style:italic;font-size:10pt;margin-bottom:4px">${e.role}</div>
        <ul style="margin-left:18px">
          ${e.bullets.filter(Boolean).map(b => `<li style="margin-bottom:3px;line-height:1.35">${parseBoldHTML(b)}</li>`).join('')}
        </ul>
      </div>`)
    .join('')

  const educationHTML = education
    .map(e => `
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span><strong>${e.degree}</strong>${e.institution ? ` | ${e.institution}` : ''}</span>
        <span style="font-style:italic;font-size:9.5pt;color:#333">${e.period}</span>
      </div>`)
    .join('')

  const languagesText = languages
    .map(l => `${l.language} (${l.level})`)
    .join(' | ')

  return `<!DOCTYPE html>
<html lang="${meta.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${header.name} — Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.3;
      color: #000;
      background: #f5f5f5;
    }
    .page {
      max-width: 210mm;
      margin: 0 auto;
      background: #fff;
      padding: .65in .75in;
    }
    @page {
      size: A4;
      margin: 0.5in 0.65in;
    }
    @media print {
      html, body { height: auto; background: #fff; }
      .page {
        padding: 0;
        margin: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
<div class="page">

  <div style="text-align:center;margin-bottom:16px;border-bottom:1px solid #000;padding-bottom:8px">
    <h1 style="font-size:20pt;font-weight:bold;letter-spacing:1px;margin-bottom:4px">${header.name}</h1>
    <p style="font-size:11pt;margin-bottom:6px">${header.title}</p>
    <p style="font-size:9.5pt;line-height:1.5">${contactParts}</p>
  </div>

  ${sectionOrder.map(id => {
    switch (id) {
      case 'summary':
        return sec(labels.summary, `<p style="text-align:justify;line-height:1.4">${parseBoldHTML(summary)}</p>`)
      case 'skills':
        return sec(labels.skills, skillsHTML)
      case 'experience':
        return sec(labels.experience, experienceHTML)
      case 'education':
        return sec(labels.education, educationHTML)
      case 'languages':
        return sec(labels.languages, `<p style="line-height:1.5">${languagesText}</p>`)
      default:
        return ''
    }
  }).join('\n  ')}

</div>
</body>
</html>`
}

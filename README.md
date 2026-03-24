# YARBA ATS
### Yet Another Resume Builder App
ATS-focused resume builder with template picker, live preview, and browser-native PDF export.

---

## Features

- ATS-first resume editing flow
- Start from curated templates or from scratch
- Live preview while editing
- Import an existing PDF resume (local parsing, no external API required)
- Save/load full resume state as `.json`
- Save custom templates:
	- Offline mode: download `.js` template files and drop into `src/templates/data/`
	- Online mode: save templates to browser `localStorage`
- Export to PDF using the browser print dialog (`Save as PDF`)
- UI available in English, Portuguese, and Spanish
- Resume content labels available in English, Portuguese, and Spanish

---

## Quick Start (Docker)

```bash
# 1. Clone and enter the project
cd yarba-ats

# 2. Start the container (first run builds the image)
docker compose up

# 3. Open in browser
# http://localhost:5173
```

Stop the environment:

```bash
docker compose down
```

Rebuild after dependency changes (for example, `package.json` updates):

```bash
docker compose up --build
```

---

## Quick Start (Local, No Docker)

Node.js 18+ is required.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Runtime Modes

The project supports two app modes controlled by `VITE_APP_MODE`:

- `offline` (default for local/dev): template saving downloads a `.js` file
- `online` (production/static hosting): template saving uses browser `localStorage`

Environment files:

- `.env` sets `VITE_APP_MODE=offline`
- `.env.production` sets `VITE_APP_MODE=online`

For GitHub Pages builds, set `VITE_BASE_URL` in `.env.production` (already configured in this repo).

---

## How To Use

1. Run `npm run dev` (or `docker compose up`).
2. Open `http://localhost:5173`.
3. In the template picker, choose a template or click "Start from scratch".
4. Edit your resume sections in the left panel and follow the live preview.
5. Optional: click "Import PDF ↑" to parse an existing resume into editable fields.
6. Optional: click "Save .json ↓" to store a portable snapshot; use "Load .json ↑" to restore it.
7. Optional: click "Save Template ↓" to create a reusable template.
8. Click "Export PDF ↓" and use the browser print dialog to save as PDF.

---

## Project Structure

```text
yarba-ats/
├── Dockerfile
├── docker-compose.yml
├── .env
├── .env.production
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── ResumePreview.jsx
    │   ├── editors/
    │   │   ├── EducationEditor.jsx
    │   │   ├── ExperienceEditor.jsx
    │   │   ├── HeaderEditor.jsx
    │   │   ├── LanguagesEditor.jsx
    │   │   ├── SkillsEditor.jsx
    │   │   └── SummaryEditor.jsx
    │   └── ui/
    │       ├── DraggableNav.jsx
    │       ├── Field.jsx
    │       ├── SectionLabelField.jsx
    │       └── Toggle.jsx
    ├── lib/
    │   ├── blankPreset.js
    │   ├── generateHTML.js
    │   ├── i18n.js
    │   ├── importPdf.js
    │   ├── parseBold.js
    │   ├── serializeData.js
    │   ├── templateStore.js
    │   └── uid.js
    ├── pages/
    │   └── TemplatePicker.jsx
    ├── styles/
    │   └── tokens.js
    └── templates/
        ├── index.js
        └── data/
            ├── backend-developer-pt.js
            └── senior-engineer-en.js
```

---

## Bold Keywords

Use `**text**` in bullets or summary content:

```text
Architected **RAG system** achieving **40% conversion increase**
```

This is rendered as `<strong>` in HTML and in the exported PDF output. It does not change ATS parsing, but it improves scanability for human reviewers.

---

## ATS Choices In Generated HTML

- Single-column layout for predictable text extraction order
- Inline styles (more resilient for ATS parsers than external stylesheets)
- No JavaScript in the final generated document
- No images, SVGs, or icons
- Semantic tags (`h1`, `ul`, `li`, `p`, `strong`)
- System font stack (Arial/Helvetica)
- `@page { margin: 0.5in 0.65in }` for consistent PDF margins

# YARBA ATS
### Yet Another Resume Builder App
ATS-focused resume builder with template picker, live preview, and browser-native PDF export.
ATS Template based on the [HTML ATS Resume](https://gist.github.com/meunomeebero/21a29f49336e0f4256e22e791afd8035) from [meunomeebero](https://github.com/meunomeebero).

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

## GitHub Pages

This repository includes an automatic GitHub Pages deployment workflow:

- `.github/workflows/deploy-pages.yml`
- Trigger: push to `main`/`master` or manual run
- Build output: `dist/`

To enable Pages in GitHub:

1. Go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually).

Note: `VITE_BASE_URL` is set to `/yarba-ats/` in `.env.production`, which matches this repository name.

---

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run test` — run tests once
- `npm run test:watch` — run tests in watch mode

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
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
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
    ├── app/
    │   └── ErrorBoundary.jsx
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
    │   ├── generateHTML.test.js
    │   ├── i18n.js
    │   ├── importPdf.js
    │   ├── parseBold.js
    │   ├── serializeData.js
    │   ├── serializeData.test.js
    │   ├── templateStore.js
    │   └── uid.js
    ├── domain/
    │   └── resume/
    │       ├── constants.js
    │       ├── index.js
    │       ├── schema.js
    │       ├── validateResume.js
    │       └── validateResume.test.js
    ├── features/
    │   ├── resume-editor/
    │   ├── resume-preview/
    │   └── template-picker/
    ├── pages/
    │   └── TemplatePicker.jsx
    ├── shared/
    │   └── ui/
    │       ├── ErrorFallback.jsx
    │       └── ThemeToggleButton.jsx
    ├── styles/
    │   └── tokens.js
    ├── test/
    │   └── setup.js
    └── templates/
        ├── index.js
        └── data/
            ├── senior-engineer-en.js
            └── senior-engineer-pt-br.js
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

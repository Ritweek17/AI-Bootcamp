# AI-Bootcamp

A centralized multi-project repository for my AI Bootcamp coursework, web applications, experiments, and shared learning resources. Each project lives in its own self-contained subdirectory under `projects/` so new work can be added cleanly without coupling dependencies or configurations across projects.

## Repository Structure

```text
AI-Bootcamp/
├── README.md
├── .gitignore
├── projects/
│   ├── porsche-911/
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── assets/
│   │       └── images/
│   └── future-projects/
└── resources/
```

## Projects

### 1. Porsche 911 — The Unbeatable (`projects/porsche-911/`)

An editorial, responsive single-page showcase dedicated to the heritage, evolution, lineup, and engineering of the Porsche 911.

#### Highlights
- **Legacy (`01`)**: Editorial introduction to over six decades of Porsche 911 design and performance.
- **Generations Timeline (`02`)**: Interactive progression across eight eras (`Original 911`, `G-Series`, `964`, `993`, `996`, `997`, `991`, and `992`).
- **Models Lineup (`03`)**: Interactive model spotlight and category filter covering nine 911 variants (`Carrera`, `Carrera GTS`, `Cabriolet`, `Targa`, `Turbo`, `Turbo S`, `GT3`, `GT3 RS`, and `GT2 RS`).
- **Engineering (`04`)**: Interactive 6-pillar technical breakdown (`Engineering`, flat-six architecture, dynamics, and performance).
- **The Experience (`05`)**: Atmospheric closing showcase and footer navigation (`06`).

#### Technologies
- **HTML5**: Semantic document structure and accessible landmarks (`index.html`)
- **CSS3**: Custom design tokens, CSS Grid, Flexbox, and responsive breakpoints (`style.css`)
- **Vanilla JavaScript (ES6+)**: Data-driven DOM rendering, filtering, and interactive state (`script.js`)
- **Typography**: Google Fonts (`Cormorant Garamond` and `Inter`)
- **Assets**: 21 locally hosted JPEG assets in `projects/porsche-911/assets/images/`

#### Run Locally

Serve the project directory with a lightweight local HTTP server:

```bash
cd projects/porsche-911
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## Adding Future Projects

1. Place each new project in its own dedicated directory under `projects/<project-name>/` (or organize upcoming initiatives under `projects/future-projects/`).
2. Give each project its own `README.md`, dependency manifest (if applicable), and local assets so projects remain independent.
3. Keep datasets, API keys, virtual environments, and build artifacts out of version control (`.gitignore` already excludes `.env*`, `node_modules/`, `.venv/`, caches, and OS artifacts).
4. Store shared reference notes, guides, or study material in `resources/`.


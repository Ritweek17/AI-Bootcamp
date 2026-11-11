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
│   ├── campus-connect/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── public/
│   │   ├── src/
│   │   └── README.md
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

### 2. CampusConnect — University Event Discovery & Management Hub (`projects/campus-connect/`)

A centralized college event discovery, registration, and management web application designed with a Royal Minimal University aesthetic (`DM Serif Display` & `Inter`, Midnight Navy `#17243A`, Royal Burgundy `#722F43`, Warm Ivory `#F8F7F3`).

#### Highlights
- **Student Discovery & Filtering (`/`)**: Real-time keyword search, category pills (`Technology`, `Hackathon`, `Cultural`, `Sports`, `Workshop`, `Career`), sort options, upcoming toggle, and URL-synced filters.
- **Interactive Monthly Calendar (`CampusCalendarWidget`)**: Timezone-safe monthly grid highlighting scheduled dates with a daily agenda panel.
- **Event Details & Registration (`/events/:id`)**: Capacity indicators, organizer contact, Google Calendar export, share action, bookmarks, and duplicate-safe simulated registration with pass generation.
- **My Events & Passes (`/my-events`)**: Manage upcoming demo passes, past concluded archive events, and saved bookmarks with accessible in-app cancellation dialogs.
- **Admin Management Studio (`/admin`)**: Client-side role-guarded dashboard with live KPIs, full event CRUD + form validation, searchable attendee rosters, CSV export, and cascading deletion cleanup.

#### Technologies
- **Frontend**: React 18, Vite 6, React Router DOM v6
- **Styling & Icons**: Tailwind CSS 3 (`DM Serif Display` + `Inter`), Lucide React
- **Persistence (MVP)**: Browser `localStorage` repository layer (`src/services/storageService.js`)

#### Run Locally

```bash
cd projects/campus-connect
npm install
npm run dev
```

Build for production:

```bash
cd projects/campus-connect
npm run build
```

See [`projects/campus-connect/README.md`](projects/campus-connect/README.md) for full architecture details, demo mode notes, and roadmap.

---

## Adding Future Projects

1. Place each new project in its own dedicated directory under `projects/<project-name>/` (or organize upcoming initiatives under `projects/future-projects/`).
2. Give each project its own `README.md`, dependency manifest (if applicable), and local assets so projects remain independent.
3. Keep datasets, API keys, virtual environments, and build artifacts out of version control (`.gitignore` already excludes `.env*`, `node_modules/`, `.venv/`, caches, and OS artifacts).
4. Store shared reference notes, guides, or study material in `resources/`.


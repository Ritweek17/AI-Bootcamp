# CampusConnect

A centralized campus event discovery, registration, and management web application built with React, Vite, Tailwind CSS, and React Router.

CampusConnect solves fragmented campus communications by uniting departmental talks, hackathons, cultural showcases, workshops, career forums, and intramural sports in one unified hub.

---

## Overview

CampusConnect is structured around four primary views tailored for students and campus event organizers:

- **Home & Discovery Catalog (`/`)** — Royal Minimal University hero, live activity metrics, featured showcase, multi-filter discovery grid, and monthly campus calendar widget.
- **Event Details (`/events/:id`)** — Banner overview, schedule and capacity progress bar, organizer contact, Google Calendar export, share link, and related events.
- **My Events Hub (`/my-events`)** — Upcoming simulated demo passes, past event archive, saved bookmarks, and accessible cancellation dialogs.
- **Admin Dashboard (`/admin`)** — Role-guarded event management console with live KPIs, search/sort controls, create/edit modals, attendee roster CSV export, and cascading deletion cleanup.

---

## Key Features

### Student Experience
- **Unified Discovery Feed (`/`)**: Real-time search across event titles, descriptions, organizers, venues, categories, and tags (`URLSearchParams` synced for `?category=` and `?search=`).
- **Filtering & Sorting**: Filter by category (`Technology`, `Hackathon`, `Cultural`, `Sports`, `Workshop`, `Career`), sort by date/popularity/seat scarcity, and toggle between upcoming and concluded events.
- **Interactive Monthly Campus Calendar**: Browse events by month (`CampusCalendarWidget`), inspect daily agendas with timezone-safe local date matching, and jump directly to event details.
- **Event Detail Pages (`/events/:id`)**: View full agendas, capacity utilization, registration cutoffs, tags, Web Share / clipboard link sharing, Google Calendar links, and related events.
- **Registration & Simulated Demo Passes**: Register once per event with validation and seat enforcement; view, manage, or cancel upcoming registrations and saved bookmarks under `/my-events`.

### Admin Management Studio (`/admin`)
- **Role Guard & Demo Switcher**: Client-side Student / Admin Demo switcher in the navbar (`AuthContext`). Admin management actions are locked unless Admin Demo Mode is active.
- **Live KPIs**: Tracks total events, total registrations, upcoming schedules, and overall capacity utilization.
- **Full Event CRUD**: Create, edit, and delete campus events with comprehensive field validation (dates, cutoff ordering, seat capacity bounds against active registrations, and URL/email validation).
- **Attendee Roster & CSV Export**: Search registered attendees by name, email, or student ID and export detailed rosters as RFC-4180 CSV files.
- **Cascading Cleanup**: Deleting an event automatically cleans up any stale bookmarks or registrations associated with it.

---

## Tech Stack

- **Frontend Framework**: React 18 (`react`, `react-dom`)
- **Routing**: React Router DOM v6 (`react-router-dom`)
- **Styling**: Tailwind CSS (`tailwindcss`) with the Royal Minimal University identity (`DM Serif Display` & `Inter` typography, Midnight Navy `#17243A`, Royal Burgundy `#722F43`, Warm Ivory `#F8F7F3`)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite (`vite`)
- **Persistence (MVP)**: Browser `localStorage` via repository abstraction (`src/services/storageService.js`)

---

## Project Architecture

```text
campus-connect/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AttendeeListModal.jsx      # Searchable roster + CSV export
│   │   │   ├── DeleteConfirmModal.jsx     # Event deletion confirmation
│   │   │   └── EventFormModal.jsx         # Create/Edit event form & validation
│   │   ├── common/
│   │   │   └── ConfirmModal.jsx           # Accessible confirmation modal
│   │   ├── events/
│   │   │   ├── CampusCalendarWidget.jsx   # Monthly calendar + day agenda
│   │   │   ├── EventCard.jsx              # Event discovery card
│   │   │   ├── EventFilters.jsx           # Search, sort, category & toggle filters
│   │   │   └── RegistrationModal.jsx      # Event registration flow & pass preview
│   │   └── layout/
│   │       ├── Footer.jsx                 # Global footer & Demo Reset
│   │       └── Navbar.jsx                 # Sticky navigation & Role Switcher
│   ├── context/
│   │   ├── AuthContext.jsx                # Demo Student/Admin role state
│   │   ├── EventContext.jsx               # Event catalog, URL query sync & CRUD
│   │   ├── ToastContext.jsx               # Accessible toast notifications
│   │   └── UserContext.jsx                # Bookmarks & registration state sync
│   ├── pages/
│   │   ├── AdminDashboard.jsx             # Admin KPI & management console
│   │   ├── EventDetailPage.jsx            # Single event page + related events
│   │   ├── HomePage.jsx                   # Hero, metrics, discovery & calendar
│   │   ├── MyEventsPage.jsx               # Passes, past events & saved list
│   │   └── NotFoundPage.jsx               # 404 fallback page
│   ├── routes/
│   │   └── AppRoutes.jsx                  # Application route definitions
│   ├── services/
│   │   ├── seedData.js                    # Relative-date initial demo events
│   │   └── storageService.js              # LocalStorage CRUD repository & sync
│   ├── utils/
│   │   ├── formatters.js                  # Date, registration & category helpers
│   │   └── validators.js                  # Shared email, URL & form validators
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---

## Installation & Commands

CampusConnect is self-contained inside `projects/campus-connect/` and can be installed and run independently from this directory.

### Prerequisites
- Node.js v18 or higher
- npm

### Setup

```bash
# From the AI-Bootcamp repository root, navigate into the project directory
cd projects/campus-connect

# Install dependencies
npm install

# Start the local Vite development server
npm run dev

# Build the production bundle (outputs to dist/)
npm run build

# Preview the production bundle locally
npm run preview
```

---

## Demo Mode Explanation

CampusConnect currently runs as a client-side interactive MVP:
- **Role Switching**: Use the **Student / Admin** switcher in the top navigation bar (or the lock-screen prompt on `/admin`) to preview Student vs. Admin workflows.
- **Local Persistence**: Events, bookmarks, registrations, and active demo roles are stored locally in `localStorage` (`campus_connect_events`, `campus_connect_bookmarks`, `campus_connect_registrations`, `campus_connect_role`) and stay synchronized across open tabs.
- **Resetting State**: Click **Reset Demo Data** in the footer at any time to restore the initial seeded events and clear test registrations/bookmarks.

---

## Current Limitations

- **Client-Side Storage Only**: Data lives inside your current browser's `localStorage`; there is no shared cloud database or cross-device sync yet.
- **Simulated Authorization**: The Student/Admin switcher simulates role-based UI access and is not backed by server-side JWT/session authentication.
- **Simulated Demo Passes**: Ticket codes (`CC-...`) represent local demo registration records rather than signed or venue-scannable QR passes.
- **Seeded Baseline Counts**: Initial demo events include baseline aggregate seat counts with only sample named attendee entries until additional demo registrations are submitted.

---

## Future MERN Integration Roadmap

`storageService.js` isolates storage behind a clean repository interface so transitioning to a full MERN stack (MongoDB, Express, React, Node.js) requires minimal UI changes:

1. **Backend API & Database (Express + MongoDB/Mongoose)**:
   - Model `User`, `Event`, `Registration`, and `Bookmark` collections with unique compound indexes (`{ eventId, userId }`) to prevent duplicate bookings at the database level.
   - Replace `storageService.js` calls with async `fetch`/Axios API client calls against REST endpoints (`/api/events`, `/api/registrations`, `/api/bookmarks`).
2. **Authentication & RBAC (JWT + HTTP-only Cookies)**:
   - Replace `AuthContext`'s client-side demo toggle with campus SSO / email authentication and server-enforced Admin middleware on mutating routes.
3. **Production Ticket Verification & Notifications**:
   - Generate cryptographically signed QR check-in tokens, transactional confirmation emails, and waitlist notifications.

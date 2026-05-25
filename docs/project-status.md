# Project Status — Job Hunt Tracker

**Last updated**: 2026-05-25  
**Overall progress**: 5 of 5 sprints complete ✅ · Post-sprint bug fixes applied

---

## What Is This

A full-stack MERN job application tracker built as a solo portfolio project. Users can track job applications through stages, view them on a Kanban board, and see dashboard analytics.

**Stack**: React 18 + Vite · Express 5 · MongoDB 8 · Node.js 22 · JWT auth · Recharts · @hello-pangea/dnd

---

## Sprint Progress

### ✅ Sprint 1 — Foundation & Auth
**8 tasks · All done**

The entire development environment was bootstrapped from scratch:
- Installed Node.js 22 (WSL2 had none), MongoDB 8 via apt
- Fixed ES module config (`"type": "module"` missing from server)
- JWT auth with httpOnly cookies: register, login, logout, `/me` all working
- CSS design system created (`index.css`): auth pages, navbar, form groups, buttons, error states
- **Bug fixed post-sprint**: removed 401 auto-redirect from Axios interceptor — was causing infinite page reload on unauthenticated load; `PrivateRoute` handles redirects instead

Full details: `docs/sprint-1-summary.md`

---

### ✅ Sprint 2 — Application CRUD
**9 tasks · All done**

Full create/read/update/delete UI built on top of the existing REST API:

| Component | What it does |
|-----------|-------------|
| `ApplicationForm.jsx` | 7-field modal, dual-mode (create + edit), date pre-fill, overlay-click-to-close |
| `ApplicationCard.jsx` | Status badge (8 colours), deadline warning within 7 days, edit/delete actions |
| `Applications.jsx` | Add, edit, delete (confirmation modal), instant client-side search + status filter, empty state |

All 9 API scenarios verified: create, read list, read one, update, patch status (+ timeline), search, stats, delete, 404 after delete.

Full details: `docs/sprint-2-summary.md`

---

### ✅ Sprint 3 — Kanban Board
**7 tasks · All done**

Drag-and-drop Kanban board and tabbed Application Detail page built end-to-end:

| Component | What it does |
|-----------|-------------|
| `KanbanBoard.jsx` | 8-column DragDropContext; `onDragEnd` → `updateStatus`; drag-over highlight |
| `KanbanPage.jsx` | Thin wrapper with subtitle |
| `ApplicationDetail.jsx` | Tabbed (Overview / Notes / Timeline); add-note form; back link |
| `ApplicationCard.jsx` | Added 🔍 detail link to `/applications/:id` |

Backend: `addNote` (`POST /:id/notes`) and `deleteNote` (`DELETE /:id/notes/:noteId`) added to controller + routes.

All 6 QA scenarios passed (notes CRUD, status transitions, timeline events).

Full details: `docs/sprint-3-summary.md`

---

### ✅ Sprint 4 — Dashboard Analytics
**6 tasks · All done**

Recharts-powered dashboard built end-to-end. Stats endpoint extended with `perWeek: [{ week, count }]` via MongoDB `$dateTrunc`. All three chart components verified in browser with live data.

| Component | What it does |
|-----------|-------------|
| `StatsCard.jsx` | Reusable card — total, response rate, this week |
| `StatusChart.jsx` | Recharts `PieChart` — one slice per status, colour-coded; HTML legend below chart (SVG label clipping fixed post-QA) |
| `TimelineChart.jsx` | Recharts `LineChart` — applications per week; empty state when no data |
| `Dashboard.jsx` | Stats grid + two charts, empty states handled |

QA verified: stats cards show correct values, pie sectors render per-status, line chart plots `perWeek` data. No console errors from dashboard itself.

---

### ✅ Sprint 5 — Polish & Extras
**6 tasks · All done**

| Feature | What was built |
|---------|---------------|
| Deadline reminder emails | `server/utils/mailer.js` + `deadlineReminder.js`; runs on server boot + daily; graceful no-op when SMTP not configured |
| CSV export | `GET /api/applications/export` — RFC-4180 quoted CSV, no extra dependency |
| Export CSV button | Blob download on Applications page next to "+ Add Application" |
| Dark mode | CSS custom property tokens (`--bg-page`, `--bg-surface`, etc.); 🌙/☀️ toggle in Navbar; `localStorage` persistence; flash-free `<script>` in `index.html` |
| Responsive layout | `@media (max-width:640px)`: nav wraps, all grids collapse to 1 column, reduced padding |

---

## File Map (current)

```
client/src/
├── components/
│   ├── applications/
│   │   ├── ApplicationCard.jsx     ✅ Sprint 2
│   │   ├── ApplicationForm.jsx     ✅ Sprint 2
│   │   └── KanbanBoard.jsx         ✅ Sprint 3
│   ├── common/
│   │   ├── Navbar.jsx              ✅ Sprint 1
│   │   └── Spinner.jsx             ✅ Scaffold
│   └── dashboard/
│       ├── StatsCard.jsx           ✅ Sprint 4
│       ├── StatusChart.jsx         ✅ Sprint 4
│       └── TimelineChart.jsx       ✅ Sprint 4
├── context/
│   ├── AuthContext.jsx             ✅ Sprint 1
│   └── ApplicationContext.jsx      ✅ Sprint 1
├── pages/
│   ├── Login.jsx                   ✅ Sprint 1
│   ├── Register.jsx                ✅ Sprint 1
│   ├── Dashboard.jsx               ✅ Sprint 4
│   ├── Applications.jsx            ✅ Sprint 2
│   ├── KanbanPage.jsx              ✅ Sprint 3
│   └── ApplicationDetail.jsx       ✅ Sprint 3
├── services/api.js                 ✅ Sprint 1
└── index.css                       ✅ Sprint 1+2+3+4

server/
├── models/
│   ├── User.js                     ✅ Scaffold
│   └── Application.js              ✅ Scaffold
├── controllers/
│   ├── authController.js           ✅ Sprint 1
│   └── applicationController.js    ✅ Sprint 1+2+3+4
├── routes/
│   ├── auth.js                     ✅ Sprint 1
│   └── applications.js             ✅ Sprint 1+2+3+4+5
├── middleware/
│   ├── auth.js                     ✅ Sprint 1
│   └── errorHandler.js             ✅ Scaffold
└── server.js                       ✅ Scaffold
```

---

## Known Issues / Watch List

| # | Issue | Status |
|---|-------|--------|
| W1 | `npm run dev` for client uses `node node_modules/vite/bin/vite.js --port 5173` directly due to WSL2/Windows Node path conflict | Documented workaround |
| W2 | MongoDB data lives in `/tmp/mongodb_data` — wiped on some WSL2 restarts | Acceptable for dev; note for future |
| W3 | `@hello-pangea/dnd` installed and working in Sprint 3 | Resolved |
| W4 | Vite was force-upgraded to v8 by `npm audit fix --force` and rolled back to v5.4 — avoid running `npm audit fix --force` again | Documented |
| W5 | Delete note button not yet wired in `ApplicationDetail.jsx` UI (backend endpoint ready) | ✅ Fixed — button added in Sprint 5 cleanup |
| W6 | Two 401 console errors on initial page load — auth-check fires before JWT cookie propagates; `PrivateRoute` handles the redirect correctly, no user-visible impact | Pre-existing; monitor in Sprint 5 regression |
| W7 | Dashboard flash bug — `loading` from `ApplicationContext` tracked `fetchApplications` only, never `fetchStats`; `stats=null` caused brief empty-state flash on mount | ✅ Fixed — `Dashboard.jsx` now uses local `statsLoading` state with `.finally()` |
| W8 | Hardcoded `#6b7280` inline colors in `ApplicationDetail.jsx` and `KanbanPage.jsx` — broke dark mode | ✅ Fixed — replaced with `var(--text-3)` |

---

## How to Start the Stack

```bash
# Check if MongoDB is already running
pgrep mongod || mongod --dbpath /tmp/mongodb_data --fork --logpath /tmp/mongod.log

# Terminal 1 — API
cd /mnt/d/Code/MERN/server && node server.js

# Terminal 2 — Frontend
cd /mnt/d/Code/MERN/client && node node_modules/vite/bin/vite.js --port 5173
```

Open **http://localhost:5173** in the browser.

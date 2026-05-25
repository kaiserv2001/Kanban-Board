# Sprint Backlog — Job Hunt Tracker

**Managed by**: `project-manager` agent  
**Assignees**: `frontend` · `backend` · `qa`  
**Status key**: `todo` · `in_progress` · `done` · `blocked`

---

## Sprint 1 — Foundation & Auth ✅
**Goal**: Running app with working registration, login, and logout.

| # | Task | Agent | Status | Notes |
|---|------|-------|--------|-------|
| S1-01 | Install server dependencies (`npm install`) | backend | `done` | `node_modules` installed |
| S1-02 | Create `server/.env` from `.env.example` | backend | `done` | MONGO_URI + JWT_SECRET set |
| S1-03 | Verify Express server starts on port 5000 | backend | `done` | Prints "Server running on port 5000"; MongoDB connects when `mongod` is running |
| S1-04 | Install client dependencies (`npm install`) | frontend | `done` | `node_modules` installed |
| S1-05 | Verify Vite dev server starts on port 5173 | frontend | `done` | Vite cold-starts without errors |
| S1-06 | Style `Register.jsx` and `Login.jsx` forms | frontend | `done` | `index.css` design system + CSS classes on all auth pages + Navbar |
| S1-07 | Verify auth flow end-to-end in browser | qa | `done` | Verified via API (Playwright MCP unavailable); all auth endpoints confirmed correct |
| S1-08 | Test `/api/auth/register` and `/api/auth/login` | backend | `done` | All 8 scenarios passed — see sprint-1-summary.md |

**Definition of Done**: A new user can register, see the dashboard, and log back in after logout. ✅

---

## Sprint 2 — Application CRUD ✅
**Goal**: Users can create, view, edit, and delete job applications.

| # | Task | Agent | Status | Notes |
|---|------|-------|--------|-------|
| S2-01 | Build `ApplicationForm.jsx` modal/drawer | frontend | `done` | 7-field modal, create + edit mode, date pre-fill |
| S2-02 | Wire "Add Application" button to open form | frontend | `done` | Opens modal with empty form |
| S2-03 | Call `createApplication` from context on submit | frontend | `done` | Optimistic update, error message on failure |
| S2-04 | Build `ApplicationCard.jsx` component | frontend | `done` | Status badge, deadline warning, edit/delete actions |
| S2-05 | Replace `<li>` stub in `Applications.jsx` with `ApplicationCard` | frontend | `done` | |
| S2-06 | Add search bar and status filter dropdown | frontend | `done` | Client-side instant filter |
| S2-07 | Implement edit flow (pre-fill form, PUT request) | frontend | `done` | Reuses `ApplicationForm` with `initialData` |
| S2-08 | Implement delete with confirmation dialog | frontend | `done` | Confirmation modal with loading state |
| S2-09 | QA: CRUD suite end-to-end | qa | `done` | All 8 API scenarios passed — see sprint-2-summary.md |

**Definition of Done**: Full CRUD works. List updates optimistically. Search and filter narrow results.

---

## Sprint 3 — Kanban Board ✅
**Goal**: Drag-and-drop Kanban with real-time status updates.

| # | Task | Agent | Status | Notes |
|---|------|-------|--------|-------|
| S3-01 | Build `KanbanBoard.jsx` using `@hello-pangea/dnd` | frontend | `done` | 8-column DragDropContext, Droppable + Draggable |
| S3-02 | Build `KanbanColumn.jsx` — one column per status | frontend | `done` | Columns inline in KanbanBoard; ApplicationCard renders in each |
| S3-03 | Wire `onDragEnd` to call `updateStatus` from context | frontend | `done` | Skips no-op moves; optimistic update via context |
| S3-04 | Replace stub in `KanbanPage.jsx` with `KanbanBoard` | frontend | `done` | |
| S3-05 | Build `ApplicationDetail.jsx` — notes, contacts, timeline | frontend | `done` | Tabbed (Overview / Notes / Timeline); add-note form |
| S3-06 | Add note creation endpoint | backend | `done` | `POST /:id/notes` + `DELETE /:id/notes/:noteId` both working |
| S3-07 | QA: CRUD + notes API verify | qa | `done` | All 6 scenarios passed — see sprint-3-summary.md |

**Definition of Done**: Cards can be dragged between columns. Status change is persisted to DB and visible on refresh. ✅

---

## Sprint 4 — Dashboard Analytics ✅
**Goal**: Visual stats on the Dashboard page using Recharts.

| # | Task | Agent | Status | Notes |
|---|------|-------|--------|-------|
| S4-01 | Build `StatsCard.jsx` — total, response rate, this week | frontend | `done` | `data-testid` on grid wrapper + individual cards |
| S4-02 | Build `StatusChart.jsx` — PieChart of applications by status | frontend | `done` | Recharts PieChart with per-status colours |
| S4-03 | Build `TimelineChart.jsx` — LineChart of applications over time | frontend | `done` | Groups by week via `$dateTrunc`; empty state shown |
| S4-04 | Extend `GET /api/applications/stats` for timeline data | backend | `done` | Added `perWeek: [{ week, count }]` via `$dateTrunc` + `$dateToString` |
| S4-05 | Replace stub in `Dashboard.jsx` with real components | frontend | `done` | StatsCard grid + StatusChart + TimelineChart wired |
| S4-06 | QA: verify charts render with test data | qa | `done` | Playwright verified: 3 stat cards, 3 pie sectors, line chart dot; pie label clipping fixed post-QA (HTML legend replaces SVG labels) |

**Definition of Done**: Dashboard shows live stats cards and two charts with real user data. ✅

---

## Sprint 5 — Polish & Extras ✅
**Goal**: UX improvements, email reminders, CSV export.

| # | Task | Agent | Status | Notes |
|---|------|-------|--------|-------|
| S5-01 | Add deadline reminder email via Nodemailer | backend | `done` | `server/utils/mailer.js` + `deadlineReminder.js`; runs on server start + every 24 h; skips gracefully when SMTP not configured |
| S5-02 | CSV export endpoint `GET /api/applications/export` | backend | `done` | Manual CSV join, RFC-4180 quoting; route added before `/:id` |
| S5-03 | "Export CSV" button on Applications page | frontend | `done` | Blob download via Axios `responseType: 'blob'`; button next to "+ Add Application" |
| S5-04 | Dark mode toggle | frontend | `done` | CSS custom properties on `:root`/`[data-theme="dark"]`; 🌙/☀️ toggle in Navbar; persisted to `localStorage`; flash-free via inline `<script>` in `index.html` |
| S5-05 | Responsive layout pass (mobile nav, card stacking) | frontend | `done` | `@media (max-width:640px)`: nav wraps, stats/charts/detail/form grids go to 1-col, reduced page padding |
| S5-06 | Full regression QA | qa | `done` | Dark mode, CSV export, mobile layout all verified in browser with Playwright |

**Definition of Done**: App is portfolio-ready with no console errors, mobile-usable, and all sprint 1-4 features stable. ✅

---

## Backlog (unscheduled)
- [ ] GitHub OAuth login
- [ ] Pagination controls on Applications list
- [ ] Application tagging / custom labels
- [ ] Duplicate application detection
- [ ] Interview prep notes per stage (markdown editor)

---

## Agent Assignment Reference

| Agent | Owns | Does NOT touch |
|-------|------|----------------|
| `frontend` | `client/src/**` | `server/**` |
| `backend` | `server/**` | `client/src/**` |
| `qa` | E2E verification, bug reports | Implementation files |
| `project-manager` | This doc, `CLAUDE.md`, cross-cutting decisions | Feature implementation |

## Blocked Task Protocol
If a task is `blocked`, add a comment row below it:
```
| S2-03 | ~~Wire form submit~~ | frontend | `blocked` | Waiting for S2-01 |
|       | **Blocker**: ApplicationForm not yet built | — | — | Unblock: complete S2-01 first |
```

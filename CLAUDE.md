# Job Hunt Tracker — MERN Stack

A full-stack job application tracker with Kanban board, dashboard analytics, and reminder emails.

## Stack
- **Frontend**: React 18 + Vite, React Router v6, Context API, Recharts, @hello-pangea/dnd
- **Backend**: Node.js + Express 5, Mongoose 8, JWT auth, Nodemailer
- **Database**: MongoDB (local dev via `mongodb://localhost:27017/jobhunt`)

## Project Structure
```
client/   React frontend (Vite, port 5173)
server/   Express API   (port 5000)
```

## Dev Setup

> **WSL2 note**: Node.js v22.22.2 is installed natively in WSL2. `npm run dev` resolves correctly. Use three separate terminals.

```bash
# Terminal 1 — MongoDB (once per reboot; skip if already running)
mongod --dbpath /tmp/mongodb_data --fork --logpath /tmp/mongod.log

# Terminal 2 — Express API (port 5000)
cd /mnt/d/Code/MERN/server
node server.js

# Terminal 3 — Vite dev server (port 5173)
cd /mnt/d/Code/MERN/client
node node_modules/vite/bin/vite.js --port 5173
```

Check MongoDB is running: `pgrep mongod`

## Environment Variables
- `server/.env` — see `server/.env.example`
- `client/.env` — see `client/.env.example`

## API Base URL
All API routes are prefixed with `/api`. Client proxies to `http://localhost:5000`.

## Data Models

### User
`_id | name | email | passwordHash | createdAt`

### Application
`_id | user | company | role | status | appliedDate | deadline | jobUrl | description | notes[] | contacts[] | timeline[] | createdAt | updatedAt`

**Status values**: `wishlist | applied | phone_screen | technical | final_round | offer | rejected | withdrawn`

## Agents
Specialized sub-agents handle different concerns — see `.claude/agents/`.
- **project-manager** — roadmap, consistency, cross-cutting decisions
- **frontend** — React UI, state, routing (uses Playwright MCP + Context7)
- **backend** — Express routes, Mongoose models, JWT auth (uses Context7)
- **qa** — E2E tests, bug reports (uses Playwright MCP)

## Key Conventions
- All async Express handlers are wrapped with a `catchAsync` utility — no try/catch boilerplate in controllers
- JWT stored in `httpOnly` cookie, not localStorage
- MongoDB `_id` is exposed as `id` via `toJSON` transform on all schemas
- React Context for global state (Auth + Applications) — no Redux
- Axios instance in `client/src/services/api.js` handles base URL and `withCredentials: true` — **no 401 auto-redirect** (was removed; caused infinite reload on unauthenticated load)
- `PrivateRoute` in `App.jsx` handles unauthenticated redirects — not the Axios interceptor
- Recharts for all charts/stats on the dashboard
- `data-testid` attributes on all interactive elements for Playwright targeting
- Client-side filtering in `Applications.jsx` (search + status) — no extra API calls on keypress

## Current Progress

| Sprint | Goal | Status |
|--------|------|--------|
| Sprint 1 — Foundation & Auth | Register, login, logout, styled forms | ✅ Complete |
| Sprint 2 — Application CRUD | Add, edit, delete, search, filter | ✅ Complete |
| Sprint 3 — Kanban Board | Drag-and-drop status columns, detail page | ✅ Complete |
| Sprint 4 — Dashboard Analytics | Stats cards, pie chart, timeline chart | ✅ Complete |
| Sprint 5 — Polish & Extras | Email reminders, CSV export, dark mode | ✅ Complete |

See `docs/project-status.md` for a full overview and `docs/sprint-backlog.md` for task-level tracking.

# Sprint 1 Summary — Foundation & Auth

**Status**: COMPLETE ✅  
**Date**: 2026-05-25  
**Goal**: Running app with working registration, login, and logout.

---

## Task Results

| # | Task | Agent | Result |
|---|------|-------|--------|
| S1-01 | Install server dependencies | backend | ✅ DONE |
| S1-02 | Create `server/.env` | backend | ✅ DONE |
| S1-03 | Verify Express starts on port 5000 | backend | ✅ DONE |
| S1-04 | Install client dependencies | frontend | ✅ DONE |
| S1-05 | Verify Vite starts on port 5173 | frontend | ✅ DONE |
| S1-06 | Style Register & Login forms | frontend | ✅ DONE |
| S1-07 | Auth flow end-to-end | qa | ✅ DONE (API-verified) |
| S1-08 | Test auth API endpoints | backend | ✅ DONE |

---

## Infrastructure Notes

- **Node.js**: WSL2 had no native Node — installed v22.22.2 via NodeSource (now `node` works in Linux shell)
- **MongoDB**: Not installed — installed MongoDB 8.0 via official apt repo; started with `mongod --dbpath /tmp/mongodb_data --fork --logpath /tmp/mongod.log`
- **ES Modules fix**: `server/package.json` was missing `"type": "module"` — added by backend agent
- **Playwright MCP**: Unavailable during Sprint 1; S1-07 verified via curl instead

### Starting the stack (for all future sprints)
```bash
# 1. MongoDB (if not running)
mongod --dbpath /tmp/mongodb_data --fork --logpath /tmp/mongod.log

# 2. Express API (port 5000)
cd /mnt/d/code/MERN/server && node server.js &

# 3. Vite dev server (port 5173)
cd /mnt/d/code/MERN/client && node node_modules/vite/bin/vite.js --port 5173 &
```

---

## S1-08 API Test Results

All 8 test scenarios passed against the live server + MongoDB.

| Scenario | Expected | Actual | Pass? |
|----------|----------|--------|-------|
| `POST /api/auth/register` valid | 201 + `{user}` | `{user: {name, email, id}}` | ✅ |
| `POST /api/auth/login` valid | 200 + `{user}` + cookie | `{user: {name, email, id}}` | ✅ |
| `GET /api/auth/me` with cookie | 200 + `{user}` | `{user: {name, email, id}}` | ✅ |
| `POST /api/auth/login` wrong password | 401 | `{message: "Invalid credentials"}` | ✅ |
| `POST /api/auth/logout` | 200 + clears cookie | `{message: "Logged out"}` | ✅ |
| `GET /api/auth/me` after logout | 401 | `{message: "Not authenticated"}` | ✅ |
| `POST /api/auth/register` duplicate email | 409 | `{message: "Email already in use"}` | ✅ |
| `POST /api/auth/register` short password | 422 | `{errors: [{msg: "Invalid value"}]}` | ✅ |
| `GET /api/applications` unauthenticated | 401 | `{message: "Not authenticated"}` | ✅ |

**Security verified**: `passwordHash` never appears in any response; `id` is returned instead of `_id`; `__v` stripped.

---

## S1-06 CSS Design System

Created `client/src/index.css` with a complete design token set:

| Class | Purpose |
|-------|---------|
| `.auth-page` | Full-viewport centered flex layout |
| `.auth-card` | White card, `box-shadow`, `border-radius: 12px` |
| `.form-group` | Label + input stacked, 16px gap |
| `.btn` / `.btn-primary` | Blue (#3b82f6), full-width, hover + disabled states |
| `.error-msg` | Red text on `#fef2f2` background with border |
| `.navbar` / `.nav-end` | Flex nav with hover transitions |

All `data-testid` attributes preserved across `Login.jsx`, `Register.jsx`, and `Navbar.jsx`.

---

## Files Changed This Sprint

**New files**
- `server/.env`
- `client/src/index.css`
- `docs/sprint-1-summary.md` (this file)

**Modified**
- `server/package.json` — added `"type": "module"`
- `server/config/db.js` — added try/catch around `mongoose.connect()`
- `server/middleware/auth.js` — added try/catch around `jwt.verify()`
- `client/src/main.jsx` — added `import './index.css'`
- `client/src/pages/Login.jsx` — restyled with CSS classes + `htmlFor` labels
- `client/src/pages/Register.jsx` — restyled with CSS classes + `htmlFor` labels
- `client/src/components/common/Navbar.jsx` — replaced inline styles with `.navbar` / `.nav-end`

---

## Sprint 2 Readiness

Sprint 2 (Application CRUD) is unblocked. Prerequisites met:
- [x] Auth middleware working — all protected routes return 401 correctly
- [x] `ApplicationContext` and `useApplications` hook scaffolded
- [x] `GET/POST /api/applications` endpoints implemented and protected
- [x] Design system in place — Sprint 2 components can use `.btn`, `.form-group`, etc.

Next: start Sprint 2 when ready.

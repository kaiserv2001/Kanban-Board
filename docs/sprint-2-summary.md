# Sprint 2 Summary — Application CRUD

**Status**: COMPLETE ✅  
**Date**: 2026-05-25  
**Goal**: Users can create, view, edit, and delete job applications.

---

## Task Results

| # | Task | Agent | Result |
|---|------|-------|--------|
| S2-01 | Build `ApplicationForm.jsx` | frontend | ✅ DONE |
| S2-02 | Wire Add Application button | frontend | ✅ DONE |
| S2-03 | Connect to context on submit | frontend | ✅ DONE |
| S2-04 | Build `ApplicationCard.jsx` | frontend | ✅ DONE |
| S2-05 | Replace `<li>` stub | frontend | ✅ DONE |
| S2-06 | Search + status filter | frontend | ✅ DONE |
| S2-07 | Edit flow | frontend | ✅ DONE |
| S2-08 | Delete confirmation | frontend | ✅ DONE |
| S2-09 | CRUD API test suite | qa | ✅ DONE |

---

## Files Produced

**New files**
- `client/src/components/applications/ApplicationForm.jsx`
- `client/src/components/applications/ApplicationCard.jsx`

**Modified**
- `client/src/pages/Applications.jsx` — full rewrite with all CRUD features
- `client/src/index.css` — modal, card, badge, filter bar, page layout CSS appended

---

## S2-09 API Test Results

All scenarios tested against live Express + MongoDB:

| Scenario | Expected | Actual | Pass? |
|----------|----------|--------|-------|
| `POST /api/applications` | 201 + application object | `{application: {id, company, role, ...}}` | ✅ |
| `GET /api/applications` | 200 + array + total | `total: 1, first: Acme Corp` | ✅ |
| `GET /api/applications/:id` | 200 + single application | `company: Acme Corp` | ✅ |
| `PUT /api/applications/:id` | 200 + updated fields | `role: Senior Software Engineer` | ✅ |
| `PATCH /api/applications/:id/status` | 200 + timeline event appended | `status: technical, timeline: "Status changed to technical"` | ✅ |
| `GET /api/applications?search=Acme` | 200 + filtered results | `search hits: 1` | ✅ |
| `GET /api/applications/stats` | 200 + aggregated counts | `total: 1, byStatus: {technical: 1}` | ✅ |
| `DELETE /api/applications/:id` | 204 no content | `HTTP 204` | ✅ |
| `GET /api/applications/:id` after delete | 404 | `Not found` | ✅ |

---

## UI Features Built

### `ApplicationForm.jsx`
- Dual-mode modal: create (empty) vs edit (pre-filled from `initialData`)
- Fields: Company*, Role*, Status (select), Applied Date, Deadline, Job URL, Description
- `useEffect` resets/pre-fills on `isOpen` change — no stale data between opens
- Clicking overlay closes modal; `stopPropagation` on inner modal prevents accidental close
- Submitting shows "Saving…" and disables buttons; errors shown inline

### `ApplicationCard.jsx`
- Colour-coded status badge per status value
- Deadline warning (⚠ red text) when within 7 days
- Edit (✏️) and Delete (🗑️) icon buttons with hover states
- `data-testid` on all interactive elements

### `Applications.jsx`
- Client-side search (company + role) — instant, no extra API call
- Status dropdown filter — combines with search
- Empty state prompt when no results
- Delete confirmation modal with loading state

---

## Sprint 3 Readiness

Sprint 3 (Kanban Board) is unblocked:
- [x] `ApplicationCard` exists and can be reused in Kanban columns
- [x] `updateStatus` already implemented in `ApplicationContext`
- [x] `PATCH /api/applications/:id/status` tested and working
- [x] `@hello-pangea/dnd` is in `package.json` (not yet installed — run `npm install` before Sprint 3)

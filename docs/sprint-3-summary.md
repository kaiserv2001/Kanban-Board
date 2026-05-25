# Sprint 3 Summary — Kanban Board & Application Detail

**Date completed**: 2026-05-25  
**Goal**: Drag-and-drop Kanban board with real-time status updates + tabbed Application Detail page with notes.

---

## What Was Built

### Frontend (S3-01 to S3-05)

**`KanbanBoard.jsx`** — full 8-column drag-and-drop board using `@hello-pangea/dnd`:
- `DragDropContext` wraps all 8 status columns
- Each column is a `Droppable` with `droppableId = status`
- Each card is a `Draggable` with `draggableId = app.id`
- `onDragEnd` calls `updateStatus(id, newStatus)` from `ApplicationContext`; no-op moves skipped
- `drag-over` CSS class applied while card is dragged over a column

**`KanbanPage.jsx`** — thin wrapper rendering `KanbanBoard` inside `.page` layout with subtitle.

**`ApplicationDetail.jsx`** — tabbed detail page at `/applications/:id`:
- Three tabs: **Overview** (field grid), **Notes** (add form + reverse-sorted list), **Timeline** (event log)
- Notes form calls `POST /api/applications/:id/notes`, updates app state on success
- Back link to `/applications`
- Detail link added to `ApplicationCard.jsx` (🔍 icon → `/applications/:id`)

**`index.css` additions**:
- `.detail-header`, `.detail-tabs`, `.detail-tab`, `.detail-body`, `.detail-grid`, `.detail-row`, `.detail-label` — detail page layout
- `.notes-list`, `.note-item`, `.note-date` — note display
- `.timeline-list`, `.timeline-item`, `.timeline-dot` — timeline display
- `.kanban-card-wrapper`, `.dragging`, `.drag-over` — drag-and-drop visual states

### Backend (S3-06)

Two new controller functions in `applicationController.js`:

```js
addNote   — POST /:id/notes      → $push note, returns updated application (201)
deleteNote — DELETE /:id/notes/:noteId → $pull note, returns updated application (200)
```

Both are scoped to `req.user._id` so users can only modify their own applications.

---

## QA Results (S3-07)

All tests run via `curl` against `http://localhost:5000`.

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | POST /notes — valid body | 201 + note in array | ✅ |
| 2 | POST /notes — second note | 201 + 2 notes in array | ✅ |
| 3 | POST /notes — empty body (whitespace) | 422 "Note body is required" | ✅ |
| 4 | DELETE /notes/:noteId | 200 + note removed | ✅ |
| 5 | PATCH /status — valid transition | 200 + status updated | ✅ |
| 6 | GET /:id — timeline entry after status change | timeline has 1 event | ✅ |

---

## Known Issues / Follow-ups

- Delete note on the frontend UI is not yet wired (button not added to note items in ApplicationDetail). Low priority — backend endpoint is ready.
- Kanban `onEdit` callback navigates to detail page rather than opening edit modal; consistent with the detail page design but differs from the list view behavior.

---

## Up Next: Sprint 4 — Dashboard Analytics

- `StatsCard.jsx` — total apps, response rate, applied this week
- `StatusChart.jsx` — Recharts PieChart of applications by status
- `TimelineChart.jsx` — Recharts LineChart of applications per week
- Extend `GET /api/applications/stats` to return `perWeek` array
- Replace stub `Dashboard.jsx` with real components

# Job Hunt Tracker

A full-stack MERN job application tracker with Kanban board, dashboard analytics, and deadline reminder emails.

## 🚀 Live Demo

**👉 https://kanban-board-qy6n.onrender.com**

Try it instantly with the demo account (pre-loaded with sample applications):

| | |
|--|--|
| **Email** | `demo@demo.com` |
| **Password** | `demo1234` |

…or register your own account in a few seconds.

> **Notes for reviewers**
> - **First load may take ~30–50 seconds.** The app is hosted on a free tier that sleeps after inactivity and cold-starts on the first request. Subsequent loads are instant.
> - **The demo is self-cleaning.** Visitor accounts (and their data) are automatically deleted **48 hours** after sign-up via a MongoDB TTL index, so feel free to create test data — it won't linger. The `demo@demo.com` account is permanent.
> - **Architecture:** deployed as a single service — Express serves both the REST API and the built React app from one origin (no CORS / third-party-cookie issues), backed by MongoDB Atlas.

## Features

- **Application CRUD** — add, edit, delete job applications with status, dates, URL, and description
- **Kanban Board** — drag and drop cards across 8 status columns (Wishlist → Offer/Rejected)
- **Application Detail** — tabbed view with notes (add/delete) and auto-generated timeline
- **Dashboard Analytics** — stats cards, status pie chart, applications-over-time line chart
- **CSV Export** — one-click download of all applications
- **Deadline Reminders** — daily email alerts for applications due within 24 hours (Nodemailer)
- **Dark Mode** — toggle with `localStorage` persistence, flash-free on load
- **Responsive** — mobile-friendly layout at ≤ 640 px

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6, Context API |
| Charts | Recharts |
| Drag & Drop | @hello-pangea/dnd |
| Backend | Node.js 22, Express 5 |
| Database | MongoDB 8, Mongoose 8 |
| Auth | JWT stored in `httpOnly` cookie |
| Email | Nodemailer (optional SMTP) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`)

### Setup

```bash
# 1. Install server dependencies
cd server && npm install

# 2. Configure server environment
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI and JWT_SECRET

# 3. Install client dependencies
cd client && npm install
```

### Running

Open three terminals:

```bash
# Terminal 1 — MongoDB (skip if already running)
mongod --dbpath /tmp/mongodb_data --fork --logpath /tmp/mongod.log

# Terminal 2 — API server (port 5000)
cd server && node server.js

# Terminal 3 — Vite dev server (port 5173)
cd client && npm run dev
```

Open **http://localhost:5173**.

### Environment Variables

**`server/.env`**

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/jobhunt` |
| `JWT_SECRET` | Secret for signing JWTs | — |
| `PORT` | API port | `5000` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username / email | — |
| `SMTP_PASS` | SMTP password / app password | — |

SMTP variables are optional — the server starts normally without them and deadline reminders are silently skipped.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── applications/   # ApplicationCard, ApplicationForm, KanbanBoard
│   │   ├── common/         # Navbar
│   │   └── dashboard/      # StatsCard, StatusChart, TimelineChart
│   ├── context/            # AuthContext, ApplicationContext
│   ├── pages/              # Dashboard, Applications, KanbanPage, ApplicationDetail, Login, Register
│   └── services/api.js     # Axios instance
server/
├── controllers/            # authController, applicationController
├── middleware/             # JWT auth, error handler
├── models/                 # User, Application
├── routes/                 # auth, applications
└── utils/                  # mailer, deadlineReminder, seedDemo
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/applications` | List applications (search, filter) |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/stats` | Dashboard stats |
| GET | `/api/applications/export` | Download CSV |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| PATCH | `/api/applications/:id/status` | Update status (adds timeline event) |
| DELETE | `/api/applications/:id` | Delete application |
| POST | `/api/applications/:id/notes` | Add note |
| DELETE | `/api/applications/:id/notes/:noteId` | Delete note |

## Application Statuses

`wishlist` · `applied` · `phone_screen` · `technical` · `final_round` · `offer` · `rejected` · `withdrawn`

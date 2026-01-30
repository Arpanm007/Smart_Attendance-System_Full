<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License" />
</p>

# Smart Attendance — Client

> Next.js frontend for the Smart Attendance Management System. Role-based dashboards (student/teacher), QR scan & generate, and real-time updates via Socket.IO.

**Next.js 16** (App Router) + **React 19** + **Tailwind CSS 4** + **Socket.IO Client**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Point API base URL to your backend (see Configuration)
# Edit src/api/axios.js → baseURL (e.g. http://localhost:5000/api)

# 3. Start dev server (ensure backend is running)
npm run dev
```

Open **http://localhost:3000** — register, login, and use the dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Auth & Context](#auth--context)
- [API Usage](#api-usage)
- [Real-Time (Socket.IO)](#real-time-socketio)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [License](#license)

---

## Features

| Feature | Description |
|--------|-------------|
| **Landing** | Hero, feature cards, links to Login / Register |
| **Auth** | Login (email + password) and Student registration (name, studentId, email, phone, password) |
| **Dashboard** | Role-based: Student dashboard (QR scan, my attendance) or Teacher dashboard (stats, mark attendance, history) |
| **QR Scan** | Student: scan QR to mark attendance (html5-qrcode) |
| **QR Generate** | Teacher: display QR for class; students scan to join (qrcode.react) |
| **Real-Time** | Socket.IO in Mark Attendance modal for live marked list |
| **Modals** | Mark Attendance (QR + live list), Attendance History (by date, search) |

---

## Tech Stack

| Category | Packages |
|----------|----------|
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router) |
| **UI** | [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) 4 |
| **HTTP** | [Axios](https://github.com/axios/axios) (with interceptors for Bearer token) |
| **Auth** | [js-cookie](https://github.com/js-cookie/js-cookie) (token, userId, role) |
| **QR** | [html5-qrcode](https://github.com/mebjas/html5-qrcode) (scan), [qrcode.react](https://github.com/zpao/qrcode.react) (generate) |
| **Icons** | [Lucide React](https://lucide-react.github.io/lucide-react/) |
| **Real-Time** | [Socket.IO Client](https://socket.io/docs/v4/client-api/) |
| **Dev** | ESLint, eslint-config-next |

---

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** or **yarn**
- **Backend** running (see [server README](../server/README.md)); client calls its API and Socket.IO URL.

---

## Project Structure

<details>
<summary>Click to expand directory tree</summary>

```
client/
├── public/                    # Static assets (favicon, SVGs)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Dashboard layout + page (protected)
│   │   │   ├── dashboard/
│   │   │   │   └── page.jsx   # Role-based: TeacherDashboard | StudentDashboard
│   │   │   └── layout.jsx     # Sidebar nav, logout, teacher nav items
│   │   ├── login/
│   │   │   └── page.jsx       # Login form → POST /auth/login
│   │   ├── register/
│   │   │   └── page.jsx       # Student registration → POST /auth/register
│   │   ├── layout.js          # Root layout, AuthProvider, fonts, metadata
│   │   ├── page.js            # Landing (hero, features, Login/Register links)
│   │   └── globals.css        # Tailwind + theme variables
│   ├── api/
│   │   └── axios.js           # Axios instance, baseURL, Bearer interceptor
│   ├── components/
│   │   ├── StudentDashboard.jsx   # QR scan, my attendance, search
│   │   ├── TeacherDashboard.jsx  # Stats, mark attendance, history modal
│   │   ├── StatsCard.jsx         # Title, value, icon card
│   │   ├── MarkAttendanceModal.jsx  # QR display, Socket.IO, live marked list
│   │   └── AttendanceRecordModal.jsx # History by date, search, present/absent
│   └── context/
│       └── AuthContext.jsx    # userRole, login, logout, loading, getUserInfo
├── next.config.mjs
├── postcss.config.mjs
├── jsconfig.json
└── package.json
```

</details>

---

## Configuration

### API base URL

The client talks to the backend via **`src/api/axios.js`**. Set `baseURL` to your server API root.

| Environment | Example `baseURL` |
|-------------|-------------------|
| Local dev   | `http://localhost:5000/api` |
| Same machine, different IP | `http://192.168.0.192:5000/api` |
| Production  | `https://your-api.com/api` |

```javascript
// src/api/axios.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Change for production
});
```

### Socket.IO URL

In **`MarkAttendanceModal.jsx`**, the Socket.IO client connects to the server URL (e.g. `http://localhost:5000`). Update this when deploying so it matches your backend URL.

---

## Installation

From the **`client`** directory:

```bash
npm install
```

Ensure the backend is running and `baseURL` in `src/api/axios.js` (and Socket URL in `MarkAttendanceModal.jsx` if needed) point to it.

---

## Running the App

### Development

```bash
npm run dev
```

Runs at **http://localhost:3000**. Use Login/Register; after login you are redirected to `/dashboard`.

### Production

```bash
npm run build
npm run start
```

Serves the production build. Set `baseURL` and Socket URL to your production backend.

---

## Pages & Routes

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing: hero, feature cards, Login / Register buttons | Public |
| `/login` | Login form (email, password). On success: sets cookies, redirects to `/dashboard` | Public |
| `/register` | Student registration (name, studentId, email, phone, password, confirm). On success: redirects to `/login` | Public |
| `/dashboard` | Role-based dashboard. Redirects to `/login` if not authenticated. Teacher: stats, mark attendance, history. Student: QR scan, my attendance | Private |

Dashboard layout shows sidebar nav; for **teacher** role it shows links such as Dashboard, Class Attendance, Single Entry, Manage Subjects, Analytics (routes may be wired in app; layout references `/attendance/bulk`, `/attendance/mark`, `/subjects`, `/attendance/reports`).

---

## Components

| Component | Description |
|-----------|-------------|
| **StudentDashboard** | Fetches user info and `/attendance/my`. QR scanner (html5-qrcode); on scan, parses QR payload and submits via `POST /attendance/join`. Displays attendance list with search. |
| **TeacherDashboard** | Fetches `/users/stats` (userId from cookie). Shows greeting, **StatsCard**s (total students, present today, absent today). Buttons: “View Full History” (opens **AttendanceRecordModal**), “Start Attendance” (opens **MarkAttendanceModal**). |
| **StatsCard** | Displays a single stat: `title`, `value`, `icon` (Lucide), `color` (e.g. `bg-blue-500`). |
| **MarkAttendanceModal** | Receives `attendanceData`, `classId`. Connects Socket.IO to server, joins room `classId`, listens for `attendanceUpdate`. Shows unmarked students list and QR code (qrcode.react) for the class. Used for live marking. |
| **AttendanceRecordModal** | Receives `attendanceData`. Groups records by date; tabs per date; search filter. Shows present/absent counts and student list per date. |

---

## Auth & Context

### AuthContext (`src/context/AuthContext.jsx`)

Provides:

| Value | Description |
|-------|-------------|
| `userRole` | `'student'` \| `'teacher'` \| `null` (from cookie `role`) |
| `loading` | Initial load while reading cookies |
| `login(userData)` | Sets cookies: `token`, `userId`, `role` from `userData` (e.g. `{ _id, token, role }`) |
| `logout()` | Clears `userRole` and removes `token`, `userId`, `role` cookies |
| `getUserInfo()` | Returns `{ token, userId }` from cookies |

Used in: **Root layout** (wraps app with `AuthProvider`), **Login page** (login + redirect), **Dashboard layout** (logout, nav), **Dashboard page** (loading, redirect when no user).

### Cookies

| Cookie | Set on | Used for |
|--------|--------|----------|
| `token` | Login success | `Authorization: Bearer <token>` (axios interceptor in `src/api/axios.js`) |
| `userId` | Login success | API calls that need current user id (e.g. `/auth/user/info`, `/users/stats`) |
| `role` | Login success | Role-based UI (dashboard layout nav, Student vs Teacher dashboard) |

---

## API Usage

Summary of backend endpoints used by the client:

| Page / Component | Method | Endpoint | Purpose |
|------------------|--------|----------|---------|
| Login | POST | `/auth/login` | Email + password → token, _id, role |
| Register | POST | `/auth/register` | Student sign-up (name, email, studentId, phone, password, role: 'student') |
| StudentDashboard | POST | `/auth/user/info` | Get current user (body: `userId`) |
| StudentDashboard | GET | `/attendance/my` | My attendance list |
| StudentDashboard (scan submit) | POST | `/attendance/join` | Mark attendance from QR (studentId, classId, date, status) |
| TeacherDashboard | POST | `/users/stats` | Dashboard stats (body: `userId`) |
| MarkAttendanceModal | Socket.IO | `join`, `attendanceUpdate` | Live list when attendance is marked |

Protected requests send `Authorization: Bearer <token>` via the axios interceptor using the `token` cookie.

---

## Real-Time (Socket.IO)

Used in **MarkAttendanceModal**:

1. When the modal opens, connect to the server (e.g. `http://localhost:5000`), then `emit('join', classId)` to join the class room.
2. Listen for `attendanceUpdate`; append incoming data to the “marked” list in the modal.
3. On close, disconnect the socket.

Server must run Socket.IO on the same URL/port and emit `attendanceUpdate` when attendance is marked (see [server README](../server/README.md)).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (default port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | Run ESLint |

---

## Deployment

| Platform | Notes |
|----------|--------|
| **Vercel** | Connect repo, set root to `client` (or monorepo client path). Set env if you use `NEXT_PUBLIC_*` for API/Socket URL; otherwise keep `baseURL` and Socket URL in code or inject at build time. |
| **Docker / Node** | `npm run build && npm run start`; expose port 3000. |
| **Static export** | This app uses client-side auth and API calls; standard `next start` is the intended production mode. |

Ensure **CORS** and **Socket.IO origin** on the backend allow your frontend origin in production.

---

## License

ISC

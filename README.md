<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-required-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-4-gray?logo=express" alt="Express" />
</p>

# Smart Attendance Management System

> Full-stack attendance management with real-time updates, QR codes, and role-based dashboards for students and teachers.

**Next.js** (client) + **Express** (server) + **MongoDB** + **Socket.IO**

---

## Quick Start

```bash
# 1. Install dependencies
cd client && npm install && cd ../server && npm install

# 2. Configure server (create server/.env with PORT, MONGO_URI, JWT_SECRET)
# 3. Start server (Terminal 1)
cd server && npm run dev

# 4. Start client (Terminal 2)
cd client && npm run dev
```

Then open **http://localhost:3000** — register, login, and use the dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Real-Time (Socket.IO)](#real-time-socketio)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [License](#license)

---

## Features

| Feature | Description |
|--------|-------------|
| **Authentication** | JWT-based register/login with roles (student / teacher) |
| **Dashboards** | Role-based views: students (attendance history, subjects), teachers (mark attendance, reports, QR) |
| **Attendance** | Per-session marking, bulk marking, reports |
| **Subjects & Courses** | Create/manage subjects and link users |
| **QR Codes** | Generate and scan QR codes for quick attendance |
| **Real-Time** | Socket.IO for live classroom sessions |
| **REST API** | Auth, users, subjects, attendance endpoints |

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Client** | [Next.js](https://nextjs.org/) 16, [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) 4, Axios, Socket.IO Client, html5-qrcode, qrcode.react, Lucide React, js-cookie |
| **Server** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) 4, [MongoDB](https://www.mongodb.com/) ([Mongoose](https://mongoosejs.com/) 8), JWT, bcryptjs, [Socket.IO](https://socket.io/), CORS, dotenv |
| **Tooling** | ESLint (client), Nodemon (server) |

---

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **MongoDB** (local `mongod` or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

---

## Project Structure

<details>
<summary>Click to expand directory tree</summary>

```
Smart_Attendance-System_Full/
├── client/                          # Next.js frontend (App Router)
│   ├── public/
│   ├── src/
│   │   ├── app/                     # Pages: login, register, dashboard
│   │   ├── api/                     # Axios client
│   │   ├── components/              # Dashboards, modals, stats
│   │   └── context/                 # Auth context
│   ├── next.config.mjs
│   └── package.json
├── server/                          # Express backend
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/                 # auth, attendance, user, subject, getInfo
│   ├── middleware/authMiddleware.js # JWT + role checks
│   ├── models/                      # User, Attendance, Subject
│   ├── routes/                      # auth, attendance, user, subject
│   ├── server.js                    # Express + Socket.IO entry
│   └── package.json
└── README.md
```

</details>

---

## Environment Variables

Create a **`.env`** file in the **`server`** directory. The client API base URL is set in `client/src/api/axios.js` (e.g. `http://localhost:5000/api`).

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | HTTP port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-attendance` or Atlas URI |
| `JWT_SECRET` | Secret for signing JWTs | Long random string |

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-attendance
JWT_SECRET=your_secure_jwt_secret_here
```

> Do not commit `.env`. Use a strong `JWT_SECRET` in production.

---

## Installation

From the **project root**:

```bash
cd client
npm install

cd ../server
npm install
```

Ensure MongoDB is running and `server/.env` is set before starting the server.

---

## Running the Application

### Development (two terminals)

**Terminal 1 — Server**

```bash
cd server
npm run dev
```

API: **http://localhost:5000** (root returns a status message)

**Terminal 2 — Client**

```bash
cd client
npm run dev
```

App: **http://localhost:3000**

### Production

```bash
# Client
cd client && npm run build && npm run start

# Server (separate terminal)
cd server && npm start
```

Set `NODE_ENV=production` and use a production MongoDB and strong `JWT_SECRET`.

---

## API Reference

**Base URL:** `http://localhost:5000/api`

Protected routes use header: `Authorization: Bearer <token>`.

### Auth — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register (name, email, password, role, …) |
| `POST` | `/login` | Login (email, password) |
| `POST` | `/user/info` | Get current user (Bearer token) |

### Attendance — `/api/attendance`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/` | Mark attendance | Teacher |
| `GET` | `/` | Attendance report | Teacher |
| `POST` | `/bulk` | Bulk mark | Teacher |
| `GET` | `/my` | My attendance | Student |
| `POST` | `/join` | Join (e.g. QR) | — |

### Users — `/api/users`

User management; see `server/routes/userRoutes.js`.

### Subjects — `/api/subjects`

Subject CRUD and listing; see `server/routes/subjectRoutes.js`.

---

## Real-Time (Socket.IO)

The server runs Socket.IO on the same port as the API. Connect to `http://localhost:5000`.

| Event | Description |
|-------|-------------|
| `join` | Client sends `classId`; server joins socket to that room (e.g. teacher–class) |
| `disconnect` | Cleanup on disconnect |

Configure the Socket.IO client in the frontend with the same server URL and port.

---

## Available Scripts

### Client (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

### Server (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev with Nodemon |
| `npm start` | Run `node server.js` |

---

## Deployment

| Part | Notes |
|------|--------|
| **Client** | `npm run build` + `npm run start`, or deploy to [Vercel](https://vercel.com). Set API URL in client (e.g. `axios.js` or env). |
| **Server** | Deploy to [Railway](https://railway.app), [Render](https://render.com), or any Node host. Set `PORT`, `MONGO_URI`, `JWT_SECRET`. |
| **Database** | Use [MongoDB Atlas](https://www.mongodb.com/atlas); set `MONGO_URI`. |
| **CORS** | Set server CORS and Socket.IO `origin` to your frontend URL in production. |

---

## License

ISC

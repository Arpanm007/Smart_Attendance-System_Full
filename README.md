<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-required-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-4-gray?logo=express" alt="Express" />
</p>

# Smart Attendance Management System

> Full-stack attendance management with real-time updates, QR codes, and role-based dashboards for students and teachers.

**Next.js** (client) · **Express** (server) · **MongoDB** · **Socket.IO**

| 📖 Documentation | |
|------------------|---|
| [**Client README**](client/README.md) | Setup, pages, components, auth, API usage, Socket.IO |
| [**Server README**](server/README.md) | API setup, env, routes (with sample request/response), Socket.IO |

---

## Quick Start

```bash
# 1. Install dependencies
cd client && npm install && cd ../server && npm install

# 2. Configure server: create server/.env (PORT, MONGO_URI, JWT_SECRET)
# 3. Start server (Terminal 1)
cd server && npm run dev

# 4. Start client (Terminal 2)
cd client && npm run dev
```

Open **http://localhost:3000** → register, login, use the dashboard.

---

## Table of Contents

**Overview**

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)

**Project**

- [Project Structure](#project-structure)
- [Documentation](#documentation)

**Getting Started**

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)

**Reference**

- [API Reference](#api-reference)
- [Real-Time (Socket.IO)](#real-time-socketio)
- [Available Scripts](#available-scripts)

**More**

- [Deployment](#deployment)
- [License](#license)

---

## Features

| Feature | Description |
|--------|-------------|
| **Authentication** | JWT-based register/login with roles (student / teacher) |
| **Dashboards** | Role-based: students (attendance history, subjects), teachers (mark attendance, reports, QR) |
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
├── client/                    # Next.js frontend (App Router)
│   ├── public/
│   ├── src/
│   │   ├── app/               # login, register, dashboard
│   │   ├── api/               # Axios client
│   │   ├── components/       # Dashboards, modals, stats
│   │   └── context/           # Auth context
│   ├── next.config.mjs
│   └── package.json
├── server/                    # Express backend
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

</details>

---

## Documentation

| Part | README | Contents |
|------|--------|----------|
| **Client** | [client/README.md](client/README.md) | Pages, components, auth, API usage, Socket.IO, scripts |
| **Server** | [server/README.md](server/README.md) | Env, routes with sample request/response, Socket.IO, scripts |

---

## Installation

From the **project root**:

```bash
cd client && npm install
cd ../server && npm install
```

Ensure **MongoDB** is running and **server/.env** is set before starting the server.  
→ Server setup: [server/README.md](server/README.md) · Client config: [client/README.md](client/README.md)

---

## Environment Variables

Create **`server/.env`** with:

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

Client API base URL is set in **`client/src/api/axios.js`** (e.g. `http://localhost:5000/api`).

> Do not commit `.env`. Use a strong `JWT_SECRET` in production.

---

## Running the Application

**Development** (two terminals)

| Terminal | Command | URL |
|----------|---------|-----|
| 1 — Server | `cd server && npm run dev` | http://localhost:5000 |
| 2 — Client | `cd client && npm run dev` | http://localhost:3000 |

**Production**

```bash
# Client
cd client && npm run build && npm run start

# Server (separate terminal)
cd server && npm start
```

Set `NODE_ENV=production` and use a production MongoDB and strong `JWT_SECRET`.

---

## API Reference

**Base URL:** `http://localhost:5000/api` · Protected routes: `Authorization: Bearer <token>`

| Area | Endpoints | Full docs |
|------|-----------|-----------|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `POST /auth/user/info` | [server/README.md#api-reference](server/README.md#api-reference) |
| **Attendance** | `POST /`, `GET /`, `POST /bulk`, `GET /my`, `POST /join` | [server/README.md#api-reference](server/README.md#api-reference) |
| **Users** | `GET /users/students`, `POST /users/stats`, `PUT /users/profile` | [server/README.md#api-reference](server/README.md#api-reference) |
| **Subjects** | `GET /`, `POST /` | [server/README.md#api-reference](server/README.md#api-reference) |

---

## Real-Time (Socket.IO)

Server runs Socket.IO on the same port as the API. Connect to `http://localhost:5000`.

| Event | Description |
|-------|-------------|
| `join` | Client sends `classId`; server joins socket to that room |
| `disconnect` | Cleanup on disconnect |

Configure the Socket.IO client in the frontend with the same server URL and port.

---

## Available Scripts

| Part | Command | Description |
|------|---------|-------------|
| **Client** | `npm run dev` | Dev server (port 3000) |
| | `npm run build` | Production build |
| | `npm run start` | Run production build |
| | `npm run lint` | ESLint |
| **Server** | `npm run dev` | Dev with Nodemon |
| | `npm start` | Run `node server.js` |

Details: [client/README.md#available-scripts](client/README.md#available-scripts) · [server/README.md#available-scripts](server/README.md#available-scripts)

---

## Deployment

| Part | Notes |
|------|--------|
| **Client** | `npm run build` + `npm run start`, or [Vercel](https://vercel.com). Set API URL in `client/src/api/axios.js` or env. |
| **Server** | [Railway](https://railway.app), [Render](https://render.com), or any Node host. Set `PORT`, `MONGO_URI`, `JWT_SECRET`. |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas); set `MONGO_URI`. |
| **CORS** | Set server CORS and Socket.IO `origin` to your frontend URL in production. |

---

## License

ISC

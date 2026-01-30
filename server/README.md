<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Express-4-gray?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-blue?logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License" />
</p>

# Smart Attendance — Backend API

> REST API and real-time server for the Smart Attendance Management System. Handles auth, users, subjects, attendance, and Socket.IO for live classroom updates.

**Express** + **MongoDB** (Mongoose) + **JWT** + **Socket.IO**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env (see Environment Variables)
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/smart-attendance
# JWT_SECRET=your_secret

# 3. Start dev server (MongoDB must be running)
npm run dev
```

API: **http://localhost:5000** — root returns a status message.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
- [Real-Time (Socket.IO)](#real-time-socketio)
- [Middleware](#middleware)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## Features

| Feature | Description |
|--------|-------------|
| **Auth** | JWT-based register/login; roles (student / teacher) |
| **Users** | Students list, dashboard stats, profile update |
| **Subjects** | List and create subjects (teacher) |
| **Attendance** | Mark (single/bulk), report, my attendance; public `/join` for QR flow |
| **Real-Time** | Socket.IO: join class rooms, live updates |

---

## Tech Stack

| Category | Packages |
|----------|----------|
| **Runtime** | [Node.js](https://nodejs.org/) |
| **Framework** | [Express](https://expressjs.com/) 4 |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) 8 |
| **Auth** | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Real-Time** | [Socket.IO](https://socket.io/) 4 |
| **Other** | [cors](https://github.com/expressjs/cors), [dotenv](https://github.com/motdotla/dotenv) |
| **Dev** | [Nodemon](https://nodemon.io/) |

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
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # register, login
│   ├── getInfo.js            # current user info
│   ├── attendanceController.js
│   ├── userController.js
│   └── subjectController.js
├── middleware/
│   └── authMiddleware.js     # protect, teacher, student
├── models/
│   ├── User.js
│   ├── Attendance.js
│   └── Subject.js
├── routes/
│   ├── authRoutes.js
│   ├── attendanceRoutes.js
│   ├── userRoutes.js
│   └── subjectRoutes.js
├── server.js                 # Express + Socket.IO entry
└── package.json
```

</details>

---

## Environment Variables

Create a **`.env`** file in the **`server`** directory.

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

From the **`server`** directory:

```bash
npm install
```

Ensure MongoDB is running and `.env` is configured before starting.

---

## Running the Server

### Development (with auto-reload)

```bash
npm run dev
```

Uses **Nodemon**; server restarts on file changes.

### Production

```bash
npm start
```

Runs `node server.js`. Set `NODE_ENV=production` and use a production MongoDB and strong `JWT_SECRET`.

---

## API Reference

**Base URL:** `http://localhost:5000/api`

**Conventions:**
- Protected routes require header: `Authorization: Bearer <token>`.
- Request bodies are JSON (`Content-Type: application/json`).
- Success: `2xx` with JSON body; errors: `4xx`/`5xx` with `{ "message": "..." }` (and optional `error` field).

---

### Auth — `/api/auth`

#### `POST /api/auth/register`

Register a new user (student or teacher). Students must provide a unique `studentId`.

**Access:** Public

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name |
| `email` | string | Yes | Unique email (used for login) |
| `password` | string | Yes | Plain password (min 6 chars; stored hashed) |
| `role` | string | Yes | `"student"` or `"teacher"` |
| `studentId` | string | If role=student | Unique student ID (required for students) |
| `phone` | string | No | 10-digit phone |
| `course` | string | No | Course name (e.g. for students) |

**Sample request:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "student",
  "studentId": "STU001",
  "phone": "9876543210",
  "course": "B.Tech CSE"
}
```

**Sample response — `201 Created`:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "student",
  "studentId": "STU001",
  "course": "B.Tech CSE",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Sample error — `400 Bad Request`:**

```json
{ "message": "User already exists" }
```

```json
{ "message": "Student ID is required" }
```

```json
{ "message": "Student ID already taken" }
```

---

#### `POST /api/auth/login`

Authenticate with email and password. Returns user id, JWT token, and role.

**Access:** Public

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email (identifier) |
| `password` | string | Yes | Plain password |

**Sample request:**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Sample response — `200 OK`:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student"
}
```

**Sample error — `401 Unauthorized`:**

```json
{ "message": "Invalid Student ID/Email or password" }
```

---

#### `POST /api/auth/user/info`

Get full user document for the given `userId`. Token must belong to that user.

**Access:** Private (Bearer token; token `id` must match `userId`)

**Headers:** `Authorization: Bearer <token>`

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | MongoDB `_id` of the user (must match JWT) |

**Sample request:**

```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Sample response — `200 OK`:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "role": "student",
  "studentId": "STU001",
  "course": "B.Tech CSE",
  "subjects": [],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

**Sample errors — `401` / `403` / `404`:**

```json
{ "message": "No token provided" }
```

```json
{ "message": "Forbidden: Invalid token for user" }
```

```json
{ "message": "User not found" }
```

---

### Attendance — `/api/attendance`

**Attendance status values:** `Present`, `Absent`, `Late`, `Excused`.

---

#### `POST /api/attendance` (mark single)

Create or update attendance for one student in a subject/class for a given date. Emits `attendanceUpdate` via Socket.IO on create.

**Access:** Private (Teacher)

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studentId` | string | Yes | User `_id` of the student |
| `classId` | string | Yes | Subject `_id` (class/subject) |
| `date` | string | No | ISO date or timestamp (default: today) |
| `status` | string | Yes | `Present`, `Absent`, `Late`, or `Excused` |

**Sample request:**

```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "classId": "507f1f77bcf86cd799439012",
  "date": "2025-01-31",
  "status": "Present"
}
```

**Sample response — `201 Created`:**

```json
{
  "message": "Attendance marked",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "student": "507f1f77bcf86cd799439011",
    "date": "2025-01-31T00:00:00.000Z",
    "status": "Present",
    "subject": "507f1f77bcf86cd799439012",
    "createdAt": "2025-01-31T08:00:00.000Z",
    "updatedAt": "2025-01-31T08:00:00.000Z"
  }
}
```

**Sample response — `200 OK` (existing record updated):**

```json
{
  "message": "Attendance updated",
  "data": { ... }
}
```

**Sample error — `400 Bad Request`:**

```json
{ "message": "Class is required" }
```

```json
{ "message": "Error marking attendance", "error": "..." }
```

---

#### `POST /api/attendance/join`

Mark attendance (e.g. from QR scan). Same request/response shape as `POST /api/attendance`; no auth required.

**Access:** Public

**Request body:** Same as `POST /api/attendance` (e.g. `studentId`, `classId`, `date`, `status`).

**Sample request:**

```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "classId": "507f1f77bcf86cd799439012",
  "date": "2025-01-31",
  "status": "Present"
}
```

**Sample response:** Same as `POST /api/attendance` (`201` with `message` and `data`, or `200` on update).

---

#### `POST /api/attendance/bulk`

Bulk mark attendance for multiple students (same subject/date). Accepts an array of records.

**Access:** Private (Teacher)

**Request body:** Array of objects with `studentId`, `classId`, `date`, `status` (same fields as single mark).

**Sample request:**

```json
[
  {
    "studentId": "507f1f77bcf86cd799439011",
    "classId": "507f1f77bcf86cd799439012",
    "date": "2025-01-31",
    "status": "Present"
  },
  {
    "studentId": "507f1f77bcf86cd799439014",
    "classId": "507f1f77bcf86cd799439012",
    "date": "2025-01-31",
    "status": "Absent"
  }
]
```

**Sample response:** Implementation-dependent; typically `200` or `201` with summary or array of created/updated records.

---

#### `GET /api/attendance/my`

Get attendance records for the logged-in student, sorted by date (newest first). Each record includes populated subject (`name`, `code`).

**Access:** Private (Student)

**Request:** No body; use `Authorization: Bearer <token>`.

**Sample response — `200 OK`:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "student": "507f1f77bcf86cd799439011",
    "date": "2025-01-31T00:00:00.000Z",
    "status": "Present",
    "subject": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Data Structures",
      "code": "CS101"
    },
    "createdAt": "2025-01-31T08:00:00.000Z",
    "updatedAt": "2025-01-31T08:00:00.000Z"
  }
]
```

---

#### `GET /api/attendance`

Get all attendance records (for reports). Records include populated `student` (name, email, studentId, course) and `subject` (name, code). Sorted by date (newest first).

**Access:** Private (Teacher)

**Request:** No body; use `Authorization: Bearer <token>`.

**Sample response — `200 OK`:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "student": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "studentId": "STU001",
      "course": "B.Tech CSE"
    },
    "date": "2025-01-31T00:00:00.000Z",
    "status": "Present",
    "subject": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Data Structures",
      "code": "CS101"
    },
    "createdAt": "2025-01-31T08:00:00.000Z",
    "updatedAt": "2025-01-31T08:00:00.000Z"
  }
]
```

---

### Users — `/api/users`

---

#### `GET /api/users/students`

List all users with role `student`. Password is excluded. Sorted by `studentId`.

**Access:** Private (Teacher)

**Request:** No body; use `Authorization: Bearer <token>`.

**Sample response — `200 OK`:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210",
    "role": "student",
    "studentId": "STU001",
    "course": "B.Tech CSE",
    "subjects": [],
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

---

#### `POST /api/users/stats`

Get dashboard statistics for a teacher: total students, today’s present/absent counts, and per-subject details (present/absent today, per-student status today and all-time).

**Access:** Private (Teacher)

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | Teacher’s user `_id` (subjects are filtered by `teacherId: userId`) |

**Sample request:**

```json
{
  "userId": "507f1f77bcf86cd799439020"
}
```

**Sample response — `200 OK`:**

```json
{
  "totalStudents": 45,
  "presentToday": 38,
  "absentToday": 7,
  "subjectDetails": [
    {
      "subject": "Data Structures",
      "subjectId": "507f1f77bcf86cd799439012",
      "presentToday": 28,
      "absentToday": 2,
      "totalStudents": 30,
      "perStudentToday": [
        {
          "student": { "_id": "...", "name": "Jane Doe" },
          "date": "2025-01-31T...",
          "status": "Present"
        }
      ],
      "perStudentAll": [
        {
          "student": { "_id": "...", "name": "Jane Doe" },
          "date": "2025-01-31T00:00:00.000Z",
          "status": "Present"
        }
      ]
    }
  ]
}
```

**Sample error — `500`:**

```json
{ "message": "Server Error" }
```

---

#### `PUT /api/users/profile`

Update the logged-in user’s profile (name, phone, password). Email and role are not editable. Phone must be exactly 10 digits; password min 6 characters.

**Access:** Private (Bearer)

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | New name |
| `phone` | string | No | 10-digit phone |
| `password` | string | No | New password (min 6 chars) |

**Sample request:**

```json
{
  "name": "Jane Doe Updated",
  "phone": "9123456789",
  "password": "newSecret456"
}
```

**Sample response — `200 OK`:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Jane Doe Updated",
  "email": "jane@example.com",
  "role": "student",
  "phone": "9123456789",
  "studentId": "STU001",
  "course": "B.Tech CSE",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Sample errors — `400`:**

```json
{ "message": "Phone number must be exactly 10 digits" }
```

```json
{ "message": "Password must be at least 6 characters" }
```

---

### Subjects — `/api/subjects`

---

#### `GET /api/subjects`

List all subjects. No query params.

**Access:** Private (Bearer)

**Request:** No body; use `Authorization: Bearer <token>`.

**Sample response — `200 OK`:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Data Structures",
    "code": "CS101",
    "description": "Introduction to data structures",
    "teacherId": "507f1f77bcf86cd799439020",
    "students": ["507f1f77bcf86cd799439011"],
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

---

#### `POST /api/subjects`

Create a new subject. `code` must be unique (stored uppercase).

**Access:** Private (Teacher)

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Subject name (unique) |
| `code` | string | Yes | Unique code (e.g. `CS101`; stored uppercase) |
| `description` | string | No | Optional description |

**Sample request:**

```json
{
  "name": "Data Structures",
  "code": "CS101",
  "description": "Introduction to data structures and algorithms"
}
```

**Sample response — `201 Created`:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Data Structures",
  "code": "CS101",
  "description": "Introduction to data structures and algorithms",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

**Sample error — `400 Bad Request`:**

```json
{ "message": "Subject code already exists" }
```

```json
{ "message": "Invalid subject data" }
```

---

## Real-Time (Socket.IO)

Socket.IO runs on the same port as the HTTP server. Connect to `http://localhost:5000`.

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `classId` | Server joins socket to room `classId` (e.g. teacher–class) |
| `disconnect` | — | Cleanup on disconnect |

`req.io` is attached to every Express request (e.g. for emitting from controllers).

---

## Middleware

| Middleware | Description |
|------------|-------------|
| `protect` | Verifies JWT, sets `req.user` (user without password). Returns 401 if missing/invalid token. |
| `teacher` | Requires `req.user.role === 'teacher'`. Use after `protect`. |
| `student` | Requires `req.user.role === 'student'`. Use after `protect`. |

Used in `routes/*.js`; see `middleware/authMiddleware.js`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with Nodemon (auto-reload) |
| `npm start` | Run `node server.js` |
| `npm test` | Placeholder (no tests yet) |

---

## License

ISC

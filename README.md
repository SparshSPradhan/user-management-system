
# User Management System

A full-stack **MERN** web application with **Role-Based Access Control (RBAC)** and secure **JWT Authentication**.

Built with **React + Redux Toolkit**, **Node.js + Express**, and **MongoDB**.

---

## Project Overview

A complete user management system supporting three roles:
- **Admin**
- **Manager**
- **User**

Features include secure authentication, full CRUD operations, audit tracking, and role-based permissions.

### Roles & Permissions

| Role     | Capabilities |
|----------|--------------|
| **Admin**    | Full CRUD on all users, assign roles, change status, view audit info |
| **Manager**  | View & update non-admin users, view user list with filters |
| **User**     | View and update own profile only (name, password — cannot change role) |

---

## Tech Stack

**Frontend:**
- React 18 + Redux Toolkit + React Router v6
- Vite
- Tailwind CSS (utility-first styling)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (Access + Refresh tokens) + bcrypt
- express-validator, Helmet, Morgan

**Deployment:**
- Backend: Render
- Frontend: Vercel

---

## Features

### Authentication
- Secure login with email + password
- Passwords hashed with bcrypt (cost 12)
- Access token (15 min) + Refresh token (7 days)
- Refresh token stored in httpOnly cookie
- Access token in localStorage
- Automatic token refresh on 401 using Axios interceptor
- Logout clears tokens on both client and server

### Admin Features
- Paginated & searchable user list with role & status filters
- Create, edit, and soft-delete users
- Assign roles and change user status
- View full audit information

### Manager Features
- View and filter users
- Update non-admin user details

### User Features
- View and update own profile (name & password)

---

## Folder Structure



user-management-system/
│
├── backend/                                      # Node.js + Express
│   ├── src/
│   │   ├── controllers/                          # Request handlers-Handle request/response
│   │   │   ├── auth.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── services/                             # Business logic
│   │   │   ├── auth.service.js
│   │   │   └── user.service.js
│   │   │
│   │   ├── models/                               # Mongoose Models
│   │   │   └── User.js
│   │   │
│   │   ├── routes/                               # API Routes
│   │   │   ├── auth.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── middleware/                           # Auth & Validation
│   │   │   ├── auth.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── utils/                                # Utilities-Helper functions
│   │   │   ├── generateToken.js
│   │   │   └── sendResponse.js
│   │   │
│   │   ├── config/
│   │   │   └── db.js                             # MongoDB connection (Docker-ready)
│   │   │
│   │   ├── database/                             # Database management
│   │   │   ├── schema.js                         # Annotated schema reference
│   │   │   ├── migrations/
│   │   │   │   ├── runner.js                     # Migration runner
│   │   │   │   ├── 001_create_users_indexes.js
│   │   │   │   ├── 002_add_status_default.js
│   │   │   │   └── 003_add_audit_fields.js
│   │   │   └── seeds/
│   │   │       ├── seed.js                       # Main seed script
│   │   │       └── data/
│   │   │           └── users.js
│   │   │
│   │   │                          
│   │   │   
│   │   │
│   │   ├── app.js                                # Express app setup (middleware, routes)
│   │   └── server.js                             # Entry point (DB connect + listen)
│   │
│   ├── Dockerfile                                # Backend Docker image
│   ├── .env.example
│   └── package.json
│
│
├── frontend/                                     # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/                                  # Axios API calls
│   │   │   ├── axiosInstance.js
│   │   │   ├── authApi.js
│   │   │   └── userApi.js
│   │   │
│   │   ├── components/                           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── RoleGuard.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── FormField.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── pages/                                # Page Components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UsersListPage.jsx
│   │   │   ├── UserDetailPage.jsx
│   │   │   ├── CreateUserPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── store/                                # Redux
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── userSlice.js
│   │   │
│   │   ├── hooks/                                # Custom Hooks
│   │   │   └── useAuth.js
│   │   │
│   │   ├── utils/                                # Utilities
│   │   │   └── roles.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── Dockerfile                                # Frontend Docker image (Nginx)
│   ├── nginx.conf                                # Nginx config for SPA + API proxy
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js                        # Tailwind configuration
│   ├── postcss.config.js                         # PostCSS configuration
│   └── package.json
│
│
├── mongo-init/                                   # MongoDB initialization
│   └── mongo-init.js                             # Creates DB, user & indexes
│
│
├── docs/                                         # Documentation
│   └── README.md
│
├── .env.example                                  # Root level env template
├── docker-compose.yml                            # Full stack (mongo + backend + frontend)
├── docker-compose.dev.yml                        # Dev mode (only mongo)
├── .gitignore
└── README.md





### Backend (`backend/src/`)
- `config/db.js` – MongoDB connection
- `models/User.js` – User schema with audit fields & bcrypt hook
- `controllers/` – Route handlers
- `services/` – Business logic
- `routes/` – Express routers
- `middleware/` – Auth, RBAC, validation
- `utils/` – Token generation & response formatter
- `database/seeds/seed.js` – Structured database seeder

### Frontend (`frontend/src/`)
- `api/` – Axios instance & API calls
- `store/` – Redux store & slices
- `components/` – PrivateRoute, RoleGuard, Navbar
- `pages/` – Login, Dashboard, UsersList, Profile, etc.
- `hooks/useAuth.js` – Auth helpers
- `utils/roles.js` – Role constants

---

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /login`
- `POST /refresh`
- `POST /logout`
- `GET /me`

### User Routes (`/api/users`)
- `GET /` – Admin & Manager (list with pagination & filters)
- `GET /:id` – Admin & Manager
- `POST /` – Admin only (create user)
- `PUT /:id` – Admin only (update user)
- `DELETE /:id` – Admin only (soft delete)
- `GET /profile` – Authenticated users
- `PUT /profile` – Authenticated users (update own profile)

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas (or local MongoDB)
- Git


🚀 Run with Docker (Recommended)-

## 🚀 Complete Setup Guide — 3 Workflows

---

### 🐳 Workflow A — Full Docker (Everything in Containers)

```bash
# 1. Clone repo
git clone https://github.com/yourname/user-management-system.git
cd user-management-system

# 2. Create environment file
cp .env.example .env
# Edit .env — fill JWT secrets

# 3. Start all services
docker-compose up -d --build

# 4. Run migrations
docker-compose exec backend node src/database/migrations/runner.js

# 5. Seed the database
docker-compose exec backend node src/database/seeds/seed.js
```

**Access:**

* Frontend → http://localhost:5173
* API → http://localhost:5001/api
* Mongo GUI → http://localhost:8081 (admin / mexpress123)

---

### 🧪 Workflow B — Dev Mode (Mongo in Docker, Code Local)

```bash
# 1. Start MongoDB
docker-compose -f docker-compose.dev.yml up -d
```

```bash
# 2. Backend setup
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

```bash
# 3. Frontend setup
cd frontend
cp .env.example .env
npm install
npm run dev
```

**Access:**

* Frontend → http://localhost:5173
* API → http://localhost:5001/api
* Mongo GUI → http://localhost:8081

---

### ☁️ Workflow C — MongoDB Atlas (No Docker)

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

---

### 🔐 Generate Secure JWT Secrets

```bash
node -e "
const c = require('crypto');
console.log('JWT_SECRET=' + c.randomBytes(64).toString('hex'));
console.log('JWT_REFRESH_SECRET=' + c.randomBytes(64).toString('hex'));
"
```

---

### 🛠 Useful Docker Commands

```bash
# Logs
docker-compose logs -f backend

# Shell into backend
docker-compose exec backend sh

# Mongo shell
docker-compose exec mongo mongosh -u admin -p secret123

# Migration status
docker-compose exec backend npm run migrate:status

# Stop containers
docker-compose down

# Full reset (⚠️ deletes DB)
docker-compose down -v
```


## OR



### 1. Clone the Repository
```bash
git clone https://github.com/sparshspradhan/user-management-system.git
cd user-management-system
```

### 2. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Environment Variables

**Backend — Create `backend/.env`:**
```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/user-management
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend — Create `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Seed Demo Users
```bash
cd backend
npm run seed
```

**Demo Credentials:**
- `admin@example.com` / `Admin@123`
- `manager@example.com` / `Manager@123`
- `user@example.com` / `User@1234`

### 5. Run Development Servers

**Terminal 1 — Backend**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend**
```bash
cd frontend && npm run dev
```

Frontend will run on: http://localhost:5173  
Backend API on: http://localhost:5001

---

## Deployment

### Backend (Render)


### Frontend (Vercel)

---

## Security Practices
- bcrypt password hashing (cost 12)
- JWT with short-lived access tokens
- httpOnly cookies for refresh tokens
- Helmet security headers
- Server-side input validation
- Soft delete instead of hard delete
- Admin cannot deactivate their own account

---

## Git Workflow
Use conventional commits:
- `feat:`
- `fix:`
- `refactor:`
- `chore:`

---

**Made with ❤️ for Purple Merit Technologies Assessment**

---




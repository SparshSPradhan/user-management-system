
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
- Plain CSS with design tokens

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
├── backend/                          # Node.js + Express
│   ├── src/
│   │   ├── controllers/              # Handle request/response
│   │   │   ├── auth.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── auth.service.js
│   │   │   └── user.service.js
│   │   │
│   │   ├── models/                   # MongoDB Models
│   │   │   └── User.js
│   │   │
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── middleware/               # Auth, RBAC, validation
│   │   │   ├── auth.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── utils/                    # Helper functions
│   │   │   ├── generateToken.js
│   │   │   └── sendResponse.js
│   │   │
│   │   ├── config/                   # Configuration
│   │   │   └── db.js
│   │   │
│   │   ├── seeders/                  # Seed data
│   │   │   └── seed.js
│   │   │
│   │   ├── app.js                    # Express app setup (middleware, routes)
│   │   └── server.js                 # Entry point (DB connect + listen)
│   │
│   ├── .env
│   └── package.json
│
│
├── frontend/                         # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/                      # API calls using axios
│   │   │   ├── axiosInstance.js
│   │   │   ├── authApi.js
│   │   │   └── userApi.js
│   │   │
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── RoleGuard.jsx
│   │   │   ├── PageHeader.jsx        # New
│   │   │   ├── FormField.jsx         # New
│   │   │   └── StatCard.jsx          # New
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UsersListPage.jsx
│   │   │   ├── UserDetailPage.jsx
│   │   │   ├── CreateUserPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── store/                    # Redux store
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── userSlice.js
│   │   │
│   │   ├── hooks/                    # Custom hooks
│   │   │   └── useAuth.js
│   │   │
│   │   ├── utils/                    # Utilities
│   │   │   └── roles.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js            # New - Tailwind configuration
│   ├── postcss.config.js             # New - PostCSS configuration
│   └── package.json
│
│
├── docs/                             # Documentation
│   └── README.md
│
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
- `seeders/seed.js` – Demo user seeder

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
PORT=5000
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




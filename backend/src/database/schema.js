/**
 * DATABASE SCHEMA REFERENCE
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is documentation-only. The authoritative schema is in models/User.js.
 * Use this file to understand field types, constraints, indexes, and relationships.
 *
 * Collection: users
 * Database:   user_management
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * USERS COLLECTION
 *
 * {
 *   _id:           ObjectId        — Auto-generated primary key by MongoDB
 *   name:          String          — User's full name
 *                                    Constraints: required, minLength:2, maxLength:50, trimmed
 *
 *   email:         String          — Unique login identifier
 *                                    Constraints: required, unique, lowercase, trimmed
 *                                    Format: must match /^\S+@\S+\.\S+$/
 *                                    Index: unique, case-insensitive collation
 *
 *   password:      String          — bcrypt hash of the user's password
 *                                    Constraints: required, minLength:6 (before hashing)
 *                                    NEVER returned in queries (select: false)
 *                                    Hashed in pre('save') hook with cost factor 12
 *
 *   role:          String(enum)    — RBAC role assignment
 *                                    Values: 'admin' | 'manager' | 'user'
 *                                    Default: 'user'
 *                                    Index: { role: 1 }
 *
 *   status:        String(enum)    — Account lifecycle state
 *                                    Values: 'active' | 'inactive'
 *                                    Default: 'active'
 *                                    Index: { status: 1 }
 *                                    Inactive users: cannot log in, blocked at middleware
 *
 *   refreshToken:  String          — Current valid refresh token for this user
 *                                    NEVER returned in queries (select: false)
 *                                    Set on login, cleared on logout / password change
 *                                    null = no active session
 *
 *   createdBy:     ObjectId|null   — Ref → users._id of the admin who created this user
 *                                    null = system-created (seeder) or self-registered
 *                                    Populated: { name, email }
 *
 *   updatedBy:     ObjectId|null   — Ref → users._id of the last person who updated this user
 *                                    Updated on every mutation through the service layer
 *                                    Populated: { name, email }
 *
 *   createdAt:     Date            — Auto-managed by Mongoose timestamps: true
 *   updatedAt:     Date            — Auto-managed by Mongoose timestamps: true
 * }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * INDEXES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Name                  | Keys                           | Options
 * ─────────────────────────────────────────────────────────────────────────────
 * _id_ (default)        | { _id: 1 }                     | unique
 * email_unique_ci       | { email: 1 }                   | unique, collation en/2
 * role_filter           | { role: 1 }                    | —
 * status_filter         | { status: 1 }                  | —
 * role_status_created   | { role:1, status:1, createdAt:-1 } | compound (most queries)
 * search_text           | { name:'text', email:'text' }  | weights name:2 email:1
 * created_by_ref        | { createdBy: 1 }               | —
 * updated_by_ref        | { updatedBy: 1 }               | —
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MIGRATIONS COLLECTION (tracks which migrations have run)
 * ─────────────────────────────────────────────────────────────────────────────
 * {
 *   _id:         ObjectId
 *   name:        String    — Migration filename without .js (e.g. '001_create_users_indexes')
 *   appliedAt:   Date      — When this migration ran
 *   duration:    Number    — Time in milliseconds
 * }
 *
 * Index: { name: 1 } unique
 */

// ── Query patterns this schema is optimised for ──────────────────────────────
//
// 1. Login:
//    db.users.findOne({ email: <email> })
//    → uses: email_unique_ci
//
// 2. User list with filters (most common admin query):
//    db.users.find({ role: 'manager', status: 'active' }).sort({ createdAt: -1 })
//    → uses: role_status_created (compound covers role + status + sort)
//
// 3. Text search:
//    db.users.find({ $text: { $search: "alice" } })
//    → uses: search_text
//
// 4. Single user with audit:
//    db.users.findById(id).populate('createdBy updatedBy')
//    → uses: _id_ (primary), then created_by_ref / updated_by_ref for populate
//
// 5. Auth middleware (every request):
//    db.users.findById(decoded.id)
//    → uses: _id_ (primary key — fastest possible lookup)

module.exports = {}; // documentation-only module
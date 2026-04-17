// — MongoDB init script (runs once on first container start)

// This script runs inside the MongoDB container on first initialization.
// It creates the application database and user with limited privileges.

db = db.getSiblingDB('user_management');

// Create a dedicated app user (not the root admin)
db.createUser({
  user: 'ums_app',
  pwd:  'ums_app_password',
  roles: [
    { role: 'readWrite', db: 'user_management' },
  ],
});

// Create collections explicitly so indexes apply immediately
db.createCollection('users');
db.createCollection('migrations');

// ── Users collection indexes ──────────────────────────────────────────────

// Unique email index (case-insensitive)
db.users.createIndex(
  { email: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 }, name: 'email_unique_ci' }
);

// Role filter index
db.users.createIndex({ role: 1 }, { name: 'role_filter' });

// Status filter index
db.users.createIndex({ status: 1 }, { name: 'status_filter' });

// Compound index for the most common query: list users filtered by role + status, sorted by createdAt
db.users.createIndex(
  { role: 1, status: 1, createdAt: -1 },
  { name: 'role_status_created' }
);

// Text index for search (name + email)
db.users.createIndex(
  { name: 'text', email: 'text' },
  { name: 'search_text', weights: { name: 2, email: 1 } }
);

// createdBy / updatedBy for audit queries
db.users.createIndex({ createdBy: 1 }, { name: 'created_by_ref' });
db.users.createIndex({ updatedBy: 1 }, { name: 'updated_by_ref' });

// ── Migrations collection ─────────────────────────────────────────────────
db.migrations.createIndex({ name: 1 }, { unique: true, name: 'migration_name_unique' });

print('✅ MongoDB initialization complete');
print('   Database : user_management');
print('   App user : ums_app');
print('   Indexes  : 7 created on users collection');
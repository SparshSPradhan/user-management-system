/**
 * Migration 001 — Create users collection indexes
 * Safe to run multiple times (createIndex is idempotent).
 */

module.exports = {
    async up(db) {
      const users = db.collection('users');
  
      // 1. Unique email (case-insensitive)
      await users.createIndex(
        { email: 1 },
        {
          unique:    true,
          collation: { locale: 'en', strength: 2 },
          name:      'email_unique_ci',
          background: true,
        }
      );
  
      // 2. Role filter
      await users.createIndex(
        { role: 1 },
        { name: 'role_filter', background: true }
      );
  
      // 3. Status filter
      await users.createIndex(
        { status: 1 },
        { name: 'status_filter', background: true }
      );
  
      // 4. Compound: role + status + sort by createdAt (most common list query)
      await users.createIndex(
        { role: 1, status: 1, createdAt: -1 },
        { name: 'role_status_created', background: true }
      );
  
      // 5. Text search on name and email
      await users.createIndex(
        { name: 'text', email: 'text' },
        {
          name:    'search_text',
          weights: { name: 2, email: 1 },
          default_language: 'english',
        }
      );
  
      // 6. Audit references
      await users.createIndex(
        { createdBy: 1 },
        { name: 'created_by_ref', background: true }
      );
  
      await users.createIndex(
        { updatedBy: 1 },
        { name: 'updated_by_ref', background: true }
      );
    },
  
    async down(db) {
      const users = db.collection('users');
      const indexesToDrop = [
        'email_unique_ci',
        'role_filter',
        'status_filter',
        'role_status_created',
        'search_text',
        'created_by_ref',
        'updated_by_ref',
      ];
      for (const name of indexesToDrop) {
        try {
          await users.dropIndex(name);
        } catch {
          // Index may not exist — safe to ignore
        }
      }
    },
  };
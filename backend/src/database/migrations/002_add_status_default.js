/**
 * Migration 002 — Backfill status field on legacy documents
 * Ensures all existing users without a status field get 'active'.
 * Safe to run multiple times (only updates docs without status).
 */

module.exports = {
    async up(db) {
      const result = await db.collection('users').updateMany(
        { status: { $exists: false } },
        { $set: { status: 'active' } }
      );
      console.log(`    Backfilled status on ${result.modifiedCount} document(s)`);
    },
  
    async down(db) {
      // Removing the field is destructive — we intentionally do not roll this back.
      console.log('    down() is a no-op for migration 002 (backfill is non-destructive)');
    },
  };
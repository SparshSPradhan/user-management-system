/**
 * Migration 003 — Backfill audit fields on existing documents
 * Ensures createdBy and updatedBy exist on all user documents.
 * Documents created before audit fields were added will get null values.
 * Safe to run multiple times.
 */

module.exports = {
    async up(db) {
      const result = await db.collection('users').updateMany(
        {
          $or: [
            { createdBy: { $exists: false } },
            { updatedBy: { $exists: false } },
          ],
        },
        {
          $set: {
            createdBy: null,
            updatedBy: null,
          },
        }
      );
      console.log(`    Backfilled audit fields on ${result.modifiedCount} document(s)`);
    },
  
    async down(db) {
      // Unset audit fields from documents where both are null
      // (i.e., those added by this migration, not legitimate data)
      const result = await db.collection('users').updateMany(
        { createdBy: null, updatedBy: null },
        { $unset: { createdBy: '', updatedBy: '' } }
      );
      console.log(`    Removed audit fields from ${result.modifiedCount} document(s)`);
    },
  };
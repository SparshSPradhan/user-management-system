/**
 * Migration Runner
 * ────────────────────────────────────────────────────────────────────────────
 * Runs pending migrations in order. Each migration is idempotent — safe to
 * run multiple times. Already-applied migrations are skipped automatically.
 *
 * Usage:
 *   node src/database/migrations/runner.js           — apply all pending
 *   node src/database/migrations/runner.js --status  — show migration status
 *   node src/database/migrations/runner.js --rollback — rollback last migration
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path     = require('path');
const fs       = require('fs');

const connectDB = require('../../config/db');

// ── Migration model ──────────────────────────────────────────────────────────
const migrationSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true },
  appliedAt: { type: Date, default: Date.now },
  duration:  { type: Number },
});
const Migration = mongoose.model('Migration', migrationSchema);

// ── Helpers ──────────────────────────────────────────────────────────────────
const getMigrationFiles = () => {
  return fs
    .readdirSync(__dirname)
    .filter(f => f.match(/^\d{3}_.*\.js$/) && f !== 'runner.js')
    .sort();
};

const getApplied = async () => {
  const docs = await Migration.find().select('name');
  return new Set(docs.map(d => d.name));
};

// ── Commands ─────────────────────────────────────────────────────────────────
const applyMigrations = async () => {
  const files   = getMigrationFiles();
  const applied = await getApplied();
  const pending = files.filter(f => !applied.has(f.replace('.js', '')));

  if (pending.length === 0) {
    console.log('✅ All migrations are already applied.');
    return;
  }

  console.log(`\n📦 Applying ${pending.length} migration(s)...\n`);

  for (const file of pending) {
    const name      = file.replace('.js', '');
    const migration = require(path.join(__dirname, file));
    const start     = Date.now();

    try {
      process.stdout.write(`  → ${name} ... `);
      await migration.up(mongoose.connection.db);
      const duration = Date.now() - start;
      await Migration.create({ name, duration });
      console.log(`✅ done (${duration}ms)`);
    } catch (err) {
      console.log(`❌ FAILED\n`);
      console.error(err);
      process.exit(1);
    }
  }

  console.log('\n✅ All migrations applied.\n');
};

const showStatus = async () => {
  const files   = getMigrationFiles();
  const applied = await getApplied();

  console.log('\n Migration Status\n' + '─'.repeat(60));
  for (const file of files) {
    const name    = file.replace('.js', '');
    const isApplied = applied.has(name);
    const status  = isApplied ? '✅ applied' : '⏳ pending';
    console.log(`  ${status.padEnd(12)} ${name}`);
  }
  console.log('─'.repeat(60) + '\n');
};

const rollbackLast = async () => {
  const last = await Migration.findOne().sort({ appliedAt: -1 });
  if (!last) {
    console.log('No migrations to rollback.');
    return;
  }

  const file      = path.join(__dirname, `${last.name}.js`);
  const migration = require(file);

  if (!migration.down) {
    console.error(`❌ Migration ${last.name} has no rollback (down) function.`);
    process.exit(1);
  }

  try {
    process.stdout.write(`  ← Rolling back ${last.name} ... `);
    await migration.down(mongoose.connection.db);
    await Migration.deleteOne({ name: last.name });
    console.log('✅ done');
  } catch (err) {
    console.log('❌ FAILED\n');
    console.error(err);
    process.exit(1);
  }
};

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  await connectDB();

  const arg = process.argv[2];
  if      (arg === '--status')   await showStatus();
  else if (arg === '--rollback') await rollbackLast();
  else                           await applyMigrations();

  await mongoose.disconnect();
  process.exit(0);
})();
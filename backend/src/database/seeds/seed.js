/**
 * Database Seeder
 * ─────────────────────────────────────────────────────────────────────────────
 * Usage (from backend/ directory):
 *
 *   npm run seed               — wipe users + re-seed
 *   npm run seed:fresh         — wipe everything (users + migrations) + re-seed
 *   node src/database/seeds/seed.js --dry-run  — show what would be inserted
 *
 * Add to package.json scripts:
 *   "seed":       "node src/database/seeds/seed.js",
 *   "seed:fresh": "node src/database/seeds/seed.js --fresh",
 *   "migrate":    "node src/database/migrations/runner.js",
 *   "migrate:status": "node src/database/migrations/runner.js --status"
 */

require('dotenv').config();
const mongoose  = require('mongoose');
const connectDB = require('../../config/db');
const User      = require('../../models/User');
const seedUsers = require('./data/users');

const isDryRun = process.argv.includes('--dry-run');
const isFresh  = process.argv.includes('--fresh');

const divider = (char = '─', len = 60) => console.log(char.repeat(len));

const run = async () => {
  await connectDB();
  divider('═');
  console.log('  User Management System — Database Seeder');
  divider('═');

  if (isDryRun) {
    console.log('\n🔍 DRY RUN — no changes will be made\n');
    console.log('Would insert the following users:\n');
    seedUsers.forEach((u, i) => {
      console.log(`  ${i + 1}. [${u.role.padEnd(7)}] ${u.name} <${u.email}> (${u.status})`);
    });
    console.log('');
    await mongoose.disconnect();
    return;
  }

  // ── Wipe ──────────────────────────────────────────────────────────────────
  if (isFresh) {
    console.log('\n⚠️  Fresh seed — dropping ALL collections...');
    await mongoose.connection.dropDatabase();
    console.log('   Database dropped.');
  } else {
    console.log('\n🧹 Clearing users collection...');
    const deleted = await User.deleteMany({});
    console.log(`   Removed ${deleted.deletedCount} existing user(s).`);
  }

  // ── Insert ─────────────────────────────────────────────────────────────────
  console.log('\n🌱 Seeding users...\n');
  const created = [];
  const failed  = [];

  for (const userData of seedUsers) {
    try {
      const user = await User.create(userData);
      created.push(user);
      const roleTag = `[${user.role.padEnd(7)}]`;
      const statusTag = user.status === 'active' ? '🟢' : '🔴';
      console.log(`  ${statusTag} ${roleTag} ${user.name} <${user.email}>`);
    } catch (err) {
      failed.push({ ...userData, error: err.message });
      console.error(`  ❌ Failed to create ${userData.email}: ${err.message}`);
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  divider();
  console.log('\n📊 Summary');
  console.log(`   ✅ Created : ${created.length} user(s)`);
  if (failed.length) {
    console.log(`   ❌ Failed  : ${failed.length} user(s)`);
  }

  divider();
  console.log('\n🔑 Login Credentials\n');
  created.forEach(u => {
    const original = seedUsers.find(s => s.email === u.email);
    console.log(`   ${u.role.padEnd(9)} ${u.email.padEnd(30)} ${original?.password}`);
  });

  console.log('\n🌐 Mongo Express (DB GUI) : http://localhost:8081');
  console.log('   Username : admin  |  Password : mexpress123\n');
  divider('═');

  await mongoose.disconnect();
  process.exit(failed.length > 0 ? 1 : 0);
};

run().catch(err => {
  console.error('Seeder crashed:', err);
  process.exit(1);
});
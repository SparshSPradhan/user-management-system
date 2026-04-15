require('dotenv').config({ path: '../../../.env' });
// Run from backend folder: node src/seeders/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const users = [
  { name: 'Super Admin', email: 'admin@example.com', password: 'Admin@123', role: 'admin', status: 'active' },
  { name: 'John Manager', email: 'manager@example.com', password: 'Manager@123', role: 'manager', status: 'active' },
  { name: 'Alice User', email: 'user@example.com', password: 'User@1234', role: 'user', status: 'active' },
];

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  console.log('Cleared existing users');
  for (const u of users) {
    await User.create(u);
  }
  console.log('Seeded users:');
  users.forEach(u => console.log(`  ${u.role}: ${u.email} / ${u.password}`));
  process.exit(0);
};

seed();
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const users = [
  { name: 'Super Admin', email: 'admin@example.com', password: 'Admin@123', role: 'admin', status: 'active' },
  { name: 'John Manager', email: 'manager@example.com', password: 'Manager@123', role: 'manager', status: 'active' },
  { name: 'Alice User', email: 'user@example.com', password: 'User@1234', role: 'user', status: 'active' },
];

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany({});


    await User.deleteMany({});
    console.log('Cleared existing users');

    for (const u of users) {
  
        const hashedPassword = await bcrypt.hash(u.password, 12);
        console.log("PLAIN PASSWORD:", u.password);
        console.log("HASHED PASSWORD:", hashedPassword);
      
        await User.create({
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
          status: u.status
        });
      }

    console.log('Seeded users successfully');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
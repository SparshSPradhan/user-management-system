/**
 * Seed data — demo users for development and testing.
 * Passwords are in plain text here; bcrypt hashing happens in the User model's
 * pre-save hook automatically when User.create() is called.
 */

module.exports = [
    {
      name:   'Super Admin',
      email:  'admin@example.com',
      password: 'Admin@123',
      role:   'admin',
      status: 'active',
    },
    {
      name:   'John Manager',
      email:  'manager@example.com',
      password: 'Manager@123',
      role:   'manager',
      status: 'active',
    },
    {
      name:   'Alice User',
      email:  'user@example.com',
      password: 'User@1234',
      role:   'user',
      status: 'active',
    },
    {
      name:   'Bob Inactive',
      email:  'inactive@example.com',
      password: 'Inactive@123',
      role:   'user',
      status: 'inactive',     // demo of a deactivated account
    },
    {
      name:   'Carol Manager',
      email:  'carol@example.com',
      password: 'Carol@1234',
      role:   'manager',
      status: 'active',
    },
  ];
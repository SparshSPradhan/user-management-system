const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getUsers, getUser, createUser, updateUser, deleteUser, updateProfile,
} = require('../controllers/userController');
// Re-use getMe from auth controller for profile
const { getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const validate = require('../middleware/validate');

// Profile (any authenticated user)
router.get('/profile', protect, getMe);
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('password').optional().isLength({ min: 6 }),
    validate,
  ],
  updateProfile
);

// Admin + Manager
router.get('/', protect, authorize('admin', 'manager'), getUsers);
router.get('/:id', protect, authorize('admin', 'manager'), getUser);

// Admin only
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name min 2 chars'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
    validate,
  ],
  createUser
);

router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;


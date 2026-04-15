const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendResponse = require('../utils/sendResponse');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, false, 'Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return sendResponse(res, 401, false, 'User not found');
    if (user.status === 'inactive')
      return sendResponse(res, 403, false, 'Account is inactive');

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Token invalid or expired');
  }
};

module.exports = { protect };
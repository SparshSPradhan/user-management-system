const sendResponse = require('../utils/sendResponse');

// Role hierarchy: admin > manager > user
const roleHierarchy = { admin: 3, manager: 2, user: 1 };

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        `Role '${req.user.role}' is not authorized to access this resource`
      );
    }
    next();
  };
};

module.exports = { authorize };
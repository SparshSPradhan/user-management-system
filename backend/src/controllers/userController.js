const userService = require('../services/userService');
const sendResponse = require('../utils/sendResponse');

const getUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    return sendResponse(res, 200, true, 'Users fetched', result);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return sendResponse(res, 404, false, 'User not found');
    return sendResponse(res, 200, true, 'User fetched', { user });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body, req.user._id);
    return sendResponse(res, 201, true, 'User created', { user });
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user._id);
    return sendResponse(res, 200, true, 'User updated', { user });
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return sendResponse(res, 400, false, 'Cannot deactivate your own account');
    }
    const user = await userService.deleteUser(req.params.id);
    return sendResponse(res, 200, true, 'User deactivated', { user });
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    return sendResponse(res, 200, true, 'Profile updated', { user });
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, updateProfile };
const { loginUser, refreshAccessToken, logoutUser } = require('../services/authService');
const sendResponse = require('../utils/sendResponse');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, true, 'Login successful', { user, accessToken });
  } catch (error) {
    return sendResponse(res, 401, false, error.message);
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    const accessToken = await refreshAccessToken(token);
    return sendResponse(res, 200, true, 'Token refreshed', { accessToken });
  } catch (error) {
    return sendResponse(res, 401, false, error.message);
  }
};

const logout = async (req, res) => {
  try {
    await logoutUser(req.user._id);
    res.clearCookie('refreshToken');
    return sendResponse(res, 200, true, 'Logged out successfully');
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getMe = async (req, res) => {
  return sendResponse(res, 200, true, 'User fetched', { user: req.user });
};

module.exports = { login, refresh, logout, getMe };
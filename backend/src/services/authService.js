const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

const loginUser = async (email, password) => {


  const user = await User.findOne({ email }).select('+password +refreshToken');
  console.log("TYPE OF PASSWORD:", typeof user.password);
  console.log("PASSWORD LENGTH:", user.password?.length);
  console.log("INPUT LENGTH:", password.length);
  console.log("CHAR CODES:", [...user.password].slice(0, 10));
  console.log("USER ID FROM LOGIN:", user._id);
  if (!user) throw new Error('Invalid credentials');
  if (user.status === 'inactive') throw new Error('Account is inactive');

  // const isMatch = await user.comparePassword(password);
  const bcrypt = require('bcryptjs');

  console.log("COMPARE INPUT:", password);
  console.log("COMPARE HASH:", user.password);
  
  const isMatch = await bcrypt.compare(
    password.trim(),
    user.password.trim()
  );  if (!isMatch) throw new Error('Invalid credentials');

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
//   console.log("EMAIL:", email);
// console.log("USER:", user);
// console.log("PASSWORD IN DB:", user?.password);

  return { user: userObj, accessToken, refreshToken };
};

const refreshAccessToken = async (token) => {
  if (!token) throw new Error('No refresh token');
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new Error('Invalid refresh token');

  const accessToken = generateAccessToken(user._id);
  return accessToken;
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = { loginUser, refreshAccessToken, logoutUser };
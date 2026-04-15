const User = require('../models/User');

const getAllUsers = async (query) => {
  const { page = 1, limit = 10, search = '', role, status } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) filter.role = role;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const users = await User.find(filter)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);
  return { users, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getUserById = async (id) => {
  return await User.findById(id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');
};

const createUser = async (data, creatorId) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error('Email already registered');
  return await User.create({ ...data, createdBy: creatorId, updatedBy: creatorId });
};

const updateUser = async (id, data, updaterId) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  const allowedFields = ['name', 'email', 'role', 'status'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) user[field] = data[field];
  });

  if (data.password) user.password = data.password;
  user.updatedBy = updaterId;
  await user.save();
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (data.name) user.name = data.name;
  if (data.password) user.password = data.password;
  user.updatedBy = userId;
  await user.save();
  return user;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateProfile };
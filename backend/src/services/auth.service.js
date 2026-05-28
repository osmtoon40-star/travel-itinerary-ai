const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

// Register new user
const registerUser = async (userData) => {
  const { name, email, password } = userData;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }
  
  // Create new user
  const user = await User.create({
    name,
    email,
    password
  });
  
  // Generate token
  const token = generateToken(user._id);
  
  return { user, token };
};

// Login existing user
const loginUser = async (email, password) => {
  // Get user with password (normally password is excluded)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Generate token
  const token = generateToken(user._id);
  
  return { user, token };
};

// Get current user from token
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
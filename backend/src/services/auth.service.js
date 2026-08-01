import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for a given user
 * @param {Object} user 
 * @returns {string} JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

/**
 * Sanitize user object to exclude sensitive fields like password
 * @param {Object} user 
 * @returns {Object} Clean user object
 */
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  return userObj;
};

/**
 * Register a new user
 * @param {Object} userData - User registration details
 * @returns {Promise<{user: Object, token: string}>} Clean user object and auth token
 */
export const registerUser = async ({ name, email, password, avatar, role }) => {
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters long');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    avatar: avatar || '',
    role: role || 'user',
  });

  const token = generateToken(newUser);
  const cleanUser = sanitizeUser(newUser);

  return {
    user: cleanUser,
    token,
  };
};

/**
 * Authenticate user and issue JWT token
 * @param {Object} credentials - Email and password
 * @returns {Promise<{user: Object, token: string}>} Clean user object and auth token
 */
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user);
  const cleanUser = sanitizeUser(user);

  return {
    user: cleanUser,
    token,
  };
};

/**
 * Fetch current authenticated user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Clean user object
 */
export const getCurrentUser = async (userId) => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.toObject ? user.toObject() : user;
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
};

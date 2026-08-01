import { registerUser, loginUser, getCurrentUser } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, avatar, role } = req.body;
    const { user, token } = await registerUser({ name, email, password, avatar, role });

    return res
      .status(201)
      .cookie('token', token, COOKIE_OPTIONS)
      .json(new ApiResponse(201, { user, token }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * Login existing user
 * @route POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    return res
      .status(200)
      .cookie('token', token, COOKIE_OPTIONS)
      .json(new ApiResponse(200, { user, token }, 'User logged in successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * Logout current user
 * @route POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie('token', COOKIE_OPTIONS)
      .json(new ApiResponse(200, {}, 'User logged out successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * Get current authenticated user profile
 * @route GET /api/v1/auth/profile
 */
export const getProfile = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id || req.params?.id;
    const user = await getCurrentUser(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User profile fetched successfully'));
  } catch (error) {
    next(error);
  }
});

export default {
  register,
  login,
  logout,
  getProfile,
};

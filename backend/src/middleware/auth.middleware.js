import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';

/**
 * Authentication Middleware
 * Reads JWT token from Authorization header or cookies, verifies it, and attaches the user to req.user.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Read JWT token from Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Fallback to cookie if present
    token = req.cookies.token;
  }

  // 2. Return 401 if token is missing
  if (!token) {
    throw new ApiError(401, 'Access denied. No authentication token provided.');
  }

  try {
    // 3. Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Fetch user from DB excluding password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'Invalid token. User no longer exists.');
    }

    // 5. Attach authenticated user to req.user
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Unauthorized. Token verification failed.');
  }
});

export default authenticate;

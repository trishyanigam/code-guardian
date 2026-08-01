import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation, validate } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validate, register);

/**
 * @route   POST /login
 * @desc    Login existing user and receive JWT token
 * @access  Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route   POST /logout
 * @desc    Logout current user and clear session cookie
 * @access  Public / Private
 */
router.post('/logout', logout);

/**
 * @route   GET /me
 * @desc    Get profile details of authenticated user
 * @access  Private
 */
router.get('/me', authenticate, getProfile);

export default router;

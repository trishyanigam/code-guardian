import { Router } from 'express';
import {
  login,
  callback,
  getProfile,
  getRepositories,
  connectRepository,
  disconnectRepository,
} from '../controllers/github.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   GET /login
 * @desc    Initiate GitHub OAuth login flow
 * @access  Public
 */
router.get('/login', login);

/**
 * @route   GET /callback
 * @desc    GitHub OAuth callback handler
 * @access  Public
 */
router.get('/callback', callback);

/**
 * @route   GET /profile
 * @desc    Fetch authenticated GitHub user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   GET /repositories
 * @desc    Fetch user's GitHub repositories list
 * @access  Private
 */
router.get('/repositories', authenticate, getRepositories);

/**
 * @route   POST /connect
 * @desc    Connect a GitHub repository to the platform workspace
 * @access  Private
 */
router.post('/connect', authenticate, connectRepository);

/**
 * @route   DELETE /disconnect/:id
 * @desc    Disconnect a repository from the platform workspace
 * @access  Private
 */
router.delete('/disconnect/:id', authenticate, disconnectRepository);

export default router;

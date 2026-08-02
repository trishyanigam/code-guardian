import { Router } from 'express';
import {
  getRepositories,
  syncRepositories,
  connectRepository,
  disconnectRepository,
  getConnectedRepositories,
} from '../controllers/repository.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes using authentication middleware
router.use(authenticate);

/**
 * @route   GET /
 * @desc    Get all repositories
 * @access  Private
 */
router.get('/', getRepositories);

/**
 * @route   POST /sync
 * @desc    Sync repositories from GitHub
 * @access  Private
 */
router.post('/sync', syncRepositories);

/**
 * @route   POST /connect
 * @desc    Connect a repository
 * @access  Private
 */
router.post('/connect', connectRepository);

/**
 * @route   GET /connected
 * @desc    Get all connected repositories
 * @access  Private
 */
router.get('/connected', getConnectedRepositories);

/**
 * @route   DELETE /:id
 * @desc    Disconnect a repository by ID
 * @access  Private
 */
router.delete('/:id', disconnectRepository);

export default router;

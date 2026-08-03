import { Router } from 'express';
import {
  getAllPullRequests,
  getPullRequest,
  getChangedFiles,
} from '../controllers/pullRequest.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protect pull request routes with authentication middleware
router.use(authenticate);

/**
 * @route   GET /
 * @desc    Get all pull requests
 * @access  Private
 */
router.get('/', getAllPullRequests);

/**
 * @route   GET /:id
 * @desc    Get single pull request details
 * @access  Private
 */
router.get('/:id', getPullRequest);

/**
 * @route   GET /:id/files
 * @desc    Get changed files for a pull request
 * @access  Private
 */
router.get('/:id/files', getChangedFiles);

export default router;

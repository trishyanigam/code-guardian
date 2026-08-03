import { Router } from 'express';
import {
  postReviewComment,
  updateReviewComment,
  getReviewComment,
} from '../controllers/githubComment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all GitHub comment routes using authentication middleware
router.use(authenticate);

/**
 * @route   POST /post
 * @desc    Post AI review comment on a GitHub pull request
 * @access  Private
 */
router.post('/post', postReviewComment);

/**
 * @route   PUT /update
 * @desc    Update an existing GitHub review comment
 * @access  Private
 */
router.put('/update', updateReviewComment);

/**
 * @route   GET /:pullRequestId
 * @desc    Get stored GitHub review comment details by pullRequestId or comment ID
 * @access  Private
 */
router.get('/:pullRequestId', getReviewComment);

export default router;

import { Router } from 'express';
import {
  generateReview,
  getReviews,
  getReviewById,
} from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all review routes using authentication middleware
router.use(authenticate);

/**
 * @route   POST /generate
 * @desc    Generate AI code review for a pull request
 * @access  Private
 */
router.post('/generate', generateReview);

/**
 * @route   GET /
 * @desc    Get all AI code reviews
 * @access  Private
 */
router.get('/', getReviews);

/**
 * @route   GET /:id
 * @desc    Get AI code review details by ID or pullRequest ID
 * @access  Private
 */
router.get('/:id', getReviewById);

export default router;

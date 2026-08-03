import { Router } from 'express';
import {
  getOverview,
  getRepositories,
  getDevelopers,
  getIssues,
  getTrends,
  getPullRequestTrends,
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all analytics endpoints with authentication middleware
router.use(authenticate);

/**
 * @route   GET /overview
 * @desc    Get platform high-level overview metrics
 * @access  Private
 */
router.get('/overview', getOverview);

/**
 * @route   GET /repositories
 * @desc    Get repository-level review and security analytics
 * @access  Private
 */
router.get('/repositories', getRepositories);

/**
 * @route   GET /developers
 * @desc    Get developer/author metrics and security statistics
 * @access  Private
 */
router.get('/developers', getDevelopers);

/**
 * @route   GET /issues
 * @desc    Get issue breakdown by severity and top categories
 * @access  Private
 */
router.get('/issues', getIssues);

/**
 * @route   GET /trends
 * @desc    Get historical review score trends over time
 * @access  Private
 */
router.get('/trends', getTrends);

/**
 * @route   GET /pr-trends
 * @desc    Get daily pull request submission and status trends
 * @access  Private
 */
router.get('/pr-trends', getPullRequestTrends);

export default router;

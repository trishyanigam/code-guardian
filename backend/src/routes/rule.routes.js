import { Router } from 'express';
import {
  createRule,
  getRules,
  updateRule,
  toggleRule,
  deleteRule,
} from '../controllers/rule.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all coding rule endpoints with authentication middleware
router.use(authenticate);

/**
 * @route   GET /
 * @desc    Get all custom AI coding rules
 * @access  Private
 */
router.get('/', getRules);

/**
 * @route   POST /
 * @desc    Create a new AI coding rule
 * @access  Private
 */
router.post('/', createRule);

/**
 * @route   PUT /:id
 * @desc    Update an existing coding rule
 * @access  Private
 */
router.put('/:id', updateRule);

/**
 * @route   DELETE /:id
 * @desc    Delete a coding rule by ID
 * @access  Private
 */
router.delete('/:id', deleteRule);

/**
 * @route   PATCH /:id/toggle
 * @desc    Toggle active status (enabled/disabled) of a coding rule
 * @access  Private
 */
router.patch('/:id/toggle', toggleRule);

export default router;

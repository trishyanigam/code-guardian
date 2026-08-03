import { Router } from 'express';
import { handleGithubWebhook } from '../controllers/webhook.controller.js';

const router = Router();

/**
 * @route   POST /github
 * @desc    Handle incoming GitHub webhook events
 * @access  Public (Webhook Signature Verified in Controller/Utility)
 */
router.post('/github', handleGithubWebhook);

export default router;

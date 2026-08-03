import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import githubRoutes from './github.routes.js';
import repositoryRoutes from './repository.routes.js';
import webhookRoutes from './webhook.routes.js';
import pullRequestRoutes from './pullRequest.routes.js';
import reviewRoutes from './review.routes.js';

const router = Router();

// Mount health routes under /health
router.use('/health', healthRoutes);

// Mount auth routes under /auth
router.use('/auth', authRoutes);

// Mount github routes under /github
router.use('/github', githubRoutes);

// Mount repository routes under /repositories
router.use('/repositories', repositoryRoutes);

// Mount webhook routes under /webhooks
router.use('/webhooks', webhookRoutes);

// Mount pull request routes under /pull-requests
router.use('/pull-requests', pullRequestRoutes);

// Mount review routes under /reviews
router.use('/reviews', reviewRoutes);

export default router;



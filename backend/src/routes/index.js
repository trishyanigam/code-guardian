import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import githubRoutes from './github.routes.js';

const router = Router();

// Mount health routes under /health
router.use('/health', healthRoutes);

// Mount auth routes under /auth
router.use('/auth', authRoutes);

// Mount github routes under /github
router.use('/github', githubRoutes);

export default router;

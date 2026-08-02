import * as repositoryService from '../services/repository.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Helper to extract GitHub access token from request
 */
const getAccessToken = (req) => {
  const token =
    req.headers['x-github-token'] ||
    req.headers['github_token'] ||
    req.query.accessToken ||
    req.user?.githubAccessToken ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    throw new ApiError(400, 'GitHub access token is required to sync repositories');
  }
  return token;
};

/**
 * Sync repositories from GitHub to database
 * @route POST /api/v1/repositories/sync
 */
export const syncRepositories = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = getAccessToken(req);
    const userId = req.user?._id || req.user?.id || null;

    const repositories = await repositoryService.syncRepositories(accessToken, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, repositories, 'Repositories synced successfully from GitHub'));
  } catch (error) {
    return next(error);
  }
});

/**
 * Get all repositories stored in database
 * @route GET /api/v1/repositories
 */
export const getRepositories = asyncHandler(async (req, res, next) => {
  try {
    const { owner, language, visibility, connected, search, sort, limit, page } = req.query;

    const filter = {};
    if (owner) filter.owner = owner;
    if (language) filter.language = language;
    if (visibility) filter.visibility = visibility;
    if (connected !== undefined) filter.connected = connected === 'true';
    if (search) {
      filter.$or = [
        { repoName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {};
    if (sort) options.sort = sort;
    if (limit) options.limit = parseInt(limit, 10);
    if (page && limit) options.skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const repositories = await repositoryService.getRepositories(filter, options);

    return res
      .status(200)
      .json(new ApiResponse(200, repositories, 'Repositories retrieved successfully'));
  } catch (error) {
    return next(error);
  }
});

/**
 * Connect a repository in database
 * @route POST /api/v1/repositories/:id/connect
 */
export const connectRepository = asyncHandler(async (req, res, next) => {
  try {
    const repositoryId = req.params.id || req.params.repositoryId || req.body.repositoryId || req.body.id;
    const userId = req.user?._id || req.user?.id || null;

    if (!repositoryId) {
      throw new ApiError(400, 'Repository ID is required');
    }

    const repository = await repositoryService.connectRepository(repositoryId, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, repository, 'Repository connected successfully'));
  } catch (error) {
    return next(error);
  }
});

/**
 * Disconnect a repository in database
 * @route POST /api/v1/repositories/:id/disconnect
 */
export const disconnectRepository = asyncHandler(async (req, res, next) => {
  try {
    const repositoryId = req.params.id || req.params.repositoryId || req.body.repositoryId || req.body.id;
    const userId = req.user?._id || req.user?.id || null;

    if (!repositoryId) {
      throw new ApiError(400, 'Repository ID is required');
    }

    const repository = await repositoryService.disconnectRepository(repositoryId, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, repository, 'Repository disconnected successfully'));
  } catch (error) {
    return next(error);
  }
});

/**
 * Get all connected repositories
 * @route GET /api/v1/repositories/connected
 */
export const getConnectedRepositories = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id || req.query.userId || null;

    const repositories = await repositoryService.getConnectedRepositories(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, repositories, 'Connected repositories retrieved successfully'));
  } catch (error) {
    return next(error);
  }
});

export default {
  syncRepositories,
  getRepositories,
  connectRepository,
  disconnectRepository,
  getConnectedRepositories,
};

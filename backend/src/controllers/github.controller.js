import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as githubService from '../services/github.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import config from '../config/env.config.js';

/**
 * Helper function to extract GitHub Access Token from request headers or query
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
    throw new ApiError(400, 'GitHub access token is required');
  }
  return token;
};

/**
 * Initiate GitHub OAuth flow
 * @route GET /api/v1/github/login
 */
export const login = (req, res, next) => {
  passport.authenticate('github', { scope: ['user:email', 'repo'] })(req, res, next);
};

/**
 * Handle GitHub OAuth callback
 * @route GET /api/v1/github/callback
 */
export const callback = (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new ApiError(401, 'GitHub authentication failed'));
    }

    // Sign JWT token for the authenticated OAuth user
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const sanitizedUser = user.toObject ? user.toObject() : { ...user };
    delete sanitizedUser.password;

    // Redirect to frontend dashboard with token or return JSON response
    if (req.accepts('html')) {
      return res
        .cookie('token', token, cookieOptions)
        .redirect(`${config.clientUrl}/dashboard?token=${token}`);
    }

    return res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json(new ApiResponse(200, { user: sanitizedUser, token }, 'GitHub authentication successful'));
  })(req, res, next);
};

/**
 * Fetch authenticated GitHub user profile
 * @route GET /api/v1/github/profile
 */
export const getProfile = asyncHandler(async (req, res, next) => {
  const accessToken = getAccessToken(req);
  const profile = await githubService.fetchGithubProfile(accessToken);

  return res
    .status(200)
    .json(new ApiResponse(200, profile, 'GitHub profile fetched successfully'));
});

/**
 * Fetch list of repositories for the authenticated GitHub user
 * @route GET /api/v1/github/repositories
 */
export const getRepositories = asyncHandler(async (req, res, next) => {
  const accessToken = getAccessToken(req);
  const repositories = await githubService.fetchRepositories(accessToken);

  return res
    .status(200)
    .json(new ApiResponse(200, repositories, 'GitHub repositories fetched successfully'));
});

/**
 * Connect a GitHub repository to the workspace
 * @route POST /api/v1/github/connect
 */
export const connectRepository = asyncHandler(async (req, res, next) => {
  const { owner, repoName, githubRepoId, defaultBranch, visibility, language } = req.body;
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    throw new ApiError(401, 'User authentication required to connect repository');
  }

  const connectedRepo = await githubService.connectRepository({
    owner,
    repoName,
    githubRepoId,
    defaultBranch,
    visibility,
    language,
    userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, connectedRepo, 'Repository connected successfully'));
});

/**
 * Disconnect a GitHub repository from the workspace
 * @route DELETE /api/v1/github/disconnect/:id
 */
export const disconnectRepository = asyncHandler(async (req, res, next) => {
  const repositoryId = req.params.id || req.params.repositoryId || req.body.repositoryId;
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    throw new ApiError(401, 'User authentication required to disconnect repository');
  }

  const result = await githubService.disconnectRepository(repositoryId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Repository disconnected successfully'));
});

export default {
  login,
  callback,
  getProfile,
  getRepositories,
  connectRepository,
  disconnectRepository,
};

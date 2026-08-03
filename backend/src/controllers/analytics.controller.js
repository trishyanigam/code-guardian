import * as analyticsService from '../services/analytics.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get high-level platform overview analytics metrics
 * @route GET /api/v1/analytics/overview
 */
export const getOverview = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getOverviewAnalytics();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Overview analytics retrieved successfully'));
});

/**
 * Get repository-level review and security analytics
 * @route GET /api/v1/analytics/repositories
 */
export const getRepositories = asyncHandler(async (req, res, next) => {
  const repositoryId = req.query.repositoryId || req.query.id || null;
  const data = await analyticsService.getRepositoryAnalytics(repositoryId);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Repository analytics retrieved successfully'));
});

/**
 * Get developer/author review metrics and security statistics
 * @route GET /api/v1/analytics/developers
 */
export const getDevelopers = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getDeveloperAnalytics();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Developer analytics retrieved successfully'));
});

/**
 * Get issue breakdown by severity and vulnerability categories
 * @route GET /api/v1/analytics/issues
 */
export const getIssues = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getIssueAnalytics();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Issue analytics retrieved successfully'));
});

/**
 * Get review score trends over a specified period
 * @route GET /api/v1/analytics/trends
 */
export const getTrends = asyncHandler(async (req, res, next) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const data = await analyticsService.getTrendAnalytics(days);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Trend analytics retrieved successfully'));
});

/**
 * Get pull request submission and status trends over time
 * @route GET /api/v1/analytics/pr-trends
 */
export const getPullRequestTrends = asyncHandler(async (req, res, next) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const data = await analyticsService.getPullRequestTrendAnalytics(days);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Pull request trend analytics retrieved successfully'));
});

export default {
  getOverview,
  getRepositories,
  getDevelopers,
  getIssues,
  getTrends,
  getPullRequestTrends,
};

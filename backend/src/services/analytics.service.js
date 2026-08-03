import mongoose from 'mongoose';
import { Review } from '../models/review.model.js';
import { PullRequest } from '../models/pullRequest.model.js';
import { Repository } from '../models/repository.model.js';

/**
 * High-level platform analytics overview.
 * Aggregates overall scores, review counts, PR totals, and issue counts.
 */
export const getOverviewAnalytics = async () => {
  const [reviewStats] = await Review.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        avgOverallScore: { $avg: '$overallScore' },
        avgSecurityScore: { $avg: '$securityScore' },
        avgPerformanceScore: { $avg: '$performanceScore' },
        avgReadabilityScore: { $avg: '$readabilityScore' },
        avgMaintainabilityScore: { $avg: '$maintainabilityScore' },
        totalIssuesDetected: { $sum: { $size: { $ifNull: ['$issues', []] } } },
        totalSuggestionsGenerated: { $sum: { $size: { $ifNull: ['$suggestions', []] } } },
      },
    },
  ]);

  const totalPullRequests = await PullRequest.countDocuments();
  const totalRepositories = await Repository.countDocuments();

  return {
    totalReviews: reviewStats?.totalReviews || 0,
    totalPullRequests,
    totalRepositories,
    totalIssuesDetected: reviewStats?.totalIssuesDetected || 0,
    totalSuggestionsGenerated: reviewStats?.totalSuggestionsGenerated || 0,
    avgScores: {
      overallScore: reviewStats?.avgOverallScore ? Number(reviewStats.avgOverallScore.toFixed(1)) : 0,
      securityScore: reviewStats?.avgSecurityScore ? Number(reviewStats.avgSecurityScore.toFixed(1)) : 0,
      performanceScore: reviewStats?.avgPerformanceScore ? Number(reviewStats.avgPerformanceScore.toFixed(1)) : 0,
      readabilityScore: reviewStats?.avgReadabilityScore ? Number(reviewStats.avgReadabilityScore.toFixed(1)) : 0,
      maintainabilityScore: reviewStats?.avgMaintainabilityScore ? Number(reviewStats.avgMaintainabilityScore.toFixed(1)) : 0,
    },
  };
};

/**
 * Analytics breakdown per repository.
 *
 * @param {string} [repositoryId] - Optional repository ObjectId filter
 */
export const getRepositoryAnalytics = async (repositoryId = null) => {
  const matchStage = repositoryId
    ? { $match: { repository: new mongoose.Types.ObjectId(repositoryId) } }
    : { $match: {} };

  const repoAnalytics = await Review.aggregate([
    matchStage,
    {
      $group: {
        _id: '$repository',
        totalReviews: { $sum: 1 },
        avgOverallScore: { $avg: '$overallScore' },
        avgSecurityScore: { $avg: '$securityScore' },
        avgPerformanceScore: { $avg: '$performanceScore' },
        totalIssues: { $sum: { $size: { $ifNull: ['$issues', []] } } },
      },
    },
    {
      $lookup: {
        from: 'repositories',
        localField: '_id',
        foreignField: '_id',
        as: 'repositoryDetails',
      },
    },
    {
      $unwind: { path: '$repositoryDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        repositoryId: '$_id',
        repoName: '$repositoryDetails.repoName',
        fullName: '$repositoryDetails.fullName',
        owner: '$repositoryDetails.owner',
        language: '$repositoryDetails.language',
        totalReviews: 1,
        avgOverallScore: { $round: [{ $ifNull: ['$avgOverallScore', 0] }, 1] },
        avgSecurityScore: { $round: [{ $ifNull: ['$avgSecurityScore', 0] }, 1] },
        avgPerformanceScore: { $round: [{ $ifNull: ['$avgPerformanceScore', 0] }, 1] },
        totalIssues: 1,
        _id: 0,
      },
    },
    { $sort: { totalReviews: -1 } },
  ]);

  return repoAnalytics;
};

/**
 * Analytics metrics aggregated by developer/author.
 */
export const getDeveloperAnalytics = async () => {
  const developerStats = await PullRequest.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'pullRequest',
        as: 'review',
      },
    },
    {
      $unwind: { path: '$review', preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: '$author',
        totalPRs: { $sum: 1 },
        totalReviewedPRs: {
          $sum: { $cond: [{ $ifNull: ['$review', false] }, 1, 0] },
        },
        avgOverallScore: { $avg: '$review.overallScore' },
        avgSecurityScore: { $avg: '$review.securityScore' },
        totalIssuesFound: {
          $sum: { $size: { $ifNull: ['$review.issues', []] } },
        },
      },
    },
    {
      $project: {
        author: '$_id',
        totalPRs: 1,
        totalReviewedPRs: 1,
        avgOverallScore: { $round: [{ $ifNull: ['$avgOverallScore', 0] }, 1] },
        avgSecurityScore: { $round: [{ $ifNull: ['$avgSecurityScore', 0] }, 1] },
        totalIssuesFound: 1,
        _id: 0,
      },
    },
    { $sort: { totalPRs: -1 } },
  ]);

  return developerStats;
};

/**
 * Breakdown of issues by severity and top categories.
 */
export const getIssueAnalytics = async () => {
  const severityDistribution = await Review.aggregate([
    { $unwind: '$issues' },
    {
      $group: {
        _id: { $toLower: { $ifNull: ['$issues.severity', 'medium'] } },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        severity: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  const categoryDistribution = await Review.aggregate([
    { $unwind: '$issues' },
    {
      $group: {
        _id: { $ifNull: ['$issues.category', 'General'] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        category: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  return {
    severityDistribution,
    categoryDistribution,
  };
};

/**
 * Daily review score trends over a specified period.
 *
 * @param {number} [days=30] - Number of days to include in historical trends
 */
export const getTrendAnalytics = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const scoreTrends = await Review.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        reviewCount: { $sum: 1 },
        avgOverallScore: { $avg: '$overallScore' },
        avgSecurityScore: { $avg: '$securityScore' },
        avgPerformanceScore: { $avg: '$performanceScore' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        reviewCount: 1,
        avgOverallScore: { $round: [{ $ifNull: ['$avgOverallScore', 0] }, 1] },
        avgSecurityScore: { $round: [{ $ifNull: ['$avgSecurityScore', 0] }, 1] },
        avgPerformanceScore: { $round: [{ $ifNull: ['$avgPerformanceScore', 0] }, 1] },
        _id: 0,
      },
    },
  ]);

  return scoreTrends;
};

/**
 * Daily pull request submission and status trends over time.
 *
 * @param {number} [days=30] - Number of days to look back
 */
export const getPullRequestTrendAnalytics = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const prTrends = await PullRequest.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          status: { $ifNull: ['$status', 'Pending AI Review'] },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
    {
      $project: {
        date: '$_id.date',
        status: '$_id.status',
        count: 1,
        _id: 0,
      },
    },
  ]);

  return prTrends;
};

export default {
  getOverviewAnalytics,
  getRepositoryAnalytics,
  getDeveloperAnalytics,
  getIssueAnalytics,
  getTrendAnalytics,
  getPullRequestTrendAnalytics,
};

import { buildReviewPrompt } from '../services/ai/prompt.service.js';
import { generateReview as generateAiResponse } from '../services/ai/ai.service.js';
import { parseReviewResponse } from '../services/ai/parser.service.js';
import { Review } from '../models/review.model.js';
import { PullRequest } from '../models/pullRequest.model.js';
import { ChangedFile } from '../models/changedFile.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Generate AI Code Review for a Pull Request
 * @route POST /api/v1/reviews/generate
 */
export const generateReview = asyncHandler(async (req, res, next) => {
  const { pullRequestId, pullRequest: prIdParam, rules = [] } = req.body;
  const targetPrId = pullRequestId || prIdParam;

  if (!targetPrId) {
    throw new ApiError(400, 'pullRequestId is required to generate AI review');
  }

  // 1. Fetch Pull Request document from MongoDB
  let pullRequest = null;
  if (targetPrId && targetPrId.match(/^[0-9a-fA-F]{24}$/)) {
    pullRequest = await PullRequest.findById(targetPrId).populate('repository');
  }

  if (!pullRequest) {
    pullRequest = await PullRequest.findOne({
      $or: [{ githubPrId: String(targetPrId) }, { number: Number(targetPrId) }],
    }).populate('repository');
  }

  if (!pullRequest) {
    throw new ApiError(404, `Pull Request '${targetPrId}' not found`);
  }

  // 2. Fetch associated changed files
  const changedFiles = await ChangedFile.find({ pullRequest: pullRequest._id });

  // 3. Build detailed prompt using prompt.service
  const prompt = buildReviewPrompt(pullRequest, changedFiles, rules);

  // 4. Call OpenAI API using ai.service
  const rawAiResult = await generateAiResponse(prompt);

  // 5. Parse and validate AI output using parser.service
  const parsedReviewData = parseReviewResponse(rawAiResult);

  // 6. Save or update Review document in MongoDB
  const repositoryId = pullRequest.repository ? (pullRequest.repository._id || pullRequest.repository) : null;

  const reviewData = {
    pullRequest: pullRequest._id,
    repository: repositoryId,
    overallScore: parsedReviewData.overallScore,
    securityScore: parsedReviewData.securityScore,
    performanceScore: parsedReviewData.performanceScore,
    readabilityScore: parsedReviewData.readabilityScore,
    maintainabilityScore: parsedReviewData.maintainabilityScore,
    summary: parsedReviewData.summary,
    issues: parsedReviewData.issues,
    suggestions: parsedReviewData.suggestions,
  };

  const review = await Review.findOneAndUpdate(
    { pullRequest: pullRequest._id },
    reviewData,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Update PullRequest status based on review scores
  let newStatus = 'Passed Security Scan';
  if (parsedReviewData.overallScore < 70 || parsedReviewData.issues.some((i) => i.severity === 'critical' || i.severity === 'high')) {
    newStatus = 'Changes Requested';
  } else if (parsedReviewData.overallScore >= 85) {
    newStatus = 'Approved';
  }

  pullRequest.status = newStatus;
  await pullRequest.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { review, pullRequestStatus: newStatus }, 'AI Code Review generated successfully'));
});

/**
 * Get all AI code reviews
 * @route GET /api/v1/reviews
 */
export const getReviews = asyncHandler(async (req, res, next) => {
  const { pullRequest, repository, page, limit } = req.query;

  const filter = {};
  if (pullRequest) filter.pullRequest = pullRequest;
  if (repository) filter.repository = repository;

  const queryLimit = parseInt(limit, 10) || 20;
  const queryPage = parseInt(page, 10) || 1;
  const skip = (queryPage - 1) * queryLimit;

  const reviews = await Review.find(filter)
    .populate({
      path: 'pullRequest',
      select: 'githubPrId number title author sourceBranch targetBranch status state',
    })
    .populate({
      path: 'repository',
      select: 'repoName owner defaultBranch visibility',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(queryLimit);

  const total = await Review.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        pagination: {
          total,
          page: queryPage,
          limit: queryLimit,
          pages: Math.ceil(total / queryLimit),
        },
      },
      'Reviews retrieved successfully'
    )
  );
});

/**
 * Get AI review details by Review ID or Pull Request ID
 * @route GET /api/v1/reviews/:id
 */
export const getReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let review = null;
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    review = await Review.findById(id)
      .populate('pullRequest')
      .populate('repository');
  }

  if (!review) {
    review = await Review.findOne({ pullRequest: id })
      .populate('pullRequest')
      .populate('repository');
  }

  if (!review) {
    throw new ApiError(404, `Review for ID '${id}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, 'Review details retrieved successfully'));
});

export default {
  generateReview,
  getReviews,
  getReviewById,
};

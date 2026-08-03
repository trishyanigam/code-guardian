import * as commentService from '../services/github/comment.service.js';
import { buildMarkdownReview } from '../services/github/markdown.service.js';
import { GithubComment } from '../models/githubComment.model.js';
import { PullRequest } from '../models/pullRequest.model.js';
import { Review } from '../models/review.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Post AI Review Comment on GitHub Pull Request
 * @route POST /api/v1/github-comments/post
 */
export const postReviewComment = asyncHandler(async (req, res, next) => {
  let { owner, repo, pullNumber, body, pullRequestId, accessToken: bodyToken } = req.body;

  const accessToken =
    bodyToken ||
    req.headers['x-github-token'] ||
    req.query.accessToken ||
    process.env.GITHUB_TOKEN;

  // If pullRequestId is provided, attempt to auto-populate metadata and review markdown if missing
  let prDoc = null;
  if (pullRequestId) {
    if (pullRequestId.match(/^[0-9a-fA-F]{24}$/)) {
      prDoc = await PullRequest.findById(pullRequestId).populate('repository');
    }
    if (!prDoc) {
      prDoc = await PullRequest.findOne({
        $or: [{ githubPrId: String(pullRequestId) }, { number: Number(pullRequestId) }],
      }).populate('repository');
    }
  }

  if (prDoc) {
    if (!owner && prDoc.repository) owner = prDoc.repository.owner;
    if (!repo && prDoc.repository) repo = prDoc.repository.repoName;
    if (!pullNumber) pullNumber = prDoc.number;

    if (!body) {
      const reviewDoc = await Review.findOne({ pullRequest: prDoc._id });
      if (reviewDoc) {
        body = buildMarkdownReview(reviewDoc);
      }
    }
  }

  if (!owner || !repo || !pullNumber || !body) {
    throw new ApiError(400, 'owner, repo, pullNumber, and body (or valid pullRequestId with AI review) are required');
  }

  const repositoryId = prDoc?.repository?._id || null;

  const result = await commentService.postComment({
    owner,
    repo,
    pullNumber: Number(pullNumber),
    body,
    accessToken,
    pullRequestId: prDoc ? prDoc._id : pullRequestId,
    repositoryId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, result, 'GitHub review comment posted successfully'));
});

/**
 * Update an existing GitHub review comment
 * @route PUT /api/v1/github-comments/:id
 */
export const updateReviewComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.id || req.body.commentId || req.body.githubCommentId;
  const { owner, repo, body, accessToken: bodyToken } = req.body;

  const accessToken =
    bodyToken ||
    req.headers['x-github-token'] ||
    req.query.accessToken ||
    process.env.GITHUB_TOKEN;

  if (!commentId || !owner || !repo || !body) {
    throw new ApiError(400, 'commentId, owner, repo, and body are required to update GitHub comment');
  }

  const result = await commentService.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body,
    accessToken,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'GitHub review comment updated successfully'));
});

/**
 * Get stored GitHub review comment details
 * @route GET /api/v1/github-comments/:id
 */
export const getReviewComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let comment = null;
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    comment = await GithubComment.findById(id)
      .populate('pullRequest')
      .populate('repository');
  }

  if (!comment) {
    comment = await GithubComment.findOne({
      $or: [{ githubCommentId: String(id) }, { pullRequest: id }],
    })
      .populate('pullRequest')
      .populate('repository');
  }

  if (!comment) {
    throw new ApiError(404, `GitHub comment for ID '${id}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'GitHub comment details retrieved successfully'));
});

export default {
  postReviewComment,
  updateReviewComment,
  getReviewComment,
};

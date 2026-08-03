import * as ruleService from '../services/rule.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Create a new AI coding rule
 * @route POST /api/v1/rules
 */
export const createRule = asyncHandler(async (req, res, next) => {
  const { organization, title, description, category, severity, enabled, exampleGood, exampleBad } = req.body;

  if (!organization || !title || !description) {
    throw new ApiError(400, 'organization, title, and description are required fields');
  }

  const rule = await ruleService.createRule({
    organization,
    title,
    description,
    category,
    severity,
    enabled,
    exampleGood,
    exampleBad,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, rule, 'Coding rule created successfully'));
});

/**
 * Get all AI coding rules with optional filters
 * @route GET /api/v1/rules
 */
export const getRules = asyncHandler(async (req, res, next) => {
  const filter = {
    organization: req.query.organization || req.query.orgId,
    category: req.query.category,
    severity: req.query.severity,
    enabled: req.query.enabled,
    search: req.query.search,
  };

  const rules = await ruleService.getRules(filter);

  return res
    .status(200)
    .json(new ApiResponse(200, rules, 'Coding rules retrieved successfully'));
});

/**
 * Get single coding rule by ID
 * @route GET /api/v1/rules/:id
 */
export const getRuleById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const rules = await ruleService.getRules({});
  const rule = rules.find((r) => String(r._id) === String(id));

  if (!rule) {
    throw new ApiError(404, `Coding rule with ID '${id}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, rule, 'Coding rule details retrieved successfully'));
});

/**
 * Update an existing coding rule
 * @route PUT /api/v1/rules/:id
 */
export const updateRule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const rule = await ruleService.updateRule(id, updateData);

  return res
    .status(200)
    .json(new ApiResponse(200, rule, 'Coding rule updated successfully'));
});

/**
 * Toggle active status (enabled/disabled) of a coding rule
 * @route PATCH /api/v1/rules/:id/toggle
 */
export const toggleRule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const rule = await ruleService.toggleRule(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rule,
        `Coding rule '${rule.title}' has been ${rule.enabled ? 'enabled' : 'disabled'}`
      )
    );
});

/**
 * Delete a coding rule
 * @route DELETE /api/v1/rules/:id
 */
export const deleteRule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedRule = await ruleService.deleteRule(id);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedRule, 'Coding rule deleted successfully'));
});

export default {
  createRule,
  getRules,
  getRuleById,
  updateRule,
  toggleRule,
  deleteRule,
};

import { CodingRule } from '../models/codingRule.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Create a new custom AI coding rule for an organization.
 *
 * @param {Object} ruleData - { organization, title, description, category, severity, enabled, exampleGood, exampleBad }
 * @returns {Promise<Object>} Created CodingRule document
 */
export const createRule = async (ruleData = {}) => {
  const { organization, title, description, category, severity, enabled, exampleGood, exampleBad } = ruleData;

  if (!organization || !title || !description) {
    throw new ApiError(400, 'Organization ID, rule title, and description are required');
  }

  const rule = await CodingRule.create({
    organization,
    title,
    description,
    category: category || 'General',
    severity: severity || 'medium',
    enabled: enabled !== undefined ? enabled : true,
    exampleGood: exampleGood || '',
    exampleBad: exampleBad || '',
  });

  return rule;
};

/**
 * Update an existing coding rule.
 *
 * @param {string} ruleId - ObjectId of the CodingRule
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated CodingRule document
 */
export const updateRule = async (ruleId, updateData = {}) => {
  if (!ruleId) {
    throw new ApiError(400, 'Rule ID is required for update');
  }

  const rule = await CodingRule.findById(ruleId);
  if (!rule) {
    throw new ApiError(404, `Coding rule with ID '${ruleId}' not found`);
  }

  Object.assign(rule, updateData);
  await rule.save();

  return rule;
};

/**
 * Delete a coding rule by ID.
 *
 * @param {string} ruleId - ObjectId of the CodingRule
 * @returns {Promise<Object>} Deleted CodingRule document
 */
export const deleteRule = async (ruleId) => {
  if (!ruleId) {
    throw new ApiError(400, 'Rule ID is required for deletion');
  }

  const rule = await CodingRule.findByIdAndDelete(ruleId);
  if (!rule) {
    throw new ApiError(404, `Coding rule with ID '${ruleId}' not found`);
  }

  return rule;
};

/**
 * Toggle active status (enabled/disabled) of a coding rule.
 *
 * @param {string} ruleId - ObjectId of the CodingRule
 * @returns {Promise<Object>} Updated CodingRule document
 */
export const toggleRule = async (ruleId) => {
  if (!ruleId) {
    throw new ApiError(400, 'Rule ID is required to toggle status');
  }

  const rule = await CodingRule.findById(ruleId);
  if (!rule) {
    throw new ApiError(404, `Coding rule with ID '${ruleId}' not found`);
  }

  rule.enabled = !rule.enabled;
  await rule.save();

  return rule;
};

/**
 * Get list of coding rules matching filter criteria.
 *
 * @param {Object} [filter] - { organization, category, severity, enabled, search }
 * @returns {Promise<Array>} List of matching CodingRule documents
 */
export const getRules = async (filter = {}) => {
  const query = {};

  if (filter.organization) {
    query.organization = filter.organization;
  }
  if (filter.category && filter.category !== 'all') {
    query.category = filter.category;
  }
  if (filter.severity && filter.severity !== 'all') {
    query.severity = filter.severity;
  }
  if (filter.enabled !== undefined && filter.enabled !== 'all') {
    query.enabled = filter.enabled === true || filter.enabled === 'true';
  }
  if (filter.search) {
    query.$or = [
      { title: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } },
    ];
  }

  const rules = await CodingRule.find(query)
    .populate('organization', 'name owner')
    .sort({ createdAt: -1 });

  return rules;
};

export default {
  createRule,
  updateRule,
  deleteRule,
  toggleRule,
  getRules,
};

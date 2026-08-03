import { ApiError } from '../../utils/ApiError.js';

/**
 * Parse and validate raw AI JSON response into a normalized Review object.
 *
 * @param {string|Object} rawResponse - Raw JSON string from AI or parsed object
 * @returns {Object} Validated and structured review payload
 * @throws {ApiError} Throws ApiError if JSON is invalid or fails structure validation
 */
export const parseReviewResponse = (rawResponse) => {
  if (!rawResponse) {
    throw new ApiError(400, 'AI response payload is empty');
  }

  let parsedObj = null;

  if (typeof rawResponse === 'object' && rawResponse !== null) {
    parsedObj = rawResponse;
  } else if (typeof rawResponse === 'string') {
    let cleanText = rawResponse.trim();
    // Strip markdown codeblock backticks if present
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }

    try {
      parsedObj = JSON.parse(cleanText);
    } catch (parseError) {
      throw new ApiError(
        422,
        `Invalid AI response format: Failed to parse JSON - ${parseError.message}`
      );
    }
  } else {
    throw new ApiError(422, 'Invalid AI response type. Expected JSON string or object');
  }

  if (typeof parsedObj !== 'object' || parsedObj === null) {
    throw new ApiError(422, 'Parsed AI response is not a valid JSON object');
  }

  // Helper score sanitizer (ensures integer/number 0-100)
  const sanitizeScore = (val) => {
    const num = Number(val);
    if (isNaN(num)) return 0;
    return Math.min(Math.max(Math.round(num), 0), 100);
  };

  const overallScore = sanitizeScore(parsedObj.overallScore ?? parsedObj.score);
  const securityScore = sanitizeScore(parsedObj.securityScore ?? overallScore);
  const performanceScore = sanitizeScore(parsedObj.performanceScore ?? overallScore);
  const readabilityScore = sanitizeScore(parsedObj.readabilityScore ?? overallScore);
  const maintainabilityScore = sanitizeScore(parsedObj.maintainabilityScore ?? overallScore);

  const summary =
    typeof parsedObj.summary === 'string'
      ? parsedObj.summary
      : typeof parsedObj.overview === 'string'
      ? parsedObj.overview
      : 'Code review analysis completed.';

  const rawIssues = Array.isArray(parsedObj.issues) ? parsedObj.issues : [];
  const issues = rawIssues.map((issue, index) => ({
    filename: String(issue.filename || issue.file || issue.path || 'unknown'),
    line: Number(issue.line || issue.lineNumber || 1),
    severity: String(issue.severity || 'medium').toLowerCase(),
    title: String(issue.title || issue.message || `Issue #${index + 1}`),
    description: String(issue.description || issue.details || issue.message || ''),
    suggestion: String(issue.suggestion || issue.recommendation || ''),
  }));

  const rawSuggestions = Array.isArray(parsedObj.suggestions)
    ? parsedObj.suggestions
    : Array.isArray(parsedObj.recommendations)
    ? parsedObj.recommendations
    : [];

  const suggestions = rawSuggestions.map((item) => ({
    filename: String(item.filename || item.file || ''),
    suggestion: String(item.suggestion || item.description || item.text || ''),
    patch: String(item.patch || item.codeSnippet || item.code || ''),
  }));

  return {
    overallScore,
    securityScore,
    performanceScore,
    readabilityScore,
    maintainabilityScore,
    summary,
    issues,
    suggestions,
  };
};

export default {
  parseReviewResponse,
};

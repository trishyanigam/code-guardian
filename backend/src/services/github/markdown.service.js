/**
 * Formats an AI Review JSON object into a GitHub Flavored Markdown review comment.
 *
 * @param {Object} reviewData - AI Review JSON object or document
 * @returns {string} Formatted GitHub Markdown string
 */
export const buildMarkdownReview = (reviewData = {}) => {
  const overall = reviewData.overallScore !== undefined ? Number(reviewData.overallScore) : 0;
  const security = reviewData.securityScore !== undefined ? Number(reviewData.securityScore) : overall;
  const performance = reviewData.performanceScore !== undefined ? Number(reviewData.performanceScore) : overall;
  const readability = reviewData.readabilityScore !== undefined ? Number(reviewData.readabilityScore) : overall;
  const maintainability = reviewData.maintainabilityScore !== undefined ? Number(reviewData.maintainabilityScore) : overall;

  const summary = reviewData.summary || 'AI code review completed.';
  const issues = Array.isArray(reviewData.issues) ? reviewData.issues : [];
  const suggestions = Array.isArray(reviewData.suggestions) ? reviewData.suggestions : [];

  const getStatusBadge = (score) => {
    if (score >= 90) return '🟢 Excellent';
    if (score >= 75) return '🟢 Good';
    if (score >= 60) return '🟡 Needs Improvement';
    return '🔴 Critical Attention';
  };

  const getSeverityEmoji = (sev = '') => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return '🚨 **[CRITICAL]**';
      case 'high':
        return '🔴 **[HIGH]**';
      case 'medium':
        return '🟠 **[MEDIUM]**';
      case 'low':
        return '🟡 **[LOW]**';
      default:
        return 'ℹ️ **[INFO]**';
    }
  };

  // Build Markdown table for scores (Includes Overall, Security, Performance, Readability)
  const scoreTable = `### 📊 Audit Scores
| Metric | Score | Status |
| :--- | :--- | :--- |
| 🛡️ **Overall Score** | **${overall} / 100** | ${getStatusBadge(overall)} |
| 🔒 **Security** | **${security} / 100** | ${getStatusBadge(security)} |
| ⚡ **Performance** | **${performance} / 100** | ${getStatusBadge(performance)} |
| 📖 **Readability** | **${readability} / 100** | ${getStatusBadge(readability)} |
| 🔧 **Maintainability** | **${maintainability} / 100** | ${getStatusBadge(maintainability)} |`;

  // Build Issues section
  let issuesSection = '';
  if (issues.length > 0) {
    const issuesList = issues
      .map((item, idx) => {
        const severityTag = getSeverityEmoji(item.severity);
        const title = item.title || item.message || `Issue #${idx + 1}`;
        const fileLoc = item.filename ? `\`${item.filename}\`${item.line ? ` (Line ${item.line})` : ''}` : 'General';
        const desc = item.description || item.message || '';
        const rec = item.suggestion ? `\n> **Recommendation:** ${item.suggestion}` : '';

        return `#### ${idx + 1}. ${severityTag} ${title}\n- **File:** ${fileLoc}\n- **Details:** ${desc}${rec}`;
      })
      .join('\n\n');

    issuesSection = `\n\n---\n\n### ⚠️ Detected Issues & Vulnerabilities\n${issuesList}`;
  } else {
    issuesSection = '\n\n---\n\n### ⚠️ Detected Issues & Vulnerabilities\n✅ No security vulnerabilities or critical code issues detected!';
  }

  // Build Suggestions section
  let suggestionsSection = '';
  if (suggestions.length > 0) {
    const sugList = suggestions
      .map((item, idx) => {
        const file = item.filename ? `\`${item.filename}\`` : 'General';
        const title = item.title ? `**${item.title}**\n` : '';
        const sugText = item.suggestion || item.description || '';
        const patchSnippet = item.patch || item.codeSnippet ? `\n\`\`\`javascript\n${item.patch || item.codeSnippet}\n\`\`\`` : '';

        return `#### ${idx + 1}. ${file}\n${title}${sugText}${patchSnippet}`;
      })
      .join('\n\n');

    suggestionsSection = `\n\n---\n\n### 💡 Refactoring & Code Suggestions\n${sugList}`;
  }

  // Footer
  const footer = `\n\n---\n\n> 🛡️ *Audited automatically by **[Code Guardian AI](https://github.com/trishyanigam/code-guardian)** — Real-time AI Code Security & PR Review Engine.*`;

  const fullMarkdown = `# 🛡️ Code Guardian AI - Security & Code Quality Audit

${scoreTable}

---

### 📝 Executive Summary
${summary}${issuesSection}${suggestionsSection}${footer}`;

  return fullMarkdown;
};

export default {
  buildMarkdownReview,
};

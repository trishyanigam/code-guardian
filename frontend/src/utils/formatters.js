/**
 * Helper utility functions for formatting text, numbers, and badge styles.
 */

export const formatSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'low':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    default:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

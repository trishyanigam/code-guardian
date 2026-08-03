import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    pullRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PullRequest',
      required: true,
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    securityScore: {
      type: Number,
      default: 0,
    },
    performanceScore: {
      type: Number,
      default: 0,
    },
    readabilityScore: {
      type: Number,
      default: 0,
    },
    maintainabilityScore: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: '',
    },
    issues: [
      {
        filename: { type: String },
        line: { type: Number },
        severity: { type: String },
        title: { type: String },
        description: { type: String },
        suggestion: { type: String },
      },
    ],
    suggestions: [
      {
        filename: { type: String },
        suggestion: { type: String },
        patch: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model('Review', reviewSchema);
export default Review;

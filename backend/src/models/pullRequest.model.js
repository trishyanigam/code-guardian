import mongoose from 'mongoose';

const pullRequestSchema = new mongoose.Schema(
  {
    githubPrId: {
      type: String,
      required: true,
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    sourceBranch: {
      type: String,
      required: true,
    },
    targetBranch: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: 'open',
    },
    status: {
      type: String,
      default: 'Pending AI Review',
    },
  },
  {
    timestamps: true,
  }
);

export const PullRequest = mongoose.model('PullRequest', pullRequestSchema);
export default PullRequest;

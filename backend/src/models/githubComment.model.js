import mongoose from 'mongoose';

const githubCommentSchema = new mongoose.Schema(
  {
    pullRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PullRequest',
      required: true,
    },
    githubCommentId: {
      type: String,
      required: true,
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
    },
    commentUrl: {
      type: String,
      default: '',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'created',
    },
  },
  {
    timestamps: true,
  }
);

export const GithubComment = mongoose.model('GithubComment', githubCommentSchema);
export default GithubComment;

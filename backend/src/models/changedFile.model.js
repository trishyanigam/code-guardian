import mongoose from 'mongoose';

const changedFileSchema = new mongoose.Schema(
  {
    pullRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PullRequest',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    additions: {
      type: Number,
      default: 0,
    },
    deletions: {
      type: Number,
      default: 0,
    },
    changes: {
      type: Number,
      default: 0,
    },
    patch: {
      type: String,
    },
    rawUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ChangedFile = mongoose.model('ChangedFile', changedFileSchema);
export default ChangedFile;

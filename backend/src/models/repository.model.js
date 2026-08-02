import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
  {
    githubRepoId: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    visibility: {
      type: String,
    },
    language: {
      type: String,
    },
    defaultBranch: {
      type: String,
    },
    cloneUrl: {
      type: String,
    },
    htmlUrl: {
      type: String,
    },
    connected: {
      type: Boolean,
      default: false,
    },
    connectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    connectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Repository = mongoose.model('Repository', repositorySchema);
export default Repository;

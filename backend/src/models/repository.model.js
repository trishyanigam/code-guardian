import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: [true, 'Repository owner is required'],
      trim: true,
    },
    repoName: {
      type: String,
      required: [true, 'Repository name is required'],
      trim: true,
    },
    githubRepoId: {
      type: String,
      required: [true, 'GitHub repository ID is required'],
      unique: true,
      trim: true,
    },
    defaultBranch: {
      type: String,
      default: 'main',
      trim: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    language: {
      type: String,
      default: 'JavaScript',
      trim: true,
    },
    connectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Connected user reference is required'],
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Repository = mongoose.model('Repository', repositorySchema);
export default Repository;

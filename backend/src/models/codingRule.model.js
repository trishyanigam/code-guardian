import mongoose from 'mongoose';

const codingRuleSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Security', 'Performance', 'Readability', 'Maintainability', 'Style', 'Documentation', 'General'],
      default: 'General',
    },
    severity: {
      type: String,
      required: true,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      default: 'medium',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    exampleGood: {
      type: String,
      default: '',
    },
    exampleBad: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const CodingRule = mongoose.model('CodingRule', codingRuleSchema);
export default CodingRule;

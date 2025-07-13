import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  industry: string;
  jobFunction: string;
  challenges?: string;
  companySize: string;
  aiExperience: string;
  summary: string;
  recommendations: Array<{
    title: string;
    description: string;
    expectedEffect: string;
    difficulty: string;
    timeframe: string;
  }>;
  implementation: string;
  html: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const ReportSchema: Schema = new Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  industry: {
    type: String,
    required: true
  },
  jobFunction: {
    type: String,
    required: true
  },
  challenges: {
    type: String
  },
  companySize: {
    type: String,
    required: true
  },
  aiExperience: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  recommendations: [{
    title: String,
    description: String,
    expectedEffect: String,
    difficulty: String,
    timeframe: String
  }],
  implementation: {
    type: String,
    required: true
  },
  html: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
    index: { expireAfterSeconds: 0 } // TTLインデックス
  }
}, {
  timestamps: true
});

// インデックス
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ industry: 1, jobFunction: 1 });

export default mongoose.model<IReport>('Report', ReportSchema);
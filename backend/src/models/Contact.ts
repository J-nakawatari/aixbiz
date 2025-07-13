import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  companyName: string;
  contactName: string;
  email: string;
  phoneNumber?: string;
  industry: string;
  employeeCount: string;
  challenges: string[];
  message?: string;
  status: 'unread' | 'read' | 'responded';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  contactName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, '有効なメールアドレスを入力してください']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[\d-+()]+$/, '有効な電話番号を入力してください']
  },
  industry: {
    type: String,
    required: true,
    enum: ['製造業', '士業', '飲食業', '不動産', '小売業', 'IT・Web', 'その他']
  },
  employeeCount: {
    type: String,
    required: true,
    enum: ['1-10名', '11-20名', '21-50名', '51-100名', '101名以上']
  },
  challenges: [{
    type: String,
    trim: true
  }],
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// インデックス
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });

export default mongoose.model<IContact>('Contact', ContactSchema);
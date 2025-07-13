import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ainavigator',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-here',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  // 開発者IPアドレス（レート制限を回避）
  developerIps: process.env.DEVELOPER_IPS ? process.env.DEVELOPER_IPS.split(',') : []
};
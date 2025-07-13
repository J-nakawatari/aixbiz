import mongoose from 'mongoose';
import Admin from '../models/Admin';
import dotenv from 'dotenv';

// 環境変数読み込み
dotenv.config();

const setupSuperAdmin = async () => {
  try {
    // MongoDB接続
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aixbiz';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // 既存のスーパー管理者をチェック
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('スーパー管理者は既に存在します');
      console.log(`Email: ${existingSuperAdmin.email}`);
      process.exit(0);
    }

    // スーパー管理者を作成
    const superAdmin = new Admin({
      username: 'superadmin',
      email: 'admin@aixbiz.jp',
      password: 'admin123456', // 本番環境では変更してください
      role: 'super_admin'
    });

    await superAdmin.save();
    console.log('スーパー管理者を作成しました:');
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Password: admin123456`);
    console.log('⚠️ パスワードを必ず変更してください');

  } catch (error) {
    console.error('セットアップエラー:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setupSuperAdmin();
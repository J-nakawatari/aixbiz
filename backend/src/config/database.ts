import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aixbiz';
    
    await mongoose.connect(mongoUri, {
      // Mongoose 6+ では以下のオプションは不要（デフォルトで有効）
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
    
    // 接続イベントの監視
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // グレースフルシャットダウン
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
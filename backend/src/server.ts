import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
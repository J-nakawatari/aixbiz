import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/reportRoutes';
import { config } from './config/config';
import { configureSecurityMiddleware } from './config/security';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { monitoringMiddleware } from './middlewares/monitoring';
import { monitoringService } from './services/monitoringService';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

// trust proxy設定（Nginxの背後で動作）
app.set('trust proxy', 1);

// 監視ミドルウェア
app.use(monitoringMiddleware);

// セキュリティミドルウェアの設定
configureSecurityMiddleware(app);

// グローバルレート制限
app.use(globalRateLimiter);

// リクエストサイズ制限
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// CORS設定
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 統計情報エンドポイント（開発者のみ）
app.get('/api/stats', (req, res) => {
  const clientIp = req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0] || '';
  const isDeveloper = config.developerIps.includes(clientIp) || 
                      config.developerIps.includes(clientIp.replace('::ffff:', ''));
  
  if (!isDeveloper && process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(monitoringService.getStats());
});

// APIルート
app.use('/api/report', reportRoutes);

// 404ハンドリング
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 本番環境では詳細なエラー情報を隠す
  if (process.env.NODE_ENV === 'production') {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
      error: 'Internal Server Error',
      message: err.message || 'Something went wrong'
    });
  } else {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
      error: err.name || 'Internal Server Error',
      message: err.message,
      stack: err.stack
    });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
import { Router } from 'express';
import { generateReport } from '../controllers/reportController';
import { validateReportRequest } from '../validators/reportValidator';
import { strictRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// レポート生成エンドポイント
// 厳格なレート制限: 15分間に10回まで（本番）または50回まで（開発）
router.post(
  '/generate',
  strictRateLimiter,
  validateReportRequest,
  generateReport
);

export default router;
import { Router } from 'express';
import { generateReport } from '../controllers/reportController';
import { validateReportRequest } from '../validators/reportValidator';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// レポート生成エンドポイント
// レート制限: 1IPあたり1分間に5回まで
router.post(
  '/generate',
  rateLimiter(5, 1), // 5 requests per 1 minute
  validateReportRequest,
  generateReport
);

export default router;
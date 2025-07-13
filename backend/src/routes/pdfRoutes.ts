import express from 'express';
import { generateReportPDF, pdfRateLimiter } from '../controllers/pdfController';
import { globalRateLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

// PDF生成エンドポイント
router.post(
  '/generate-pdf',
  globalRateLimiter,
  pdfRateLimiter,
  generateReportPDF
);

export default router;
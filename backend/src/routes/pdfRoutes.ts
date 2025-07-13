import express from 'express';
import { generateReportPDF, pdfRateLimiter } from '../controllers/pdfController';
import { generateDownloadToken, downloadPDFWithToken } from '../controllers/pdfDownloadController';
import { globalRateLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

// PDF生成エンドポイント
router.post(
  '/generate-pdf',
  globalRateLimiter,
  pdfRateLimiter,
  generateReportPDF
);

// PDFダウンロード用トークン発行（CSRF保護あり）
router.post(
  '/download-token',
  globalRateLimiter,
  generateDownloadToken
);

// トークンベースのPDFダウンロード（CSRF保護不要）
router.get(
  '/download/:reportId',
  downloadPDFWithToken
);

export default router;
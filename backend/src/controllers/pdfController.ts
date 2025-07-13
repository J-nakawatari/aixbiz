import { Request, Response } from 'express';
import { generatePDF } from '../services/pdfService';
import { getReport } from '../services/reportStorage';
import rateLimit from 'express-rate-limit';

// PDF生成用のレート制限（より厳格）
export const pdfRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 15分間に5回まで
  message: 'PDF生成の制限に達しました。しばらくしてから再度お試しください。',
  standardHeaders: true,
  legacyHeaders: false,
});

export const generateReportPDF = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.body;
    
    // バリデーション
    if (!reportId || typeof reportId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'レポートIDが必要です'
      });
    }
    
    // 保存されたレポートを取得
    const storedReport = await getReport(reportId);
    if (!storedReport) {
      return res.status(404).json({
        success: false,
        error: 'レポートが見つかりません。有効期限が切れた可能性があります。'
      });
    }
    
    // PDF生成
    const pdfBuffer = await generatePDF({
      html: storedReport.html,
      reportId
    });
    
    // レスポンスヘッダー設定
    const filename = `ai-report-${reportId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    
    // セキュリティヘッダー
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    // PDFを送信
    res.send(pdfBuffer);
    
  } catch (error: any) {
    console.error('PDF generation controller error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'PDF生成中にエラーが発生しました'
    });
  }
};
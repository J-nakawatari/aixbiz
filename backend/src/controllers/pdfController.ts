import { Request, Response } from 'express';
import { generatePDF } from '../services/pdfService';
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
    const { html, reportId } = req.body;
    
    // バリデーション
    if (!html || typeof html !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'HTMLデータが必要です'
      });
    }
    
    if (!reportId || typeof reportId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'レポートIDが必要です'
      });
    }
    
    // HTMLサイズ制限（5MB）
    const htmlSize = Buffer.byteLength(html, 'utf8');
    if (htmlSize > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'HTMLデータが大きすぎます'
      });
    }
    
    // PDF生成
    const pdfBuffer = await generatePDF({
      html,
      reportId
    });
    
    // レスポンスヘッダー設定
    const filename = `ai-report-${reportId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
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
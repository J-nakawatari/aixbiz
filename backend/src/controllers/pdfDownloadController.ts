import { Request, Response } from 'express';
import crypto from 'crypto';
import { getReport } from '../services/reportStorage';
import { generatePDF } from '../services/pdfService';

// メモリ内トークンストア（本番環境ではRedisを使用すべき）
const downloadTokens = new Map<string, { reportId: string; expires: number }>();

// トークンクリーンアップ（期限切れトークンを削除）
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of downloadTokens.entries()) {
    if (data.expires < now) {
      downloadTokens.delete(token);
    }
  }
}, 60000); // 1分ごと

// PDFダウンロード用の一時トークンを発行
export const generateDownloadToken = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.body;
    
    if (!reportId || typeof reportId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'レポートIDが必要です'
      });
    }
    
    // レポートの存在確認
    const report = await getReport(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'レポートが見つかりません'
      });
    }
    
    // 一時トークンを生成（5分間有効）
    const token = crypto.randomBytes(32).toString('hex');
    downloadTokens.set(token, {
      reportId,
      expires: Date.now() + 5 * 60 * 1000
    });
    
    res.json({
      success: true,
      token
    });
    
  } catch (error) {
    console.error('Download token generation error:', error);
    res.status(500).json({
      success: false,
      error: 'トークン生成中にエラーが発生しました'
    });
  }
};

// トークンを使用したPDFダウンロード（CSRF保護不要）
export const downloadPDFWithToken = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'トークンが必要です'
      });
    }
    
    // トークンの検証
    const tokenData = downloadTokens.get(token);
    if (!tokenData || tokenData.reportId !== reportId || tokenData.expires < Date.now()) {
      return res.status(403).json({
        success: false,
        error: '無効または期限切れのトークンです'
      });
    }
    
    // トークンを使用済みにする（ワンタイム使用）
    downloadTokens.delete(token);
    
    // レポートを取得
    const report = await getReport(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'レポートが見つかりません'
      });
    }
    
    // PDF生成
    const pdfBuffer = await generatePDF({
      html: report.html,
      reportId
    });
    
    // レスポンスヘッダー設定
    const filename = `ai-report-${reportId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    // PDFを送信
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({
      success: false,
      error: 'PDFダウンロード中にエラーが発生しました'
    });
  }
};
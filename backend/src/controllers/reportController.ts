import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateAIReport } from '../services/openaiService';
import { generateHTMLReport } from '../services/reportService';
import { storeReport } from '../services/reportStorage';

export const generateReport = async (req: Request, res: Response) => {
  try {
    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { industry, jobFunction, challenges, companySize, aiExperience } = req.body;

    // OpenAI APIを使用してレポートを生成
    const reportData = await generateAIReport({
      industry,
      jobFunction,
      challenges,
      companySize,
      aiExperience
    });

    // HTMLレポートを生成
    const htmlReport = generateHTMLReport(reportData);

    // レポートを保存（非同期だがawaitしない）
    storeReport(reportData.reportId, reportData, htmlReport).catch(err => {
      console.error('Failed to store report:', err);
    });

    // レスポンスとして返す
    res.json({
      success: true,
      data: reportData,
      html: htmlReport
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      error: 'レポート生成中にエラーが発生しました'
    });
  }
};
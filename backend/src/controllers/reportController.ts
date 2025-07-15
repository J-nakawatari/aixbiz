import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateAIReport } from '../services/openaiService';
import { generateHTMLReport } from '../services/reportService';
import { storeReport } from '../services/reportStorage';

export const generateReport = async (req: Request, res: Response) => {
  const startTime = Date.now();
  console.log('Report generation started');
  
  try {
    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { industry, jobFunction, challenges, companySize, aiExperience } = req.body;

    // OpenAI APIを使用してレポートを生成
    console.log('Calling OpenAI API...');
    const apiStartTime = Date.now();
    const reportData = await generateAIReport({
      industry,
      jobFunction,
      challenges,
      companySize,
      aiExperience
    });
    console.log(`OpenAI API took: ${Date.now() - apiStartTime}ms`);

    // HTMLレポートを生成
    const htmlStartTime = Date.now();
    const htmlReport = generateHTMLReport(reportData);
    console.log(`HTML generation took: ${Date.now() - htmlStartTime}ms`);

    // レポートを保存（非同期だがawaitしない）
    storeReport(reportData.reportId, reportData, htmlReport).catch(err => {
      console.error('Failed to store report:', err);
    });

    // レスポンスとして返す
    const totalTime = Date.now() - startTime;
    console.log(`Total report generation time: ${totalTime}ms`);
    
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
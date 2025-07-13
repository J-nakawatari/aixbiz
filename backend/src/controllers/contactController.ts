import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const submitContact = async (req: Request, res: Response) => {
  try {
    // バリデーションエラーチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      companyName,
      contactName,
      email,
      industry,
      employeeCount,
      challenges
    } = req.body;

    // ここで通常はデータベースに保存したり、メール送信したりします
    // 今回は開発中なのでログ出力のみ
    console.log('Contact form submission:', {
      companyName,
      contactName,
      email,
      industry,
      employeeCount,
      challenges,
      submittedAt: new Date().toISOString()
    });

    // TODO: 実際の実装では以下を行う
    // 1. MongoDBに保存
    // 2. 管理者へメール通知
    // 3. 自動返信メール送信

    res.json({
      success: true,
      message: 'お申し込みありがとうございます。後日担当者よりご連絡いたします。'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'エラーが発生しました。しばらくしてから再度お試しください。'
    });
  }
};
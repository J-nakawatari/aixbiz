import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Contact from '../models/Contact';
import { EmailService } from '../services/emailService';

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
      phoneNumber,
      industry,
      employeeCount,
      challenges,
      otherChallenge,
      message
    } = req.body;

    // IPアドレスとユーザーエージェントを取得
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // データベースに保存
    const contact = new Contact({
      companyName,
      contactName,
      email,
      phoneNumber,
      industry,
      employeeCount,
      challenges,
      otherChallenge,
      message,
      ipAddress,
      userAgent
    });

    await contact.save();

    console.log('Contact saved to database:', {
      id: contact._id,
      email: contact.email,
      companyName: contact.companyName
    });

    // メール送信（非同期で実行し、エラーがあっても処理は続行）
    Promise.all([
      EmailService.sendContactConfirmation(contact),
      EmailService.sendAdminNotification(contact)
    ]).catch(error => {
      console.error('Email sending error:', error);
    });

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
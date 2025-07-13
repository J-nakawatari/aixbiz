import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { featureFlags, isFeatureEnabled } from '../config/features';

// CSRF設定
const CSRF_CONFIG = {
  // 除外パス（段階的導入のため）
  excludePaths: [
    '/api/pdf/download',    // GETリクエストなので除外
    '/api/pdf/generate-pdf', // PDFダウンロード関連
    '/health',              // ヘルスチェック
    '/api/stats'            // 統計情報
  ],
  // CSRF保護を無効化するフラグ（機能フラグ）
  enabled: isFeatureEnabled('enableCSRF'),
  // 開発環境では警告のみ
  enforceInDev: false,
  // トークン長
  tokenLength: 32,
  // クッキー設定
  cookieOptions: {
    httpOnly: false, // JSから読み取り可能にする必要あり
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000 // 24時間
  }
};

// CSRFトークン生成
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(CSRF_CONFIG.tokenLength).toString('hex');
};

// CSRFミドルウェア
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // CSRF保護が無効の場合はスキップ
  if (!CSRF_CONFIG.enabled) {
    return next();
  }

  // 除外パスの場合はスキップ
  if (CSRF_CONFIG.excludePaths.some(path => req.path.includes(path))) {
    return next();
  }

  // GETリクエストはスキップ（読み取り専用）
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  // CSRFトークンの検証
  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'] as string;

  // トークンが存在しない場合
  if (!cookieToken || !headerToken) {
    const message = 'CSRF token missing';
    
    // 開発環境で強制しない場合は警告のみ
    if (process.env.NODE_ENV === 'development' && !CSRF_CONFIG.enforceInDev) {
      console.warn(`[CSRF Warning] ${message} - Path: ${req.path}`);
      return next();
    }
    
    return res.status(403).json({ 
      error: 'Forbidden',
      message: message
    });
  }

  // トークンが一致しない場合
  if (cookieToken !== headerToken) {
    const message = 'CSRF token mismatch';
    
    // 開発環境で強制しない場合は警告のみ
    if (process.env.NODE_ENV === 'development' && !CSRF_CONFIG.enforceInDev) {
      console.warn(`[CSRF Warning] ${message} - Path: ${req.path}`);
      return next();
    }
    
    return res.status(403).json({ 
      error: 'Forbidden',
      message: message
    });
  }

  // 検証成功
  next();
};

// CSRFトークン初期化エンドポイント
export const initCSRFToken = (req: Request, res: Response) => {
  const token = generateCSRFToken();
  
  res.cookie('csrf-token', token, CSRF_CONFIG.cookieOptions);
  res.json({ token });
};
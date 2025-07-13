import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// IPアドレスを取得するヘルパー関数
const getClientIp = (req: any): string => {
  return req.ip || 
         req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] ||
         req.socket.remoteAddress || 
         '';
};

// 開発者IPかどうかをチェック
const isDeveloperIp = (ip: string): boolean => {
  return config.developerIps.includes(ip) || 
         config.developerIps.includes(ip.replace('::ffff:', '')); // IPv4 mapped IPv6対応
};

export const rateLimiter = (maxRequests: number, windowMinutes: number) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000, // 分をミリ秒に変換
    max: maxRequests,
    message: `リクエスト制限を超えました。${windowMinutes}分後に再度お試しください。`,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getClientIp,
    skip: (req) => {
      const clientIp = getClientIp(req);
      // 開発者IPまたはヘルスチェックはスキップ
      return isDeveloperIp(clientIp) || 
             (req.path === '/health' && process.env.NODE_ENV === 'production');
    }
  });
};

// グローバルレート制限（全体的なDDoS対策）
export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1分
  max: 100, // 1分あたり100リクエストまで
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  skip: (req) => isDeveloperIp(getClientIp(req)),
});

// 厳格なレート制限（レポート生成用）
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: process.env.NODE_ENV === 'production' ? 10 : 50, // 本番は10回、開発は50回
  message: 'レポート生成の制限に達しました。15分後に再度お試しください。',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // 成功したリクエストもカウント
  keyGenerator: getClientIp,
  skip: (req) => isDeveloperIp(getClientIp(req)),
});
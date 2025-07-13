import rateLimit from 'express-rate-limit';

export const rateLimiter = (maxRequests: number, windowMinutes: number) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000, // 分をミリ秒に変換
    max: maxRequests,
    message: `リクエスト制限を超えました。${windowMinutes}分後に再度お試しください。`,
    standardHeaders: true,
    legacyHeaders: false,
    // IPアドレスの取得（プロキシ経由の場合も考慮）
    keyGenerator: (req) => {
      return req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
    }
  });
};
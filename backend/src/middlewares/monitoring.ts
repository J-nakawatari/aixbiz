import { Request, Response, NextFunction } from 'express';
import { monitoringService } from '../services/monitoringService';

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // レスポンスの終了を監視
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    monitoringService.logApiUsage(req, res.statusCode, responseTime);
  });

  next();
};
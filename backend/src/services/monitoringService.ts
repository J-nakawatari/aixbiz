import { Request } from 'express';

interface ApiUsageLog {
  timestamp: Date;
  ip: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
}

class MonitoringService {
  private usageLogs: ApiUsageLog[] = [];
  private readonly maxLogs = 10000; // メモリ使用量を制限

  logApiUsage(req: Request, statusCode: number, responseTime: number) {
    const log: ApiUsageLog = {
      timestamp: new Date(),
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      endpoint: req.path,
      statusCode,
      responseTime,
      userAgent: req.headers['user-agent']
    };

    this.usageLogs.push(log);

    // ログが多すぎる場合は古いものを削除
    if (this.usageLogs.length > this.maxLogs) {
      this.usageLogs.shift();
    }

    // 異常なアクセスパターンを検知
    this.detectAnomalies(req.ip || '');
  }

  private detectAnomalies(ip: string) {
    const recentLogs = this.getRecentLogs(5); // 過去5分
    const ipLogs = recentLogs.filter(log => log.ip === ip);

    // 5分間に50回以上のアクセスがある場合は警告
    if (ipLogs.length > 50) {
      console.warn(`⚠️ Suspicious activity detected from IP: ${ip} - ${ipLogs.length} requests in 5 minutes`);
      // 本番環境では、ここでアラートメールやSlack通知を送信
    }

    // エラー率が高い場合の警告
    const errorLogs = ipLogs.filter(log => log.statusCode >= 400);
    if (errorLogs.length > 10) {
      console.warn(`⚠️ High error rate from IP: ${ip} - ${errorLogs.length} errors in 5 minutes`);
    }
  }

  private getRecentLogs(minutes: number): ApiUsageLog[] {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return this.usageLogs.filter(log => log.timestamp > cutoffTime);
  }

  getStats() {
    const recentLogs = this.getRecentLogs(60); // 過去1時間
    const totalRequests = recentLogs.length;
    const errorRequests = recentLogs.filter(log => log.statusCode >= 400).length;
    const avgResponseTime = recentLogs.reduce((sum, log) => sum + log.responseTime, 0) / (totalRequests || 1);

    return {
      totalRequests,
      errorRequests,
      errorRate: (errorRequests / (totalRequests || 1)) * 100,
      avgResponseTime: Math.round(avgResponseTime),
      uniqueIPs: new Set(recentLogs.map(log => log.ip)).size
    };
  }
}

export const monitoringService = new MonitoringService();
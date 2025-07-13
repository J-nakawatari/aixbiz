import { Request, Response, NextFunction } from 'express';
import { featureFlags, isDeveloperIp } from '../config/features';

// 疑わしいパターンの定義
const SUSPICIOUS_PATTERNS = {
  xss: [
    /<script[\s\S]*?>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ],
  sqlInjection: [
    /(\b(union|select|insert|update|delete|drop|create)\b.*\b(from|where|table)\b)/gi,
    /('|(--|\/\*|\*\/)|;|\||\\)/g
  ],
  pathTraversal: [
    /\.\.\//g,
    /\.\.\\\\/g,
    /%2e%2e/gi
  ],
  commandInjection: [
    /[;&|`$]/g,
    /\b(cat|ls|rm|mv|cp|chmod|chown)\b/gi
  ]
};

// 監査ログインターフェース
interface AuditLog {
  timestamp: Date;
  ip: string;
  method: string;
  path: string;
  threat: string;
  pattern: string;
  value: string;
  headers: Record<string, any>;
}

// 監査ログの保存（実際の実装では外部サービスへ送信）
const logSecurityEvent = (log: AuditLog) => {
  if (featureFlags.enableSecurityLogging) {
    // 本番環境では外部ログサービスへ送信
    if (process.env.NODE_ENV === 'production') {
      // TODO: Sentry, Datadog, CloudWatch等への送信
      console.error('[SECURITY ALERT]', JSON.stringify(log, null, 2));
    } else {
      console.warn('[SECURITY AUDIT]', log);
    }
  }
};

// リクエストボディの検査
const inspectRequestBody = (body: any, path: string = ''): { threat: string; pattern: string; value: string }[] => {
  const threats: { threat: string; pattern: string; value: string }[] = [];
  
  if (typeof body === 'string') {
    // 文字列の検査
    for (const [threatType, patterns] of Object.entries(SUSPICIOUS_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(body)) {
          threats.push({
            threat: threatType,
            pattern: pattern.toString(),
            value: body.substring(0, 100) // 最初の100文字のみ
          });
        }
      }
    }
  } else if (typeof body === 'object' && body !== null) {
    // オブジェクトの再帰的検査
    for (const [key, value] of Object.entries(body)) {
      const subPath = path ? `${path}.${key}` : key;
      threats.push(...inspectRequestBody(value, subPath));
    }
  } else if (Array.isArray(body)) {
    // 配列の検査
    body.forEach((item, index) => {
      threats.push(...inspectRequestBody(item, `${path}[${index}]`));
    });
  }
  
  return threats;
};

// セキュリティ監査ミドルウェア
export const securityAudit = (req: Request, res: Response, next: NextFunction) => {
  // 機能フラグチェック
  if (!featureFlags.enableSecurityLogging) {
    return next();
  }
  
  // 開発者IPはスキップ
  const clientIp = req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0] || '';
  if (isDeveloperIp(clientIp)) {
    return next();
  }
  
  // URLパラメータの検査
  const urlThreats: { threat: string; pattern: string; value: string }[] = [];
  const fullUrl = req.originalUrl;
  
  for (const [threatType, patterns] of Object.entries(SUSPICIOUS_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(fullUrl)) {
        urlThreats.push({
          threat: threatType,
          pattern: pattern.toString(),
          value: fullUrl
        });
      }
    }
  }
  
  // リクエストボディの検査
  const bodyThreats = req.body ? inspectRequestBody(req.body) : [];
  
  // ヘッダーの検査（User-Agent等）
  const headerThreats: { threat: string; pattern: string; value: string }[] = [];
  const suspiciousHeaders = ['user-agent', 'referer', 'x-forwarded-for'];
  
  for (const header of suspiciousHeaders) {
    const value = req.headers[header];
    if (value && typeof value === 'string') {
      // 自動化ツールの検出
      if (/bot|crawler|spider|scraper|curl|wget|python/gi.test(value)) {
        headerThreats.push({
          threat: 'bot',
          pattern: 'Automated tool detected',
          value: value
        });
      }
    }
  }
  
  // 脅威が検出された場合のログ
  const allThreats = [...urlThreats, ...bodyThreats, ...headerThreats];
  
  if (allThreats.length > 0) {
    allThreats.forEach(threat => {
      logSecurityEvent({
        timestamp: new Date(),
        ip: clientIp,
        method: req.method,
        path: req.path,
        threat: threat.threat,
        pattern: threat.pattern,
        value: threat.value,
        headers: {
          'user-agent': req.headers['user-agent'],
          'referer': req.headers['referer']
        }
      });
    });
    
    // 深刻な脅威の場合はリクエストをブロック（オプション）
    const criticalThreats = allThreats.filter(t => 
      t.threat === 'xss' || t.threat === 'sqlInjection' || t.threat === 'commandInjection'
    );
    
    if (criticalThreats.length > 0 && featureFlags.enableStrictValidation) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid characters detected in request'
      });
    }
  }
  
  // 異常なリクエストパターンの検出
  const requestSize = JSON.stringify(req.body || {}).length;
  if (requestSize > 50000) { // 50KB以上
    logSecurityEvent({
      timestamp: new Date(),
      ip: clientIp,
      method: req.method,
      path: req.path,
      threat: 'large_payload',
      pattern: 'Request size exceeds threshold',
      value: `${requestSize} bytes`,
      headers: {
        'content-length': req.headers['content-length']
      }
    });
  }
  
  next();
};

// 統計情報の取得（開発者向け）
let securityStats = {
  totalThreats: 0,
  threatsByType: {} as Record<string, number>,
  threatsByIp: {} as Record<string, number>,
  lastReset: new Date()
};

export const getSecurityStats = () => {
  return {
    ...securityStats,
    uptime: Date.now() - securityStats.lastReset.getTime()
  };
};

// 定期的な統計リセット（24時間ごと）
setInterval(() => {
  securityStats = {
    totalThreats: 0,
    threatsByType: {},
    threatsByIp: {},
    lastReset: new Date()
  };
}, 24 * 60 * 60 * 1000);
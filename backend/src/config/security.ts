import helmet from 'helmet';
import { Express, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { featureFlags } from './features';

// nonce生成ミドルウェア
const generateNonce = (req: Request, res: Response, next: NextFunction) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
};

export const configureSecurityMiddleware = (app: Express) => {
  // 本番環境でHTTPS強制（内部接続は除外）
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      // 内部接続（localhost）はHTTPS強制しない
      const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
      
      if (!isLocalhost && req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

  // nonce生成（本番環境のみ）
  if (process.env.NODE_ENV === 'production') {
    app.use(generateNonce);
  }

  // Helmetの詳細設定
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Tailwind CSS
        scriptSrc: isDevelopment 
          ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com"]
          : ["'self'", "https://www.googletagmanager.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", process.env.CORS_ORIGIN || "http://localhost:3000"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"], // iframeレポート表示のため
        formAction: ["'self'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: isDevelopment ? [] : []
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'same-origin' },
    permittedCrossDomainPolicies: false,
  }));

  // DNSプリフェッチ制御
  app.use(helmet.dnsPrefetchControl({ allow: false }));
  
  // IEの互換性を無効化
  app.use(helmet.ieNoOpen());
  
  // フレーム内での表示を禁止
  app.use(helmet.frameguard({ action: 'deny' }));
};
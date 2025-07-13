import helmet from 'helmet';
import { Express } from 'express';

export const configureSecurityMiddleware = (app: Express) => {
  // 本番環境でHTTPS強制
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

  // Helmetの詳細設定
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
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
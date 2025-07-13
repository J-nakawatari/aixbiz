// 機能フラグ管理システム
export interface FeatureFlags {
  // セキュリティ機能
  enableCSRF: boolean;
  enableStrictValidation: boolean;
  enableSecurityLogging: boolean;
  
  // レート制限
  enableRateLimit: boolean;
  rateLimitTiers: {
    normal: { windowMs: number; max: number };
    report: { windowMs: number; max: number };
  };
  
  // フロントエンド機能
  useIframeMode: boolean;
  enableValidationWarnings: boolean;
  
  // 開発者向け機能
  developerMode: boolean;
  developerIps: string[];
}

// デフォルト設定
const defaultFeatures: FeatureFlags = {
  // セキュリティ機能
  enableCSRF: true,
  enableStrictValidation: false, // 段階的に有効化
  enableSecurityLogging: false,
  
  // レート制限
  enableRateLimit: true,
  rateLimitTiers: {
    normal: { windowMs: 60 * 1000, max: 100 },
    report: { windowMs: 15 * 60 * 1000, max: 10 }
  },
  
  // フロントエンド機能
  useIframeMode: true,
  enableValidationWarnings: true,
  
  // 開発者向け機能
  developerMode: process.env.NODE_ENV === 'development',
  developerIps: ['127.0.0.1', '::1', '::ffff:127.0.0.1']
};

// 環境変数から機能フラグを読み込む
export const loadFeatureFlags = (): FeatureFlags => {
  const flags: FeatureFlags = { ...defaultFeatures };
  
  // 環境変数からオーバーライド
  if (process.env.ENABLE_CSRF !== undefined) {
    flags.enableCSRF = process.env.ENABLE_CSRF === 'true';
  }
  
  if (process.env.ENABLE_STRICT_VALIDATION !== undefined) {
    flags.enableStrictValidation = process.env.ENABLE_STRICT_VALIDATION === 'true';
  }
  
  if (process.env.ENABLE_SECURITY_LOGGING !== undefined) {
    flags.enableSecurityLogging = process.env.ENABLE_SECURITY_LOGGING === 'true';
  }
  
  if (process.env.ENABLE_RATE_LIMIT !== undefined) {
    flags.enableRateLimit = process.env.ENABLE_RATE_LIMIT === 'true';
  }
  
  if (process.env.USE_IFRAME_MODE !== undefined) {
    flags.useIframeMode = process.env.USE_IFRAME_MODE === 'true';
  }
  
  if (process.env.DEVELOPER_IPS) {
    flags.developerIps = process.env.DEVELOPER_IPS.split(',').map(ip => ip.trim());
  }
  
  // レート制限のカスタマイズ
  if (process.env.RATE_LIMIT_NORMAL_MAX) {
    flags.rateLimitTiers.normal.max = parseInt(process.env.RATE_LIMIT_NORMAL_MAX, 10);
  }
  
  if (process.env.RATE_LIMIT_REPORT_MAX) {
    flags.rateLimitTiers.report.max = parseInt(process.env.RATE_LIMIT_REPORT_MAX, 10);
  }
  
  return flags;
};

// シングルトンインスタンス
export const featureFlags = loadFeatureFlags();

// 機能フラグチェック用ヘルパー
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  const value = featureFlags[feature];
  return typeof value === 'boolean' ? value : false;
};

// 開発者IPチェック
export const isDeveloperIp = (ip: string): boolean => {
  if (!featureFlags.developerMode) return false;
  
  const normalizedIp = ip.replace('::ffff:', '');
  return featureFlags.developerIps.includes(ip) || 
         featureFlags.developerIps.includes(normalizedIp);
};

// 機能フラグの状態をログ出力（起動時）
export const logFeatureFlags = (): void => {
  console.log('=== Feature Flags Configuration ===');
  console.log('CSRF Protection:', featureFlags.enableCSRF);
  console.log('Strict Validation:', featureFlags.enableStrictValidation);
  console.log('Security Logging:', featureFlags.enableSecurityLogging);
  console.log('Rate Limiting:', featureFlags.enableRateLimit);
  console.log('Iframe Mode:', featureFlags.useIframeMode);
  console.log('Developer Mode:', featureFlags.developerMode);
  console.log('Developer IPs:', featureFlags.developerIps.join(', '));
  console.log('================================');
};
// 一時的なインメモリストレージ（本番環境ではRedisやDBを使用すべき）
interface StoredReport {
  reportData: any;
  html: string;
  createdAt: Date;
}

const reportStorage = new Map<string, StoredReport>();

// 30分後に自動削除
const EXPIRY_TIME = 30 * 60 * 1000;

export function storeReport(reportId: string, reportData: any, html: string): void {
  reportStorage.set(reportId, {
    reportData,
    html,
    createdAt: new Date()
  });

  // 期限切れレポートの自動削除
  setTimeout(() => {
    reportStorage.delete(reportId);
  }, EXPIRY_TIME);
}

export function getReport(reportId: string): StoredReport | undefined {
  const report = reportStorage.get(reportId);
  
  // 期限切れチェック
  if (report && (Date.now() - report.createdAt.getTime() > EXPIRY_TIME)) {
    reportStorage.delete(reportId);
    return undefined;
  }
  
  return report;
}

// 定期的なクリーンアップ
setInterval(() => {
  const now = Date.now();
  for (const [id, report] of reportStorage.entries()) {
    if (now - report.createdAt.getTime() > EXPIRY_TIME) {
      reportStorage.delete(id);
    }
  }
}, 5 * 60 * 1000); // 5分ごと
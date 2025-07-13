import { createClient } from 'redis';
import { config } from '../config/config';

interface StoredReport {
  reportData: any;
  html: string;
  createdAt: Date;
}

// Redisクライアントの初期化
const redisClient = createClient({
  url: config.redisUrl || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Redis接続
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// 30分（秒単位）
const EXPIRY_TIME = 30 * 60;

export async function storeReport(reportId: string, reportData: any, html: string): Promise<void> {
  try {
    const report: StoredReport = {
      reportData,
      html,
      createdAt: new Date()
    };
    
    // RedisにJSON形式で保存（30分のTTL付き）
    await redisClient.setEx(
      `report:${reportId}`,
      EXPIRY_TIME,
      JSON.stringify(report)
    );
  } catch (error) {
    console.error('Failed to store report:', error);
    throw error;
  }
}

export async function getReport(reportId: string): Promise<StoredReport | undefined> {
  try {
    const data = await redisClient.get(`report:${reportId}`);
    
    if (!data) {
      return undefined;
    }
    
    const report = JSON.parse(data) as StoredReport;
    report.createdAt = new Date(report.createdAt);
    
    return report;
  } catch (error) {
    console.error('Failed to get report:', error);
    return undefined;
  }
}

// グレースフルシャットダウン
process.on('SIGINT', async () => {
  await redisClient.disconnect();
  process.exit(0);
});
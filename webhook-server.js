const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const app = express();

// GitHub Webhookのシークレット（環境変数から取得）
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'your-webhook-secret';
const PORT = process.env.WEBHOOK_PORT || 9000;

// リクエストボディをrawで取得するミドルウェア
app.use(express.raw({ type: 'application/json' }));

// Webhookエンドポイント
app.post('/webhook', (req, res) => {
  // GitHub署名の検証
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.error('No signature provided');
    return res.status(401).send('Unauthorized');
  }

  // HMACを使って署名を検証
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(req.body).digest('hex');
  
  if (signature !== digest) {
    console.error('Invalid signature');
    return res.status(401).send('Unauthorized');
  }

  // JSONをパース
  const payload = JSON.parse(req.body.toString());
  
  // mainブランチへのpushイベントのみ処理
  if (payload.ref === 'refs/heads/main') {
    console.log(`[${new Date().toISOString()}] Received push to main branch`);
    console.log(`Commit: ${payload.head_commit.message}`);
    console.log(`Author: ${payload.head_commit.author.name}`);
    
    // すぐにレスポンスを返す（GitHubのタイムアウト対策）
    res.status(200).send('Webhook received');
    
    // デプロイを非同期で実行
    console.log('Starting deployment...');
    exec('cd /var/www/aixbiz && ./deploy.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Deployment failed: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log('Deployment output:', stdout);
      console.log(`[${new Date().toISOString()}] Deployment completed successfully`);
    });
  } else {
    console.log(`Ignored push to ${payload.ref}`);
    res.status(200).send('Ignored - not main branch');
  }
});

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
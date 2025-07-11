# AI導入ナビゲーター ポート割り当て設計書

## 現在のVPS使用状況
- 既存サービスの使用ポート:
  - 3000, 3001, 3002, 3100 (Next.js/Node.js)
  - 5001, 5100 (Node.js)
  - 6379 (Redis)
  - 19999 (Netdata)
- 新規サービス（AI導入ナビゲーター）用のポート割り当てが必要

## AI導入ナビゲーター用ポート割り当て

### 本番環境ポート
```
3004: Next.js フロントエンド（内部）
4004: Express API バックエンド（内部）
27020: MongoDB（内部、デフォルトの27017から変更）
```

### 開発環境ポート（ローカル）
```
3000: Next.js フロントエンド
4000: Express API バックエンド
27017: MongoDB（デフォルト）
```

## Nginx設定例

```nginx
# AI導入ナビゲーター（aixbiz.jp）
server {
    listen 443 ssl http2;
    server_name aixbiz.jp www.aixbiz.jp;

    # SSL証明書設定
    ssl_certificate /etc/letsencrypt/live/aixbiz.jp/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aixbiz.jp/privkey.pem;

    # フロントエンド（Next.js）
    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # バックエンドAPI
    location /api/ {
        proxy_pass http://localhost:4004;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTPからHTTPSへリダイレクト
server {
    listen 80;
    server_name aixbiz.jp www.aixbiz.jp;
    return 301 https://$server_name$request_uri;
}
```

## PM2設定例

### ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: 'ainavigator-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/ainavigator/frontend',
      env: {
        PORT: 3004,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'ainavigator-backend',
      script: './server.js',
      cwd: '/var/www/ainavigator/backend',
      env: {
        PORT: 4004,
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://localhost:27020/ainavigator'
      }
    }
  ]
};
```

## 環境変数設定

### フロントエンド（.env.production）
```
NEXT_PUBLIC_API_URL=https://aixbiz.jp/api/v1
PORT=3004
```

### バックエンド（.env.production）
```
PORT=4004
MONGODB_URI=mongodb://localhost:27020/ainavigator
OPENAI_API_KEY=your-api-key-here
NODE_ENV=production
CORS_ORIGIN=https://aixbiz.jp
```

## ファイアウォール設定
```bash
# 外部からアクセス可能（Nginxが処理）
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 内部のみアクセス可能
# 3004, 4004, 27020 は外部からアクセス不可
```

## ポート使用状況確認コマンド
```bash
# 使用中のポート確認
sudo netstat -tlnp

# 特定ポートの使用確認
sudo lsof -i :3004
sudo lsof -i :4004
sudo lsof -i :27020
```

## 注意事項
1. 他のサービスで3000-3003、4000-4003が使用されている想定
2. MongoDBは各サービスで異なるポートを使用（競合回避）
3. 全ての内部ポートは外部からアクセス不可に設定
4. Nginxがリバースプロキシとして外部リクエストを処理
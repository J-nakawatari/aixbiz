# HTTPS設定ガイド - aixbiz.jp

## 1. Let's Encrypt で無料SSL証明書を取得

### Certbotのインストール
```bash
# Ubuntu/Debian系
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### SSL証明書の取得
```bash
# Nginxプラグインを使って自動設定
sudo certbot --nginx -d aixbiz.jp -d www.aixbiz.jp

# または手動で証明書のみ取得
sudo certbot certonly --nginx -d aixbiz.jp -d www.aixbiz.jp
```

入力が求められたら：
- メールアドレス: 通知用のメールアドレスを入力
- 利用規約: A (Agree)
- メール配信: N (No) ※お好みで

## 2. Nginx設定ファイルの作成

### 設定ファイルを作成
```bash
sudo nano /etc/nginx/sites-available/aixbiz.jp
```

### 設定内容
```nginx
# HTTPからHTTPSへリダイレクト
server {
    listen 80;
    listen [::]:80;
    server_name aixbiz.jp www.aixbiz.jp;
    return 301 https://$server_name$request_uri;
}

# HTTPS設定
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name aixbiz.jp www.aixbiz.jp;

    # SSL証明書
    ssl_certificate /etc/letsencrypt/live/aixbiz.jp/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aixbiz.jp/privkey.pem;

    # SSL設定（セキュリティ強化）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # セキュリティヘッダー
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # ログ設定
    access_log /var/log/nginx/aixbiz.jp.access.log;
    error_log /var/log/nginx/aixbiz.jp.error.log;

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
        
        # CORS対応（必要に応じて）
        add_header Access-Control-Allow-Origin "https://aixbiz.jp" always;
    }
}
```

## 3. Nginx設定を有効化

```bash
# シンボリックリンクを作成
sudo ln -s /etc/nginx/sites-available/aixbiz.jp /etc/nginx/sites-enabled/

# 設定テスト
sudo nginx -t

# Nginx再起動
sudo systemctl reload nginx
```

## 4. 証明書の自動更新設定

### 自動更新テスト
```bash
sudo certbot renew --dry-run
```

### Cronジョブ設定（通常は自動で設定される）
```bash
# crontabを確認
sudo crontab -l | grep certbot

# なければ追加
sudo crontab -e
# 以下を追加
0 3 * * * /usr/bin/certbot renew --quiet
```

## 5. HTTPS動作確認

### コマンドラインで確認
```bash
# HTTPSアクセス確認
curl -I https://aixbiz.jp

# SSL証明書情報確認
openssl s_client -connect aixbiz.jp:443 -servername aixbiz.jp < /dev/null

# HTTPからのリダイレクト確認
curl -I http://aixbiz.jp
```

### ブラウザで確認
1. https://aixbiz.jp にアクセス
2. 鍵マークが表示されることを確認
3. 証明書情報を確認（鍵マークをクリック）

## 6. トラブルシューティング

### よくある問題と対策

#### ポート443が開いていない
```bash
# ファイアウォール確認
sudo ufw status
sudo ufw allow 443/tcp
```

#### 証明書エラー
```bash
# 証明書の状態確認
sudo certbot certificates

# 証明書の再取得
sudo certbot delete --cert-name aixbiz.jp
sudo certbot --nginx -d aixbiz.jp -d www.aixbiz.jp
```

#### Nginxエラー
```bash
# エラーログ確認
sudo tail -f /var/log/nginx/error.log

# 設定ファイルの文法チェック
sudo nginx -t
```

## 7. セキュリティ評価

設定完了後、以下のサイトでSSL設定を評価：
- SSL Labs: https://www.ssllabs.com/ssltest/
- aixbiz.jp を入力して「Submit」

A評価以上を目指しましょう。
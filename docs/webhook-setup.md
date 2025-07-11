# GitHub Webhook自動デプロイ設定手順

## 1. 本番サーバーでの設定

### Webhookサーバーのセットアップ
```bash
# 必要なファイルをpull
cd /var/www/aixbiz
git pull origin main

# systemdサービスファイルをコピー
sudo cp webhook-server.service /etc/systemd/system/

# シークレットキーを生成（メモしておく）
openssl rand -hex 32

# サービスファイルを編集してシークレットを設定
sudo nano /etc/systemd/system/webhook-server.service
# GITHUB_WEBHOOK_SECRET=生成したシークレット に変更

# サービスを有効化・起動
sudo systemctl daemon-reload
sudo systemctl enable webhook-server
sudo systemctl start webhook-server

# 状態確認
sudo systemctl status webhook-server

# ログ確認
sudo journalctl -u webhook-server -f
```

### Nginxの設定（リバースプロキシ）
```nginx
location /webhook {
    proxy_pass http://localhost:9000/webhook;
    proxy_http_version 1.1;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
}
```

## 2. GitHubでの設定

1. リポジトリの Settings → Webhooks → Add webhook
2. 以下を設定：
   - **Payload URL**: https://aixbiz.jp/webhook
   - **Content type**: application/json
   - **Secret**: 上記で生成したシークレット
   - **Which events**: Just the push event
   - **Active**: チェック

3. Add webhookをクリック

## 3. 動作確認

1. GitHubでWebhookの送信テスト
   - Webhooks設定画面で Recent Deliveries を確認
   - Redeliverボタンでテスト送信可能

2. サーバーログ確認
```bash
sudo journalctl -u webhook-server -f
```

3. 実際にコードをpush
```bash
git add .
git commit -m "test: webhook deployment"
git push origin main
```

## セキュリティ注意事項

- 必ず強力なシークレットキーを使用
- HTTPSでのみ公開（HTTP不可）
- ポート9000は外部公開しない（Nginx経由のみ）
- ログを定期的に確認

## トラブルシューティング

### Webhookが届かない
- GitHubのWebhook設定でRecent Deliveriesを確認
- サーバーのファイアウォール設定を確認
- Nginxの設定を確認

### デプロイが実行されない
- systemdサービスのログを確認
- deploy.shの実行権限を確認
- 作業ディレクトリのパスを確認
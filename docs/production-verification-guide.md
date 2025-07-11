# 本番サーバー確認ガイド

## 1. サービス稼働状況の確認

### PM2でプロセス確認
```bash
# PM2で管理されているプロセス一覧
pm2 list

# 特定のアプリの詳細確認
pm2 show ainavigator-frontend
pm2 show ainavigator-backend

# リアルタイムログ確認
pm2 logs ainavigator-frontend
pm2 logs ainavigator-backend

# CPUやメモリ使用状況
pm2 monit
```

### ポート使用状況確認
```bash
# 指定ポートが使用されているか確認
sudo lsof -i :3004
sudo lsof -i :4004
sudo lsof -i :27020

# 全体のポート使用状況
sudo netstat -tlnp | grep -E '3004|4004|27020'
```

## 2. Webサービスの動作確認

### 外部からの接続確認
```bash
# HTTPSアクセス確認（別のマシンから）
curl -I https://aixbiz.jp
curl https://aixbiz.jp/api/v1/health

# SSL証明書の確認
openssl s_client -connect aixbiz.jp:443 -servername aixbiz.jp
```

### サーバー内部からの確認
```bash
# フロントエンド確認
curl http://localhost:3004

# バックエンドAPI確認
curl http://localhost:4004/api/v1/health

# MongoDB接続確認
mongosh --port 27020
```

## 3. ログファイルの確認

### Nginxログ
```bash
# アクセスログ
sudo tail -f /var/log/nginx/access.log

# エラーログ
sudo tail -f /var/log/nginx/error.log

# 特定ドメインのログを抽出
sudo grep "aixbiz.jp" /var/log/nginx/access.log
```

### アプリケーションログ
```bash
# PM2ログの場所
ls ~/.pm2/logs/

# 特定アプリのログ
tail -f ~/.pm2/logs/ainavigator-frontend-out.log
tail -f ~/.pm2/logs/ainavigator-backend-error.log
```

## 4. システムリソース確認

### 全体的なリソース使用状況
```bash
# CPU、メモリ、ディスク使用率
htop

# ディスク使用量
df -h

# メモリ使用量
free -h
```

### MongoDB状態確認
```bash
# MongoDBサービス状態
sudo systemctl status mongod

# MongoDB接続してステータス確認
mongosh --port 27020 --eval "db.serverStatus()"
```

## 5. セキュリティ確認

### ファイアウォール設定
```bash
# UFW状態確認
sudo ufw status verbose

# 開いているポート確認
sudo ss -tlnp
```

### 不正アクセスチェック
```bash
# 最近のSSHログイン履歴
last -10

# 認証失敗ログ
sudo grep "Failed password" /var/log/auth.log | tail -20

# Nginx不審なアクセス
sudo grep -E "404|403|400" /var/log/nginx/access.log | tail -20
```

## 6. 問題発生時の確認手順

### サービスが動かない場合
```bash
# 1. プロセスが起動しているか
pm2 list

# 2. ポートが使用されているか
sudo lsof -i :3004

# 3. エラーログを確認
pm2 logs ainavigator-backend --lines 100

# 4. Nginx設定が正しいか
sudo nginx -t

# 5. DNS解決ができているか
nslookup aixbiz.jp
dig aixbiz.jp
```

### パフォーマンスが悪い場合
```bash
# プロセスのCPU/メモリ使用率
pm2 status

# MongoDBのスロークエリ
mongosh --port 27020 --eval "db.currentOp()"

# ネットワーク接続数
ss -tan | grep :443 | wc -l
```

## 7. 定期確認項目チェックリスト

### 日次確認
- [ ] PM2プロセスが全て online 状態
- [ ] エラーログに異常がない
- [ ] ディスク使用率が80%未満

### 週次確認
- [ ] SSL証明書の有効期限（30日以上）
- [ ] MongoDB のデータサイズ
- [ ] アクセスログの異常パターン
- [ ] システムアップデートの確認

### 月次確認
- [ ] バックアップの動作確認
- [ ] セキュリティパッチの適用
- [ ] パフォーマンスメトリクスの推移

## 8. 便利なワンライナー

```bash
# サービス全体の健全性チェック
echo "=== PM2 Status ===" && pm2 list && echo -e "\n=== Port Check ===" && sudo netstat -tlnp | grep -E '3004|4004|27020' && echo -e "\n=== HTTPS Check ===" && curl -I https://aixbiz.jp 2>/dev/null | head -1

# ログの異常検知
grep -E "ERROR|WARN|Failed" ~/.pm2/logs/*.log | tail -20

# リソース使用率サマリー
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')%" && echo "Memory: $(free | grep Mem | awk '{print ($3/$2) * 100.0}')%" && echo "Disk: $(df -h / | awk 'NR==2 {print $5}')"
```
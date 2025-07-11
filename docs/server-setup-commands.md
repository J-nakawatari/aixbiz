# サーバー初期設定コマンド集

## 1. Node.js のインストール（v20 LTS）

```bash
# NodeSourceリポジトリを追加
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js をインストール
sudo apt-get install -y nodejs

# バージョン確認
node --version
npm --version
```

## 2. PM2 のインストール

```bash
# PM2をグローバルインストール
sudo npm install -g pm2

# PM2の起動時自動起動設定
pm2 startup systemd
# 表示されたコマンドを実行

# PM2のログローテーション設定
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 3. MongoDB のインストール

```bash
# MongoDB 7.0 のGPGキーを追加
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# リポジトリを追加
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# パッケージリストを更新
sudo apt-get update

# MongoDBをインストール
sudo apt-get install -y mongodb-org

# MongoDBサービスの設定（ポート27020用）
sudo nano /etc/mongod.conf
# net:
#   port: 27020
#   bindIp: 127.0.0.1

# MongoDBを起動
sudo systemctl start mongod
sudo systemctl enable mongod

# 状態確認
sudo systemctl status mongod
```

## 4. Gitリポジトリのセットアップ

```bash
# プロジェクトディレクトリ作成
cd /var/www/aixbiz
sudo mkdir -p frontend backend

# 権限設定
sudo chown -R $USER:$USER /var/www/aixbiz

# Gitリポジトリを初期化
git init

# .gitignore作成
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.env.production
.next/
dist/
build/
*.log
.DS_Store
.vscode/
.idea/
EOF
```

## 5. 環境変数ファイルの準備

```bash
# バックエンド用
cat > backend/.env.example << 'EOF'
NODE_ENV=production
PORT=4004
MONGODB_URI=mongodb://localhost:27020/ainavigator
OPENAI_API_KEY=your-openai-api-key-here
CORS_ORIGIN=https://aixbiz.jp
SESSION_SECRET=your-session-secret-here
ADMIN_SESSION_SECRET=your-admin-session-secret-here
JWT_SECRET=your-jwt-secret-here
EOF

# フロントエンド用
cat > frontend/.env.example << 'EOF'
NEXT_PUBLIC_API_URL=https://aixbiz.jp/api/v1
PORT=3004
EOF
```

## 6. ディレクトリ構造の作成

```bash
# バックエンドディレクトリ構造
mkdir -p backend/{src,config,models,routes,controllers,middlewares,utils}

# フロントエンドディレクトリ構造
mkdir -p frontend/{src,public,components,pages,styles,utils}
```

## 7. セキュリティ設定

```bash
# ファイアウォール設定確認
sudo ufw status

# 必要に応じてポートを開く（既に設定済みの場合はスキップ）
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS

# fail2banのインストール（ブルートフォース攻撃対策）
sudo apt-get install -y fail2ban

# fail2ban設定
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## 8. システムモニタリング

```bash
# htopのインストール（既にインストール済みかも）
sudo apt-get install -y htop

# ディスク容量確認
df -h

# メモリ使用量確認
free -h
```

## 9. 必要なディレクトリのパーミッション設定

```bash
# ログディレクトリ
sudo mkdir -p /var/log/ainavigator
sudo chown $USER:$USER /var/log/ainavigator

# アップロードディレクトリ（将来用）
sudo mkdir -p /var/www/aixbiz/uploads
sudo chown $USER:$USER /var/www/aixbiz/uploads
```

## 10. 確認コマンド

```bash
# インストール状況確認
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "MongoDB: $(mongod --version | head -1)"
echo "Nginx: $(nginx -v 2>&1)"
```

## 次のステップ

1. 実際のアプリケーションコードをデプロイ
2. PM2でプロセスを起動
3. 動作確認

## トラブルシューティング

### MongoDBが起動しない場合
```bash
# ログ確認
sudo tail -f /var/log/mongodb/mongod.log

# 設定ファイル確認
sudo cat /etc/mongod.conf
```

### Node.jsのバージョンが古い場合
```bash
# 古いバージョンを削除
sudo apt-get remove nodejs
# 上記の手順で再インストール
```
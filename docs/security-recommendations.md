# AI導入ナビゲーター セキュリティ対策提案

## 既存の対策
- reCAPTCHA v3
- IP制限（1日1回）
- バリデーション（サーバー側・クライアント側）

## 追加推奨セキュリティ対策

### 1. CSRF対策
- **実装方法**: CSRFトークンの実装（Express用: csurf、Next.js用: built-in CSRF protection）
- **理由**: フォーム送信時の偽装リクエストを防ぐ

### 2. レート制限の強化
- **実装方法**: express-rate-limit または Redisベースの制限
- **設定例**:
  - API全体: 1IPあたり100リクエスト/15分
  - レポート生成API: 1IPあたり5リクエスト/時間
  - 認証試行: 5回失敗で15分ロック

### 3. 入力サニタイゼーション
- **実装方法**: DOMPurify、validator.js
- **対象**: XSS攻撃防止のため、全ての入力フィールド
- **特に注意**: 企業名、課題詳細などの自由記述欄

### 4. API キー管理
- **OpenAI APIキー**: 環境変数で管理、決してクライアント側に露出しない
- **キーローテーション**: 3ヶ月ごとに更新
- **使用量モニタリング**: 異常な使用量を検知してアラート

### 5. HTTPSの強制
- **実装**: HSTS (Strict-Transport-Security) ヘッダー
- **設定**: max-age=31536000; includeSubDomains

### 6. セキュリティヘッダー
```javascript
// helmet.jsを使用
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://www.google.com/recaptcha/"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 7. データベースセキュリティ
- **MongoDB接続**: 認証必須、SSL/TLS接続
- **SQLインジェクション対策**: パラメータ化クエリ使用
- **フィールドレベル暗号化**: 個人情報（メールアドレス等）

### 8. セッション管理
- **実装**: express-session + connect-mongo
- **設定**:
  - HTTPOnly cookies
  - Secure flag (HTTPS環境)
  - SameSite=Strict
  - セッションタイムアウト: 30分

### 9. ログ・監視
- **アクセスログ**: morgan + Winston
- **エラーログ**: Sentryなどのエラートラッキング
- **不審なアクティビティ**: 
  - 大量のAPIコール
  - 異常なペイロードサイズ
  - 連続した400/401エラー

### 10. コンテンツ検証
- **ファイルアップロード**: 現在は不要だが、将来的に実装する場合
  - ファイルタイプ検証
  - ファイルサイズ制限
  - ウイルススキャン

### 11. API応答時間の制限
- **タイムアウト設定**: OpenAI API呼び出しは30秒でタイムアウト
- **理由**: DoS攻撃の影響を最小化

### 12. 環境分離
- **開発/ステージング/本番**: 環境ごとに異なるAPIキー
- **本番データ**: 開発環境では使用しない

## 実装優先度

### 高優先度（即実装）
1. CSRF対策
2. HTTPSの強制
3. セキュリティヘッダー（helmet.js）
4. API キー管理
5. 入力サニタイゼーション

### 中優先度（初期リリース後）
1. レート制限の強化
2. セッション管理
3. ログ・監視システム
4. データベースセキュリティ強化

### 低優先度（必要に応じて）
1. WAF (Web Application Firewall) の導入
2. DDoS対策サービスの利用
3. ペネトレーションテストの実施
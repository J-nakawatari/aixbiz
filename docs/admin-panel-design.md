# 管理画面・認証設計仕様書

## 認証システム設計

### ロール分離
- **user**: 一般利用者（診断フォーム利用者）
- **admin**: 管理者（申込者確認・統計閲覧）

### セッション分離設計

#### 1. 別々のCookie名を使用
```javascript
// ユーザー用セッション
app.use(session({
  name: 'user_session',
  secret: process.env.USER_SESSION_SECRET,
  // ...
}));

// 管理者用セッション
app.use('/admin', session({
  name: 'admin_session',
  secret: process.env.ADMIN_SESSION_SECRET,
  // ...
}));
```

#### 2. JWT実装案（推奨）
```javascript
// 別々のトークン名で管理
const userToken = req.cookies.user_token;
const adminToken = req.cookies.admin_token;

// トークン検証も別々に
verifyUserToken(userToken);
verifyAdminToken(adminToken);
```

### 認証エンドポイント設計
```
POST /api/auth/user/login     # ユーザーログイン
POST /api/auth/user/logout    # ユーザーログアウト
GET  /api/auth/user/me        # ユーザー情報取得

POST /api/auth/admin/login    # 管理者ログイン
POST /api/auth/admin/logout   # 管理者ログアウト
GET  /api/auth/admin/me       # 管理者情報取得
```

## API バージョニング設計

### バージョニング戦略（推奨）

#### URLパスベース（推奨）
```
/api/v1/report/generate
/api/v1/admin/users
/api/v2/report/generate  # 将来の新バージョン
```

**メリット**:
- 明確で理解しやすい
- 複数バージョンの並行運用が容易
- API ドキュメントが整理しやすい

#### ヘッダーベース（代替案）
```
GET /api/report/generate
Headers: X-API-Version: 1
```

### 推奨APIエンドポイント構造

```
# パブリックAPI（v1）
GET  /api/v1/health              # ヘルスチェック
POST /api/v1/report/generate     # レポート生成
GET  /api/v1/prompt/templates    # プロンプトテンプレート一覧

# 管理API（v1）
GET  /api/v1/admin/reports       # レポート一覧（ページネーション付き）
GET  /api/v1/admin/reports/:id   # レポート詳細
GET  /api/v1/admin/stats         # 利用統計
GET  /api/v1/admin/users         # 申込者一覧
DELETE /api/v1/admin/reports/:id # レポート削除

# 認証API（バージョンなし）
POST /api/auth/admin/login
POST /api/auth/admin/logout
GET  /api/auth/admin/me
```

## 管理画面機能

### 申込者確認機能
```javascript
// 管理画面で確認できる情報
{
  "id": "xxx",
  "submittedAt": "2025-07-11T10:00:00Z",
  "industry": "製造業",
  "jobFunction": "総務",
  "companySize": "20名",
  "challenges": "日報作成に時間がかかる",
  "aiExperience": "未導入",
  "ipAddress": "xxx.xxx.xxx.xxx",
  "reportGenerated": true,
  "reportId": "yyy"
}
```

### 管理画面ページ構成
```
/admin/login          # 管理者ログイン
/admin/dashboard      # ダッシュボード（統計サマリー）
/admin/reports        # レポート一覧・検索
/admin/reports/:id    # レポート詳細
/admin/users          # 申込者一覧
/admin/settings       # 管理設定
```

## セキュリティ考慮事項

### 管理者認証の強化
1. **2段階認証**: TOTP（Google Authenticator等）対応
2. **IPアドレス制限**: 管理画面は特定IPからのみアクセス可能
3. **ログイン試行制限**: 5回失敗で30分ロック
4. **セッションタイムアウト**: 管理者は15分で自動ログアウト

### CORS設定
```javascript
// 管理APIは厳格なCORS設定
app.use('/api/v1/admin', cors({
  origin: process.env.ADMIN_FRONTEND_URL,
  credentials: true
}));
```

## 実装優先順位

1. **Phase 1（MVP）**
   - 基本的な管理者ログイン機能
   - 申込者一覧・レポート一覧表示
   - セッション分離（user/admin）

2. **Phase 2**
   - APIバージョニング（/api/v1/）
   - 詳細な統計ダッシュボード
   - 検索・フィルタ機能

3. **Phase 3**
   - 2段階認証
   - 監査ログ
   - 管理者権限の細分化
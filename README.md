# AI導入ナビゲーター

中小企業向けに、ChatGPTなどの生成AIを活用した業務改善・効率化の提案を行う診断サービス

## 概要

エンドユーザーは主に業種問わず中小規模事業者で、AIの導入や活用を模索しているが知識がない、または方法がわからない企業が対象です。

## 主要機能

| 機能カテゴリ | 内容 |
|--------------|------|
| 無料診断フォーム | Webフォームから業務内容・課題を入力すると、AI活用レポート（PDF or Web）が即時出力される |
| 無料体験ツール | 業種と業務を選ぶと、ChatGPT用プロンプトを自動生成（ミニツール）|
| 有料コンサル | 希望企業に対して、深掘りヒアリング＋AI活用提案をレポート形式で提供（別契約）|

## 技術スタック

- **フロントエンド**: Next.js（フォーム、LP、ミニツール）
- **バックエンド**: Node.js（Express）＋ OpenAI API呼び出し（レポート生成）
- **データベース**: MongoDB（フォーム入力、レポート記録）
- **外部API**: OpenAI GPT API（プロンプト処理）
- **ホスティング**: Xserver VPS
- **ドメイン**: aixbiz.jp

## API仕様

### レポート生成API

**エンドポイント**: `POST /api/report/generate`

**リクエスト**:
```json
{
  "industry": "製造業",
  "jobFunction": "総務",
  "challenges": "日報作成に時間がかかる",
  "companySize": "20名",
  "aiExperience": "未導入"
}
```

**レスポンス**:
```json
{
  "summary": "ChatGPTを用いた日報自動化の提案",
  "recommendations": ["提案1", "提案2", "提案3"],
  "promptExample": "以下の文をもとに日報を要約してください：...",
  "version": "2025.07"
}
```

## セキュリティ・コスト管理

| 対策項目 | 対策内容 |
|----------|----------|
| reCAPTCHA | フォームにv3導入予定 |
| IP制限 | 無料ツールはIPアドレス単位で1日1回に制限 |
| APIコスト対策 | GPT-3.5またはGPT-4.0など軽量モデル使用、キャッシュ活用 |
| バリデーション | 入力項目はサーバ側・クライアント側ともに実装予定 |

## プロジェクト構造

```
ainavigator/
├── docs/
│   ├── Claude Code Service Spec.md    # サービス仕様書
│   ├── claude_code_api_spec.json      # OpenAPI仕様書
│   └── prompt_template_ai_report.md   # プロンプトテンプレート集
├── frontend/                           # Next.jsフロントエンド（予定）
├── backend/                            # Express APIサーバー（予定）
└── README.md                           # このファイル
```

## ドキュメントの役割

### prompt_template_ai_report.md
- OpenAI APIに送るプロンプトの構造と例を統一・管理
- systemロール（中小企業アドバイザー）とuserロール（入力内容）を定義
- 業種別のサンプルデータを含む

### claude_code_api_spec.json
- レポート生成APIの仕様をOpenAPI形式で明文化
- フロントエンド開発時のAPI連携設計の基礎
- 外部開発者との仕様共有用ドキュメント

## 開発タスク

1. プロジェクト構造の初期セットアップ（Next.js + Node.js）
2. 無料診断フォームの実装（フロントエンド）
3. バックエンドAPIサーバーのセットアップ（Express）
4. OpenAI API統合とレポート生成機能
5. MongoDBセットアップとデータモデル設計
6. 無料体験ツール（プロンプト自動生成）の実装
7. セキュリティ対策（reCAPTCHA、IP制限、バリデーション）
8. PDF生成機能の実装

## インフラ・デプロイ情報

### ホスティング環境
- **VPS**: Xserver VPS
- **ドメイン**: aixbiz.jp
- **SSL証明書**: Let's Encrypt（無料SSL）

### DNS設定（Xserver VPS用）
```
タイプ: A
ホスト: @
値: [VPSのIPアドレス]
TTL: 3600

タイプ: A
ホスト: www
値: [VPSのIPアドレス]
TTL: 3600
```

### サーバー構成
- **Webサーバー**: Nginx（リバースプロキシ）
- **アプリケーション**: PM2でNode.jsプロセス管理
- **ポート構成**:
  - 80: HTTP（443へリダイレクト）
  - 443: HTTPS（外部アクセス）
  - 3004: Next.js フロントエンド（内部）
  - 4004: Express API バックエンド（内部）
  - 27020: MongoDB（内部）

### デプロイ手順概要
1. VPSにSSH接続
2. Node.js、Nginx、MongoDB、PM2をインストール
3. GitHubからコードをクローン
4. 依存関係をインストール（npm install）
5. 環境変数を設定（.env）
6. PM2でアプリケーションを起動
7. Nginxでリバースプロキシ設定
8. Let's EncryptでSSL証明書取得

## 注意事項

- このサービスは「AI活用支援の方向性提案」が主軸であり、開発代行・システム導入は実施しない
- 診断・提案レベルにとどめ、判断材料として活用してもらう目的
- 記載内容は2025年7月時点での仕様草案であり、変更の可能性あり
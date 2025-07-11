# aixbiz.jp DNS設定ガイド

## 基本的なDNS設定

### 1. Aレコード（IPv4アドレス）
```
タイプ: A
ホスト: @ (またはaixbiz.jp)
値: サーバーのIPアドレス（例: 123.456.789.0）
TTL: 3600
```

### 2. WWWサブドメイン
```
タイプ: CNAME
ホスト: www
値: aixbiz.jp
TTL: 3600
```

または

```
タイプ: A
ホスト: www
値: サーバーのIPアドレス
TTL: 3600
```

## ホスティングサービス別の設定例

### Vercel を使う場合
```
タイプ: A
ホスト: @
値: 76.76.21.21
TTL: 3600

タイプ: CNAME
ホスト: www
値: cname.vercel-dns.com
TTL: 3600
```

### AWS (CloudFront/S3) を使う場合
```
タイプ: CNAME
ホスト: www
値: d1234567890.cloudfront.net
TTL: 3600

# Route 53を使う場合はALIASレコードも可能
```

### 従来のVPS/専用サーバーを使う場合
```
タイプ: A
ホスト: @
値: サーバーのIPアドレス
TTL: 3600

タイプ: A
ホスト: www
値: サーバーのIPアドレス
TTL: 3600
```

## 追加で設定したい項目

### メール関連（必要な場合）
```
# MXレコード
タイプ: MX
ホスト: @
値: mail.aixbiz.jp (または外部メールサービス)
優先度: 10
TTL: 3600

# SPFレコード
タイプ: TXT
ホスト: @
値: "v=spf1 include:_spf.google.com ~all"
TTL: 3600
```

### SSL証明書の検証用
```
# Let's Encrypt等の認証用
タイプ: TXT
ホスト: _acme-challenge
値: 証明書発行時に提供される値
TTL: 300
```

## 設定手順

1. **ドメイン管理画面にログイン**
   - お名前.com、ムームードメイン、バリュードメイン等

2. **DNS設定/ネームサーバー設定を選択**

3. **上記のレコードを追加**

4. **反映を待つ**
   - 通常15分〜48時間程度
   - `nslookup aixbiz.jp` で確認可能

## 確認コマンド

```bash
# Aレコードの確認
nslookup aixbiz.jp

# DNSレコード全体の確認
dig aixbiz.jp ANY

# 特定のレコードタイプを確認
dig aixbiz.jp A
dig aixbiz.jp CNAME
dig aixbiz.jp MX
```

## 注意事項

- **TTL（Time To Live）**: 変更予定がある場合は300秒など短めに設定
- **プロパゲーション**: DNS変更は全世界に反映されるまで時間がかかる
- **ネームサーバー**: ドメインレジストラのDNSを使うか、外部DNS（Cloudflare等）を使うか選択

## セキュリティ関連の推奨設定

### CAA レコード（SSL証明書の発行制限）
```
タイプ: CAA
ホスト: @
値: 0 issue "letsencrypt.org"
TTL: 3600
```

### DNSSEC
- ドメインレジストラが対応している場合は有効化を推奨
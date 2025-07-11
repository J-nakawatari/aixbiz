# 本番サーバー ポート使用状況確認コマンド

## 1. 全ポート使用状況を確認

### netstatを使う方法
```bash
# 全てのリスニングポートを表示（プロセス名付き）
sudo netstat -tlnp

# TCPとUDP両方を確認
sudo netstat -tulnp

# 数値で表示（名前解決しない）
sudo netstat -tulnp | grep LISTEN
```

### ssコマンドを使う方法（推奨・高速）
```bash
# 全てのリスニングポートを表示
sudo ss -tlnp

# TCPとUDP両方を確認
sudo ss -tulnp

# プロセス情報付きで表示
sudo ss -tulnp | grep LISTEN
```

### lsofを使う方法
```bash
# 全てのネットワーク接続を表示
sudo lsof -i -P -n

# リスニングポートのみ表示
sudo lsof -i -P -n | grep LISTEN

# TCPポートのみ
sudo lsof -i tcp -P -n | grep LISTEN
```

## 2. 整理して見やすく表示

### ポート番号順にソート
```bash
# ポート番号でソート（小さい順）
sudo ss -tlnp | grep LISTEN | sort -t: -k2 -n

# カスタムフォーマットで表示
sudo netstat -tlnp | grep LISTEN | awk '{print $4 "\t" $7}' | sort -t: -k2 -n
```

### 特定の範囲のポートを確認
```bash
# 3000番台のポート
sudo ss -tlnp | grep -E ':3[0-9]{3}'

# 4000番台のポート
sudo ss -tlnp | grep -E ':4[0-9]{3}'

# 27000番台（MongoDB系）
sudo ss -tlnp | grep -E ':27[0-9]{3}'
```

## 3. よく使う実用的なコマンド

### ポートとプロセスの一覧（見やすい形式）
```bash
# ポート、プロセス名、PIDを表示
sudo ss -tlnp | grep LISTEN | awk '{split($4,a,":"); split($7,b,","); print a[length(a)] "\t" b[2]}' | sort -n | column -t
```

### Node.js関連のポートのみ表示
```bash
# Node.jsプロセスが使用しているポート
sudo lsof -i -P -n | grep node | grep LISTEN
```

### Nginx関連のポートのみ表示
```bash
# Nginxプロセスが使用しているポート
sudo lsof -i -P -n | grep nginx | grep LISTEN
```

## 4. 結果を保存して確認

### ファイルに保存
```bash
# 現在のポート使用状況を保存
sudo ss -tulnp > ~/port_usage_$(date +%Y%m%d_%H%M%S).txt

# 見やすい形式で保存
echo "=== Port Usage Report $(date) ===" > ~/port_report.txt
echo "" >> ~/port_report.txt
echo "Port    Process" >> ~/port_report.txt
echo "----    -------" >> ~/port_report.txt
sudo ss -tlnp | grep LISTEN | awk '{split($4,a,":"); print a[length(a)] "\t" $7}' | sort -n >> ~/port_report.txt
```

## 5. 一発で全体像を把握するコマンド

```bash
# おすすめ：整形された一覧表示
sudo ss -tlnp | grep LISTEN | awk '{
    split($4, addr, ":");
    port = addr[length(addr)];
    split($7, proc, "\"");
    process = proc[2];
    printf "%-10s %-30s\n", port, process
}' | sort -n | uniq
```

## 実行例の出力イメージ
```
22         sshd
80         nginx
443        nginx
3000       node
3001       node
3002       node
3003       node
3004       node
4000       node
4001       node
4002       node
4003       node
4004       node
27017      mongod
27018      mongod
27019      mongod
27020      mongod
```

## 注意事項
- sudoが必要：プロセス情報を表示するには管理者権限が必要
- grepやawkの使い方は環境により微調整が必要な場合あり
- ssコマンドがない場合はnetstatを使用（古いシステム）
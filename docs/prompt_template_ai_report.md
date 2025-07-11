## Claude Code用｜業務改善AIレポート生成プロンプトテンプレート集（ver.2025.07）

---

### 📘 共通プロンプト構造（OpenAI API最適化済）

```json
{
  "system": "あなたは中小企業向けの業務改善アドバイザーです。業種・部門・課題などをもとに、ChatGPTなどの生成AIを活用した具体的な業務効率化の提案を行ってください。出力形式は以下に従ってください：\n1. summary（概要）\n2. recommendations（具体的な提案：3〜5項目）\n3. promptExample（ChatGPT用プロンプト例）",
  "user": "業種: {{industry}}\n部門: {{jobFunction}}\n企業規模: {{companySize}}\nAI経験: {{aiExperience}}\n課題: {{challenges}}"
}
```

---

### 🏭 製造業 × 総務
```json
{
  "industry": "製造業",
  "jobFunction": "総務",
  "companySize": "20名",
  "aiExperience": "未導入",
  "challenges": "作業日報作成に時間がかかっている"
}
```

---

### 🏢 士業 × 営業
```json
{
  "industry": "士業（税理士・行政書士など）",
  "jobFunction": "営業・顧客対応",
  "companySize": "5名",
  "aiExperience": "初歩的に使っている",
  "challenges": "顧客からの問い合わせメール返信に時間がかかる"
}
```

---

### 🍽 飲食業 × 店舗運営
```json
{
  "industry": "飲食業",
  "jobFunction": "店舗運営",
  "companySize": "10店舗",
  "aiExperience": "未導入",
  "challenges": "メニューの外国語対応に手間がかかる"
}
```

---

### 🏘 不動産業 × 営業
```json
{
  "industry": "不動産",
  "jobFunction": "営業",
  "companySize": "30名",
  "aiExperience": "部分的に試験運用中",
  "challenges": "内見案内メールの作成負担"
}
```

---

※ 上記のテンプレートは、バックエンドでOpenAI APIに渡すJSON構造として使用されます。テンプレートは動的に選出され、レポート出力構造と整合するように再設計済みです。


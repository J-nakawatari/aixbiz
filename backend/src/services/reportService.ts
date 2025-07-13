interface ReportData {
  summary: string;
  recommendations: string[];
  promptExample: string;
  version: string;
}

export function generateHTMLReport(data: ReportData): string {
  // エスケープ処理（XSS対策）
  const escapeHtml = (text: string): string => {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, (m) => map[m]);
  };

  // 推奨事項のリストを生成
  const recommendationsList = data.recommendations
    .map(rec => `<li>${escapeHtml(rec)}</li>`)
    .join('\n');

  // シンプルなHTMLテンプレート
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI業務改善診断レポート</title>
    <style>
        body {
            font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 10px;
        }
        h2 {
            color: #4f46e5;
            margin-top: 30px;
        }
        .summary {
            background-color: #f0f4ff;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .recommendations {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 5px;
        }
        .recommendations ul {
            margin: 10px 0;
            padding-left: 25px;
        }
        .recommendations li {
            margin: 10px 0;
        }
        .prompt-example {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #e5e7eb;
            font-family: monospace;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI業務改善診断レポート</h1>
        
        <div class="summary">
            <h2>診断結果の概要</h2>
            <p>${escapeHtml(data.summary)}</p>
        </div>

        <div class="recommendations">
            <h2>具体的な改善提案</h2>
            <ul>
                ${recommendationsList}
            </ul>
        </div>

        <h2>ChatGPT活用例</h2>
        <div class="prompt-example">
${escapeHtml(data.promptExample)}
        </div>

        <div class="footer">
            <p>AI導入ナビゲーター by aixbiz</p>
            <p>レポートバージョン: ${escapeHtml(data.version)}</p>
            <p>生成日時: ${new Date().toLocaleString('ja-JP')}</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}
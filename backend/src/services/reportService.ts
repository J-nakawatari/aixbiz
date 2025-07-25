interface Recommendation {
  title: string;
  description: string;
  expectedEffect: string;
  difficulty: string;
  timeframe: string;
}

interface ReportData {
  summary: string;
  recommendations: Recommendation[];
  implementation: string;
  reportId: string;
  generatedAt: string;
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

  // 推奨事項のカードを生成
  const recommendationsCards = data.recommendations
    .map((rec, index) => `
    <div class="recommendation-card">
      <div class="recommendation-header">
        <h3>${index + 1}. ${escapeHtml(rec.title)}</h3>
        <span class="difficulty ${rec.difficulty}">${escapeHtml(rec.difficulty)}難易度</span>
      </div>
      <p class="description">${escapeHtml(rec.description)}</p>
      <div class="meta">
        <div class="effect">
          <strong>期待効果:</strong> ${escapeHtml(rec.expectedEffect)}
        </div>
        <div class="timeframe">
          <strong>導入期間:</strong> ${escapeHtml(rec.timeframe)}
        </div>
      </div>
    </div>
  `).join('\n');

  // シンプルなHTMLテンプレート
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI業務改善診断レポート</title>
    <style>
        @page {
            margin: 5mm 10mm;
            size: A4;
        }
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
            page-break-after: avoid;
            break-after: avoid;
        }
        .summary {
            background-color: #f0f4ff;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .recommendations {
            margin: 20px 0;
        }
        .recommendation-card {
            background-color: #f9fafb;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .recommendation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .recommendation-header h3 {
            color: #4f46e5;
            margin: 0;
            font-size: 1.2em;
        }
        .difficulty {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .difficulty.低 {
            background-color: #d1fae5;
            color: #047857;
        }
        .difficulty.中 {
            background-color: #fed7aa;
            color: #c2410c;
        }
        .difficulty.高 {
            background-color: #fee2e2;
            color: #dc2626;
        }
        .description {
            margin: 10px 0;
            line-height: 1.6;
        }
        .meta {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.9em;
        }
        .implementation {
            background-color: #f0f4ff;
            padding: 20px;
            border-radius: 5px;
            border-left: 4px solid #4f46e5;
            margin: 20px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 0.9em;
        }
        .download-button {
            display: block;
            margin: 30px auto;
            padding: 12px 30px;
            background-color: #4f46e5;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .download-button:hover {
            background-color: #4338ca;
        }
        @media print {
            .download-button {
                display: none;
            }
        }
    </style>
    <script>
        async function downloadPDF() {
            const button = document.querySelector('.download-button');
            const originalText = button.textContent;
            
            try {
                // ボタンを無効化してローディング表示
                button.disabled = true;
                button.textContent = 'PDF生成中...';
                
                // レポートIDを取得（DOM要素から直接取得）
                const reportIdElement = document.getElementById('report-id');
                const reportId = reportIdElement ? reportIdElement.textContent : 'report';
                
                console.log('Extracted report ID:', reportId);
                
                // PDFダウンロード用の一時トークンを使用する方法（より安全）
                const tokenResponse = await fetch('/api/pdf/download-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reportId: reportId
                    }),
                    credentials: 'include'
                });
                
                if (!tokenResponse.ok) {
                    throw new Error('トークン取得に失敗しました');
                }
                
                const { token } = await tokenResponse.json();
                
                // トークンを使用してPDFをダウンロード（CSRFトークン不要）
                button.textContent = 'ダウンロード中...';
                window.location.href = \`/api/pdf/download/\${reportId}?token=\${encodeURIComponent(token)}\`;
                
                // 3秒後にボタンを元に戻す
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = originalText;
                }, 3000);
                
            } catch (error) {
                alert('PDF生成中にエラーが発生しました。もう一度お試しください。');
                console.error('PDF generation error:', error);
                // エラー時は即座にボタンを元に戻す
                button.disabled = false;
                button.textContent = originalText;
            }
        }
    </script>
</head>
<body>
    <div class="container">
        <h1>AI業務改善診断レポート</h1>
        
        <div class="summary">
            <h2>診断結果の概要</h2>
            <p>${escapeHtml(data.summary)}</p>
        </div>

        <h2>具体的な改善提案</h2>
        <div class="recommendations">
            ${recommendationsCards}
        </div>

        <h2>導入に向けたロードマップ</h2>
        <div class="implementation">
            ${data.implementation}
        </div>

        <button class="download-button" onclick="downloadPDF()">PDFをダウンロード</button>

        <div class="footer">
            <p>AI導入ナビゲーター by aixbiz</p>
            <p>レポートID: <span id="report-id">${escapeHtml(data.reportId)}</span></p>
            <p>生成日時: ${new Date(data.generatedAt).toLocaleString('ja-JP')}</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}
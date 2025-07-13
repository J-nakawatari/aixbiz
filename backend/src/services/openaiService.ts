import OpenAI from 'openai';
import { config } from '../config/config';

// OpenAIクライアントの初期化
if (!config.openaiApiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

interface ReportInput {
  industry: string;
  jobFunction: string;
  challenges: string;
  companySize: string;
  aiExperience: string;
}

interface Recommendation {
  title: string;
  description: string;
  expectedEffect: string;
  difficulty: string;
  timeframe: string;
}

interface ReportOutput {
  summary: string;
  recommendations: Recommendation[];
  implementation: string;
  reportId: string;
  generatedAt: string;
}

export async function generateAIReport(input: ReportInput): Promise<ReportOutput> {
  try {
    // APIキーの確認
    if (!config.openaiApiKey || config.openaiApiKey === '') {
      throw new Error('OPENAI_API_KEY_MISSING');
    }

    // システムプロンプト
    const systemPrompt = `あなたは中小企業向けのAI業務改善専門コンサルタントです。
提供された業種・部門・課題に基づいて、AIを活用した具体的で実践的な業務改善提案を作成してください。

出力は必ず以下のJSON形式で返してください：
{
  "summary": "診断結果の概要（200-300文字）。現状の課題認識、AI導入による改善ポイント、期待される効果を含めて具体的に記述",
  "recommendations": [
    {
      "title": "提案タイトル",
      "description": "具体的な改善内容（100-150文字）",
      "expectedEffect": "期待される効果（50-100文字）",
      "difficulty": "導入難易度（低/中/高）",
      "timeframe": "導入期間の目安"
    }
  ],
  "implementation": "導入に向けた具体的なステップ（200-300文字）。優先順位、必要なリソース、注意点を含む"
}

提案は最低4つ、最大6つ作成してください。
各提案は実現可能で具体的な内容にしてください。

重要な指示：
1. 「AIツール」のような抽象的な表現は避け、具体的なツール名（ChatGPT、Claude、Notion AI、DeepL、文字起こしツール等）を必ず記載
2. 現在の作業時間と改善後の作業時間を数値で示す（例：「日報作成が30分→5分に短縮」）
3. 具体的な業務フローの変化を説明（例：「手書きメモ→Excel転記→集計」が「音声入力→自動集計」に）
4. 費用の目安も含める（月額○○円程度）
5. 業種・部門に特化した具体例を使用`;

    // ユーザープロンプト
    const userPrompt = `業種: ${input.industry}
部門: ${input.jobFunction}
企業規模: ${input.companySize}
AI経験: ${input.aiExperience}
課題: ${input.challenges}`;

    // OpenAI APIの呼び出し
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 品質とコストのバランスが良いモデル
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000, // より詳細なレポートのため増加
      response_format: { type: "json_object" } // JSON形式を強制
    });

    // レスポンスの解析
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI APIからの応答が空です');
    }

    const parsedResponse = JSON.parse(content);
    
    // レポートIDを生成（タイムスタンプベース）
    const timestamp = new Date().toISOString();
    
    return {
      ...parsedResponse,
      reportId: `RPT-${Date.now()}`,
      generatedAt: timestamp
    };

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    // エラーメッセージをより詳細に
    let errorMessage = "申し訳ございません。レポート生成中にエラーが発生しました。";
    
    if (error.message === 'OPENAI_API_KEY_MISSING') {
      errorMessage = "OpenAI APIキーが設定されていません。管理者にお問い合わせください。";
    } else if (error.code === 'invalid_api_key') {
      errorMessage = "APIキーの設定に問題があります。管理者にお問い合わせください。";
    } else if (error.status === 429) {
      errorMessage = "現在アクセスが集中しています。しばらく待ってから再度お試しください。";
    } else if (error.status === 401) {
      errorMessage = "認証エラーが発生しました。管理者にお問い合わせください。";
    } else if (error.response?.data?.error?.message) {
      errorMessage = `エラー: ${error.response.data.error.message}`;
    }
    
    return {
      summary: errorMessage,
      recommendations: [],
      implementation: "エラーの詳細: " + (error.message || "不明なエラー"),
      reportId: `ERR-${Date.now()}`,
      generatedAt: new Date().toISOString()
    };
  }
}
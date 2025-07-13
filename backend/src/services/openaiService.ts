import OpenAI from 'openai';
import { config } from '../config/config';

// OpenAIクライアントの初期化
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

interface ReportOutput {
  summary: string;
  recommendations: string[];
  promptExample: string;
  reportId: string;
  generatedAt: string;
}

export async function generateAIReport(input: ReportInput): Promise<ReportOutput> {
  try {
    // システムプロンプト
    const systemPrompt = `あなたは中小企業向けの業務改善アドバイザーです。業種・部門・課題などをもとに、ChatGPTなどの生成AIを活用した具体的な業務効率化の提案を行ってください。

出力は必ず以下のJSON形式で返してください：
{
  "summary": "提案の概要（100文字程度）",
  "recommendations": ["具体的な提案1", "具体的な提案2", "具体的な提案3"],
  "promptExample": "ChatGPTで実際に使える具体的なプロンプト例（200-300文字程度）。必ず「以下の〜」で始まり、具体的な指示と出力形式を含めること"
}

promptExampleの要件：
- 実際にコピペして使える完全なプロンプトにすること
- 業種と部門に特化した具体的な内容にすること
- 「以下の〜から〜を作成してください」という形式で始めること
- 出力形式や条件を明確に指定すること`;

    // ユーザープロンプト
    const userPrompt = `業種: ${input.industry}
部門: ${input.jobFunction}
企業規模: ${input.companySize}
AI経験: ${input.aiExperience}
課題: ${input.challenges}`;

    // OpenAI APIの呼び出し
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // コスト削減のためGPT-3.5を使用
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
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

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // エラー時のフォールバック
    return {
      summary: "申し訳ございません。レポート生成中にエラーが発生しました。",
      recommendations: ["しばらく時間をおいてから再度お試しください"],
      promptExample: "",
      reportId: `ERR-${Date.now()}`,
      generatedAt: new Date().toISOString()
    };
  }
}
"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Target } from "lucide-react";
import { csrfManager } from "../../utils/csrf";

// 業種ごとの部門・業務の定義
const departmentsByIndustry: Record<string, string[]> = {
  "製造業": ["生産管理", "品質管理", "在庫管理", "営業・マーケティング", "経理・総務", "人事"],
  "士業": ["案件管理", "書類作成", "顧客対応", "マーケティング", "経理・事務", "リサーチ"],
  "飲食業": ["店舗運営", "仕入れ・在庫管理", "シフト管理", "顧客対応", "マーケティング", "経理"],
  "不動産": ["物件管理", "顧客対応", "契約管理", "営業・マーケティング", "経理・総務"],
  "小売業": ["店舗運営", "在庫管理", "顧客対応", "EC運営", "マーケティング", "経理"],
  "IT・Web": ["開発", "プロジェクト管理", "カスタマーサポート", "営業・マーケティング", "人事", "経理"]
};

export default function DiagnosticSection() {
  const [formData, setFormData] = useState({
    industry: "",
    jobFunction: "",
    challenges: "",
    companySize: "10-50名", // デフォルト値
    aiExperience: "未導入" // デフォルト値
  });
  const [isLoading, setIsLoading] = useState(false);
  const [reportHtml, setReportHtml] = useState("");
  const [error, setError] = useState("");
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // レポート表示関数（セキュア版）
  const displayReport = (html: string, reportId: string) => {
    // 機能フラグで新旧切り替え
    const useIframeMode = process.env.NEXT_PUBLIC_USE_IFRAME_MODE !== 'false';
    
    if (useIframeMode) {
      // セキュアなiframe実装
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        // セキュリティヘッダーとスタイルを含むHTML
        const secureHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="X-Content-Type-Options" content="nosniff">
            <title>AI活用診断レポート</title>
            <style>
              body { margin: 0; padding: 0; font-family: sans-serif; }
              iframe { border: none; width: 100%; height: 100vh; }
            </style>
          </head>
          <body>
            <iframe 
              srcdoc="${html.replace(/"/g, '&quot;')}"
              sandbox="allow-scripts allow-forms allow-downloads allow-popups allow-same-origin"
              id="report-frame">
            </iframe>
          </body>
          </html>
        `;
        reportWindow.document.write(secureHtml);
        reportWindow.document.close();
        
      }
    } else {
      // 既存実装（移行期間中の互換性のため）
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(html);
        reportWindow.document.close();
      }
    }
  };

  // 業種が変更されたときに部門・業務を更新
  useEffect(() => {
    if (formData.industry && departmentsByIndustry[formData.industry]) {
      setAvailableDepartments(departmentsByIndustry[formData.industry]);
      // 部門・業務をリセット
      setFormData(prev => ({ ...prev, jobFunction: "" }));
    } else {
      setAvailableDepartments([]);
    }
  }, [formData.industry]);

  // バリデーション関数
  const validateField = (fieldName: string, value: string): string | null => {
    // 危険な文字パターンのチェック
    const dangerousPatterns = [
      { pattern: /<script[\s\S]*?>/gi, message: 'スクリプトタグは使用できません' },
      { pattern: /javascript:/gi, message: 'JavaScriptは使用できません' },
      { pattern: /on\w+\s*=/gi, message: 'イベントハンドラは使用できません' },
      { pattern: /<iframe/gi, message: 'iframeタグは使用できません' },
      { pattern: /<object/gi, message: 'objectタグは使用できません' },
      { pattern: /<embed/gi, message: 'embedタグは使用できません' }
    ];

    // 危険なパターンをチェック
    for (const { pattern, message } of dangerousPatterns) {
      if (pattern.test(value)) {
        // 開発環境では警告のみ
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Validation Warning] ${fieldName}: ${message}`);
        }
        return message;
      }
    }

    // 文字数制限
    const limits: Record<string, number> = {
      industry: 100,
      jobFunction: 100,
      challenges: 1000,
      companySize: 50
    };

    if (limits[fieldName] && value.length > limits[fieldName]) {
      return `${limits[fieldName]}文字以内で入力してください`;
    }

    return null;
  };

  // フィールド変更時のバリデーション
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // バリデーション実行
    const error = validateField(fieldName, value);
    setValidationErrors(prev => {
      if (error) {
        return { ...prev, [fieldName]: error };
      } else {
        const { [fieldName]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setReportHtml("");

    try {
      // 相対URLを使用（同一オリジン）
      const response = await csrfManager.fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          companySize: "10-50",    // 中小企業向けサービスなので固定
          aiExperience: "未導入"   // デフォルト値
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'レポート生成に失敗しました');
      }

      // セキュアな方法でレポートを表示
      displayReport(data.html, data.data.reportId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="diagnosis" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4 text-gray-800 text-[32px] font-bold leading-[48px]">
            まずは無料体験で<br />
            <span className="text-green-600">「AIの力」</span>を感じてください
          </h2>
          <p className="text-lg text-gray-600 text-[16px]">
            業種と業務を選ぶだけで、AI活用プロンプトを自動提案。その場で試せます。
          </p>
        </div>
        
        <Card className="p-8 bg-white border border-gray-200 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl mb-4 text-gray-800 flex items-center justify-center gap-2 text-[24px] font-bold">
              <Target className="w-8 h-8 text-green-600" />
              簡易AI活用診断
            </h3>
            <p className="text-gray-600 text-[16px]">
              わずか30秒で、御社に最適なAI活用法の一例をご提案します
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-gray-700 mb-2 text-[16px] font-bold">業種</label>
              <select 
                className={`w-full p-3 pr-10 border rounded-lg bg-white text-[16px] ${
                  validationErrors.industry ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.industry}
                onChange={(e) => handleFieldChange('industry', e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="製造業">製造業</option>
                <option value="士業">士業</option>
                <option value="飲食業">飲食業</option>
                <option value="不動産">不動産</option>
                <option value="小売業">小売業</option>
                <option value="IT・Web">IT・Web</option>
              </select>
              {validationErrors.industry && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.industry}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 text-[16px] font-bold">部門・業務</label>
              <select 
                className={`w-full p-3 pr-10 border rounded-lg bg-white text-[16px] disabled:bg-gray-100 disabled:text-gray-500 ${
                  validationErrors.jobFunction ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.jobFunction}
                onChange={(e) => handleFieldChange('jobFunction', e.target.value)}
                disabled={!formData.industry || availableDepartments.length === 0}
              >
                <option value="">
                  {formData.industry ? "選択してください" : "まず業種を選択してください"}
                </option>
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {validationErrors.jobFunction && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.jobFunction}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 text-[16px] font-bold">
                課題（オプション）
                <span className="text-gray-500 text-sm font-normal ml-2">最大1000文字</span>
              </label>
              <textarea 
                className={`w-full p-3 border rounded-lg h-20 resize-none text-[16px] ${
                  validationErrors.challenges ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例：顧客からの問い合わせ対応に時間がかかる"
                value={formData.challenges}
                onChange={(e) => handleFieldChange('challenges', e.target.value)}
                maxLength={1000}
              ></textarea>
              <div className="flex justify-between items-center mt-1">
                {validationErrors.challenges ? (
                  <p className="text-red-500 text-sm">{validationErrors.challenges}</p>
                ) : (
                  <span></span>
                )}
                <span className="text-gray-500 text-sm">
                  {formData.challenges.length}/1000
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 w-full text-[24px] px-[26px] py-[24px] px-[26px] py-[32px] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!formData.industry || !formData.jobFunction || isLoading}
            >
              {isLoading ? "診断中..." : "AI活用法を診断する"}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </Card>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-4">
            <strong>より詳しい診断をご希望の方は...</strong>
          </p>
          <p className="text-gray-600 text-[16px]">
            本格的な無料診断では、御社の具体的な業務フローを分析し、<br />
            より実践的で詳細なAI活用レポートをお渡しします
          </p>
        </div>
      </div>
    </section>
  );
}
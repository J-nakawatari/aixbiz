"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
  employeeCount: string;
  challenges: string[];
}

interface FormErrors {
  companyName?: string;
  contactName?: string;
  email?: string;
  industry?: string;
  employeeCount?: string;
  challenges?: string;
}

export default function CTASection() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactName: "",
    email: "",
    industry: "",
    employeeCount: "",
    challenges: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "会社名は必須です";
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "ご担当者名は必須です";
    }

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!formData.industry || formData.industry === "選択してください") {
      newErrors.industry = "業種を選択してください";
    }

    if (!formData.employeeCount || formData.employeeCount === "選択してください") {
      newErrors.employeeCount = "従業員数を選択してください";
    }

    if (formData.challenges.length === 0) {
      newErrors.challenges = "業務課題を1つ以上選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("お申し込みありがとうございます。後日担当者よりご連絡いたします。");
        // フォームリセット
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          industry: "",
          employeeCount: "",
          challenges: []
        });
        setErrors({});
      } else {
        alert("送信に失敗しました。お手数ですが、しばらくしてから再度お試しください。");
      }
    } catch (error) {
      alert("送信に失敗しました。お手数ですが、しばらくしてから再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChallengeChange = (challenge: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        challenges: [...prev.challenges, challenge]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        challenges: prev.challenges.filter(c => c !== challenge)
      }));
    }
  };

  return (
    <section id="cta" className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl mb-6 text-[32px] font-bold leading-[56px] md:leading-[56px]">
          <span className="text-yellow-300">AI活用について相談してみたい方へ</span>
        </h2>
        <p className="text-lg md:text-xl mb-8 text-indigo-100 text-[24px]">
          簡単な情報をご入力いただくと、<br />
          後日こちらからご提案差し上げます。
        </p>
        
        <Card className="bg-white text-gray-800 p-8 rounded-xl shadow-xl max-w-3xl mx-auto">
          <h3 className="text-2xl mb-6 text-center text-gray-800 text-[24px] font-bold">AI導入のご相談はこちらから</h3>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className={`w-full p-3 border rounded-lg text-[16px] ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="株式会社aixbiz"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.companyName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">
                  ご担当者名 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className={`w-full p-3 border rounded-lg text-[16px] ${
                    errors.contactName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="山田 太郎"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                />
                {errors.contactName && (
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.contactName}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                className={`w-full p-3 border rounded-lg text-[16px] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your-email@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                onBlur={() => {
                  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    setErrors(prev => ({ ...prev, email: "有効なメールアドレスを入力してください" }));
                  } else if (formData.email) {
                    setErrors(prev => {
                      const { email, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">
                  業種 <span className="text-red-500">*</span>
                </label>
                <select 
                  className={`w-full p-3 pr-10 border rounded-lg bg-white text-[16px] ${
                    errors.industry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                >
                  <option value="">選択してください</option>
                  <option value="製造業">製造業</option>
                  <option value="士業">士業</option>
                  <option value="飲食業">飲食業</option>
                  <option value="不動産">不動産</option>
                  <option value="小売業">小売業</option>
                  <option value="IT・Web">IT・Web</option>
                  <option value="その他">その他</option>
                </select>
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.industry}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">
                  従業員数 <span className="text-red-500">*</span>
                </label>
                <select 
                  className={`w-full p-3 pr-10 border rounded-lg bg-white text-[16px] ${
                    errors.employeeCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.employeeCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: e.target.value }))}
                >
                  <option value="">選択してください</option>
                  <option value="1-5名">1-5名</option>
                  <option value="6-20名">6-20名</option>
                  <option value="21-50名">21-50名</option>
                  <option value="51-100名">51-100名</option>
                  <option value="101名以上">101名以上</option>
                </select>
                {errors.employeeCount && (
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.employeeCount}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 text-[16px] font-bold text-left">
                現在の業務課題（複数選択可） <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  "業務効率化が必要",
                  "人手不足",
                  "顧客対応の改善", 
                  "データ分析の強化",
                  "社内コミュニケーション",
                  "書類・文書作成の効率化"
                ].map((task, index) => (
                  <label key={index} className="flex items-center cursor-pointer p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 bg-white hover:bg-indigo-50">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={formData.challenges.includes(task)}
                      onChange={(e) => handleChallengeChange(task, e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                      formData.challenges.includes(task) 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'bg-white border-gray-300'
                    }`}>
                      {formData.challenges.includes(task) && (
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 text-[16px] select-none">{task}</span>
                  </label>
                ))}
              </div>
              {errors.challenges && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.challenges}</p>
              )}
            </div>
            
            <Button 
              type="submit"
              size="lg" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg px-[21px] py-[24px] py-[32px] text-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "AI導入の相談申し込み"}
            </Button>
          </form>
        </Card>
        

        
        <div className="mt-12 pt-8 border-t border-indigo-500">
          <p className="text-sm text-indigo-200 text-[16px]">
            ※ご入力いただいた情報は、診断レポートの作成およびフォローアップメールの送信のみに使用いたします。<br />
            第三者への提供や営業目的での利用は一切行いません。
          </p>
        </div>
      </div>
    </section>
  );
}
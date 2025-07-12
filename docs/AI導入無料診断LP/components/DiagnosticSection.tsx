import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Target } from "lucide-react";

export default function DiagnosticSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4 text-gray-800 text-[32px] font-bold">
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
              <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold">業種</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-[16px]">
                <option>選択してください</option>
                <option>製造業</option>
                <option>士業</option>
                <option>飲食業</option>
                <option>不動産</option>
                <option>小売業</option>
                <option>IT・Web</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold">部門・業務</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-[16px]">
                <option>選択してください</option>
                <option>営業・マーケティング</option>
                <option>経理・総務</option>
                <option>人事</option>
                <option>カスタマーサポート</option>
                <option>製造・生産</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold">課題（オプション）</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none text-[16px]"
                placeholder="例：顧客からの問い合わせ対応に時間がかかる"
              ></textarea>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 w-full text-[24px] px-[26px] py-[24px] px-[26px] py-[32px]"
            >
              AI活用法を診断する
            </Button>
          </div>
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
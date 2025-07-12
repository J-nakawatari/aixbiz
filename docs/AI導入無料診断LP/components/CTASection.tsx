import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function CTASection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl mb-6 text-[32px] font-bold">
          まずは無料診断から。<br />
          <span className="text-indigo-100">3分の入力</span>で、御社に合ったAI活用法をご提案！
        </h2>
        
        <p className="text-lg md:text-xl mb-8 text-indigo-100">
          診断結果はその場で自動生成。<br />
          メールアドレスを登録すると後日フォローアップも届きます。
        </p>
        
        <Card className="bg-white text-gray-800 p-8 rounded-xl shadow-xl max-w-3xl mx-auto">
          <h3 className="text-2xl mb-6 text-center text-gray-800 text-[24px] font-bold">無料AI業務改善診断</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">会社名</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-[16px]"
                  placeholder="株式会社aixbiz"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">お名前</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-[16px]"
                  placeholder="山田 太郎"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">メールアドレス</label>
              <input 
                type="email" 
                className="w-full p-3 border border-gray-300 rounded-lg text-[16px]"
                placeholder="your-email@example.com"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">業種</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                  <option>選択してください</option>
                  <option>製造業</option>
                  <option>士業</option>
                  <option>飲食業</option>
                  <option>不動産</option>
                  <option>小売業</option>
                  <option>IT・Web</option>
                  <option>その他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-[16px] font-bold text-left">従業員数</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                  <option>選択してください</option>
                  <option>1-5名</option>
                  <option>6-20名</option>
                  <option>21-50名</option>
                  <option>51-100名</option>
                  <option>101名以上</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2 text-[16px]">現在の業務課題（複数選択可）</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  "業務効率化が必要",
                  "人手不足",
                  "顧客対応の改善", 
                  "データ分析の強化",
                  "社内コミュニケーション",
                  "書類・文書作成の効率化"
                ].map((task, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" className="mr-3 text-[16px]" />
                    <span className="text-sm text-gray-700 text-[16px]">{task}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button 
              type="submit"
              size="lg" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg px-[21px] py-[24px] py-[32px] text-[24px]"
            >
              無料診断を受ける
            </Button>
            
            <p className="text-xs text-gray-500 text-center text-[16px]">
              個人情報は診断結果の送付およびフォローアップにのみ使用します。
            </p>
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
import { Search, Rocket, ClipboardList, Handshake } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "ChatGPTなどのAIツールを業務にどう活かせるかを診断",
      description: "御社の業種・業務内容に合わせて、すぐに効果が出るAI活用方法を診断します。特別なシステム開発は不要です。"
    },
    {
      icon: Rocket, 
      title: "自社で\"すぐ始められる\"使い方やプロンプトも提案",
      description: "診断結果には、すぐにコピー＆ペーストで使えるAIプロンプト例も含まれています。明日から使えます。"
    },
    {
      icon: ClipboardList,
      title: "専門家ではなくてもわかる・実行できるレポート形式",
      description: "AI初心者でも理解できる平易な言葉で解説。社内展開もスムーズに行えます。"
    },
    {
      icon: Handshake,
      title: "開発やツール販売は行わず、現場視点で最適な提案",
      description: "ベンダーのような高額な開発費は不要。中立的な立場から、最適なAI活用法をアドバイスします。"
    }
  ];

  return (
    <section id="features" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4 text-gray-800 text-[32px] font-bold leading-[48px]">
            AI導入の「はじめの一歩」を<br />
            <span className="text-green-600">中立の立場</span>からご提案します
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto text-[16px]">
            システム開発やツール販売ではなく、御社の業務に合わせた実践的なAI活用方法をご提案します
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-3 text-gray-800 leading-relaxed text-[16px] font-bold">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-[16px]">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
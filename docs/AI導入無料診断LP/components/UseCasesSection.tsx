import image_b9b7469b1a20c9604131cdc2367c680e8b6dc640 from 'figma:asset/b9b7469b1a20c9604131cdc2367c680e8b6dc640.png';
import image_6360419969235edc5cb3a33b91d59de9dc7ac77a from 'figma:asset/6360419969235edc5cb3a33b91d59de9dc7ac77a.png';
import image_bd1409478526ebdf38686150c1f1e7b5f86e7a8e from 'figma:asset/bd1409478526ebdf38686150c1f1e7b5f86e7a8e.png';
import image_d9c459ec3d46336d964034d350b6f6c96d223327 from 'figma:asset/d9c459ec3d46336d964034d350b6f6c96d223327.png';
import image_f177aaca948bb710ffe26a8d7852723ae1196f1b from 'figma:asset/f177aaca948bb710ffe26a8d7852723ae1196f1b.png';
import image_084cb252a520af8ebe2346c5f5c41eccb901921a from 'figma:asset/084cb252a520af8ebe2346c5f5c41eccb901921a.png';
import manufacturingIcon from "figma:asset/da32be4c64e4b3d06c4e541ad3557a170ae10357.png";
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function UseCasesSection() {
  const useCases = [
    {
      industry: "製造業",
      examples: ["作業手順書の自動作成", "設備点検記録の要約", "品質管理レポートの分析"],
      customIcon: manufacturingIcon
    },
    {
      industry: "士業",
      examples: ["契約文書の要約", "メール返信の自動化", "法律文書のドラフト作成"],
      unsplashImage: image_f177aaca948bb710ffe26a8d7852723ae1196f1b
    },
    {
      industry: "飲食業",
      examples: ["レシピ文書化", "外国語対応メニュー生成", "在庫管理の効率化"],
      unsplashImage: image_d9c459ec3d46336d964034d350b6f6c96d223327
    },
    {
      industry: "不動産",
      examples: ["問い合わせ自動応答", "内見案内の自動返信", "物件説明文の生成"],
      unsplashImage: image_bd1409478526ebdf38686150c1f1e7b5f86e7a8e
    },
    {
      industry: "小売業", 
      examples: ["商品説明文の作成", "よくある質問の生成", "顧客レビューの分析"],
      unsplashImage: image_6360419969235edc5cb3a33b91d59de9dc7ac77a
    },
    {
      industry: "IT・Web",
      examples: ["コード説明・改善提案", "マニュアル作成の効率化", "バグレポート分析"],
      unsplashImage: image_b9b7469b1a20c9604131cdc2367c680e8b6dc640
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4 text-gray-800 text-[32px] font-bold">
            さまざまな業種・部門で<br />
            <span className="text-green-600">活用が広がっています</span>
          </h2>
          <p className="text-lg text-gray-600 text-[16px]">
            御社の業種でも、きっと活用できるAI活用法が見つかります
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            return (
              <div key={index} className="bg-slate-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 border border-slate-100">
                <div className="text-center mb-4">
                  {useCase.customIcon ? (
                    <img 
                      src={useCase.customIcon} 
                      alt={`${useCase.industry}アイコン`} 
                      className="w-16 h-16 mx-auto mb-3 object-contain"
                    />
                  ) : (
                    <ImageWithFallback
                      src={useCase.unsplashImage}
                      alt={`${useCase.industry}アイコン`}
                      className="w-16 h-16 mx-auto mb-3 object-cover rounded-lg"
                    />
                  )}
                  <h3 className="text-xl text-indigo-500 font-bold text-[24px]">{useCase.industry}</h3>
                </div>
                <div className="space-y-3">
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                      <p className="text-slate-700 text-[16px]">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-4">
            <strong>まだまだあります！</strong>
          </p>
          <p className="text-gray-600 text-[16px]">
            無料診断では、御社の業種・業務に特化した活用法をより詳しくご提案いたします
          </p>
        </div>
      </div>
    </section>
  );
}
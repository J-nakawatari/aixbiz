import { ImageWithFallback } from './ImageWithFallback';

export default function ProblemsSection() {
  const problems = [
    {
      title: "AIを導入したいが、何から始めればいいか不明",
      description: "最初の一歩が分からず、貴重な時間とリソースを無駄にしていませんか？"
    },
    {
      title: "ChatGPTを試したけど業務活用に落とし込めない", 
      description: "AIツールを使ってみたものの、本当の業務効率化につながっていませんか？"
    },
    {
      title: "ツールは揃えたけど、社内で使われない",
      description: "導入したAIツールが宝の持ち腐れになっていませんか？"
    },
    {
      title: "ベンダーに頼むほどの規模じゃないが効率化したい",
      description: "中小企業でも手軽に始められるAI活用法をお探しですか？"
    }
  ];

  return (
    <section id="problems" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl mb-4 text-gray-800 font-bold text-[32px]">
          こんなお悩みはありませんか？
        </h2>
        <p className="text-lg mb-12 text-gray-600">
          多くの中小企業様が同じような課題を抱えています
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="p-8 rounded-xl shadow-sm border border-gray-100" style={{backgroundColor: '#EFF6FF'}}>
              <div className="flex items-start">
                <ImageWithFallback
                  src="/images/finger-icon.png"
                  alt="お悩みポイント"
                  width={48}
                  height={48}
                  className="w-12 h-12 mr-6 mt-1 flex-shrink-0 object-contain"
                />
                <div className="text-left">
                  <h3 className="text-lg mb-3 text-gray-800 leading-relaxed font-bold">{problem.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
          <p className="text-lg text-green-800">
            <strong>安心してください！</strong><br />
            これらの課題は、AI×Bizで解決できます
          </p>
        </div>
      </div>
    </section>
  );
}
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "AIの導入までしてもらえるのですか？",
      answer: "高額な開発費用は不要です。ChatGPT、Claude、Geminiなど、今すぐ使える生成AIツールを活用した実践的な業務改善プランをご提案。御社の課題に最適なツール選定から、具体的な活用シナリオ、効果的なプロンプト作成まで、明日から使えるノウハウをお届けします。"
    },
    {
      question: "専門知識がなくても大丈夫ですか？",
      answer: "専門用語を使わず、誰でも理解・実行できる内容にまとめたレポートをお渡しします。AIに関する基礎知識がなくても、診断結果を見ながら実践できるよう配慮しています。"
    },
    {
      question: "費用はかかりますか？",
      answer: "無料診断は0円です。診断結果に基づいて、より詳細な分析や具体的な導入支援をご希望の場合は、有料コンサルティングも提供しています（診断後にご案内します）。ただし、無料診断だけでも十分な価値があり、具体的なAI活用法を知ることができます。"
    },
    {
      question: "どのくらいの時間がかかりますか？",
      answer: "お申し込みから診断レポートのお渡しまで、通常3〜5営業日程度です。お急ぎの場合はご相談ください。診断自体は1時間程度のオンライン面談で完了します。"
    },
    {
      question: "どんな業種でも対応可能ですか？",
      answer: "製造業、サービス業、士業、小売業など、幅広い業種に対応しています。業種特有の業務フローに合わせたAI活用法をご提案いたします。"
    },
    {
      question: "診断後に営業されることはありませんか？",
      answer: "しつこい営業は一切行いません。診断レポートをお渡しした後、ご希望があれば有料コンサルティングのご案内をする程度です。お客様のペースを大切にいたします。"
    }
  ];

  return (
    <section id="faq" className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4 text-gray-800 text-[32px] font-bold">
            よくある質問
          </h2>
          <p className="text-lg text-gray-600 text-[16px]">
            皆様からよくいただくご質問にお答えします
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="text-gray-800 text-left text-[18px] font-bold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600 leading-relaxed text-[16px]">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-4 text-[16px]">
            その他ご不明な点がございましたら
          </p>
          <p className="text-gray-600 text-[16px]">
            お気軽にお問い合わせください。専門スタッフが丁寧にお答えいたします。
          </p>
        </div>
      </div>
    </section>
  );
}
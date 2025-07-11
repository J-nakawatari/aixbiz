export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI導入ナビゲーター
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            中小企業向けAI活用診断サービス
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            ChatGPTなどの生成AIを活用して、あなたの業務を効率化する方法を無料で診断します
          </p>
          <div className="space-y-4">
            <a
              href="/diagnosis"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl"
            >
              無料診断を始める
            </a>
            <div>
              <a
                href="/tool"
                className="inline-block text-blue-600 hover:text-blue-800 underline font-medium"
              >
                プロンプト生成ツールを試す
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
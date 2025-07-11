export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AIxBiz</h1>
              <span className="ml-2 text-sm text-purple-600 font-medium">AI導入ナビゲーター</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">サービス</a>
              <a href="#examples" className="text-gray-600 hover:text-gray-900 transition-colors">活用例</a>
              <a href="#trial" className="text-gray-600 hover:text-gray-900 transition-colors">無料体験</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">よくある質問</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">中小企業のためのAI業務改善診断</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            AI導入ナビゲーターが<br />
            <span className="text-yellow-300">&quot;いま必要な活用法&quot;</span>を<br />
            無料でご提案
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
            高額なシステムや複雑なAI導入は不要。<br />
            ChatGPTなど、すぐに使えるAIを活かして<br />
            御社の業務課題に合わせた効率化プランを診断・ご提案します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/diagnosis" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg">
              無料で診断を受ける
            </a>
            <a href="/tool" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors">
              まずは体験ツールから
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">こんなお悩みありませんか？</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <div className="text-red-400 text-3xl mb-3">😰</div>
              <p className="text-gray-700 font-medium">AIを導入したいが、何から始めればいいかわからない</p>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
              <div className="text-orange-400 text-3xl mb-3">🤔</div>
              <p className="text-gray-700 font-medium">ChatGPTを試したけど業務活用に落とし込めていない</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <div className="text-blue-400 text-3xl mb-3">😔</div>
              <p className="text-gray-700 font-medium">ツールは揃えたけど、社内で使われない</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
              <div className="text-purple-400 text-3xl mb-3">💭</div>
              <p className="text-gray-700 font-medium">ベンダーに頼むほどの規模じゃないけど効率化したい</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI導入の「はじめの一歩」を中立の立場からご提案します</h3>
            <p className="text-lg text-gray-600">専門家ではなくてもわかる・実行できるレポート形式でお届け</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:transform hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-blue-500 text-4xl mb-4">🎯</div>
              <h4 className="text-lg font-bold mb-3">業務診断</h4>
              <p className="text-gray-600 text-sm">ChatGPTなどのAIツールを業務にどう活かせるかを診断</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:transform hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-green-500 text-4xl mb-4">⚡</div>
              <h4 className="text-lg font-bold mb-3">即実行可能</h4>
              <p className="text-gray-600 text-sm">自社で&quot;すぐ始められる&quot;使い方やプロンプトも提案</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:transform hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-purple-500 text-4xl mb-4">📝</div>
              <h4 className="text-lg font-bold mb-3">わかりやすい</h4>
              <p className="text-gray-600 text-sm">専門家ではなくてもわかる・実行できるレポート形式</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:transform hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-orange-500 text-4xl mb-4">🤝</div>
              <h4 className="text-lg font-bold mb-3">中立的提案</h4>
              <p className="text-gray-600 text-sm">開発やツール販売は行わず、現場視点で提案</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="examples" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">さまざまな業種・部門で活用が広がっています</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-blue-600 text-3xl mb-4">🏭</div>
              <h4 className="text-xl font-bold mb-3 text-blue-900">製造業</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ 作業手順書の自動作成</li>
                <li>✓ 設備点検記録の要約</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-green-600 text-3xl mb-4">⚖️</div>
              <h4 className="text-xl font-bold mb-3 text-green-900">士業</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ 契約文書の要約</li>
                <li>✓ メール返信の自動化</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-orange-600 text-3xl mb-4">🍽️</div>
              <h4 className="text-xl font-bold mb-3 text-orange-900">飲食業</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ レシピ文書化</li>
                <li>✓ 外国語対応メニュー生成</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-purple-600 text-3xl mb-4">🏠</div>
              <h4 className="text-xl font-bold mb-3 text-purple-900">不動産</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ 問い合わせ自動応答</li>
                <li>✓ 内見案内の自動返信</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-pink-600 text-3xl mb-4">🛍️</div>
              <h4 className="text-xl font-bold mb-3 text-pink-900">小売業</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ 商品説明文の作成</li>
                <li>✓ よくある質問の生成</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-indigo-600 text-3xl mb-4">💼</div>
              <h4 className="text-xl font-bold mb-3 text-indigo-900">その他多数</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ 業種問わずカスタマイズ</li>
                <li>✓ 御社に最適な提案</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Section */}
      <section id="trial" className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">まずは無料体験で&quot;AIの力&quot;を感じてください</h3>
          <p className="text-xl mb-8 opacity-90">業種と業務を選ぶだけで、AI活用プロンプトを自動提案</p>
          
          <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto text-gray-900">
            <h4 className="text-xl font-bold mb-6">無料体験ツール</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-left font-medium mb-2">業種を選択</label>
                <select className="w-full p-3 border rounded-lg">
                  <option>製造業</option>
                  <option>士業</option>
                  <option>飲食業</option>
                  <option>不動産</option>
                  <option>小売業</option>
                  <option>その他</option>
                </select>
              </div>
              <div>
                <label className="block text-left font-medium mb-2">業務内容</label>
                <select className="w-full p-3 border rounded-lg">
                  <option>文書作成</option>
                  <option>顧客対応</option>
                  <option>データ整理</option>
                  <option>メール業務</option>
                  <option>その他</option>
                </select>
              </div>
              <a href="/tool" className="block w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors">
                プロンプトを生成する
              </a>
            </div>
            <p className="text-sm text-gray-600 mt-4">※ IP制限1日1回</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            まずは無料診断から。<br />
            <span className="text-purple-600">3分の入力</span>で、御社に合ったAI活用法をご提案！
          </h3>
          <p className="text-lg text-gray-700 mb-8">診断結果はその場で自動生成。メールアドレスを登録すると後日フォローアップも届きます。</p>
          <a href="/diagnosis" className="inline-block bg-purple-600 text-white px-12 py-4 rounded-lg font-bold text-xl hover:bg-purple-700 transition-colors shadow-lg">
            無料診断をはじめる
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">よくある質問</h3>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Q：AIの導入までしてもらえるのですか？</h4>
              <p className="text-gray-700">A：システム開発やツール販売は行いませんが、すぐ使えるAIツール（例：ChatGPT）を使って、御社に合った&quot;導入の方向性&quot;をご提案します。</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Q：専門知識がなくても大丈夫ですか？</h4>
              <p className="text-gray-700">A：専門用語を使わず、誰でも理解・実行できる内容にまとめたレポートをお渡しします。</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Q：費用はかかりますか？</h4>
              <p className="text-gray-700">A：無料診断は0円。有料コンサルはご希望に応じて提供可能です（診断後にご案内）。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">AIxBiz</h2>
            <p className="text-gray-400">AI導入ナビゲーター | 中小企業のためのAI業務改善診断サービス</p>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-500 text-sm">© 2025 AIxBiz. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
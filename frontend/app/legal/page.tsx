import type { Metadata } from 'next'
import SimpleHeader from '@/components/lp/SimpleHeader'
import Footer from '@/components/lp/Footer'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | AI×Biz',
  description: 'AI×Bizの特定商取引法に基づく表記',
  robots: 'index, follow',
}

export default function LegalPage() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>
          
          <div className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">事業者名</h2>
                <p className="mt-2">中渡 潤</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">運営責任者</h2>
                <p className="mt-2">中渡 潤</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">所在地</h2>
                <p className="mt-2">請求があった場合に開示いたします</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">連絡先</h2>
                <p className="mt-2">メールアドレス: info@aixbiz.jp</p>
                <p className="text-sm text-gray-600 mt-1">※お問い合わせはメールでお願いいたします</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">販売価格</h2>
                <p className="mt-2">AI活用診断レポート: 無料</p>
                <p className="mt-2">コンサルティングサービス: 個別見積り</p>
                <p className="text-sm text-gray-600 mt-1">※詳細な料金については、お問い合わせください</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">販売価格以外でお客様に発生する費用</h2>
                <p className="mt-2">インターネット接続料金等の通信費</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">サービス提供時期</h2>
                <p className="mt-2">AI活用診断レポート: お申し込み後、即時</p>
                <p className="mt-2">コンサルティングサービス: ご契約後、双方合意のスケジュールに従って提供</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">お支払い方法</h2>
                <p className="mt-2">銀行振込（請求書発行後、翌月末払い）</p>
                <p className="text-sm text-gray-600 mt-1">※コンサルティングサービスご利用時</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">返品・キャンセルについて</h2>
                <p className="mt-2">【コンサルティングサービス】</p>
                <p className="mt-1">契約締結前：キャンセル可能</p>
                <p className="mt-1">契約締結後：契約条件に従います</p>
                <p className="text-sm text-gray-600 mt-2">※診断レポートは無料のため、キャンセルの概念はありません</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">動作環境</h2>
                <p className="mt-2">推奨ブラウザ：</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Google Chrome（最新版）</li>
                  <li>Safari（最新版）</li>
                  <li>Microsoft Edge（最新版）</li>
                  <li>Firefox（最新版）</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">※JavaScript、Cookieを有効にしてご利用ください</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">免責事項</h2>
                <p className="mt-2">本サービスの利用により生じた損害について、故意または重大な過失がある場合を除き、一切の責任を負いません。</p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">その他</h2>
                <p className="mt-2">本表記は、将来のサービス内容の変更に伴い、予告なく変更される場合があります。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
  )
}
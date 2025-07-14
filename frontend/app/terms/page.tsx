import type { Metadata } from 'next'
import SimpleHeader from '@/components/lp/SimpleHeader'
import Footer from '@/components/lp/Footer'

export const metadata: Metadata = {
  title: '利用規約 | AI×Biz',
  description: 'AI×Bizの利用規約',
  robots: 'index, follow',
}

export default function TermsPage() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-8">最終更新日: 2025年1月14日</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（適用）</h2>
              <p>本規約は、中渡 潤（以下「当方」といいます）が提供するAI×Biz（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」といいます）には、本規約に同意いただいた上で、本サービスをご利用いただきます。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（定義）</h2>
              <p>本規約において使用する用語の定義は以下のとおりです：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>「本サービス」：AI×Bizウェブサイトおよび関連するすべてのサービス</li>
                <li>「ユーザー」：本サービスを利用する法人または個人</li>
                <li>「診断レポート」：本サービスが生成するAI活用提案資料</li>
                <li>「コンテンツ」：本サービス上の文章、画像、情報等すべての内容</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（サービス内容）</h2>
              <p>本サービスは、以下の機能を提供します：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>AI活用診断の実施</li>
                <li>診断結果に基づくレポートの生成・提供</li>
                <li>AI活用に関する情報提供</li>
                <li>お問い合わせ対応</li>
              </ul>
              <p className="mt-2">本サービスは無料で提供されますが、将来的に有料オプションを追加する可能性があります。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（利用登録）</h2>
              <p>本サービスの一部機能は、登録なしでご利用いただけます。お問い合わせフォームの送信時には、必要な情報を正確に提供していただく必要があります。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（禁止事項）</h2>
              <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当方または第三者の知的財産権を侵害する行為</li>
                <li>当方または第三者の名誉・信用を毀損する行為</li>
                <li>本サービスのサーバーやネットワークに過度な負荷をかける行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>不正アクセスまたはこれを試みる行為</li>
                <li>他のユーザーの個人情報を収集する行為</li>
                <li>虚偽の情報を登録・投稿する行為</li>
                <li>営利目的での無断転載・再配布</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（知的財産権）</h2>
              <p>本サービスのコンテンツ（診断レポートを含む）の著作権は、当方または正当な権利者に帰属します。ユーザーは、個人的な利用の範囲を超えて、これらを複製、転載、改変することはできません。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（免責事項）</h2>
              <ol className="list-decimal pl-6 mt-2">
                <li>本サービスで提供される診断結果やアドバイスは、一般的な情報提供を目的としており、特定の状況に対する専門的助言ではありません。</li>
                <li>診断結果の正確性、完全性、有用性について、当方は保証しません。</li>
                <li>本サービスの利用により生じた損害について、当方は一切の責任を負いません。</li>
                <li>当方は、本サービスの中断、停止、終了、変更により生じた損害について責任を負いません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（サービスの変更・中断）</h2>
              <p>当方は、以下の場合、ユーザーに事前通知することなく、本サービスの内容を変更または中断することができます：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>システムの保守・更新を行う場合</li>
                <li>地震、火災、停電等の不可抗力により提供が困難な場合</li>
                <li>その他、当方が必要と判断した場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第9条（利用規約の変更）</h2>
              <p>当方は、必要と判断した場合、ユーザーに通知することなく本規約を変更できるものとします。変更後の規約は、本サービス上に掲載した時点から効力を生じます。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第10条（準拠法・管轄裁判所）</h2>
              <p>本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、横浜地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第11条（お問い合わせ）</h2>
              <p>本規約に関するお問い合わせは、以下の連絡先までお願いいたします。</p>
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p><strong>運営者:</strong> 中渡 潤</p>
                <p><strong>メールアドレス:</strong> info@aixbiz.jp</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
  )
}
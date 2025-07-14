import type { Metadata } from 'next'
import SimpleHeader from '@/components/lp/SimpleHeader'
import Footer from '@/components/lp/Footer'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | AI×Biz',
  description: 'AI×Bizのプライバシーポリシー',
  robots: 'index, follow',
}

export default function PrivacyPage() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-8">最終更新日: 2025年1月14日</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. はじめに</h2>
              <p>中渡 潤（以下「当方」といいます）は、AI×Biz（以下「本サービス」といいます）の提供にあたり、お客様の個人情報の保護を重要な責務と認識し、以下のプライバシーポリシーに基づき適切に取り扱います。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 収集する個人情報</h2>
              <p>当方は、本サービスの提供にあたり、以下の個人情報を収集することがあります：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>会社名、氏名、メールアドレス、電話番号</li>
                <li>業種、従業員数、業務課題に関する情報</li>
                <li>お問い合わせ内容</li>
                <li>IPアドレス、ブラウザ情報、アクセスログ</li>
                <li>Cookie情報</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 個人情報の利用目的</h2>
              <p>収集した個人情報は、以下の目的で利用いたします：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>AI活用診断レポートの生成・提供</li>
                <li>お問い合わせへの回答・ご連絡</li>
                <li>サービスの改善・新サービスの開発</li>
                <li>統計データの作成（個人を特定できない形式）</li>
                <li>不正利用の防止</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 個人情報の第三者提供</h2>
              <p>当方は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>お客様の同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために必要がある場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 外部サービスの利用</h2>
              <p>本サービスでは、以下の外部サービスを利用しています：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Google Analytics（アクセス解析）</li>
                <li>SendGrid（メール送信）</li>
              </ul>
              <p className="mt-2">これらのサービスの利用により、お客様の情報が各サービス提供者に送信される場合があります。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. セキュリティ対策</h2>
              <p>当方は、個人情報の漏洩、紛失、破損等を防止するため、以下のセキュリティ対策を実施しています：</p>
              <ul className="list-disc pl-6 mt-2">
                <li>SSL/TLSによる通信の暗号化</li>
                <li>データベースの暗号化</li>
                <li>アクセス権限の最小化</li>
                <li>定期的なセキュリティ監査</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookieの使用</h2>
              <p>本サービスでは、サービスの利便性向上のためCookieを使用しています。Cookieの使用を希望されない場合は、ブラウザの設定により無効化することができます。ただし、Cookieを無効化した場合、一部のサービスが正常に動作しない可能性があります。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 個人情報の開示・訂正・削除</h2>
              <p>お客様は、当方が保有する自己の個人情報について、開示・訂正・削除を請求することができます。請求される場合は、以下の連絡先までご連絡ください。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. プライバシーポリシーの変更</h2>
              <p>当方は、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. お問い合わせ</h2>
              <p>本プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。</p>
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
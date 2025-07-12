import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-jp'
})

export const metadata: Metadata = {
  title: 'AI導入ナビゲーター | 中小企業のためのAI業務改善診断サービス',
  description: '高額なシステムや複雑なAI導入は不要。ChatGPTなど、すぐに使えるAIを活かして御社の業務課題に合わせた効率化プランを診断・ご提案します。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable}`}>
      <body className={`${notoSansJP.className} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
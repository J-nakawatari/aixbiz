import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import StructuredData from '@/components/StructuredData'
import CSRFInitializer from '@/components/CSRFInitializer'

const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-jp'
})

export const metadata: Metadata = {
  title: 'AI×Biz | 中小企業のためのAI業務改善診断サービス',
  description: '高額なシステムや複雑なAI導入は不要。ChatGPTなど、すぐに使えるAIを活かして御社の業務課題に合わせた効率化プランを診断・ご提案します。',
  keywords: 'AI導入,中小企業,業務改善,ChatGPT,AI診断,業務効率化,DX推進,生産性向上',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://aixbiz.jp',
  },
  openGraph: {
    title: 'AI×Biz | 中小企業のためのAI業務改善診断サービス',
    description: '高額なシステムや複雑なAI導入は不要。無料診断で御社に最適なAI活用法をご提案します。',
    url: 'https://aixbiz.jp',
    siteName: 'AI×Biz',
    images: [
      {
        url: 'https://aixbiz.jp/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI×Biz',
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI×Biz | 中小企業のためのAI業務改善診断サービス',
    description: '高額なシステムや複雑なAI導入は不要。無料診断で御社に最適なAI活用法をご提案します。',
    images: ['https://aixbiz.jp/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // 後で実際のコードに置き換え
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <GoogleAnalytics />
        <CSRFInitializer />
        {children}
      </body>
    </html>
  )
}
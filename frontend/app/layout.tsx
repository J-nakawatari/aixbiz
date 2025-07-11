import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI導入ナビゲーター - 中小企業向けAI活用診断',
  description: '中小企業向けに、ChatGPTなどの生成AIを活用した業務改善・効率化の提案を行う無料診断サービス',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
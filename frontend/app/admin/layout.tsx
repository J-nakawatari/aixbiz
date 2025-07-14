import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI×Biz 管理画面',
  description: 'AI×Biz 管理画面',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
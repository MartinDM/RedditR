import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'tw-elements-react/dist/css/tw-elements-react.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Redditr',
  description: 'Get Redit feeds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className + ' bg-slate-200 '}>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Campus Connect - Hub Voluntariat Universitar',
  description: 'Platform pentru gestionarea activităților de voluntariat studenţesc',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

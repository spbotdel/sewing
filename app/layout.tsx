import React from "react"
import type { Metadata } from 'next'
import { Oswald, Roboto_Condensed } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _oswald = Oswald({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"] });
const _robotoCondensed = Roboto_Condensed({ subsets: ["latin", "cyrillic"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: 'ШВЕЙНАЯ ФАБРИКА',
  description: 'Швейная фабрика в Москве. ОПТ. Пошив одежды.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

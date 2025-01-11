import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI or Human? - A Text-Guessing Game',
  description: 'Test your skills at detecting AI-generated text! Play daily challenges, track your streak, and see if you can tell the difference between AI and human writing.',
  keywords: 'AI detection, text game, daily challenge, AI vs human, language game',
  openGraph: {
    title: 'AI or Human? - A Text-Guessing Game',
    description: 'Can you tell the difference between AI and human writing? Play daily challenges and test your skills!',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI or Human? Game Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI or Human? - A Text-Guessing Game',
    description: 'Test your skills at detecting AI-generated text! Play daily challenges and track your streak.',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#1a56db',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  )
} 
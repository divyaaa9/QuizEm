import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
})
export const metadata: Metadata = {
  title: 'QuizEm — Quiz \u2019em on anything.',
  description:
    'QuizEm is the AI quiz platform that turns any topic into a fun, addictive quiz. Master anything, one question at a time.',
  generator: 'v0.app',
}
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1330',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className={`dark ${inter.variable} ${poppins.variable}`}>
        <body className="bg-background font-sans antialiased">
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'CineX - Watch TV Shows Online, Watch Movies Online',
  description: 'Watch Netflix-style movies and TV shows on CineX. Stream anywhere, anytime.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cinex-black text-cinex-text antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

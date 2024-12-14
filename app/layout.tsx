import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from './components/Sidebar'
import { ThemeProvider } from './contexts/ThemeContext'
import { SessionProvider } from 'next-auth/react'
import AuthWrapper from './components/AuthWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudySage',
  description: 'AI-powered educational tool for efficient studying',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <AuthWrapper>
              {(isAuthenticated) => (
                <div className="flex h-screen bg-background text-foreground">
                  {isAuthenticated && <Sidebar />}
                  <main className="flex-1 p-10 overflow-y-auto">
                    {children}
                  </main>
                </div>
              )}
            </AuthWrapper>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}


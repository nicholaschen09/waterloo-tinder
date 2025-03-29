'use client'

import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

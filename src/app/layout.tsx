import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/lib/auth/Provider";
import TrpcProvider from "@/lib/trpc/Provider";

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TrpcProvider>
          <NextAuthProvider>{children}
            <Toaster />
          </NextAuthProvider>
        </TrpcProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import type React from "react"

const poppins = Poppins({ weight: ['400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
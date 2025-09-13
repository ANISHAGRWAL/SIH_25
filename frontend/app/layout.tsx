import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import type React from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { I18nProvider } from "@/components/I18nProvider"

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Campus Care",
  description: "A Safe Space for Campus Minds",
  generator: "v0.app",
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.className}`}>
        <I18nProvider>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}

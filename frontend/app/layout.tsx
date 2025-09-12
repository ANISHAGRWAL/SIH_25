import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import type React from "react";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahayog",
  description: "A Safe Space for Campus Minds",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

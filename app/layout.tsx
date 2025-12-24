import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FloatingNav } from "@/components/floating-nav"
import { GlobalBackground } from "@/components/global-background"
import { LoadingScreen } from "@/components/loading-screen"
import { FooterRedesigned } from "@/components/footer-redesigned"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NEXUS - Innovate. Lead. Build.",
  description: "Empowering the next generation of tech innovators through collaboration, cutting-edge projects, and community-driven learning experiences.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-black text-white`}>
        <LoadingScreen />
        <GlobalBackground />
        <FloatingNav />
        {children}
        <FooterRedesigned />
      </body>
    </html>
  )
}

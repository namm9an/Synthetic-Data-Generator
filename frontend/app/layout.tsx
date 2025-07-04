import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "SynthGen - AI-Powered Synthetic Data Generation",
  description: "Create limitless synthetic datasets with AI precision. Trusted by 10,000+ researchers worldwide.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} font-serif`}>{children}</body>
    </html>
  )
}

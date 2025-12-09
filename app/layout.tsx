// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Chatbot } from "@/components/layout/Chatbot"
import "./globals.css"

const geist = localFont({
  src: "./fonts/GeistVariable.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVariable.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "PharmaCare - Your Trusted Online Pharmacy",
  description:
    "Professional online pharmacy offering quality medications, prescription services, and healthcare products delivered to your door.",
  generator: "v0.app",
  keywords: ["pharmacy", "medications", "prescriptions", "healthcare", "online pharmacy", "Eswatini"],
  openGraph: {
    title: "PharmaCare - Your Trusted Online Pharmacy",
    description: "Quality medications and healthcare products delivered to your door across Eswatini",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
        <Chatbot />
      </body>
    </html>
  )
}
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PharmaCare - Your Trusted Online Pharmacy",
  description:
    "Professional online pharmacy offering quality medications, prescription services, and healthcare products delivered to your door.",
  generator: "v0.app",
  keywords: ["pharmacy", "medications", "prescriptions", "healthcare", "online pharmacy"],
  openGraph: {
    title: "PharmaCare - Your Trusted Online Pharmacy",
    description: "Quality medications and healthcare products delivered to your door",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

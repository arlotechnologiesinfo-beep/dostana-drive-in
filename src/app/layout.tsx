import type { Metadata, Viewport } from "next"
import { Playfair_Display, Poppins } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
})

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const poppinsBody = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "DOSTANA DRIVE IN | Where Every Craving Finds Its Place",
  description:
    "Premium multi-vendor food court. Order from 6 stalls with a single QR, single cart, single checkout.",
  keywords: [
    "food court",
    "QR ordering",
    "multi-vendor",
    "restaurant",
    "DOSTANA",
    "drive in",
    "dine-in",
  ],
  openGraph: {
    title: "DOSTANA DRIVE IN",
    description: "Where Every Craving Finds Its Place.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFF9F2",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppinsBody.variable} ${playfair.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  )
}

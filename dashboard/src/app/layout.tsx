import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GeoArbitrage HQ",
  description: "AI Virtual Family Office Dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}

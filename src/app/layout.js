import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow-condensed',
})

const BASE_URL = 'https://outdoorsa.com'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'OutdoorSA — San Antonio Outdoor Guide',
  description: 'Trails, parks, bike paths, kayak spots — curated for San Antonio with shade ratings, seasonal conditions, and everything AllTrails leaves out.',
  openGraph: {
    title: 'OutdoorSA — San Antonio Outdoor Guide',
    description: 'Trails, parks, bike paths, kayak spots — curated for San Antonio with shade ratings, seasonal conditions, and everything AllTrails leaves out.',
    url: BASE_URL,
    siteName: 'OutdoorSA',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OutdoorSA — San Antonio Outdoor Guide',
    description: 'Trails, parks, bike paths, kayak spots — curated for San Antonio with shade ratings, seasonal conditions, and everything AllTrails leaves out.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  )
}

const BASE_URL = 'https://outdoorsa.co'

export const metadata = {
  title: 'San Antonio Outdoor Locations — OutdoorSA',
  description: 'Trails, parks, kayak spots, disc golf, birding sites and more in San Antonio. Shade ratings, seasonal conditions, and local knowledge for every spot.',
  keywords: ['San Antonio hiking', 'San Antonio trails', 'outdoor activities San Antonio', 'shade ratings', 'SA parks', 'kayaking San Antonio', 'birding San Antonio'],
  openGraph: {
    title: 'San Antonio Outdoor Locations — OutdoorSA',
    description: 'Trails, parks, kayak spots, disc golf, birding sites and more in San Antonio. Shade ratings, seasonal conditions, and local knowledge for every spot.',
    url: `${BASE_URL}/locations`,
    siteName: 'OutdoorSA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'San Antonio Outdoor Locations — OutdoorSA',
    description: 'Trails, parks, kayak spots, disc golf, birding sites and more in San Antonio. Shade ratings, seasonal conditions, and local knowledge for every spot.',
  },
  alternates: {
    canonical: `${BASE_URL}/locations`,
  },
}

export default function LocationsLayout({ children }) {
  return children
}

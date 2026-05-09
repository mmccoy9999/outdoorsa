import locations from '@/data/locations.json'
import { guides } from '@/data/guides/index'

const BASE_URL = 'https://outdoorsa.co'

export default function sitemap() {
  const locationEntries = locations.map(loc => ({
    url: `${BASE_URL}/locations/${loc.id}`,
    lastModified: new Date(loc.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...locationEntries,
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...guides.map(g => ({
      url: `${BASE_URL}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ]
}

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { guides, getGuide } from '@/data/guides/index'
import locations from '@/data/locations.json'

const BASE_URL = 'https://outdoorsa.co'

export async function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}
  return {
    title: `${guide.title} | OutdoorSA`,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `${BASE_URL}/guides/${guide.slug}`,
      images: [{ url: guide.hero_photo, width: 1200, alt: guide.title }],
      type: 'article',
      publishedTime: guide.published,
    },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.excerpt },
    alternates: { canonical: `${BASE_URL}/guides/${guide.slug}` },
  }
}

const CATEGORY_COLORS = {
  'Seasonal Tips': { bg: '#EAF3DE', color: '#3B6D11' },
  'Activity Guides': { bg: '#FAEEDA', color: '#BA7517' },
  'Destination Guides': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Getting Started': { bg: '#F7F5EF', color: '#5F5E5A' },
}

function renderBlock(block, i) {
  switch (block.type) {
    case 'intro':
      return <p key={i} style={{ fontSize: 17, lineHeight: 1.8, color: '#2C2C2A', fontFamily: 'var(--font-barlow)', marginBottom: 28, fontWeight: 500 }}>{block.text}</p>
    case 'h2':
      return <h2 key={i} style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 24, fontWeight: 700, color: '#2C2C2A', margin: '36px 0 12px', lineHeight: 1.2 }}>{block.text}</h2>
    case 'h3':
      return <h3 key={i} style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 19, fontWeight: 700, color: '#2C2C2A', margin: '24px 0 8px' }}>{block.text}</h3>
    case 'p':
      return <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: '#2C2C2A', fontFamily: 'var(--font-barlow)', marginBottom: 20 }}>{block.text}</p>
    case 'tip':
      return (
        <div key={i} style={{ background: '#EAF3DE', borderLeft: '3px solid #3B6D11', borderRadius: 8, padding: '14px 18px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#3B6D11', margin: '0 0 4px', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tip</p>
          <p style={{ fontSize: 14, color: '#2C2C2A', margin: 0, fontFamily: 'var(--font-barlow)', lineHeight: 1.5 }}>{block.text}</p>
        </div>
      )
    case 'warning':
      return (
        <div key={i} style={{ background: '#FDE8E8', borderLeft: '3px solid #B91C1C', borderRadius: 8, padding: '14px 18px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#B91C1C', margin: '0 0 4px', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Note</p>
          <p style={{ fontSize: 14, color: '#2C2C2A', margin: 0, fontFamily: 'var(--font-barlow)', lineHeight: 1.5 }}>{block.text}</p>
        </div>
      )
    default:
      return null
  }
}

export default async function GuidePage({ params }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const cat = CATEGORY_COLORS[guide.category] || CATEGORY_COLORS['Getting Started']
  const relatedLocs = (guide.related_locations || [])
    .map(id => locations.find(l => l.id === id))
    .filter(Boolean)
    .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    image: guide.hero_photo,
    datePublished: guide.published,
    dateModified: guide.updated,
    author: { '@type': 'Organization', name: 'OutdoorSA', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'OutdoorSA', url: BASE_URL },
    url: `${BASE_URL}/guides/${guide.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`* { box-sizing: border-box; } body { margin: 0; background: #F7F5EF; font-family: var(--font-barlow); }`}</style>

      <nav style={{ background: '#F7F5EF', borderBottom: '1px solid #D3D1C7', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: '#2C2C2A' }}>
            OUTDOOR<span style={{ color: '#3B6D11' }}>SA</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/guides" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>← All Guides</Link>
          <Link href="/locations" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>Locations</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', height: 400, background: '#2C2C2A' }}>
        <Image src={guide.hero_photo} alt={guide.title} fill priority style={{ objectFit: 'cover', opacity: 0.7 }} sizes="100vw" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 32px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <span style={{ background: cat.bg, color: cat.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.06em', fontFamily: 'var(--font-barlow-condensed)', textTransform: 'uppercase', display: 'inline-block', marginBottom: 12 }}>
              {guide.category}
            </span>
            <h1 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 38, fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.1 }}>{guide.title}</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, fontFamily: 'var(--font-barlow)' }}>
              {guide.read_time} min read · Updated {new Date(guide.updated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          {guide.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* Related locations */}
        {relatedLocs.length > 0 && (
          <div style={{ borderTop: '1px solid #D3D1C7', paddingTop: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 22, fontWeight: 700, color: '#2C2C2A', margin: '0 0 20px' }}>Related Locations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {relatedLocs.map(loc => (
                <Link key={loc.id} href={`/locations/${loc.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #D3D1C7', display: 'flex', alignItems: 'center', gap: 12, padding: 12, transition: 'box-shadow 0.15s' }}>
                    <div style={{ position: 'relative', width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={loc.hero_photo} alt={loc.name} fill style={{ objectFit: 'cover' }} sizes="60px" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#2C2C2A', fontFamily: 'var(--font-barlow-condensed)' }}>{loc.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#5F5E5A', fontFamily: 'var(--font-barlow)' }}>{loc.area}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to guides */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #D3D1C7' }}>
          <Link href="/guides" style={{ fontSize: 14, color: '#3B6D11', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>
            ← More Guides
          </Link>
        </div>
      </div>
    </>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { guides } from '@/data/guides/index'

export const metadata = {
  title: 'Outdoor Guides — OutdoorSA',
  description: 'Guides for hiking, kayaking, and exploring San Antonio and the Texas Hill Country — seasonal tips, beginner advice, and local knowledge.',
}

const CATEGORY_COLORS = {
  'Seasonal Tips': { bg: '#EAF3DE', color: '#3B6D11' },
  'Activity Guides': { bg: '#FAEEDA', color: '#BA7517' },
  'Destination Guides': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Getting Started': { bg: '#F7F5EF', color: '#5F5E5A' },
}

export default function GuidesPage() {
  const sorted = [...guides].sort((a, b) => new Date(b.published) - new Date(a.published))

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F7F5EF; font-family: var(--font-barlow); }
        .guides-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 1024px) { .guides-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .guides-grid { grid-template-columns: 1fr; } }
        .guide-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .guide-card { transition: box-shadow 0.15s, transform 0.15s; }
      `}</style>

      <nav style={{ background: '#F7F5EF', borderBottom: '1px solid #D3D1C7', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: '#2C2C2A' }}>
            OUTDOOR<span style={{ color: '#3B6D11' }}>SA</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/locations" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>Locations</Link>
          <Link href="/guides" style={{ fontSize: 13, color: '#2C2C2A', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>Guides</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#3B6D11', textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)', margin: '0 0 8px' }}>OutdoorSA</p>
          <h1 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 40, fontWeight: 800, color: '#2C2C2A', margin: '0 0 12px', lineHeight: 1.1 }}>Outdoor Guides</h1>
          <p style={{ fontSize: 16, color: '#5F5E5A', margin: 0, maxWidth: 560, fontFamily: 'var(--font-barlow)', lineHeight: 1.6 }}>
            Seasonal tips, activity guides, and local knowledge for getting outside in San Antonio and the Texas Hill Country.
          </p>
        </div>

        <div className="guides-grid">
          {sorted.map(guide => {
            const cat = CATEGORY_COLORS[guide.category] || CATEGORY_COLORS['Getting Started']
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="guide-card" style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #D3D1C7', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', height: 200 }}>
                    <Image src={guide.hero_photo} alt={guide.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <span style={{ background: cat.bg, color: cat.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.05em', fontFamily: 'var(--font-barlow-condensed)', textTransform: 'uppercase' }}>
                        {guide.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <h2 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 19, fontWeight: 700, color: '#2C2C2A', margin: '0 0 8px', lineHeight: 1.25 }}>{guide.title}</h2>
                    <p style={{ fontSize: 13, color: '#5F5E5A', margin: '0 0 12px', lineHeight: 1.5, fontFamily: 'var(--font-barlow)' }}>{guide.excerpt}</p>
                    <span style={{ fontSize: 11, color: '#9E9C94', fontFamily: 'var(--font-barlow)' }}>{guide.read_time} min read</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

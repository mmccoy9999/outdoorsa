import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import locations from '@/data/locations.json'
import AdUnit from '@/components/AdUnit'

const ACTIVITY_LABELS = {
  hiking: 'Hiking', cycling: 'Cycling', trail_running: 'Trail Running',
  kayaking: 'Kayaking', birding: 'Birding', camping: 'Camping',
  disc_golf: 'Disc Golf', outdoor_fitness: 'Outdoor Fitness',
  swimming: 'Swimming', fishing: 'Fishing', picnicking: 'Picnicking',
  nature_watching: 'Nature Watching',
}

const BADGE_LABELS = {
  sa_summer_pick: { label: 'SA Summer Pick', emoji: '☀', color: '#3B6D11', bg: '#EAF3DE' },
  sunset_spot: { label: 'Sunset Spot', emoji: '🌅', color: '#BA7517', bg: '#FAEEDA' },
  sunrise_spot: { label: 'Sunrise Spot', emoji: '🌄', color: '#BA7517', bg: '#FAEEDA' },
  dog_favorite: { label: 'Dog Favorite', emoji: '🐕', color: '#3B6D11', bg: '#EAF3DE' },
  hidden_gem: { label: 'Hidden Gem', emoji: '💎', color: '#5F5E5A', bg: '#F7F5EF' },
  family_first: { label: 'Family Friendly', emoji: '👨‍👩‍👧', color: '#3B6D11', bg: '#EAF3DE' },
  birding_hotspot: { label: 'Birding Hotspot', emoji: '🐦', color: '#3B6D11', bg: '#EAF3DE' },
  best_beginner: { label: 'Great for Beginners', emoji: '✓', color: '#3B6D11', bg: '#EAF3DE' },
  most_scenic: { label: 'Most Scenic', emoji: '🏞', color: '#3B6D11', bg: '#EAF3DE' },
  local_favorite: { label: 'Local Favorite', emoji: '★', color: '#2C2C2A', bg: '#F7F5EF' },
  afuera_pick: { label: 'Afuera Pick', emoji: '🇲🇽', color: '#3B6D11', bg: '#EAF3DE' },
  avoid_midday: { label: 'Avoid Midday', emoji: '⚠', color: '#B91C1C', bg: '#FDE8E8' },
  flood_risk: { label: 'Flood Risk', emoji: '🌊', color: '#1D4ED8', bg: '#EFF6FF' },
}

const SHADE_LABELS = ['', 'Full Sun', 'Mostly Sun', 'Mixed', 'Mostly Shaded', 'Full Shade']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export async function generateStaticParams() {
  return locations.map(loc => ({ slug: loc.id }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const loc = locations.find(l => l.id === slug)
  if (!loc) return {}

  const BASE_URL = 'https://outdoorsa.co'
  const activityList = loc.activities.map(a => ACTIVITY_LABELS[a]).filter(Boolean).join(', ')
  const title = `${loc.name} — ${activityList} in San Antonio | OutdoorSA`
  const description = `${loc.short_desc} Shade rating: ${SHADE_LABELS[loc.shade_rating]}. ${loc.area}, San Antonio, TX.`

  return {
    title,
    description,
    keywords: [
      loc.name,
      ...loc.activities.map(a => ACTIVITY_LABELS[a]),
      'San Antonio outdoor',
      loc.area,
      'shade rating',
      'hiking San Antonio',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/locations/${loc.id}`,
      siteName: 'OutdoorSA',
      images: [{ url: loc.hero_photo, width: 1200, alt: loc.name }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [loc.hero_photo],
    },
    alternates: {
      canonical: `${BASE_URL}/locations/${loc.id}`,
    },
  }
}

function StatBlock({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#5F5E5A', textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)' }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#2C2C2A', fontFamily: 'var(--font-barlow-condensed)' }}>{value}</span>
    </div>
  )
}

function CheckRow({ label, value }) {
  if (value === null || value === undefined) return null
  let display
  if (value === true) display = <span style={{ color: '#3B6D11' }}>Yes</span>
  else if (value === false) display = <span style={{ color: '#5F5E5A' }}>No</span>
  else if (value === 'leash_required') display = <span style={{ color: '#BA7517' }}>Leash required</span>
  else if (value === 'yes') display = <span style={{ color: '#3B6D11' }}>Yes</span>
  else if (value === 'no') display = <span style={{ color: '#5F5E5A' }}>No</span>
  else if (value === 'full') display = <span style={{ color: '#3B6D11' }}>Full</span>
  else if (value === 'partial') display = <span style={{ color: '#BA7517' }}>Partial</span>
  else display = <span style={{ color: '#2C2C2A', textTransform: 'capitalize' }}>{String(value).replace(/_/g, ' ')}</span>
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0EEE8', fontSize: 14, fontFamily: 'var(--font-barlow)' }}>
      <span style={{ color: '#5F5E5A' }}>{label}</span>
      {display}
    </div>
  )
}

const ACTIVITY_SCHEMA_TYPE = {
  hiking: 'HikingTrail',
  cycling: 'Park',
  trail_running: 'HikingTrail',
  kayaking: 'LakeBodyOfWater',
  birding: 'TouristAttraction',
  camping: 'Campground',
  disc_golf: 'SportsActivityLocation',
  outdoor_fitness: 'SportsActivityLocation',
  fishing: 'TouristAttraction',
  nature_watching: 'TouristAttraction',
}

export default async function LocationPage({ params }) {
  const { slug } = await params
  const loc = locations.find(l => l.id === slug)
  if (!loc) notFound()

  const BASE_URL = 'https://outdoorsa.co'
  const primaryType = ACTIVITY_SCHEMA_TYPE[loc.activities[0]] || 'TouristAttraction'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['TouristAttraction', primaryType].filter((v, i, a) => a.indexOf(v) === i),
    name: loc.name,
    description: loc.long_desc,
    url: `${BASE_URL}/locations/${loc.id}`,
    image: loc.hero_photo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address,
      addressLocality: 'San Antonio',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: loc.lat,
      longitude: loc.lng,
    },
    ...(loc.website ? { sameAs: loc.website } : {}),
    touristType: loc.activities.map(a => ACTIVITY_LABELS[a]).filter(Boolean),
    isAccessibleForFree: true,
    publicAccess: true,
    ...(loc.ada_accessible === 'full' ? { amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: 'Wheelchair accessible', value: true }] } : {}),
  }

  const difficultyColors = {
    easy: { bg: '#EAF3DE', color: '#3B6D11' },
    moderate: { bg: '#FAEEDA', color: '#BA7517' },
    hard: { bg: '#FDE8E8', color: '#B91C1C' },
    expert: { bg: '#2C2C2A', color: '#fff' },
  }
  const dc = difficultyColors[loc.difficulty] || difficultyColors.easy

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F7F5EF; font-family: var(--font-barlow); }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        background: '#F7F5EF', borderBottom: '1px solid #D3D1C7',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: '#2C2C2A' }}>
            OUTDOOR<span style={{ color: '#3B6D11' }}>SA</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/locations" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>
            ← All Locations
          </Link>
          <Link href="/privacy-policy" style={{ fontSize: 13, color: '#9E9C94', textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>
            Privacy Policy
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', height: 360, background: '#2C2C2A' }}>
        <Image
          src={loc.hero_photo}
          alt={loc.name}
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.75 }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#97C459', textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)', margin: '0 0 6px' }}>
              {loc.area}
            </p>
            <h1 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 40, fontWeight: 800, color: '#fff', margin: '0 0 12px', lineHeight: 1.1 }}>
              {loc.name}
            </h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {loc.activities.map(a => (
                <span key={a} style={{
                  background: 'rgba(255,255,255,0.15)', color: '#fff',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                  padding: '4px 10px', borderRadius: 4,
                  fontFamily: 'var(--font-barlow-condensed)', textTransform: 'uppercase',
                  backdropFilter: 'blur(4px)',
                }}>{ACTIVITY_LABELS[a]}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        <div className="detail-grid">
          {/* Main content */}
          <div>
            {/* Badges */}
            {loc.badges.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {loc.badges.map(b => {
                  const badge = BADGE_LABELS[b]
                  if (!badge) return null
                  return (
                    <span key={b} style={{
                      background: badge.bg, color: badge.color,
                      fontSize: 12, fontWeight: 700,
                      padding: '5px 10px', borderRadius: 6,
                      fontFamily: 'var(--font-barlow-condensed)',
                      letterSpacing: '0.04em',
                    }}>
                      {badge.emoji} {badge.label}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Quick stats */}
            <div style={{
              background: '#fff', borderRadius: 10, padding: '16px 20px',
              border: '1px solid #D3D1C7', marginBottom: 24,
              display: 'flex', gap: 24, flexWrap: 'wrap',
            }}>
              {loc.difficulty && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#5F5E5A', textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)' }}>Difficulty</span>
                  <span style={{
                    fontSize: 14, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    background: dc.bg, color: dc.color,
                    fontFamily: 'var(--font-barlow-condensed)', textTransform: 'uppercase',
                    letterSpacing: '0.05em', display: 'inline-block',
                  }}>{loc.difficulty}</span>
                </div>
              )}
              <StatBlock label="Distance" value={loc.distance_miles ? `${loc.distance_miles} mi` : null} />
              <StatBlock label="Elevation" value={loc.elevation_gain_ft ? `+${loc.elevation_gain_ft} ft` : null} />
              <StatBlock label="Route Type" value={loc.route_type ? loc.route_type.replace(/_/g, ' ') : null} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#5F5E5A', textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)' }}>Shade</span>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: i <= loc.shade_rating ? '#3B6D11' : '#D3D1C7' }} />
                  ))}
                  <span style={{ fontSize: 13, color: '#5F5E5A', marginLeft: 6, fontFamily: 'var(--font-barlow)' }}>{SHADE_LABELS[loc.shade_rating]}</span>
                </div>
              </div>
            </div>

            {/* Ad — between stats bar and About */}
            <div style={{ marginBottom: 28 }}>
              <AdUnit slot="SLOT_ID_LEADERBOARD" format="auto" />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 22, fontWeight: 700, color: '#2C2C2A', margin: '0 0 10px' }}>About</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#2C2C2A', margin: 0, fontFamily: 'var(--font-barlow)' }}>{loc.long_desc}</p>
            </div>

            {/* Shade detail */}
            {loc.shade_notes && (
              <div style={{ background: '#EAF3DE', borderRadius: 8, padding: '14px 16px', marginBottom: 28, borderLeft: '3px solid #3B6D11' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#3B6D11', margin: '0 0 4px', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Shade Details</p>
                <p style={{ fontSize: 14, color: '#2C2C2A', margin: 0, fontFamily: 'var(--font-barlow)', lineHeight: 1.5 }}>{loc.shade_notes}</p>
              </div>
            )}

            {/* Seasonal notes */}
            {loc.seasonal_notes && (
              <div style={{ background: '#FAEEDA', borderRadius: 8, padding: '14px 16px', marginBottom: 28, borderLeft: '3px solid #BA7517' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#BA7517', margin: '0 0 4px', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Conditions & Tips</p>
                <p style={{ fontSize: 14, color: '#2C2C2A', margin: 0, fontFamily: 'var(--font-barlow)', lineHeight: 1.5 }}>{loc.seasonal_notes}</p>
                {loc.drought_impact && <p style={{ fontSize: 14, color: '#2C2C2A', margin: '8px 0 0', fontFamily: 'var(--font-barlow)', lineHeight: 1.5 }}>{loc.drought_impact}</p>}
              </div>
            )}

            {/* Best months */}
            {loc.best_months && loc.best_months.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 22, fontWeight: 700, color: '#2C2C2A', margin: '0 0 12px' }}>Best Time to Visit</h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {MONTHS.map((m, i) => {
                    const month = i + 1
                    const good = loc.best_months.includes(month)
                    return (
                      <div key={m} style={{
                        width: 48, height: 48, borderRadius: 8,
                        background: good ? '#3B6D11' : '#E8E6DF',
                        color: good ? '#fff' : '#9E9C94',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                        fontFamily: 'var(--font-barlow-condensed)',
                        letterSpacing: '0.04em',
                      }}>{m}</div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Birding species */}
            {loc.birding && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 22, fontWeight: 700, color: '#2C2C2A', margin: '0 0 12px' }}>Notable Species</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(loc.birding.notable_species || loc.birding.highlight_species || []).map(s => (
                    <span key={s} style={{
                      background: '#fff', border: '1px solid #D3D1C7',
                      padding: '5px 12px', borderRadius: 20,
                      fontSize: 13, fontFamily: 'var(--font-barlow)', color: '#2C2C2A',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Directions button */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#3B6D11', color: '#fff',
                padding: '12px 24px', borderRadius: 8,
                fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-barlow)',
                textDecoration: 'none',
              }}
            >
              Get Directions →
            </a>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Amenities */}
            <div style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid #D3D1C7' }}>
              <h3 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 18, fontWeight: 700, color: '#2C2C2A', margin: '0 0 4px' }}>Amenities</h3>
              <CheckRow label="Parking" value={loc.parking} />
              <CheckRow label="Restrooms" value={loc.restrooms} />
              <CheckRow label="Water fountain" value={loc.water_fountain} />
              <CheckRow label="Picnic tables" value={loc.picnic_tables} />
              <CheckRow label="Playground" value={loc.playground} />
              <CheckRow label="Bike racks" value={loc.bike_racks} />
              <CheckRow label="ADA accessible" value={loc.ada_accessible} />
            </div>

            {/* Who it's for */}
            <div style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid #D3D1C7' }}>
              <h3 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 18, fontWeight: 700, color: '#2C2C2A', margin: '0 0 4px' }}>Who It's For</h3>
              <CheckRow label="Dogs" value={loc.dog_friendly} />
              <CheckRow label="Kids" value={loc.kid_friendly} />
              <CheckRow label="Flood prone" value={loc.flood_prone} />
            </div>

            {/* Activity-specific */}
            {loc.kayak && (
              <div style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid #D3D1C7' }}>
                <h3 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 18, fontWeight: 700, color: '#2C2C2A', margin: '0 0 4px' }}>Kayaking</h3>
                <CheckRow label="Launch type" value={loc.kayak.launch_type} />
                <CheckRow label="Water body" value={loc.kayak.water_body} />
                <CheckRow label="Current" value={loc.kayak.current} />
                <CheckRow label="Drought risk" value={loc.kayak.drought_risk} />
              </div>
            )}
            {loc.camping && (
              <div style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid #D3D1C7' }}>
                <h3 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 18, fontWeight: 700, color: '#2C2C2A', margin: '0 0 4px' }}>Camping</h3>
                <CheckRow label="Site types" value={loc.camping.site_types.join(', ')} />
                <CheckRow label="Sites" value={loc.camping.num_sites} />
                <CheckRow label="Reservations" value={loc.camping.reservations} />
              </div>
            )}
            {loc.disc_golf && (
              <div style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid #D3D1C7' }}>
                <h3 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 18, fontWeight: 700, color: '#2C2C2A', margin: '0 0 4px' }}>Disc Golf</h3>
                <CheckRow label="Holes" value={loc.disc_golf.num_holes} />
                <CheckRow label="Basket condition" value={loc.disc_golf.basket_condition} />
              </div>
            )}

            {/* Ad — bottom of sidebar */}
            <div style={{ borderRadius: 10, overflow: 'hidden' }}>
              <AdUnit slot="SLOT_ID_SIDEBAR" format="auto" style={{ minHeight: 100 }} />
            </div>

            {/* Official site */}
            {loc.website && (
              <a href={loc.website} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', background: '#F7F5EF',
                border: '1px solid #D3D1C7', borderRadius: 10,
                padding: '14px 16px', textDecoration: 'none',
                fontSize: 13, color: '#5F5E5A', fontFamily: 'var(--font-barlow)',
                textAlign: 'center',
              }}>
                Official website ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

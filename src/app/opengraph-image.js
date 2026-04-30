import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OutdoorSA — San Antonio Outdoor Guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F7F5EF',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontSize: 52, fontWeight: 800, color: '#3B6D11', letterSpacing: '-0.01em' }}>
            OUTDOOR
          </span>
          <span style={{ fontSize: 52, fontWeight: 800, color: '#639922', letterSpacing: '-0.01em' }}>
            SA
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: '#2C2C2A', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Get Outside.
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, color: '#3B6D11', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Know the Terrain.
          </div>
          <div style={{ fontSize: 28, color: '#5F5E5A', marginTop: 12, maxWidth: 700, lineHeight: 1.5 }}>
            Trails, parks, kayak spots — curated for San Antonio with shade ratings and everything AllTrails leaves out.
          </div>
        </div>

        {/* Bottom: stat pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['80+ Locations', '12 Activity types', 'Free to browse'].map((label) => (
            <div
              key={label}
              style={{
                background: '#EAF3DE',
                color: '#3B6D11',
                fontSize: 20,
                fontWeight: 600,
                padding: '10px 22px',
                borderRadius: 8,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}

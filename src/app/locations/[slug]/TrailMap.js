'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const TRAIL_COLORS = [
  '#3B6D11', '#639922', '#1D4ED8', '#BA7517', '#7C3AED',
  '#0891B2', '#B91C1C', '#047857', '#9333EA', '#C2410C',
]

export default function TrailMap({ locationId, lat, lng, trails }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [activeTrail, setActiveTrail] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // Assign colors to named trails
  const trailColorMap = {}
  const namedTrails = [...new Set(trails.map(t => t.name).filter(Boolean))]
  namedTrails.forEach((name, i) => {
    trailColorMap[name] = TRAIL_COLORS[i % TRAIL_COLORS.length]
  })

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [lng, lat],
      zoom: 13.5,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.current.on('load', async () => {
      // Load GeoJSON
      const res = await fetch(`/trails/${locationId}.geojson`)
      const geojson = await res.json()

      // Add source
      map.current.addSource('trails', { type: 'geojson', data: geojson })

      // Unnamed trails — light grey base layer
      map.current.addLayer({
        id: 'trails-unnamed',
        type: 'line',
        source: 'trails',
        filter: ['==', ['get', 'name'], null],
        paint: {
          'line-color': '#C4BFB0',
          'line-width': 1.5,
          'line-opacity': 0.6,
        },
      })

      // Named trails — colored
      map.current.addLayer({
        id: 'trails-named',
        type: 'line',
        source: 'trails',
        filter: ['!=', ['get', 'name'], null],
        paint: {
          'line-color': [
            'match', ['get', 'name'],
            ...namedTrails.flatMap(name => [name, trailColorMap[name]]),
            '#3B6D11'
          ],
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            12, 2,
            15, 4,
          ],
          'line-opacity': 0.9,
        },
      })

      // Hover interaction
      map.current.on('mousemove', 'trails-named', (e) => {
        if (e.features.length > 0) {
          const name = e.features[0].properties.name
          setActiveTrail(name)
          map.current.getCanvas().style.cursor = 'pointer'
        }
      })
      map.current.on('mouseleave', 'trails-named', () => {
        setActiveTrail(null)
        map.current.getCanvas().style.cursor = ''
      })

      // Center marker
      new mapboxgl.Marker({ color: '#2C2C2A' })
        .setLngLat([lng, lat])
        .addTo(map.current)

      setLoaded(true)
    })
  }, [])

  // Highlight active trail
  useEffect(() => {
    if (!map.current || !loaded) return
    if (activeTrail) {
      map.current.setPaintProperty('trails-named', 'line-width', [
        'case',
        ['==', ['get', 'name'], activeTrail], 6,
        2,
      ])
    } else {
      map.current.setPaintProperty('trails-named', 'line-width', [
        'interpolate', ['linear'], ['zoom'],
        12, 2,
        15, 4,
      ])
    }
  }, [activeTrail, loaded])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: 400, borderRadius: 10, overflow: 'hidden', border: '1px solid #D3D1C7' }} />

      {/* Legend */}
      {namedTrails.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 8, padding: '10px 14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          maxWidth: 200, maxHeight: 200, overflowY: 'auto',
        }}>
          {namedTrails.map(name => (
            <div key={name}
              onMouseEnter={() => setActiveTrail(name)}
              onMouseLeave={() => setActiveTrail(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                cursor: 'pointer', opacity: activeTrail && activeTrail !== name ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}>
              <div style={{ width: 20, height: 3, borderRadius: 2, background: trailColorMap[name], flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-barlow)', color: '#2C2C2A', lineHeight: 1.3 }}>{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'

const SHADE_LABELS = ['', 'Full Sun', 'Mostly Sun', 'Mixed', 'Mostly Shaded', 'Full Shade']

function makeIcon(color = '#3B6D11', size = 28) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;
      background:${color};border:2px solid #fff;
      transform:rotate(-45deg);
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

const defaultIcon = makeIcon('#3B6D11')
const activeIcon = makeIcon('#BA7517', 32)

function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 13, { duration: 0.8 })
  }, [center, map])
  return null
}

export default function MapView({ locations, activeId, onHover }) {
  const SA_CENTER = [29.424, -98.494]

  return (
    <MapContainer
      center={SA_CENTER}
      zoom={11}
      style={{ width: '100%', height: '100%', borderRadius: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {activeId && (() => {
        const loc = locations.find(l => l.id === activeId)
        if (loc) return <FlyTo center={[loc.lat, loc.lng]} />
        return null
      })()}

      {locations.map(loc => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={activeId === loc.id ? activeIcon : defaultIcon}
          eventHandlers={{ mouseover: () => onHover(loc.id), mouseout: () => onHover(null) }}
        >
          <Popup>
            <div style={{ fontFamily: 'sans-serif', minWidth: 180 }}>
              <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 4px', color: '#2C2C2A' }}>{loc.name}</p>
              <p style={{ fontSize: 12, color: '#5F5E5A', margin: '0 0 6px' }}>{loc.area}</p>
              <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: i <= loc.shade_rating ? '#3B6D11' : '#D3D1C7' }} />
                ))}
                <span style={{ fontSize: 10, color: '#5F5E5A', marginLeft: 4 }}>{SHADE_LABELS[loc.shade_rating]}</span>
              </div>
              <a href={`/locations/${loc.id}`} style={{ fontSize: 12, color: '#3B6D11', fontWeight: 600, textDecoration: 'none' }}>
                View details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

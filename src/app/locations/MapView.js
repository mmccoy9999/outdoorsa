'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const SHADE_LABELS = ['', 'Full Sun', 'Mostly Sun', 'Mixed', 'Mostly Shaded', 'Full Shade']

export default function MapView({ locations, activeId, onHover }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef({})
  const popups = useRef({})
  const activeIdRef = useRef(activeId)

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-98.494, 29.424],
      zoom: 10.5,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left')
  }, [])

  // Add/update markers when locations change
  useEffect(() => {
    if (!map.current) return

    const onMapLoad = () => {
      // Remove old markers
      Object.values(markers.current).forEach(m => m.remove())
      markers.current = {}
      popups.current = {}

      locations.forEach(loc => {
        // Marker element
        const el = document.createElement('div')
        el.style.cssText = `
          width: 28px; height: 28px;
          border-radius: 50% 50% 50% 0;
          background: #3B6D11;
          border: 2px solid #fff;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          cursor: pointer;
          transition: transform 0.15s, width 0.15s, height 0.15s;
        `
        el.dataset.id = loc.id

        // Popup
        const shadeBoxes = [1,2,3,4,5].map(i =>
          `<div style="width:9px;height:9px;border-radius:2px;background:${i <= loc.shade_rating ? '#3B6D11' : '#D3D1C7'}"></div>`
        ).join('')

        const popup = new mapboxgl.Popup({
          offset: [0, -28],
          closeButton: false,
          maxWidth: '220px',
        }).setHTML(`
          <div style="font-family:sans-serif;padding:4px 2px">
            <p style="font-weight:700;font-size:14px;margin:0 0 3px;color:#2C2C2A">${loc.name}</p>
            <p style="font-size:11px;color:#5F5E5A;margin:0 0 6px">${loc.area}</p>
            <div style="display:flex;gap:3px;align-items:center;margin-bottom:8px">
              ${shadeBoxes}
              <span style="font-size:10px;color:#5F5E5A;margin-left:4px">${SHADE_LABELS[loc.shade_rating]}</span>
            </div>
            <a href="/locations/${loc.id}" style="font-size:12px;color:#3B6D11;font-weight:600;text-decoration:none">View details →</a>
          </div>
        `)

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([loc.lng, loc.lat])
          .setPopup(popup)
          .addTo(map.current)

        el.addEventListener('mouseenter', () => {
          onHover(loc.id)
          marker.getPopup().addTo(map.current)
        })
        el.addEventListener('mouseleave', () => {
          onHover(null)
          marker.getPopup().remove()
        })
        el.addEventListener('click', () => {
          window.location.href = `/locations/${loc.id}`
        })

        markers.current[loc.id] = marker
        popups.current[loc.id] = popup
      })
    }

    if (map.current.isStyleLoaded()) {
      onMapLoad()
    } else {
      map.current.once('load', onMapLoad)
    }
  }, [locations])

  // Highlight active marker and fly to it
  useEffect(() => {
    activeIdRef.current = activeId
    Object.entries(markers.current).forEach(([id, marker]) => {
      const el = marker.getElement()
      if (id === activeId) {
        el.style.width = '34px'
        el.style.height = '34px'
        el.style.background = '#BA7517'
        el.style.zIndex = '10'
      } else {
        el.style.width = '28px'
        el.style.height = '28px'
        el.style.background = '#3B6D11'
        el.style.zIndex = ''
      }
    })

    if (activeId && markers.current[activeId]) {
      const loc = locations.find(l => l.id === activeId)
      if (loc) {
        map.current.flyTo({ center: [loc.lng, loc.lat], zoom: Math.max(map.current.getZoom(), 13), duration: 800 })
      }
    }
  }, [activeId, locations])

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
  )
}

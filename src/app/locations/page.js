'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import locations from '@/data/locations.json'

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => (
  <div style={{ width: '100%', height: '100%', background: '#E8E6DF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5F5E5A', fontFamily: 'var(--font-barlow)' }}>
    Loading map…
  </div>
)})

const ACTIVITY_LABELS = {
  hiking: 'Hiking', cycling: 'Cycling', trail_running: 'Trail Running',
  kayaking: 'Kayaking', birding: 'Birding', camping: 'Camping',
  disc_golf: 'Disc Golf', outdoor_fitness: 'Outdoor Fitness',
  swimming: 'Swimming', fishing: 'Fishing', picnicking: 'Picnicking',
  nature_watching: 'Nature Watching',
}

const SHADE_LABELS = ['', 'Full Sun', 'Mostly Sun', 'Mixed', 'Mostly Shaded', 'Full Shade']
const ALL_ACTIVITIES = Object.keys(ACTIVITY_LABELS)

// Shade reduces effective heat index — full shade (~15°F cooler than full sun)
const SHADE_ADJ = [0, 0, -3, -7, -11, -15]

function getComfort(feelsLike, shadeRating) {
  if (feelsLike == null) return null
  const adjusted = feelsLike + SHADE_ADJ[shadeRating ?? 1]
  if (adjusted >= 105) return { label: 'Avoid', color: '#B91C1C', bg: '#FDE8E8' }
  if (adjusted >= 95)  return { label: 'Hot',   color: '#BA7517', bg: '#FAEEDA' }
  if (adjusted >= 80)  return { label: 'Warm',  color: '#BA7517', bg: '#FFF9EC' }
  if (adjusted >= 55)  return { label: 'Good',  color: '#3B6D11', bg: '#EAF3DE' }
  return                      { label: 'Great', color: '#3B6D11', bg: '#EAF3DE' }
}

function ShadeBar({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: i <= rating ? '#3B6D11' : '#D3D1C7' }} />
      ))}
      <span style={{ fontSize: 11, color: '#5F5E5A', marginLeft: 4 }}>{SHADE_LABELS[rating]}</span>
    </div>
  )
}

function DifficultyPill({ difficulty }) {
  const colors = { easy: { bg: '#EAF3DE', color: '#3B6D11' }, moderate: { bg: '#FAEEDA', color: '#BA7517' }, hard: { bg: '#FDE8E8', color: '#B91C1C' }, expert: { bg: '#2C2C2A', color: '#fff' } }
  const s = colors[difficulty] || colors.easy
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)' }}>{difficulty}</span>
}

function LocationCard({ loc, highlighted, onMouseEnter, onMouseLeave, weather }) {
  const comfort = weather ? getComfort(weather.feelsLike, loc.shade_rating) : null
  return (
    <Link href={`/locations/${loc.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          background: '#fff', borderRadius: 12, overflow: 'hidden',
          border: highlighted ? '2px solid #3B6D11' : '1px solid #D3D1C7',
          transition: 'box-shadow 0.15s, border 0.15s', cursor: 'pointer',
          boxShadow: highlighted ? '0 4px 20px rgba(59,109,17,0.18)' : 'none',
        }}
      >
        <div style={{ position: 'relative', height: 160 }}>
          <Image src={loc.hero_photo} alt={loc.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 400px" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {loc.activities.slice(0, 2).map(a => (
              <span key={a} style={{ background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-barlow-condensed)', textTransform: 'uppercase' }}>{ACTIVITY_LABELS[a]}</span>
            ))}
            {loc.activities.length > 2 && <span style={{ background: 'rgba(0,0,0,0.65)', color: '#D3D1C7', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-barlow-condensed)' }}>+{loc.activities.length - 2}</span>}
          </div>
          {loc.badges.includes('sa_summer_pick') && (
            <div style={{ position: 'absolute', top: 8, right: 8, background: '#3B6D11', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-barlow-condensed)', textTransform: 'uppercase' }}>☀ Summer Pick</div>
          )}
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 17, fontWeight: 700, color: '#2C2C2A', margin: 0, lineHeight: 1.2 }}>{loc.name}</h3>
              <p style={{ fontSize: 11, color: '#5F5E5A', margin: '1px 0 0', fontFamily: 'var(--font-barlow)' }}>{loc.area}</p>
            </div>
            {loc.difficulty && <DifficultyPill difficulty={loc.difficulty} />}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <ShadeBar rating={loc.shade_rating} />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: '#5F5E5A', fontFamily: 'var(--font-barlow)' }}>
              {loc.distance_miles && <span>{loc.distance_miles} mi</span>}
              {(loc.dog_friendly === 'leash_required' || loc.dog_friendly === 'yes') && <span>🐕</span>}
              {comfort && (
                <span style={{ background: comfort.bg, color: comfort.color, fontWeight: 700, fontSize: 10, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.04em', fontFamily: 'var(--font-barlow-condensed)', textTransform: 'uppercase' }}>
                  {comfort.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function LocationsContent() {
  const searchParams = useSearchParams()
  const [activeActivity, setActiveActivity] = useState(null)
  const [shadeMins, setShadeMins] = useState(1)
  const [difficultyFilter, setDifficultyFilter] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('split') // 'list' | 'map' | 'split'
  const [hoveredId, setHoveredId] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const activity = searchParams.get('activity')
    if (activity && ACTIVITY_LABELS[activity]) setActiveActivity(activity)
  }, [searchParams])

  useEffect(() => {
    fetch('/api/weather').then(r => r.json()).then(setWeather).catch(() => {})
  }, [])

  const usedActivities = useMemo(() => {
    const set = new Set(locations.flatMap(l => l.activities))
    return ALL_ACTIVITIES.filter(a => set.has(a))
  }, [])

  const filtered = useMemo(() => locations.filter(loc => {
    if (activeActivity && !loc.activities.includes(activeActivity)) return false
    if (loc.shade_rating < shadeMins) return false
    if (difficultyFilter && loc.difficulty !== difficultyFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!loc.name.toLowerCase().includes(q) && !loc.short_desc.toLowerCase().includes(q) && !loc.area.toLowerCase().includes(q)) return false
    }
    return true
  }), [activeActivity, shadeMins, difficultyFilter, searchQuery])

  const showList = view !== 'map'
  const showMap = view !== 'list'

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F7F5EF; font-family: var(--font-barlow); }
        .filter-pill { padding: 6px 13px; border-radius: 20px; border: 1.5px solid #D3D1C7; background: #fff; cursor: pointer; font-size: 13px; font-family: var(--font-barlow); color: #2C2C2A; transition: all 0.15s; white-space: nowrap; }
        .filter-pill:hover { border-color: #3B6D11; color: #3B6D11; }
        .filter-pill.active { background: #3B6D11; border-color: #3B6D11; color: #fff; }
        .view-btn { padding: 6px 14px; border: 1.5px solid #D3D1C7; background: #fff; cursor: pointer; font-size: 13px; font-family: var(--font-barlow); color: #5F5E5A; transition: all 0.15s; }
        .view-btn:first-child { border-radius: 6px 0 0 6px; }
        .view-btn:last-child { border-radius: 0 6px 6px 0; border-left: none; }
        .view-btn:nth-child(2) { border-left: none; }
        .view-btn.active { background: #2C2C2A; border-color: #2C2C2A; color: #fff; }
        .list-scroll { overflow-y: auto; }
        .list-scroll::-webkit-scrollbar { width: 4px; }
        .list-scroll::-webkit-scrollbar-track { background: transparent; }
        .list-scroll::-webkit-scrollbar-thumb { background: #D3D1C7; border-radius: 2px; }
        .locations-grid-single { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 1024px) { .locations-grid-single { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .locations-grid-single { grid-template-columns: 1fr; } }
        .leaflet-popup-content-wrapper { border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important; }
        .leaflet-popup-tip { display: none; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: '#F7F5EF', borderBottom: '1px solid #D3D1C7', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: '#2C2C2A' }}>
            OUTDOOR<span style={{ color: '#3B6D11' }}>SA</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* View toggle */}
          <div style={{ display: 'flex' }}>
            <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>List</button>
            <button className={`view-btn${view === 'split' ? ' active' : ''}`} onClick={() => setView('split')}>Split</button>
            <button className={`view-btn${view === 'map' ? ' active' : ''}`} onClick={() => setView('map')}>Map</button>
          </div>
        </div>
      </nav>

      {/* Filters bar */}
      <div style={{ background: '#F7F5EF', borderBottom: '1px solid #D3D1C7', padding: '10px 24px', position: 'sticky', top: 56, zIndex: 999, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Search…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 20, border: '1.5px solid #D3D1C7', background: '#fff', fontSize: 13, fontFamily: 'var(--font-barlow)', outline: 'none', color: '#2C2C2A', width: 140 }}
        />
        <button className={`filter-pill${!activeActivity ? ' active' : ''}`} onClick={() => setActiveActivity(null)}>All</button>
        {usedActivities.map(a => (
          <button key={a} className={`filter-pill${activeActivity === a ? ' active' : ''}`} onClick={() => setActiveActivity(activeActivity === a ? null : a)}>
            {ACTIVITY_LABELS[a]}
          </button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          <span style={{ fontSize: 12, color: '#5F5E5A', whiteSpace: 'nowrap', fontFamily: 'var(--font-barlow)' }}>Shade:</span>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setShadeMins(n)} title={SHADE_LABELS[n]}
              style={{ width: 22, height: 22, borderRadius: 4, border: '1.5px solid', borderColor: n === shadeMins ? '#3B6D11' : '#D3D1C7', background: n <= shadeMins ? '#3B6D11' : '#fff', cursor: 'pointer' }} />
          ))}
        </div>
        {['easy','moderate','hard'].map(d => (
          <button key={d} className={`filter-pill${difficultyFilter === d ? ' active' : ''}`} onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)} style={{ fontSize: 12 }}>
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#5F5E5A', fontFamily: 'var(--font-barlow)', marginLeft: 4 }}>{filtered.length} locations</span>
        {weather?.temp != null && (
          <span style={{ fontSize: 12, color: '#5F5E5A', fontFamily: 'var(--font-barlow)', marginLeft: 8, paddingLeft: 8, borderLeft: '1px solid #D3D1C7', whiteSpace: 'nowrap' }}>
            {weather.temp}°F
            {weather.feelsLike != null && weather.feelsLike !== weather.temp && <> · Feels {weather.feelsLike}°F</>}
            {weather.conditions && <> · {weather.conditions}</>}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', height: 'calc(100vh - 112px)', overflow: 'hidden' }}>
        {/* List panel */}
        {showList && (
          <div
            className="list-scroll"
            style={{
              width: view === 'list' ? '100%' : '420px',
              flexShrink: 0,
              overflowY: 'auto',
              background: '#F7F5EF',
              borderRight: view === 'split' ? '1px solid #D3D1C7' : 'none',
              padding: '20px',
            }}
          >
            {view === 'list' ? (
              <div className="locations-grid-single">
                {filtered.map(loc => (
                  <LocationCard key={loc.id} loc={loc} highlighted={hoveredId === loc.id} onMouseEnter={() => setHoveredId(loc.id)} onMouseLeave={() => setHoveredId(null)} weather={weather} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(loc => (
                  <LocationCard key={loc.id} loc={loc} highlighted={hoveredId === loc.id} onMouseEnter={() => setHoveredId(loc.id)} onMouseLeave={() => setHoveredId(null)} weather={weather} />
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#5F5E5A' }}>
                <p style={{ fontSize: 16 }}>No locations match your filters.</p>
                <button onClick={() => { setActiveActivity(null); setShadeMins(1); setDifficultyFilter(null); setSearchQuery('') }}
                  style={{ marginTop: 12, padding: '8px 16px', background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-barlow)', fontSize: 14 }}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Map panel */}
        {showMap && (
          <div style={{ flex: 1, position: 'relative' }}>
            <MapView locations={filtered} activeId={hoveredId} onHover={setHoveredId} />
          </div>
        )}
      </div>
    </>
  )
}

export default function LocationsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: 'var(--font-barlow)', color: '#5F5E5A' }}>Loading…</div>}>
      <LocationsContent />
    </Suspense>
  )
}

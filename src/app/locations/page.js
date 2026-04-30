'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import locations from '@/data/locations.json'

const ACTIVITY_LABELS = {
  hiking: 'Hiking',
  cycling: 'Cycling',
  trail_running: 'Trail Running',
  kayaking: 'Kayaking',
  birding: 'Birding',
  camping: 'Camping',
  disc_golf: 'Disc Golf',
  outdoor_fitness: 'Outdoor Fitness',
  swimming: 'Swimming',
  fishing: 'Fishing',
  picnicking: 'Picnicking',
  nature_watching: 'Nature Watching',
}

const BADGE_LABELS = {
  sa_summer_pick: 'SA Summer Pick',
  sunrise_spot: 'Sunrise Spot',
  sunset_spot: 'Sunset Spot',
  dog_favorite: 'Dog Favorite',
  hidden_gem: 'Hidden Gem',
  family_first: 'Family Friendly',
  birding_hotspot: 'Birding Hotspot',
  best_beginner: 'Great for Beginners',
  most_scenic: 'Most Scenic',
  local_favorite: 'Local Favorite',
  afuera_pick: 'Afuera Pick',
  avoid_midday: 'Avoid Midday',
  flood_risk: 'Flood Risk',
}

const SHADE_LABELS = ['', 'Full Sun', 'Mostly Sun', 'Mixed', 'Mostly Shaded', 'Full Shade']

const ALL_ACTIVITIES = Object.keys(ACTIVITY_LABELS)

function ShadeBar({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            background: i <= rating ? '#3B6D11' : '#D3D1C7',
          }}
        />
      ))}
      <span style={{ fontSize: 11, color: '#5F5E5A', marginLeft: 4 }}>{SHADE_LABELS[rating]}</span>
    </div>
  )
}

function DifficultyPill({ difficulty }) {
  const colors = {
    easy: { bg: '#EAF3DE', color: '#3B6D11' },
    moderate: { bg: '#FAEEDA', color: '#BA7517' },
    hard: { bg: '#FDE8E8', color: '#B91C1C' },
    expert: { bg: '#2C2C2A', color: '#fff' },
  }
  const s = colors[difficulty] || colors.easy
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
      padding: '2px 8px', borderRadius: 4,
      textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)',
    }}>
      {difficulty}
    </span>
  )
}

function LocationCard({ loc }) {
  return (
    <Link href={`/locations/${loc.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #D3D1C7',
        transition: 'box-shadow 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ position: 'relative', height: 180 }}>
          <Image
            src={loc.hero_photo}
            alt={loc.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
          }} />
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {loc.activities.slice(0, 3).map(a => (
              <span key={a} style={{
                background: 'rgba(0,0,0,0.65)', color: '#fff',
                fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                padding: '3px 7px', borderRadius: 4,
                fontFamily: 'var(--font-barlow-condensed)',
                textTransform: 'uppercase',
              }}>{ACTIVITY_LABELS[a]}</span>
            ))}
            {loc.activities.length > 3 && (
              <span style={{
                background: 'rgba(0,0,0,0.65)', color: '#D3D1C7',
                fontSize: 10, fontWeight: 600,
                padding: '3px 7px', borderRadius: 4,
                fontFamily: 'var(--font-barlow-condensed)',
              }}>+{loc.activities.length - 3}</span>
            )}
          </div>
          {loc.badges.includes('sa_summer_pick') && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: '#3B6D11', color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
              padding: '3px 8px', borderRadius: 4,
              fontFamily: 'var(--font-barlow-condensed)',
              textTransform: 'uppercase',
            }}>☀ SA Summer Pick</div>
          )}
        </div>

        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: 18, fontWeight: 700,
                color: '#2C2C2A', margin: 0, lineHeight: 1.2,
              }}>{loc.name}</h3>
              <p style={{ fontSize: 12, color: '#5F5E5A', margin: '2px 0 0', fontFamily: 'var(--font-barlow)' }}>
                {loc.area}
              </p>
            </div>
            {loc.difficulty && <DifficultyPill difficulty={loc.difficulty} />}
          </div>

          <p style={{
            fontSize: 13, color: '#5F5E5A', margin: '8px 0 10px',
            lineHeight: 1.5, fontFamily: 'var(--font-barlow)',
          }}>{loc.short_desc}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ShadeBar rating={loc.shade_rating} />
            <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#5F5E5A', fontFamily: 'var(--font-barlow)' }}>
              {loc.distance_miles && <span>{loc.distance_miles} mi</span>}
              {loc.dog_friendly === 'leash_required' && <span>🐕 Dogs OK</span>}
              {loc.dog_friendly === 'yes' && <span>🐕 Dogs OK</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function LocationsPage() {
  const [activeActivity, setActiveActivity] = useState(null)
  const [shadeMins, setShadeMins] = useState(1)
  const [difficultyFilter, setDifficultyFilter] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const usedActivities = useMemo(() => {
    const set = new Set(locations.flatMap(l => l.activities))
    return ALL_ACTIVITIES.filter(a => set.has(a))
  }, [])

  const filtered = useMemo(() => {
    return locations.filter(loc => {
      if (activeActivity && !loc.activities.includes(activeActivity)) return false
      if (loc.shade_rating < shadeMins) return false
      if (difficultyFilter && loc.difficulty !== difficultyFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!loc.name.toLowerCase().includes(q) && !loc.short_desc.toLowerCase().includes(q) && !loc.area.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [activeActivity, shadeMins, difficultyFilter, searchQuery])

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F7F5EF; font-family: var(--font-barlow); }
        .filter-pill {
          padding: 7px 14px;
          border-radius: 20px;
          border: 1.5px solid #D3D1C7;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          font-family: var(--font-barlow);
          color: #2C2C2A;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .filter-pill:hover { border-color: #3B6D11; color: #3B6D11; }
        .filter-pill.active { background: #3B6D11; border-color: #3B6D11; color: #fff; }
        .locations-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .locations-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .locations-grid { grid-template-columns: 1fr; }
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
          <span style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontWeight: 800, fontSize: 20, letterSpacing: '0.04em',
            color: '#2C2C2A',
          }}>
            OUTDOOR<span style={{ color: '#3B6D11' }}>SA</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#5F5E5A', fontFamily: 'var(--font-barlow)' }}>
          <Link href="/locations" style={{ color: '#3B6D11', fontWeight: 600, textDecoration: 'none' }}>Locations</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#639922', textTransform: 'uppercase', fontFamily: 'var(--font-barlow-condensed)', margin: '0 0 6px' }}>
            San Antonio Outdoor Guide
          </p>
          <h1 style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: 42, fontWeight: 800, color: '#2C2C2A',
            margin: '0 0 8px', lineHeight: 1.1,
          }}>
            {filtered.length} {activeActivity ? ACTIVITY_LABELS[activeActivity] : 'Outdoor'} Locations
          </h1>
          <p style={{ fontSize: 15, color: '#5F5E5A', margin: 0, fontFamily: 'var(--font-barlow)' }}>
            Shade ratings, seasonal conditions, and local knowledge — everything AllTrails leaves out.
          </p>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%', maxWidth: 400,
            padding: '9px 14px', borderRadius: 8,
            border: '1.5px solid #D3D1C7', background: '#fff',
            fontSize: 14, fontFamily: 'var(--font-barlow)',
            outline: 'none', marginBottom: 16,
            color: '#2C2C2A',
          }}
        />

        {/* Activity filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button className={`filter-pill${!activeActivity ? ' active' : ''}`} onClick={() => setActiveActivity(null)}>
            All
          </button>
          {usedActivities.map(a => (
            <button
              key={a}
              className={`filter-pill${activeActivity === a ? ' active' : ''}`}
              onClick={() => setActiveActivity(activeActivity === a ? null : a)}
            >
              {ACTIVITY_LABELS[a]}
            </button>
          ))}
        </div>

        {/* Secondary filters */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#5F5E5A', fontFamily: 'var(--font-barlow)', whiteSpace: 'nowrap' }}>
              Min shade:
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setShadeMins(n)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: '1.5px solid',
                    borderColor: shadeMins === n ? '#3B6D11' : '#D3D1C7',
                    background: shadeMins <= n ? '#3B6D11' : '#fff',
                    cursor: 'pointer',
                  }}
                  title={SHADE_LABELS[n]}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['easy', 'moderate', 'hard'].map(d => (
              <button
                key={d}
                className={`filter-pill${difficultyFilter === d ? ' active' : ''}`}
                onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
                style={{ fontSize: 12 }}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5F5E5A', fontFamily: 'var(--font-barlow)' }}>
            <p style={{ fontSize: 18 }}>No locations match your filters.</p>
            <button onClick={() => { setActiveActivity(null); setShadeMins(1); setDifficultyFilter(null); setSearchQuery('') }}
              style={{ marginTop: 12, padding: '8px 16px', background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-barlow)', fontSize: 14 }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="locations-grid">
            {filtered.map(loc => <LocationCard key={loc.id} loc={loc} />)}
          </div>
        )}
      </div>
    </>
  )
}

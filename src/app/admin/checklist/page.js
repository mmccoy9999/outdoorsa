import locations from '@/data/locations.json'

const SHOT_TYPES = [
  { id: 'hero',       label: 'Hero Shot',         tip: 'Trail through trees, scenic overlook, or signature feature — horizontal, well-lit, no people blocking' },
  { id: 'sign',       label: 'Entrance Sign',      tip: 'Park name sign at main entrance — include surrounding vegetation for context' },
  { id: 'trailhead',  label: 'Trailhead / Parking', tip: 'Main parking lot and trailhead kiosk — shows visitors what to expect on arrival' },
  { id: 'trail_dirt', label: 'Dirt Trail',         tip: 'Natural surface singletrack — shoot down the trail to show character and canopy' },
  { id: 'trail_paved',label: 'Paved Trail',        tip: 'Paved path section — show width, condition, shade coverage' },
  { id: 'vista',      label: 'Vista / View',       tip: 'Any overlook or elevated view — hills, city skyline, water, open meadow' },
  { id: 'water',      label: 'Water Feature',      tip: 'Creek, river, lake, or pond — shoot toward the light for best reflection' },
  { id: 'wildlife',   label: 'Wildlife / Flora',   tip: 'Deer, birds, wildflowers, cacti, cedar, live oaks — any distinctive nature shot' },
  { id: 'dog_park',   label: 'Dog Park',           tip: 'Off-leash area fence, gate, or dogs playing — great for dog-friendly badge' },
  { id: 'playground', label: 'Playground',         tip: 'Play equipment — best in morning light before crowds' },
  { id: 'pavilion',   label: 'Pavilion / Shade',   tip: 'Covered picnic area or pavilion — shows shade amenity' },
  { id: 'fitness',    label: 'Fitness Stations',   tip: 'Outdoor exercise equipment — shoot along the row if multiple stations' },
  { id: 'restrooms',  label: 'Restrooms',          tip: 'Quick exterior shot — confirms amenity exists for visitors' },
  { id: 'amenity',    label: 'Other Amenity',      tip: 'Disc golf basket, kayak launch, pump track, climbing wall, splash pad, skate park, etc.' },
]

const DRONE_SHOTS = [
  { id: 'drone_overview',  label: 'Park Overview',       tip: 'High altitude (300–400ft) — capture full park boundary and layout. Best shot for hero image.' },
  { id: 'drone_trail',     label: 'Follow the Trail',    tip: 'Low altitude (50–100ft), fly slowly down the main trail — cinematic reveal shot' },
  { id: 'drone_trailhead', label: 'Trailhead Approach',  tip: '150ft, angled down toward parking + trailhead — shows access and scale' },
  { id: 'drone_feature',   label: 'Signature Feature',   tip: 'Canyon edge, lake, creek bend, hilltop, bridge — orbit shot at 100–200ft' },
  { id: 'drone_canopy',    label: 'Tree Canopy',         tip: 'Straight-down (nadir) shot over the densest tree canopy — shows shade rating visually' },
  { id: 'drone_sunrise',   label: 'Golden Hour',         tip: 'Early morning or late afternoon — long shadows and warm light on the landscape' },
]

const AREAS_TO_DOCUMENT = [
  'Trails (dirt singletrack)',
  'Paved path / greenway',
  'Creek or water access',
  'Dog park',
  'Playground',
  'Pavilion / picnic area',
  'Fitness stations',
  'Disc golf course',
  'Pump track / bike skills',
  'Kayak launch',
  'Splash pad',
  'Skate park',
  'Restrooms',
  'Parking / trailhead',
  'Vista / overlook',
  'Unique geological feature',
]

// Group parks by area
const AREA_ORDER = [
  'North SA', 'Northwest SA', 'Northeast San Antonio', 'North San Antonio',
  'Central SA', 'West San Antonio', 'South SA', 'Southwest SA', 'Southeast SA',
  'Hill Country Edge', 'Hill Country', 'South Texas Edge', 'South Texas Plains',
  'Coastal Bend',
]

function groupByArea(parks) {
  const groups = {}
  parks.forEach(p => {
    const area = p.area || 'Other'
    if (!groups[area]) groups[area] = []
    groups[area].push(p)
  })
  return groups
}

function StatusPill({ hasHero, photoCount, sectionCount }) {
  if (hasHero && sectionCount > 0) return (
    <span style={{ background: 'rgba(151,196,89,0.15)', color: '#97C459', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
      ✅ Complete
    </span>
  )
  if (hasHero && photoCount > 1) return (
    <span style={{ background: 'rgba(186,117,23,0.15)', color: '#BA7517', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
      📸 Has photos, needs sections
    </span>
  )
  if (hasHero) return (
    <span style={{ background: 'rgba(186,117,23,0.15)', color: '#BA7517', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
      🖼 Hero only
    </span>
  )
  return (
    <span style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
      📷 Needs photos
    </span>
  )
}

export default function ChecklistPage() {
  const grouped = groupByArea(locations)
  const totalNeeding = locations.filter(p => !p.hero_photo || !p.sections?.length).length

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a18', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>← Dashboard</a>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: 16, fontWeight: 800 }}>📷 Park Photo Checklist</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          {locations.length - totalNeeding}/{locations.length} parks complete
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>

        {/* Shot type guide */}
        <div style={{ background: '#2C2C2A', borderRadius: 12, padding: 24, marginBottom: 32, border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800 }}>📸 Ground Shot Guide</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {SHOT_TYPES.map(s => (
              <div key={s.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#97C459', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{s.tip}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Drone shot guide */}
        <div style={{ background: '#2C2C2A', borderRadius: 12, padding: 24, marginBottom: 32, border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800 }}>🚁 Drone Shot Guide</h2>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            FAA Part 107 required for commercial use. SA city parks require prior authorization — check AirMap or LAANC before flying. Hill Country state parks require TPWD permit.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {DRONE_SHOTS.map(s => (
              <div key={s.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#639922', marginBottom: 3 }}>🚁 {s.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{s.tip}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Area sections to document */}
        <div style={{ background: '#2C2C2A', borderRadius: 12, padding: 24, marginBottom: 32, border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 800 }}>🗂 Park Areas to Document</h2>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Each area becomes a clickable gallery card on the park page (like McAllister). Capture 3–6 photos per area.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AREAS_TO_DOCUMENT.map(a => (
              <span key={a} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 12, padding: '4px 10px', borderRadius: 6 }}>
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Park list by area */}
        {AREA_ORDER.filter(area => grouped[area]).map(area => (
          <div key={area} style={{ marginBottom: 32 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: '#97C459', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📍 {area}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {grouped[area].map(park => {
                const hasHero = !!park.hero_photo
                const photoCount = park.photos?.length || 0
                const sectionCount = park.sections?.length || 0
                const needsVisit = !hasHero || sectionCount === 0

                return (
                  <div key={park.id} style={{
                    background: needsVisit ? '#2C2C2A' : 'rgba(44,44,42,0.5)',
                    borderRadius: 10, padding: '16px 20px',
                    border: `1px solid ${needsVisit ? 'rgba(255,255,255,0.08)' : 'rgba(151,196,89,0.1)'}`,
                  }}>
                    {/* Park header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: needsVisit ? 12 : 0 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 800 }}>{park.name}</span>
                          <StatusPill hasHero={hasHero} photoCount={photoCount} sectionCount={sectionCount} />
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                          {park.address} · {park.distance_miles ? `${park.distance_miles}mi trails` : ''} · {(park.activities || []).join(', ')}
                        </div>
                      </div>
                      <a
                        href={`/locations/${park.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', flexShrink: 0, marginLeft: 12 }}
                      >
                        View page →
                      </a>
                    </div>

                    {/* Checklist — only show for parks needing photos */}
                    {needsVisit && (
                      <div>
                        {/* What to shoot based on activities */}
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shots needed</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {/* Always needed */}
                            {['Hero Shot', 'Entrance Sign', 'Trailhead / Parking'].map(s => (
                              <span key={s} style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', fontSize: 11, padding: '3px 8px', borderRadius: 5, fontWeight: 600 }}>
                                ☐ {s}
                              </span>
                            ))}
                            {/* Activity-based */}
                            {(park.activities || []).includes('hiking') && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Trail (dirt)</span>
                            )}
                            {(park.activities || []).includes('cycling') && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Trail (paved/MTB)</span>
                            )}
                            {(park.activities || []).includes('kayaking') && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Water / Launch</span>
                            )}
                            {(park.activities || []).includes('fishing') && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Fishing Access</span>
                            )}
                            {(park.activities || []).includes('birding') && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Wildlife / Flora</span>
                            )}
                            {(park.activities || []).includes('disc_golf') && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Disc Golf</span>
                            )}
                            {(park.activities || []).includes('outdoor_fitness') && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Fitness Stations</span>
                            )}
                            {park.dog_friendly && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Dog Park / Dog Access</span>
                            )}
                            {park.playground && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Playground</span>
                            )}
                            {park.picnic_tables && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Pavilion / Picnic</span>
                            )}
                            {/* Vista for high shade_rating or elevation */}
                            {(park.elevation_gain_ft > 100 || park.shade_rating <= 2) && (
                              <span style={{ background: 'rgba(99,153,34,0.12)', color: '#97C459', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>☐ Vista / View</span>
                            )}
                          </div>
                        </div>

                        {/* Drone */}
                        <div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drone shots</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            <span style={{ background: 'rgba(99,153,34,0.08)', color: '#639922', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>🚁 Park Overview (300ft)</span>
                            {(park.elevation_gain_ft > 150 || (park.activities || []).includes('hiking')) && (
                              <span style={{ background: 'rgba(99,153,34,0.08)', color: '#639922', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>🚁 Follow the Trail</span>
                            )}
                            {(park.activities || []).includes('kayaking') || (park.activities || []).includes('fishing') ? (
                              <span style={{ background: 'rgba(99,153,34,0.08)', color: '#639922', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>🚁 Water Feature Orbit</span>
                            ) : null}
                            {park.elevation_gain_ft > 200 && (
                              <span style={{ background: 'rgba(99,153,34,0.08)', color: '#639922', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>🚁 Ridge / Overlook Shot</span>
                            )}
                            <span style={{ background: 'rgba(99,153,34,0.08)', color: '#639922', fontSize: 11, padding: '3px 8px', borderRadius: 5 }}>🚁 Canopy Nadir (straight down)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          OutdoorSA Admin · <a href="/admin" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>← Back to Dashboard</a>
        </p>
      </div>
    </div>
  )
}

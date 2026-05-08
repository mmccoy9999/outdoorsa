import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const locations = JSON.parse(readFileSync(join(ROOT, 'src/data/locations.json'), 'utf8'))

const TRAILS_DIR = join(ROOT, 'public/trails')
mkdirSync(TRAILS_DIR, { recursive: true })

// Radius in degrees (~1.5km)
const R = 0.014

async function fetchTrails(loc) {
  const { id, lat, lng } = loc
  const bbox = `${lat - R},${lng - R},${lat + R},${lng + R}`
  const query = `[out:json][timeout:25];(way["highway"~"^(path|footway|track)$"](${bbox}););out geom;`
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OutdoorSA/1.0 hello@outdoorsa.co', 'Accept': 'application/json' }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    const features = data.elements
      .filter(el => el.geometry && el.geometry.length > 1)
      .map(el => ({
        type: 'Feature',
        properties: {
          name: el.tags?.name || null,
          highway: el.tags?.highway,
          surface: el.tags?.surface || null,
          trail_visibility: el.tags?.trail_visibility || null,
          sac_scale: el.tags?.sac_scale || null,
          osm_id: el.id,
        },
        geometry: {
          type: 'LineString',
          coordinates: el.geometry.map(n => [n.lon, n.lat]),
        },
      }))

    const geojson = { type: 'FeatureCollection', features }
    writeFileSync(join(TRAILS_DIR, `${id}.geojson`), JSON.stringify(geojson))
    console.log(`✓ ${id}: ${features.length} trail segments`)
    return features.length
  } catch (err) {
    console.error(`✗ ${id}: ${err.message}`)
    writeFileSync(join(TRAILS_DIR, `${id}.geojson`), JSON.stringify({ type: 'FeatureCollection', features: [] }))
    return 0
  }
}

// Process in batches to avoid rate limiting
async function run() {
  const BATCH = 4
  const DELAY = 1200 // ms between batches

  for (let i = 0; i < locations.length; i += BATCH) {
    const batch = locations.slice(i, i + BATCH)
    await Promise.all(batch.map(fetchTrails))
    if (i + BATCH < locations.length) {
      await new Promise(r => setTimeout(r, DELAY))
    }
  }
  console.log('\nDone!')
}

run()

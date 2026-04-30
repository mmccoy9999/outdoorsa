const toF = c => c != null ? Math.round(c * 9 / 5 + 32) : null

export async function GET() {
  try {
    const res = await fetch(
      'https://api.weather.gov/stations/KSAT/observations/latest',
      {
        headers: { 'User-Agent': 'OutdoorSA/1.0 hello@outdoorsa.co' },
        next: { revalidate: 1800 },
      }
    )
    if (!res.ok) throw new Error('NWS error')
    const { properties: p } = await res.json()

    const temp = toF(p.temperature?.value)
    const heatIndex = toF(p.heatIndex?.value)
    const windChill = toF(p.windChill?.value)

    return Response.json({
      temp,
      feelsLike: heatIndex ?? windChill ?? temp,
      conditions: p.textDescription ?? null,
      timestamp: p.timestamp ?? null,
    })
  } catch {
    return Response.json({ temp: null, feelsLike: null, conditions: null, timestamp: null })
  }
}

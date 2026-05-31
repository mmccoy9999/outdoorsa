import locations from '@/data/locations.json'
import LogoutButton from './LogoutButton'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://outdoorsa.co'

// Fetch Mailchimp subscriber count server-side
async function getMailchimpStats() {
  try {
    const { MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_SERVER } = process.env
    if (!MAILCHIMP_API_KEY) return null
    const res = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}?fields=stats.member_count,stats.unsubscribe_count`,
      {
        headers: { Authorization: `Bearer ${MAILCHIMP_API_KEY}` },
        next: { revalidate: 300 }, // cache 5 min
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      subscribers: data.stats?.member_count ?? 0,
      unsubscribed: data.stats?.unsubscribe_count ?? 0,
    }
  } catch {
    return null
  }
}

// Site coverage stats
function getSiteStats() {
  const total = locations.length
  const withSections = locations.filter(p => p.sections && p.sections.length > 0).length
  const withGallery = locations.filter(p => p.photos && p.photos.length > 1).length
  const withHero = locations.filter(p => p.hero_photo).length
  const activities = new Set(locations.flatMap(p => p.activities || []))
  return { total, withSections, withGallery, withHero, activityTypes: activities.size }
}

function Card({ children, style }) {
  return (
    <div style={{
      background: '#2C2C2A', borderRadius: 12, padding: '24px',
      border: '1px solid rgba(255,255,255,0.07)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    active:   { bg: 'rgba(151, 196, 89, 0.15)', color: '#97C459', text: '● Active' },
    warning:  { bg: 'rgba(186, 117, 23, 0.15)', color: '#BA7517', text: '⚠ Needs attention' },
    pending:  { bg: 'rgba(99, 153, 34, 0.15)',  color: '#97C459', text: '⏳ Pending' },
    inactive: { bg: 'rgba(255,255,255,0.07)',    color: 'rgba(255,255,255,0.4)', text: '○ Inactive' },
  }
  const s = styles[status] || styles.inactive
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
      letterSpacing: '0.03em',
    }}>
      {s.text}
    </span>
  )
}

function StatNumber({ value, label, sub }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#97C459', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export default async function AdminDashboard() {
  const [mailchimp, siteStats] = await Promise.all([
    getMailchimpStats(),
    Promise.resolve(getSiteStats()),
  ])

  const now = new Date()
  const nextRun = new Date(now)
  nextRun.setUTCHours(13, 0, 0, 0)
  if (nextRun <= now) nextRun.setDate(nextRun.getDate() + 1)
  const hoursUntil = Math.round((nextRun - now) / 1000 / 3600)

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1a18',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌿</span>
          <div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>OutdoorSA</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>Admin Dashboard</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>
            ← View site
          </a>
          <LogoutButton />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Last updated */}
        <p style={{ margin: '0 0 28px', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          Last updated: {now.toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' })} CT
        </p>

        {/* Top stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <Card>
            <StatNumber
              value={mailchimp?.subscribers ?? '—'}
              label="Email Subscribers"
              sub={mailchimp ? `${mailchimp.unsubscribed} unsubscribed` : 'Mailchimp unavailable'}
            />
          </Card>
          <Card>
            <StatNumber value={siteStats.total} label="Parks Listed" sub="across SA & Hill Country" />
          </Card>
          <Card>
            <StatNumber value={siteStats.withHero} label="Parks with Hero Photo" sub={`${siteStats.total - siteStats.withHero} missing`} />
          </Card>
          <Card>
            <StatNumber value={siteStats.withSections} label="Parks with Area Galleries" sub={`${siteStats.total - siteStats.withSections} to build out`} />
          </Card>
          <Card>
            <StatNumber value={siteStats.withGallery} label="Parks with Photo Galleries" sub={`${siteStats.total - siteStats.withGallery} photo-only`} />
          </Card>
        </div>

        {/* Grid: Tools & Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

          {/* Reddit Monitor */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>🤖 Automation</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Reddit Monitor</h2>
              </div>
              <StatusBadge status="active" />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              <div>📅 <strong style={{ color: '#fff' }}>Daily at 8:00 AM CT</strong></div>
              <div style={{ marginTop: 6 }}>⏱ Next run in ~{hoursUntil}h</div>
              <div style={{ marginTop: 6 }}>📬 Delivers to <strong style={{ color: '#fff' }}>#reddit-monitor</strong> on Slack</div>
              <div style={{ marginTop: 6 }}>🔍 Monitors: r/sanantonio, r/texashiking, r/sanantoniohiking, r/Austin</div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <a
                href="https://claude.ai/code/routines/trig_01GntwCdeSKuwb6HkYfn2WMw"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                View Routine →
              </a>
              <a
                href="https://app.slack.com/client"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Open Slack →
              </a>
            </div>
          </Card>

          {/* County Road Reddit Monitor */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>🤖 Automation</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>County Road Reddit Monitor</h2>
              </div>
              <StatusBadge status="active" />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              <div>📅 <strong style={{ color: '#fff' }}>Daily at 8:00 AM CT</strong></div>
              <div style={{ marginTop: 6 }}>📬 Delivers to <strong style={{ color: '#fff' }}>#reddit-monitor</strong> on Slack</div>
              <div style={{ marginTop: 6 }}>🔍 Monitors: r/TexasHunting, r/whitetail, r/homestead, r/land</div>
              <div style={{ marginTop: 6 }}>🎯 Keywords: wildlife exemption, ag exemption, protein feeder, stock tank, hog trapping, rollback taxes, land loan Texas</div>
              <div style={{ marginTop: 6 }}>⚙️ Via Pullpush API (api.pullpush.io)</div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <a
                href="https://claude.ai/code/routines"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                View Routine →
              </a>
              <a
                href="https://app.slack.com/client"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Open Slack →
              </a>
            </div>
          </Card>

          {/* Google Search Console */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>📊 SEO</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Search Console</h2>
              </div>
              <StatusBadge status="active" />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              <div>✅ <strong style={{ color: '#fff' }}>58 pages indexed</strong></div>
              <div style={{ marginTop: 6 }}>⚠️ 9 pages not indexed — request manually</div>
              <div style={{ marginTop: 6 }}>🌐 Property: <strong style={{ color: '#fff' }}>outdoorsa.co</strong></div>
              <div style={{ marginTop: 6 }}>💡 Tip: Request indexing for top location pages first</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Open Search Console →
              </a>
            </div>
          </Card>

          {/* AdSense */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>💰 Revenue</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Google AdSense</h2>
              </div>
              <StatusBadge status="warning" />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              <div>⚠️ <strong style={{ color: '#BA7517' }}>Low value content</strong> flag — request re-review after adding guides content</div>
              <div style={{ marginTop: 6 }}>⚠️ <strong style={{ color: '#BA7517' }}>ads.txt not found</strong> — needs to be added to public/</div>
              <div style={{ marginTop: 6 }}>📋 Ad slot IDs are placeholders — update after approval</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <a
                href="https://adsense.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Open AdSense →
              </a>
            </div>
          </Card>

          {/* Domain */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>🌐 Domain</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Domain Migration</h2>
              </div>
              <StatusBadge status="pending" />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              <div>📦 Transferring: <strong style={{ color: '#fff' }}>outdoorsa.co</strong></div>
              <div style={{ marginTop: 6 }}>🎯 Target: <strong style={{ color: '#97C459' }}>outdoorsa.com</strong></div>
              <div style={{ marginTop: 6 }}>📝 After transfer: update BASE_URL in 8+ files + Search Console property</div>
              <div style={{ marginTop: 6 }}>⏳ Domain transfers typically take 5–7 days</div>
            </div>
          </Card>

          {/* Email / Mailchimp */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>📧 Email</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Mailchimp</h2>
              </div>
              <StatusBadge status="active" />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              <div>👥 <strong style={{ color: '#fff' }}>{mailchimp?.subscribers ?? '—'} subscribers</strong> on the waitlist</div>
              <div style={{ marginTop: 6 }}>🏷️ Tag: <strong style={{ color: '#fff' }}>outdoorsa-waitlist</strong></div>
              <div style={{ marginTop: 6 }}>📬 Audience ID: <code style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>5a27499c7c</code></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <a
                href="https://mailchimp.com/audience"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Open Mailchimp →
              </a>
            </div>
          </Card>

          {/* Reddit Strategy */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>🟠 Reddit</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Reddit Strategy</h2>
              </div>
              <StatusBadge status="pending" />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              <div>⏳ <strong style={{ color: '#fff' }}>Warmup phase</strong> — 2–3 weeks of genuine engagement first</div>
              <div style={{ marginTop: 6 }}>✅ Post text written and ready for r/sanantonio</div>
              <div style={{ marginTop: 6 }}>📋 Goal: build credibility before mentioning OutdoorSA</div>
              <div style={{ marginTop: 6 }}>🔗 Subreddits: r/sanantonio · r/texashiking · r/sanantoniohiking</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <a
                href="https://reddit.com/r/sanantonio"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, padding: '6px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                r/sanantonio →
              </a>
            </div>
          </Card>

        </div>

        {/* Content to-do */}
        <div style={{ marginTop: 16 }}>
          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800 }}>📋 Content To-Do</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {[
                { done: false, text: `Add park area galleries to ${siteStats.total - siteStats.withSections} more parks (${siteStats.withSections}/50 done)` },
                { done: false, text: `Add photo galleries to ${siteStats.total - siteStats.withGallery} more parks (${siteStats.withGallery}/50 done)` },
                { done: false, text: 'Add ads.txt to /public for AdSense' },
                { done: false, text: 'Request AdSense re-review after guides section is live' },
                { done: false, text: 'Update BASE_URL to outdoorsa.com after domain transfer' },
                { done: false, text: 'Request Google indexing for remaining 9 unindexed pages' },
                { done: true,  text: 'Reddit daily monitor set up (Slack delivery ✅)' },
                { done: true,  text: 'McAllister Park photos & area galleries added' },
                { done: true,  text: 'All 50 parks fact-checked and corrected' },
                { done: true,  text: 'Homepage refactored as server component for SEO' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  fontSize: 13, color: item.done ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.8)',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>{item.done ? '✅' : '☐'}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          OutdoorSA Admin · <a href="https://outdoorsa.co" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>outdoorsa.co</a>
        </p>
      </div>
    </div>
  )
}

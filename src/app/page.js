'use client'

import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error — please try again.')
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green-dark: #3B6D11;
          --green-mid: #639922;
          --green-light: #97C459;
          --green-pale: #EAF3DE;
          --stone: #2C2C2A;
          --stone-mid: #5F5E5A;
          --stone-light: #D3D1C7;
          --cream: #F7F5EF;
          --white: #ffffff;
          --amber: #BA7517;
          --amber-light: #FAEEDA;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: var(--font-barlow), sans-serif;
          background: var(--cream);
          color: var(--stone);
          overflow-x: hidden;
        }

        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(247,245,239,0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--stone-light);
          padding: 0 2rem;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: 0.02em;
          display: flex;
          align-items: baseline;
        }

        .nav-logo .outdoor { color: var(--green-dark); }
        .nav-logo .sa { color: var(--green-mid); }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          list-style: none;
        }

        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: var(--stone-mid);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.15s;
        }

        .nav-links a:hover { color: var(--green-dark); }

        .nav-cta {
          background: var(--green-dark);
          color: var(--white) !important;
          padding: 7px 16px;
          border-radius: 6px;
          font-size: 13px !important;
          font-weight: 600 !important;
          transition: background 0.15s !important;
        }

        .nav-cta:hover { background: var(--green-mid) !important; }

        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 56px;
          position: relative;
          overflow: hidden;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5rem 3rem 5rem 4rem;
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--green-mid);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .eyebrow::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 2px;
          background: var(--green-mid);
        }

        h1 {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: clamp(52px, 6vw, 80px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.01em;
          color: var(--stone);
          margin-bottom: 1.5rem;
        }

        h1 .highlight {
          color: var(--green-dark);
          display: block;
        }

        .hero-desc {
          font-size: 17px;
          line-height: 1.65;
          color: var(--stone-mid);
          max-width: 440px;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--green-dark);
          color: var(--white);
          font-family: var(--font-barlow), sans-serif;
          font-weight: 600;
          font-size: 15px;
          padding: 13px 28px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, transform 0.1s;
        }

        .btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); }

        .btn-secondary {
          color: var(--stone);
          font-family: var(--font-barlow), sans-serif;
          font-weight: 500;
          font-size: 15px;
          padding: 13px 20px;
          background: transparent;
          border: 1.5px solid var(--stone-light);
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: border-color 0.15s, color 0.15s;
        }

        .btn-secondary:hover { border-color: var(--green-mid); color: var(--green-dark); }

        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--stone-light);
        }

        .stat-num {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--stone);
          display: block;
        }

        .stat-label {
          font-size: 13px;
          color: var(--stone-mid);
          margin-top: 2px;
          display: block;
        }

        .hero-right {
          position: relative;
          overflow: hidden;
          background: var(--green-dark);
        }

        .hero-map-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 60%, #4a7d18 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, #2d5a0e 0%, transparent 50%),
            #3B6D11;
        }

        .map-card-float {
          position: absolute;
          background: rgba(255,255,255,0.97);
          border-radius: 12px;
          padding: 14px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          animation: floatUp 3s ease-in-out infinite alternate;
        }

        @keyframes floatUp {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }

        .card-1 { top: 22%; left: 12%; animation-delay: 0s; }
        .card-2 { top: 52%; left: 42%; animation-delay: 1s; }
        .card-3 { top: 30%; right: 10%; animation-delay: 0.5s; }

        .map-card-title {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--stone);
          margin-bottom: 6px;
        }

        .map-card-meta {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .badge-shade { background: var(--amber-light); color: var(--amber); }
        .badge-diff { background: var(--green-pale); color: var(--green-dark); }
        .badge-hot { background: #FCEBEB; color: #A32D2D; }

        .map-card-sub {
          font-size: 12px;
          color: var(--stone-mid);
          margin-top: 4px;
        }

        .features-strip {
          background: var(--green-dark);
          color: var(--white);
          padding: 1.2rem 4rem;
          display: flex;
          justify-content: center;
          gap: 3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          opacity: 0.9;
        }

        .feature-icon {
          width: 20px;
          height: 20px;
          background: var(--green-light);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .section {
          padding: 6rem 4rem;
        }

        .section-label {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--green-mid);
          margin-bottom: 0.75rem;
        }

        .section-title {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: clamp(34px, 4vw, 52px);
          font-weight: 800;
          line-height: 1.05;
          color: var(--stone);
          max-width: 560px;
          margin-bottom: 3.5rem;
        }

        .diff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5px;
          background: var(--stone-light);
          border: 1.5px solid var(--stone-light);
          border-radius: 12px;
          overflow: hidden;
        }

        .diff-card {
          background: var(--white);
          padding: 2rem 1.75rem;
          transition: background 0.15s;
        }

        .diff-card:hover { background: var(--green-pale); }

        .diff-number {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 48px;
          font-weight: 800;
          color: var(--stone-light);
          line-height: 1;
          margin-bottom: 0.75rem;
        }

        .diff-card-title {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--stone);
          margin-bottom: 0.6rem;
        }

        .diff-card-desc {
          font-size: 14px;
          line-height: 1.65;
          color: var(--stone-mid);
        }

        .diff-tag {
          display: inline-block;
          margin-top: 1rem;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--green-dark);
          background: var(--green-pale);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .activity-section {
          background: var(--stone);
          padding: 5rem 4rem;
          color: var(--white);
        }

        .activity-section .section-label { color: var(--green-light); }
        .activity-section .section-title { color: var(--white); max-width: 100%; }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
          margin-top: 2.5rem;
        }

        .activity-tile {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 1.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
        }

        .activity-tile:hover {
          background: rgba(151,196,89,0.15);
          border-color: var(--green-light);
          transform: translateY(-3px);
        }

        .activity-icon { font-size: 28px; margin-bottom: 0.6rem; display: block; }
        .activity-name {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          display: block;
        }
        .activity-count { font-size: 12px; color: var(--green-light); margin-top: 3px; display: block; }

        .email-section {
          background: var(--green-dark);
          padding: 6rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .email-section::before {
          content: 'OUTDOORSA';
          position: absolute;
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 180px;
          font-weight: 800;
          color: rgba(255,255,255,0.04);
          letter-spacing: -0.02em;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          pointer-events: none;
        }

        .email-inner {
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .email-section .section-label { text-align: center; color: var(--green-light); }

        .email-title {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: clamp(38px, 5vw, 60px);
          font-weight: 800;
          color: var(--white);
          line-height: 1.05;
          margin-bottom: 1rem;
        }

        .email-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .email-form {
          display: flex;
          gap: 8px;
          max-width: 440px;
          margin: 0 auto;
        }

        .email-input {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 13px 16px;
          font-size: 15px;
          color: var(--white);
          font-family: var(--font-barlow), sans-serif;
          outline: none;
          transition: border-color 0.15s;
        }

        .email-input::placeholder { color: rgba(255,255,255,0.45); }
        .email-input:focus { border-color: var(--green-light); }

        .btn-email {
          background: var(--white);
          color: var(--green-dark);
          font-family: var(--font-barlow), sans-serif;
          font-weight: 700;
          font-size: 14px;
          padding: 13px 22px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, transform 0.1s;
        }

        .btn-email:hover { background: var(--green-pale); transform: translateY(-1px); }

        .email-fine {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 1rem;
        }

        footer {
          background: var(--stone);
          padding: 2rem 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-logo {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-weight: 800;
          font-size: 18px;
        }

        .footer-logo .outdoor { color: var(--green-light); }
        .footer-logo .sa { color: var(--green-mid); }

        .footer-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
        }

        .footer-links a {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.15s;
        }

        .footer-links a:hover { color: var(--green-light); }

        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <span className="outdoor">OUTDOOR</span><span className="sa">SA</span>
        </div>
        <ul className="nav-links">
          <li><a href="#activities">Activities</a></li>
          <li><a href="#trails">Trails</a></li>
          <li><a href="#parks">Parks</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#early" className="nav-cta">Get Early Access</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow">San Antonio&apos;s Outdoor Guide</div>
          <h1>
            Get Outside.<br />
            <span className="highlight">Know the Terrain.</span>
          </h1>
          <p className="hero-desc">
            Trails, parks, bike paths, kayak spots — curated for San Antonio with shade ratings, seasonal conditions, and everything AllTrails leaves out.
          </p>
          <div className="hero-actions">
            <a href="#early" className="btn-primary">Get Early Access</a>
            <a href="#activities" className="btn-secondary">Explore Activities →</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">80+</span>
              <span className="stat-label">Locations mapped</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">12</span>
              <span className="stat-label">Activity types</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">Free</span>
              <span className="stat-label">Always free to browse</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-map-bg"></div>
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.12}} viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="white" strokeWidth="1">
              <ellipse cx="300" cy="350" rx="80" ry="50"/>
              <ellipse cx="300" cy="350" rx="150" ry="100"/>
              <ellipse cx="300" cy="350" rx="220" ry="155"/>
              <ellipse cx="300" cy="350" rx="290" ry="210"/>
              <ellipse cx="300" cy="350" rx="360" ry="265"/>
              <ellipse cx="160" cy="200" rx="70" ry="45"/>
              <ellipse cx="160" cy="200" rx="130" ry="85"/>
              <ellipse cx="160" cy="200" rx="190" ry="125"/>
              <ellipse cx="460" cy="520" rx="60" ry="40"/>
              <ellipse cx="460" cy="520" rx="110" ry="75"/>
              <ellipse cx="460" cy="520" rx="165" ry="115"/>
            </g>
          </svg>

          <div className="map-card-float card-1">
            <div className="map-card-title">Leon Creek Greenway</div>
            <div className="map-card-meta">
              <span className="badge badge-diff">Easy</span>
              <span className="badge badge-shade">★★★ Shade</span>
            </div>
            <div className="map-card-sub">7.2 mi · Paved · Bike-friendly</div>
          </div>

          <div className="map-card-float card-2">
            <div className="map-card-title">Medina River Natural Area</div>
            <div className="map-card-meta">
              <span className="badge badge-diff">Moderate</span>
              <span className="badge badge-shade">★★ Shade</span>
            </div>
            <div className="map-card-sub">4.5 mi · Natural surface · Trail running</div>
          </div>

          <div className="map-card-float card-3">
            <div className="map-card-title">Eisenhower Park</div>
            <div className="map-card-meta">
              <span className="badge badge-hot">Hot · Best at sunrise</span>
            </div>
            <div className="map-card-sub">3.8 mi · Rocky · Hill views</div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <div className="features-strip">
        <div className="feature-item">Live weather conditions</div>
        <div className="feature-item">Shade ratings per trail</div>
        <div className="feature-item">12 activity categories</div>
        <div className="feature-item">En Español — próximamente</div>
      </div>

      {/* WHY OUTDOORSA */}
      <section className="section" id="about">
        <div className="section-label">Why OutdoorSA</div>
        <div className="section-title">Built for this city, not every city.</div>
        <div className="diff-grid">
          <div className="diff-card">
            <div className="diff-number">01</div>
            <div className="diff-card-title">Shade ratings that matter</div>
            <div className="diff-card-desc">San Antonio summers are brutal. Every listing tells you how much tree cover to expect — so you plan around the heat, not into it.</div>
            <span className="diff-tag">SA-specific</span>
          </div>
          <div className="diff-card">
            <div className="diff-number">02</div>
            <div className="diff-card-title">More than hiking</div>
            <div className="diff-card-desc">Kayaking the Medina. Birding at Mitchell Lake. Disc golf at McAllister. If you do it outside in SA, it&apos;s here.</div>
            <span className="diff-tag">12 activity types</span>
          </div>
          <div className="diff-card">
            <div className="diff-number">03</div>
            <div className="diff-card-title">Weather-aware filters</div>
            <div className="diff-card-desc">Live temperature, UV, and wind data baked into the filter. Know before you go whether today&apos;s actually a good day to go.</div>
            <span className="diff-tag">Real-time</span>
          </div>
          <div className="diff-card">
            <div className="diff-number">04</div>
            <div className="diff-card-title">En Español</div>
            <div className="diff-card-desc">Full Spanish-language version launching as Afuera SA — so the whole city can find its next adventure, not just part of it.</div>
            <span className="diff-tag">Coming soon</span>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="activity-section" id="activities">
        <div className="section-label">What&apos;s out there</div>
        <div className="section-title">Every way to get outside.</div>
        <div className="activity-grid">
          {[
            { icon: '🥾', name: 'Hiking', count: '32 spots' },
            { icon: '🚴', name: 'Cycling', count: '18 routes' },
            { icon: '🏃', name: 'Trail Running', count: '24 routes' },
            { icon: '🛶', name: 'Kayaking', count: '8 launches' },
            { icon: '🦅', name: 'Birding', count: '11 sites' },
            { icon: '🏕️', name: 'Camping', count: '6 sites' },
            { icon: '🥏', name: 'Disc Golf', count: '9 courses' },
            { icon: '🧘', name: 'Outdoor Fitness', count: '14 parks' },
          ].map((a) => (
            <div className="activity-tile" key={a.name}>
              <span className="activity-icon">{a.icon}</span>
              <span className="activity-name">{a.name}</span>
              <span className="activity-count">{a.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="email-section" id="early">
        <div className="email-inner">
          <div className="section-label">Early access</div>
          <div className="email-title">San Antonio&apos;s trails are waiting.</div>
          <p className="email-sub">Be first to explore when OutdoorSA launches. No spam — just a heads-up when we&apos;re live.</p>
          {status === 'success' ? (
            <p style={{color:'var(--green-light)',fontSize:'17px',fontWeight:600,marginBottom:'1rem'}}>
              You&apos;re on the list — we&apos;ll reach out when we launch!
            </p>
          ) : (
            <form className="email-form" onSubmit={handleSubmit}>
              <input
                className="email-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
              <button className="btn-email" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Notify Me'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p style={{color:'#f87171',fontSize:'13px',marginTop:'0.75rem'}}>{errorMsg}</p>
          )}
          <div className="email-fine">Free forever to browse · No account required to explore</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <span className="outdoor">OUTDOOR</span><span className="sa">SA</span>
        </div>
        <ul className="footer-links">
          <li><a href="#">Trails</a></li>
          <li><a href="#">Parks</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#" style={{color:'rgba(151,196,89,0.6)'}}>Afuera SA →</a></li>
        </ul>
        <div className="footer-copy">© 2026 OutdoorSA · San Antonio, TX</div>
      </footer>
    </>
  )
}
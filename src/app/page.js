'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
            radial-gradient(ellipse at 30% 60%, rgba(74,125,24,0.55) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(45,90,14,0.6) 0%, transparent 50%),
            rgba(59,109,17,0.45);
          z-index: 1;
        }

        .map-card-float {
          position: absolute;
          background: rgba(255,255,255,0.97);
          border-radius: 12px;
          padding: 14px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          animation: floatUp 3s ease-in-out infinite alternate;
          z-index: 3;
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
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          height: 190px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .activity-tile:hover { transform: translateY(-4px); }

        .activity-tile-img { position: absolute; inset: 0; }

        .activity-tile-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 55%, transparent 100%);
          transition: background 0.2s;
          z-index: 1;
        }

        .activity-tile:hover .activity-tile-overlay {
          background: linear-gradient(to top, rgba(44,90,14,0.88) 0%, rgba(44,90,14,0.45) 55%, rgba(44,90,14,0.1) 100%);
        }

        .activity-tile-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0.85rem 1rem;
          z-index: 2;
        }

        .activity-name {
          font-family: var(--font-barlow-condensed), sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: white;
          display: block;
          line-height: 1.1;
        }
        .activity-count { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 3px; display: block; }

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

        /* ── Tablet (≤1024px) ── */
        @media (max-width: 1024px) {
          .hero-left { padding: 4rem 2.5rem 4rem 3rem; }
          .features-strip { padding: 1.2rem 2rem; gap: 1.5rem; }
          .section { padding: 5rem 2.5rem; }
          .activity-section { padding: 4rem 2.5rem; }
          .email-section { padding: 5rem 2.5rem; }
          footer { padding: 2rem 2.5rem; }
        }

        /* ── Mobile (≤768px) ── */
        @media (max-width: 768px) {
          nav { padding: 0 1.25rem; }

          /* hide text links, keep CTA */
          .nav-links li:not(:last-child) { display: none; }

          .hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .hero-right { display: none; }

          .hero-left {
            padding: 3rem 1.25rem 3.5rem;
          }

          .hero-desc { max-width: 100%; }

          .hero-stats {
            gap: 1.5rem;
            flex-wrap: wrap;
          }

          .features-strip {
            padding: 1rem 1.25rem;
            flex-wrap: wrap;
            gap: 0.6rem 1.25rem;
            justify-content: flex-start;
          }

          .section { padding: 4rem 1.25rem; }
          .section-title { margin-bottom: 2.5rem; }

          .activity-section { padding: 3.5rem 1.25rem; }

          .email-section { padding: 4rem 1.25rem; }

          .email-form { flex-direction: column; }

          .btn-email {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          footer {
            padding: 2rem 1.25rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }

          .footer-links { flex-wrap: wrap; gap: 1rem 1.5rem; }
        }

        /* ── Scroll reveal ── */
        .reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Small phones (≤480px) ── */
        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; align-items: stretch; }
          .btn-primary, .btn-secondary { justify-content: center; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <span className="outdoor">OUTDOOR</span><span className="sa">SA</span>
        </div>
        <ul className="nav-links">
          <li><a href="/locations">Locations</a></li>
          <li><a href="/locations?activity=hiking">Trails</a></li>
          <li><a href="/locations?activity=outdoor_fitness">Parks</a></li>
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
          <Image
            src="https://images.unsplash.com/photo-1624664267579-d94b43372f18?w=1200&q=80&fit=crop&auto=format"
            alt="Texas river surrounded by lush green trees"
            fill
            style={{objectFit:'cover'}}
            priority
          />
          <div className="hero-map-bg"></div>
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.12,zIndex:2}} viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
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
      <div className="features-strip reveal">
        <div className="feature-item">Live weather conditions</div>
        <div className="feature-item">Shade ratings per trail</div>
        <div className="feature-item">12 activity categories</div>
        <div className="feature-item">En Español — próximamente</div>
      </div>

      {/* WHY OUTDOORSA */}
      <section className="section" id="about">
        <div className="section-label reveal">Why OutdoorSA</div>
        <div className="section-title reveal" style={{transitionDelay:'80ms'}}>Built for this city, not every city.</div>
        <div className="diff-grid">
          <div className="diff-card reveal" style={{transitionDelay:'0ms'}}>
            <div className="diff-number">01</div>
            <div className="diff-card-title">Shade ratings that matter</div>
            <div className="diff-card-desc">San Antonio summers are brutal. Every listing tells you how much tree cover to expect — so you plan around the heat, not into it.</div>
            <span className="diff-tag">SA-specific</span>
          </div>
          <div className="diff-card reveal" style={{transitionDelay:'80ms'}}>
            <div className="diff-number">02</div>
            <div className="diff-card-title">More than hiking</div>
            <div className="diff-card-desc">Kayaking the Medina. Birding at Mitchell Lake. Disc golf at McAllister. If you do it outside in SA, it&apos;s here.</div>
            <span className="diff-tag">12 activity types</span>
          </div>
          <div className="diff-card reveal" style={{transitionDelay:'160ms'}}>
            <div className="diff-number">03</div>
            <div className="diff-card-title">Weather-aware filters</div>
            <div className="diff-card-desc">Live temperature, UV, and wind data baked into the filter. Know before you go whether today&apos;s actually a good day to go.</div>
            <span className="diff-tag">Real-time</span>
          </div>
          <div className="diff-card reveal" style={{transitionDelay:'240ms'}}>
            <div className="diff-number">04</div>
            <div className="diff-card-title">En Español</div>
            <div className="diff-card-desc">Full Spanish-language version launching as Afuera SA — so the whole city can find its next adventure, not just part of it.</div>
            <span className="diff-tag">Coming soon</span>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="activity-section" id="activities">
        <div className="section-label reveal">What&apos;s out there</div>
        <div className="section-title reveal" style={{transitionDelay:'80ms'}}>Every way to get outside.</div>
        <div className="activity-grid">
          {[
            { name: 'Hiking',          count: '32 spots',   slug: 'hiking',         img: 'https://images.unsplash.com/photo-1759938894506-965368ace0f8?w=400&q=75&fit=crop&auto=format' },
            { name: 'Cycling',         count: '18 routes',  slug: 'cycling',        img: 'https://images.unsplash.com/photo-1726506116661-f62368d9d6bb?w=400&q=75&fit=crop&auto=format' },
            { name: 'Trail Running',   count: '24 routes',  slug: 'trail_running',  img: 'https://images.unsplash.com/photo-1590646299178-1b26ab821e34?w=400&q=75&fit=crop&auto=format' },
            { name: 'Kayaking',        count: '8 launches', slug: 'kayaking',       img: 'https://images.unsplash.com/photo-1698246550885-cc4e82115944?w=400&q=75&fit=crop&auto=format' },
            { name: 'Birding',         count: '11 sites',   slug: 'birding',        img: 'https://images.unsplash.com/photo-1684769099431-6dde82c04bb0?w=400&q=75&fit=crop&auto=format' },
            { name: 'Camping',         count: '6 sites',    slug: 'camping',        img: 'https://images.unsplash.com/photo-1759665839780-b695f5f3e590?w=400&q=75&fit=crop&auto=format' },
            { name: 'Disc Golf',       count: '9 courses',  slug: 'disc_golf',      img: 'https://images.unsplash.com/photo-1689514534472-791fadb755e5?w=400&q=75&fit=crop&auto=format' },
            { name: 'Outdoor Fitness', count: '14 parks',   slug: 'outdoor_fitness',img: 'https://images.unsplash.com/photo-1686247166150-fe4ef9c56241?w=400&q=75&fit=crop&auto=format' },
          ].map((a, i) => (
            <a href={`/locations?activity=${a.slug}`} key={a.name} style={{textDecoration:'none',color:'inherit'}}>
              <div className="activity-tile reveal" style={{transitionDelay:`${i * 60}ms`}}>
                <div className="activity-tile-img">
                  <Image src={a.img} alt={a.name} fill style={{objectFit:'cover'}} sizes="(max-width: 768px) 50vw, 160px" />
                </div>
                <div className="activity-tile-overlay" />
                <div className="activity-tile-content">
                  <span className="activity-name">{a.name}</span>
                  <span className="activity-count">{a.count}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="email-section" id="early">
        <div className="email-inner reveal">
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
          <li><a href="/locations?activity=hiking">Trails</a></li>
          <li><a href="/locations?activity=outdoor_fitness">Parks</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#early">Contact</a></li>
          <li><a href="#" style={{color:'rgba(151,196,89,0.6)'}}>Afuera SA →</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
        </ul>
        <div className="footer-copy">© 2026 OutdoorSA · San Antonio, TX</div>
      </footer>
    </>
  )
}
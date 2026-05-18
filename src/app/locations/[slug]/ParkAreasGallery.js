'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function ParkAreasGallery({ sections }) {
  const [open, setOpen] = useState(null)   // { sectionIndex, photoIndex }

  const close = useCallback(() => setOpen(null), [])

  const prev = useCallback(() => {
    setOpen(o => {
      const gallery = sections[o.sectionIndex].gallery
      return { ...o, photoIndex: (o.photoIndex - 1 + gallery.length) % gallery.length }
    })
  }, [sections])

  const next = useCallback(() => {
    setOpen(o => {
      const gallery = sections[o.sectionIndex].gallery
      return { ...o, photoIndex: (o.photoIndex + 1) % gallery.length }
    })
  }, [sections])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  const activeSection = open !== null ? sections[open.sectionIndex] : null
  const activePhoto = activeSection ? activeSection.gallery[open.photoIndex] : null
  const hasMultiple = activeSection && activeSection.gallery.length > 1

  return (
    <>
      {/* Area cards grid */}
      <div className="sections-grid">
        {sections.map((section, si) => (
          <button
            key={si}
            onClick={() => setOpen({ sectionIndex: si, photoIndex: 0 })}
            style={{
              position: 'relative',
              borderRadius: 10,
              overflow: 'hidden',
              background: '#2C2C2A',
              aspectRatio: '4/3',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'block',
              width: '100%',
            }}
          >
            <Image
              src={section.photo}
              alt={section.label}
              fill
              style={{ objectFit: 'cover', opacity: 0.75, transition: 'opacity 0.2s' }}
              sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 220px"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
            {section.gallery && section.gallery.length > 1 && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
                color: '#fff', fontSize: 10, fontWeight: 700,
                padding: '3px 7px', borderRadius: 4,
                fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.05em',
              }}>
                {section.gallery.length} PHOTOS
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                {section.label}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-barlow)', lineHeight: 1.35 }}>
                {section.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && activeSection && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Header */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {activeSection.label}
              </p>
              {hasMultiple && (
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-barlow)' }}>
                  {open.photoIndex + 1} / {activeSection.gallery.length}
                </p>
              )}
            </div>
            <button
              onClick={close}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, fontSize: 24, lineHeight: 1, opacity: 0.8 }}
              aria-label="Close gallery"
            >
              ✕
            </button>
          </div>

          {/* Main image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: 900, flex: 1, margin: '64px 0 16px', padding: '0 60px' }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', maxHeight: 'calc(100vh - 180px)' }}>
              <Image
                src={activePhoto}
                alt={activeSection.label}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 900px) 100vw, 900px"
                priority
              />
            </div>
          </div>

          {/* Prev / Next */}
          {hasMultiple && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
                  width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
                  fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
                  width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
                  fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {hasMultiple && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', gap: 6, padding: '0 16px 16px',
                overflowX: 'auto', maxWidth: 900, width: '100%',
                scrollbarWidth: 'none',
              }}
            >
              {activeSection.gallery.map((photo, pi) => (
                <button
                  key={pi}
                  onClick={() => setOpen(o => ({ ...o, photoIndex: pi }))}
                  style={{
                    position: 'relative', flexShrink: 0,
                    width: 60, height: 60, borderRadius: 6, overflow: 'hidden',
                    border: pi === open.photoIndex ? '2px solid #97C459' : '2px solid transparent',
                    padding: 0, cursor: 'pointer', background: '#2C2C2A',
                    opacity: pi === open.photoIndex ? 1 : 0.55,
                    transition: 'opacity 0.15s, border-color 0.15s',
                  }}
                  aria-label={`Go to photo ${pi + 1}`}
                >
                  <Image
                    src={photo}
                    alt=""
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="60px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

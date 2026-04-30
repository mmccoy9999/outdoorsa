'use client'
import { useEffect } from 'react'

// Replace BOTH placeholder values with your real IDs after AdSense approval:
//   data-ad-client  → your publisher ID  (ca-pub-XXXXXXXXXXXXXXXXX)
//   slot prop       → your ad unit slot ID when placing the component

export default function AdUnit({ slot, format = 'auto', style = {} }) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', overflow: 'hidden', ...style }}
      data-ad-client="ca-pub-9940334519327352"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}

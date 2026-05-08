'use client'

import dynamic from 'next/dynamic'

const TrailMap = dynamic(() => import('./TrailMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 400, background: '#E8E6DF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5F5E5A', fontFamily: 'var(--font-barlow)' }}>
      Loading map…
    </div>
  ),
})

export default function TrailMapWrapper(props) {
  return <TrailMap {...props} />
}

'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)', fontSize: 12, padding: '6px 12px',
        borderRadius: 6, cursor: 'pointer',
      }}
    >
      Sign out
    </button>
  )
}

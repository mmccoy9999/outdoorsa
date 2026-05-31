'use client'

import { useState } from 'react'

export default function EmailCapture() {
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

  if (status === 'success') {
    return (
      <p style={{ color: 'var(--green-light)', fontSize: '17px', fontWeight: 600, marginBottom: '1rem' }}>
        You&apos;re on the list — we&apos;ll reach out when we launch!
      </p>
    )
  }

  return (
    <>
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
      {status === 'error' && (
        <p style={{ color: '#f87171', fontSize: '13px', marginTop: '0.75rem' }}>{errorMsg}</p>
      )}
    </>
  )
}

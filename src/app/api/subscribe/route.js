import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(request) {
  const { email } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_SERVER } = process.env
  const authHeader = { Authorization: `Bearer ${MAILCHIMP_API_KEY}`, 'Content-Type': 'application/json' }
  const base = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0`

  // Verify API key before doing anything else
  const ping = await fetch(`${base}/ping`, { headers: authHeader })
  if (!ping.ok) {
    const pingBody = await ping.json()
    console.log('[subscribe] ping failed:', ping.status, JSON.stringify(pingBody))
    return NextResponse.json({ error: 'Mailchimp auth failed', _debug: pingBody }, { status: 500 })
  }

  // Subscribe without tags — tags applied separately below
  const res = await fetch(`${base}/lists/${MAILCHIMP_AUDIENCE_ID}/members`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ email_address: email, status: 'subscribed' }),
  })

  const data = await res.json()
  console.log('[subscribe] member status=%d body=%s', res.status, JSON.stringify(data))

  if (!res.ok && data.title !== 'Member Exists') {
    return NextResponse.json(
      {
        error: data.detail || 'Subscription failed',
        mailchimp_status: res.status,
        mailchimp_title: data.title,
        mailchimp_errors: data.errors ?? [],
        mailchimp_raw: data,
      },
      { status: 500 }
    )
  }

  // Apply tag via the dedicated tags endpoint
  const hash = createHash('md5').update(email.toLowerCase()).digest('hex')
  const tagRes = await fetch(`${base}/lists/${MAILCHIMP_AUDIENCE_ID}/members/${hash}/tags`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ tags: [{ name: 'outdoorsa-waitlist', status: 'active' }] }),
  })
  console.log('[subscribe] tag status=%d', tagRes.status)

  return NextResponse.json({ success: true })
}

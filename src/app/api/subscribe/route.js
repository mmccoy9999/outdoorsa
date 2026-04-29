import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_SERVER } = process.env

  const res = await fetch(
    `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: [{ name: 'outdoorsa-waitlist', status: 'active' }],
      }),
    }
  )

  const data = await res.json()
  console.log('[subscribe] status=%d body=%s', res.status, JSON.stringify(data))

  if (res.ok) {
    return NextResponse.json({ success: true })
  }

  // Already subscribed is not an error from the user's perspective
  if (data.title === 'Member Exists') {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    {
      error: data.detail || 'Subscription failed',
      mailchimp_status: res.status,
      mailchimp_title: data.title,
      mailchimp_detail: data.detail,
      mailchimp_errors: data.errors ?? [],
      mailchimp_raw: data,
    },
    { status: 500 }
  )
}

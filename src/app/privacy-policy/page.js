import Link from 'next/link'

const BASE_URL = 'https://outdoorsa.co'

export const metadata = {
  title: 'Privacy Policy — OutdoorSA',
  description: 'Privacy policy for OutdoorSA, a San Antonio outdoor activity guide.',
  alternates: { canonical: `${BASE_URL}/privacy-policy` },
  robots: { index: false },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F7F5EF; font-family: var(--font-barlow); }
      `}</style>

      <nav style={{
        background: '#F7F5EF', borderBottom: '1px solid #D3D1C7',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: '#2C2C2A' }}>
            OUTDOOR<span style={{ color: '#3B6D11' }}>SA</span>
          </span>
        </Link>
        <Link href="/" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none', fontFamily: 'var(--font-barlow)' }}>
          ← Home
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: 36, fontWeight: 800, color: '#2C2C2A', margin: '0 0 8px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: '#5F5E5A', margin: '0 0 40px', fontFamily: 'var(--font-barlow)' }}>
          Effective date: January 1, 2025 &nbsp;·&nbsp; Last updated: January 1, 2025
        </p>

        <Section title="Overview">
          <p>OutdoorSA ("we," "our," or "us") operates the website located at outdoorsa.co (the "Site"). This Privacy Policy explains how we collect, use, and share information when you visit the Site.</p>
          <p>By using the Site, you agree to the collection and use of information as described in this policy.</p>
        </Section>

        <Section title="Information We Collect">
          <h3 style={h3Style}>Information you provide</h3>
          <p>If you subscribe to our email list, we collect your email address. We use this solely to send you updates about OutdoorSA. You can unsubscribe at any time using the link in any email we send.</p>

          <h3 style={h3Style}>Information collected automatically</h3>
          <p>When you visit the Site, certain information is collected automatically, including:</p>
          <ul style={ulStyle}>
            <li>Your IP address and general location (city/region level)</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring website or search query that brought you to the Site</li>
            <li>Device type (mobile, tablet, desktop)</li>
          </ul>
          <p>This information is collected through cookies and similar tracking technologies, including those set by third-party services described below.</p>
        </Section>

        <Section title="Cookies">
          <p>Cookies are small text files stored on your device. We and our third-party partners use cookies to:</p>
          <ul style={ulStyle}>
            <li>Understand how visitors use the Site (analytics)</li>
            <li>Serve relevant advertisements (advertising)</li>
            <li>Remember your preferences</li>
          </ul>
          <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect how the Site functions.</p>
        </Section>

        <Section title="Google AdSense and Advertising">
          <p>We use Google AdSense to display advertisements on the Site. Google AdSense uses cookies to serve ads based on your prior visits to this and other websites.</p>
          <p>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our Site and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google Ads Settings</a> or by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={linkStyle}>aboutads.info</a>.</p>
          <p>For more information on how Google uses data collected through advertising, visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google's Privacy & Terms</a>.</p>
        </Section>

        <Section title="Analytics">
          <p>We may use analytics services such as Google Analytics to understand how visitors interact with the Site. These services collect information sent by your browser, including pages visited and time spent. This data is aggregated and anonymized.</p>
          <p>You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google Analytics Opt-out Browser Add-on</a>.</p>
        </Section>

        <Section title="Email Marketing">
          <p>If you subscribe to our email list, your email address is processed through Mailchimp (an Intuit company). Mailchimp's privacy policy is available at <a href="https://www.intuit.com/privacy/statement/" target="_blank" rel="noopener noreferrer" style={linkStyle}>intuit.com/privacy/statement</a>.</p>
          <p>We will never sell or share your email address with third parties for their own marketing purposes. You can unsubscribe at any time.</p>
        </Section>

        <Section title="How We Use Your Information">
          <ul style={ulStyle}>
            <li>To send email updates you have requested</li>
            <li>To analyze and improve Site performance and content</li>
            <li>To serve advertisements through Google AdSense</li>
            <li>To comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="Sharing of Information">
          <p>We do not sell your personal information. We may share information with:</p>
          <ul style={ulStyle}>
            <li><strong>Service providers</strong> who help us operate the Site (e.g., hosting, email delivery, analytics)</li>
            <li><strong>Advertising partners</strong> such as Google AdSense as described above</li>
            <li><strong>Law enforcement or legal process</strong> when required by law</li>
          </ul>
        </Section>

        <Section title="Children's Privacy">
          <p>The Site is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, contact us and we will delete it.</p>
        </Section>

        <Section title="Your Choices">
          <ul style={ulStyle}>
            <li><strong>Email:</strong> Unsubscribe at any time using the link in any email from us</li>
            <li><strong>Cookies:</strong> Adjust your browser settings to block or delete cookies</li>
            <li><strong>Personalized ads:</strong> Opt out at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>google.com/settings/ads</a></li>
          </ul>
        </Section>

        <Section title="Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of the Site after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="Contact Us">
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <p><strong>OutdoorSA</strong><br />San Antonio, Texas<br />
          <a href="mailto:hello@outdoorsa.co" style={linkStyle}>hello@outdoorsa.co</a></p>
        </Section>
      </div>
    </>
  )
}

const h3Style = {
  fontFamily: 'var(--font-barlow-condensed)',
  fontSize: 16,
  fontWeight: 700,
  color: '#2C2C2A',
  margin: '20px 0 6px',
  letterSpacing: '0.02em',
}

const ulStyle = {
  paddingLeft: 20,
  margin: '8px 0',
  lineHeight: 1.8,
}

const linkStyle = {
  color: '#3B6D11',
  textDecoration: 'underline',
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{
        fontFamily: 'var(--font-barlow-condensed)',
        fontSize: 22,
        fontWeight: 700,
        color: '#2C2C2A',
        margin: '0 0 12px',
        paddingBottom: 8,
        borderBottom: '1px solid #D3D1C7',
      }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: '#2C2C2A', fontFamily: 'var(--font-barlow)' }}>
        {children}
      </div>
    </div>
  )
}

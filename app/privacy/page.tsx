import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Nira',
  description: 'How Nira collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: April 18, 2026</p>

        <Section title="1. What we collect">
          <p>When you create a Nira account or use our platform, we collect:</p>
          <ul>
            <li><strong>Account information</strong> — your name, email address, and password</li>
            <li><strong>Business information</strong> — business name, type, city, and phone number</li>
            <li><strong>Customer data</strong> — names and WhatsApp phone numbers of your customers, added through the WhatsApp bot or mobile app</li>
            <li><strong>Conversation logs</strong> — WhatsApp messages sent through your Nira bot, stored to power AI responses and your dashboard analytics</li>
            <li><strong>Usage analytics</strong> — how you interact with the Nira mobile app (screens visited, features used), collected anonymously to improve the product</li>
          </ul>
        </Section>

        <Section title="2. How we use it">
          <ul>
            <li>To provide and operate the Nira service — powering your WhatsApp bot, bookings, orders, and customer management</li>
            <li>To send AI-powered WhatsApp responses to your customers on your behalf</li>
            <li>To show you analytics about your business performance in the mobile app</li>
            <li>To send you service-related communications (account updates, security alerts)</li>
            <li>To improve our AI features and platform quality</li>
          </ul>
          <p className="mt-4"><strong>We never sell your data or your customers' data to third parties.</strong></p>
        </Section>

        <Section title="3. Data storage and security">
          <ul>
            <li>All data is stored on secure servers using <strong>Neon PostgreSQL</strong>, hosted in the US East region</li>
            <li>All data in transit is encrypted using <strong>HTTPS / TLS 1.2+</strong></li>
            <li>Passwords are hashed with bcrypt (never stored in plain text)</li>
            <li>JWT tokens expire after 7 days and are invalidated on logout</li>
            <li>Access to your data is role-restricted — only authorized team members and you can see it</li>
          </ul>
        </Section>

        <Section title="4. Your rights">
          <p>You have the following rights over your data:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of all data we hold about you</li>
            <li><strong>Correction</strong> — update incorrect information via the app or by contacting us</li>
            <li><strong>Deletion</strong> — request deletion of your account and all associated data. We will process this within 30 days.</li>
            <li><strong>Export</strong> — export your customer list and conversation history from the app</li>
            <li><strong>Opt-out</strong> — stop using the service at any time by deleting your account</li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, email us at{' '}
            <a href="mailto:privacy@nira.app" className="text-coral underline">privacy@nira.app</a>.
          </p>
        </Section>

        <Section title="5. Third-party services">
          <p>Nira uses the following third-party services to operate. Each has its own privacy policy:</p>
          <ul>
            <li><strong>Anthropic</strong> — powers AI chat responses via Claude API. Customer messages may be processed by Anthropic for response generation. See <a href="https://www.anthropic.com/privacy" className="underline">anthropic.com/privacy</a>.</li>
            <li><strong>Ghala Rails</strong> — WhatsApp messaging infrastructure for Tanzania. Messages pass through Ghala's systems.</li>
            <li><strong>Neon</strong> — database hosting. See <a href="https://neon.tech/privacy" className="underline">neon.tech/privacy</a>.</li>
            <li><strong>Render / Railway</strong> — backend server hosting.</li>
            <li><strong>Vercel</strong> — website hosting. See <a href="https://vercel.com/legal/privacy-policy" className="underline">vercel.com/privacy</a>.</li>
          </ul>
        </Section>

        <Section title="6. Cookies">
          <p>The Nira mobile app does not use cookies. The Nira website and admin panel use cookies only for authentication sessions — no tracking or advertising cookies are used.</p>
        </Section>

        <Section title="7. Data retention">
          <p>We retain your data for as long as your account is active. Conversation logs older than 12 months may be automatically archived. If you delete your account, all data is permanently deleted within 30 days.</p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>We may update this privacy policy from time to time. We will notify you of significant changes by email or in-app notification. Continued use of Nira after changes constitutes acceptance.</p>
        </Section>

        <Section title="9. Contact">
          <ul>
            <li>Email: <a href="mailto:privacy@nira.app" className="underline">privacy@nira.app</a></li>
            <li>Website: <a href="https://niratz.vercel.app" className="underline">niratz.vercel.app</a></li>
            <li>Country of operation: Tanzania 🇹🇿</li>
          </ul>
        </Section>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-[#FF6B6B]">
        {children}
      </div>
    </section>
  )
}

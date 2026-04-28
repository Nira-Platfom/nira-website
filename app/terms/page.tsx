import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Nira',
  description: 'Terms governing your use of the Nira platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: April 18, 2026</p>

        <Section title="1. Acceptance of terms">
          <p>By creating an account or using the Nira platform (including the mobile app, WhatsApp bot, and website), you agree to these Terms of Service. If you do not agree, do not use Nira.</p>
        </Section>

        <Section title="2. Description of service">
          <p>Nira is an AI-powered business management platform for beauty businesses in East Africa. It provides:</p>
          <ul>
            <li>An automated WhatsApp bot that handles customer inquiries, bookings, and orders on your behalf</li>
            <li>A mobile app to manage your business, customers, products, services, and analytics</li>
            <li>AI-powered skincare advice and responses generated using Anthropic's Claude</li>
          </ul>
          <p>The service is provided on an "as is" basis and may be updated or changed at any time.</p>
        </Section>

        <Section title="3. User accounts">
          <ul>
            <li>You must be at least 18 years old to create an account</li>
            <li>You are responsible for maintaining the confidentiality of your password</li>
            <li>One account may be associated with multiple businesses</li>
            <li>You are responsible for all activity that occurs under your account</li>
            <li>You must notify us immediately of any unauthorized use at <a href="mailto:support@nira.app" className="underline">support@nira.app</a></li>
          </ul>
        </Section>

        <Section title="4. Acceptable use">
          <p>You agree NOT to use Nira to:</p>
          <ul>
            <li>Send spam, unsolicited messages, or bulk communications to people who have not opted in</li>
            <li>Transmit illegal, harmful, threatening, or fraudulent content through the WhatsApp bot</li>
            <li>Impersonate another person or business</li>
            <li>Attempt to reverse-engineer, hack, or exploit the platform</li>
            <li>Violate WhatsApp's Business Policy or Meta's Terms of Service</li>
            <li>Collect personal data from customers beyond what is needed to operate your business</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these rules without notice.</p>
        </Section>

        <Section title="5. Payment and subscription">
          <ul>
            <li>New accounts receive a <strong>30-day free trial</strong> with no credit card required</li>
            <li>After the trial, continued use requires a paid subscription (Free, Pro, or Business plan)</li>
            <li>Subscription fees are billed in advance on a monthly or annual basis</li>
            <li>All prices are in Tanzanian Shillings (TZS) unless otherwise stated</li>
            <li>Refunds are provided at our discretion within 7 days of payment for annual plans</li>
            <li>We reserve the right to change pricing with 30 days' notice</li>
          </ul>
        </Section>

        <Section title="6. Intellectual property">
          <p>The Nira platform, including its AI models, design, and code, is owned by Nira and protected by copyright. You retain ownership of your business data and customer data. By using Nira, you grant us a limited license to process that data solely to provide the service.</p>
        </Section>

        <Section title="7. Termination">
          <p>You may cancel your account at any time from the app settings. We may suspend or terminate your account if you violate these terms. Upon termination, your data will be deleted within 30 days.</p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>To the maximum extent permitted by law, Nira is not liable for:</p>
          <ul>
            <li>Loss of revenue or profits resulting from downtime or service interruptions</li>
            <li>Incorrect AI responses sent to your customers through the bot</li>
            <li>Delays or failures caused by third-party services (WhatsApp, Anthropic, etc.)</li>
            <li>Unauthorized access to your account if caused by your failure to secure your credentials</li>
          </ul>
          <p>Our total liability to you for any claim shall not exceed the amount you paid to us in the 3 months preceding the claim.</p>
        </Section>

        <Section title="9. Governing law">
          <p>These terms are governed by the laws of the United Republic of Tanzania. Any disputes shall be resolved in the courts of Dar es Salaam, Tanzania.</p>
        </Section>

        <Section title="10. Contact">
          <ul>
            <li>Email: <a href="mailto:support@nira.app" className="underline">support@nira.app</a></li>
            <li>Website: <a href="https://niratz.vercel.app" className="underline">niratz.vercel.app</a></li>
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

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TCG Directory privacy policy — how we handle your data',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white">
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Privacy Policy</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6 text-gray-700 dark:text-gray-300">
        <p className="text-sm text-gray-500">Last updated: February 2026</p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Overview</h2>
          <p>TCG Directory is a free trading card database. We do not require account creation and do not collect personal information directly. This policy explains what data is collected through third-party services.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data We Store Locally</h2>
          <p>Favorites, deck lists, and compare lists are stored in your browser&apos;s localStorage. This data never leaves your device and is not sent to our servers.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Google Analytics</h2>
          <p>We use Google Analytics 4 to understand how visitors use the site. This service collects anonymous usage data including pages visited, time on site, and general geographic region. Google Analytics uses cookies to distinguish users. You can opt out by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Google AdSense</h2>
          <p>We may display ads through Google AdSense. Google uses cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Third-Party Data Sources</h2>
          <p>Card data is sourced from public APIs including the Pokemon TCG API, Scryfall, YGOPRODeck, and community-maintained datasets. Card images are served from their respective sources.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
          <p>Under GDPR and CCPA, you have the right to access, correct, or delete your personal data. Since we do not collect personal data directly, most data resides in your browser (localStorage) and can be cleared by clearing your browser data. For questions about data collected by Google services, refer to <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact</h2>
          <p>If you have questions about this privacy policy, please open an issue on our <a href="https://github.com/YNDEV209/tcg-directory" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
        </section>
      </div>
    </main>
  )
}

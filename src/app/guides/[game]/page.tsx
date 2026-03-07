import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GAMES, GAME_ACCENTS } from '@/lib/constants'
import { GUIDE_CONTENT } from '@/lib/guide-content'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ game: string }>
}

export async function generateStaticParams() {
  return GAMES.map(g => ({ game: g.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params
  const guide = GUIDE_CONTENT[game]
  if (!guide) return { title: 'Guide Not Found' }
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `${siteUrl}/guides/${game}` },
    openGraph: { title: guide.title, description: guide.description },
  }
}

export default async function GuidePage({ params }: Props) {
  const { game } = await params
  const guide = GUIDE_CONTENT[game]
  const gameName = GAMES.find(g => g.id === game)?.name
  if (!guide || !gameName) notFound()

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: gameName, url: `${siteUrl}/games/${game}` },
    { name: 'Beginner Guide', url: `${siteUrl}/guides/${game}` },
  ])

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href={`/games/${game}`} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">&larr;</Link>
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white">
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/games/${game}`} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            {gameName}
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Guide</h1>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{guide.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed dark:text-gray-400">{guide.intro}</p>
        </div>

        <nav className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-5 shadow-sm dark:from-gray-800 dark:to-gray-800/50">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">In this guide</p>
          <ul className="space-y-1">
            {guide.sections.map((s, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                  {s.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Frequently Asked Questions
              </a>
            </li>
          </ul>
        </nav>

        {guide.sections.map((section, i) => (
          <section key={i} id={`section-${i}`} className={`space-y-3 border-l-2 ${GAME_ACCENTS[game]?.border || 'border-l-blue-500'} pl-4`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{section.heading}</h3>
            {section.content.map((p, j) => (
              <p key={j} className="text-gray-600 leading-relaxed dark:text-gray-400">{p}</p>
            ))}
          </section>
        ))}

        <section id="faq" className="space-y-4 pt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {guide.faq.map((f, i) => (
              <details key={i} className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 [&[open]]:ring-1 [&[open]]:ring-blue-500/20">
                <summary className="flex cursor-pointer items-center px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {f.question}
                </summary>
                <p className="px-4 pb-4 text-gray-600 dark:text-gray-400">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex gap-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
          <Link
            href={`/games/${game}`}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse {gameName} cards
          </Link>
          <Link
            href="/glossary"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            TCG Glossary
          </Link>
        </div>
      </article>
    </main>
  )
}

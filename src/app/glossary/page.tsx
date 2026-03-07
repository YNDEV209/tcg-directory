import Link from 'next/link'
import { GLOSSARY_TERMS } from '@/lib/glossary-content'
import { GAMES, GAME_ACCENTS } from '@/lib/constants'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TCG Glossary — Trading Card Game Terms & Definitions',
  description: 'Comprehensive glossary of trading card game terminology covering Pokemon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, and Gundam. Learn key TCG terms, mechanics, and concepts.',
  alternates: { canonical: `${siteUrl}/glossary` },
}

export default function GlossaryPage() {
  const sorted = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term))
  const letters = [...new Set(sorted.map(t => t.term[0].toUpperCase()))]

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Glossary', url: `${siteUrl}/glossary` },
  ])

  const definedTermListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'TCG Glossary',
    description: 'Comprehensive glossary of trading card game terms and definitions.',
    hasDefinedTerm: sorted.map(t => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
    })),
  }

  const gameNameMap: Record<string, string> = {}
  for (const g of GAMES) gameNameMap[g.id] = g.name

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermListJsonLd) }}
      />
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">&larr;</Link>
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white">
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Glossary</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-8">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Trading Card Game Glossary
          </h2>
          <p className="max-w-3xl text-gray-600 leading-relaxed dark:text-gray-400">
            Whether you&apos;re new to trading card games or a seasoned veteran encountering unfamiliar terminology, this glossary covers the essential terms used across Pokemon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, and Gundam card games. Each term is tagged with the games it applies to, helping you quickly find game-specific definitions.
          </p>
        </section>

        <nav className="sticky top-0 z-10 -mx-4 flex flex-wrap gap-2 bg-gray-50/80 px-4 py-3 backdrop-blur-sm dark:bg-gray-900/80">
          {letters.map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded bg-white text-sm font-medium text-gray-700 shadow-sm border border-gray-100 transition-all hover:bg-blue-500 hover:text-white hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-blue-600"
            >
              {letter}
            </a>
          ))}
        </nav>

        {letters.map(letter => {
          const terms = sorted.filter(t => t.term[0].toUpperCase() === letter)
          return (
            <section key={letter} id={`letter-${letter}`} className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-lg font-bold text-white">{letter}</span>
                {letter}
              </h3>
              <dl className="space-y-3">
                {terms.map(t => (
                  <div key={t.term} className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <dt className="text-lg font-semibold text-gray-900 dark:text-white">{t.term}</dt>
                    <dd className="mt-1 text-gray-600 leading-relaxed dark:text-gray-400">{t.definition}</dd>
                    <dd className="mt-2 flex flex-wrap gap-1">
                      {t.games.map(gid => (
                        <Link
                          key={gid}
                          href={`/games/${gid}`}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${GAME_ACCENTS[gid]?.bg || 'bg-gray-100 dark:bg-gray-700'} text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300`}
                        >
                          {gameNameMap[gid] || gid}
                        </Link>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )
        })}
      </div>
    </main>
  )
}

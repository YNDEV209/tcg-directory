import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About TCG Directory — a free trading card database for Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white">
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">About</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6 text-gray-700 dark:text-gray-300">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">What is TCG Directory?</h2>
          <p>TCG Directory is a free, comprehensive trading card database that lets you browse, search, and compare cards across multiple popular card games. With over 67,000 cards and growing, it&apos;s one of the most complete multi-game TCG databases available.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Supported Games</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Pokemon TCG</strong> — 20,000+ cards from Base Set to the latest expansions</li>
            <li><strong>Magic: The Gathering</strong> — 30,000+ cards across all standard sets</li>
            <li><strong>Yu-Gi-Oh!</strong> — 14,000+ cards with full set cross-references</li>
            <li><strong>One Piece TCG</strong> — 2,000+ cards from all booster and starter sets</li>
            <li><strong>Gundam Card Game</strong> — 600+ cards from all available sets</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Features</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Search and filter cards by name, type, rarity, set, and more</li>
            <li>Featured sort highlights the rarest and most valuable cards</li>
            <li>Compare up to 4 cards side by side</li>
            <li>Build and save custom decks</li>
            <li>Save favorite cards for quick access</li>
            <li>Market price data for Pokemon, MTG, Yu-Gi-Oh!, and One Piece</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Sources</h2>
          <p>Card data is sourced from the following APIs and datasets:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><a href="https://pokemontcg.io" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">Pokemon TCG API</a></li>
            <li><a href="https://scryfall.com" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">Scryfall</a> (Magic: The Gathering)</li>
            <li><a href="https://ygoprodeck.com" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">YGOPRODeck</a> (Yu-Gi-Oh!)</li>
            <li><a href="https://optcgapi.com" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">OPTCG API</a> (One Piece)</li>
            <li><a href="https://github.com/apitcg/gundam-tcg-data" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">Gundam TCG Data</a> (community-maintained)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Open Source</h2>
          <p>TCG Directory is open source. View the code, report issues, or contribute on <a href="https://github.com/YNDEV209/tcg-directory" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        </section>
      </div>
    </main>
  )
}

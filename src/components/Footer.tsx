import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 py-10 dark:bg-gray-800/80">
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid gap-8 sm:grid-cols-3 text-sm">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Browse</h3>
            <nav className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <Link href="/games/pokemon" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Pokemon</Link>
              <Link href="/games/mtg" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Magic: The Gathering</Link>
              <Link href="/games/yugioh" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Yu-Gi-Oh!</Link>
              <Link href="/games/onepiece" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">One Piece</Link>
              <Link href="/games/gundam" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Gundam</Link>
              <Link href="/sets" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">All Sets</Link>
              <Link href="/prices" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Price Guide</Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Learn</h3>
            <nav className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <Link href="/blog" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
              <Link href="/glossary" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">TCG Glossary</Link>
              <Link href="/guides/pokemon" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Pokemon Guide</Link>
              <Link href="/guides/mtg" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">MTG Guide</Link>
              <Link href="/guides/yugioh" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Yu-Gi-Oh! Guide</Link>
              <Link href="/guides/onepiece" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">One Piece Guide</Link>
              <Link href="/guides/gundam" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Gundam Guide</Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Info</h3>
            <nav className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <Link href="/about" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">About</Link>
              <Link href="/privacy" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} TCG Directory</p>
        </div>
      </div>
    </footer>
  )
}

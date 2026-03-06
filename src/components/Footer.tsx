import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 sm:grid-cols-3 text-sm">
          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Browse</h3>
            <nav className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <Link href="/games/pokemon" className="hover:text-gray-700 dark:hover:text-gray-200">Pokemon</Link>
              <Link href="/games/mtg" className="hover:text-gray-700 dark:hover:text-gray-200">Magic: The Gathering</Link>
              <Link href="/games/yugioh" className="hover:text-gray-700 dark:hover:text-gray-200">Yu-Gi-Oh!</Link>
              <Link href="/games/onepiece" className="hover:text-gray-700 dark:hover:text-gray-200">One Piece</Link>
              <Link href="/games/gundam" className="hover:text-gray-700 dark:hover:text-gray-200">Gundam</Link>
              <Link href="/sets" className="hover:text-gray-700 dark:hover:text-gray-200">All Sets</Link>
              <Link href="/prices" className="hover:text-gray-700 dark:hover:text-gray-200">Price Guide</Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Learn</h3>
            <nav className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-200">Blog</Link>
              <Link href="/glossary" className="hover:text-gray-700 dark:hover:text-gray-200">TCG Glossary</Link>
              <Link href="/guides/pokemon" className="hover:text-gray-700 dark:hover:text-gray-200">Pokemon Guide</Link>
              <Link href="/guides/mtg" className="hover:text-gray-700 dark:hover:text-gray-200">MTG Guide</Link>
              <Link href="/guides/yugioh" className="hover:text-gray-700 dark:hover:text-gray-200">Yu-Gi-Oh! Guide</Link>
              <Link href="/guides/onepiece" className="hover:text-gray-700 dark:hover:text-gray-200">One Piece Guide</Link>
              <Link href="/guides/gundam" className="hover:text-gray-700 dark:hover:text-gray-200">Gundam Guide</Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Info</h3>
            <nav className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-200">About</Link>
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200">Privacy Policy</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} TCG Directory</p>
        </div>
      </div>
    </footer>
  )
}

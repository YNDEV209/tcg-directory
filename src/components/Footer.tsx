import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} TCG Directory</p>
        <nav className="flex gap-4">
          <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-200">About</Link>
          <Link href="/sets" className="hover:text-gray-700 dark:hover:text-gray-200">Sets</Link>
          <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  )
}

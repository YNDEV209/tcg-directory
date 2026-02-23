import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/seo'
import { GAMES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'TCG guides, deck lists, set reviews, and trading card game news for Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam.',
  alternates: { canonical: `${siteUrl}/blog` },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">&larr;</Link>
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white">
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Blog</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {posts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts yet. Check back soon!</p>
        )}
        {posts.map(post => {
          const gameName = GAMES.find(g => g.id === post.game)?.name
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                {gameName && (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {gameName}
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{post.title}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{post.description}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

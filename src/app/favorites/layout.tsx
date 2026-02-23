import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'Your saved favorite trading cards on TCG Directory',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

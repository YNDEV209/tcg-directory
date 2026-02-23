import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Decks',
  description: 'Your saved trading card decks on TCG Directory',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

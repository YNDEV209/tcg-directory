import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Card Decks',
  description: 'Build and manage trading card decks for Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

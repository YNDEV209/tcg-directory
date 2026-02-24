import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Favorite Cards',
  description: 'View and manage your saved favorite trading cards from Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Cards Side by Side',
  description: 'Compare trading cards side by side — view stats, types, rarity, and prices across Pokemon, MTG, Yu-Gi-Oh!, and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

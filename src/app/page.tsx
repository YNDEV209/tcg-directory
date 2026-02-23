import type { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'TCG Directory — Pokemon, MTG, Yu-Gi-Oh!, One Piece & Gundam Card Database',
  description: 'Search over 67,000 trading cards from Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam. Free card database with prices, sets, deck building, and more.',
  alternates: { canonical: siteUrl },
}

export default function Page() {
  return <HomeContent />
}

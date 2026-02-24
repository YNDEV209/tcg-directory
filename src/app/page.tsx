import type { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'TCG Directory — Trading Card Game Database',
  description: 'Search over 67,000 trading cards from Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam. Free database with prices, sets, and deck building.',
  alternates: { canonical: siteUrl },
}

export default function Page() {
  return <HomeContent />
}

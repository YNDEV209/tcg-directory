import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { GAMES } from '@/lib/constants'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tcg-directory.vercel.app'

export async function generateSitemaps() {
  return [
    { id: 'static' },
    ...GAMES.map(g => ({ id: g.id })),
  ]
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  if (id === 'static') {
    const { data: sets } = await supabase.from('sets').select('id')
    return [
      { url: baseUrl, changeFrequency: 'daily', priority: 1, lastModified: now },
      { url: `${baseUrl}/sets`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${baseUrl}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
      ...GAMES.map(g => ({
        url: `${baseUrl}/games/${g.id}`,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
        lastModified: now,
      })),
      ...(sets || []).map(s => ({
        url: `${baseUrl}/sets/${s.id}`,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]
  }

  const { data: cards } = await supabase
    .from('cards')
    .select('id')
    .eq('game_id', id)

  return (cards || []).map(card => ({
    url: `${baseUrl}/cards/${card.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
}

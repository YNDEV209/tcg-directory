import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tcg-directory.vercel.app'

  const { data: cards } = await supabase
    .from('cards')
    .select('id')

  const cardEntries: MetadataRoute.Sitemap = (cards || []).map((card) => ({
    url: `${baseUrl}/cards/${card.id}`,
    changeFrequency: 'monthly',
  }))

  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    ...cardEntries,
  ]
}

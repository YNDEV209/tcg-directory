import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tcg-directory.vercel.app'
  const now = new Date().toISOString()

  const { data: cards } = await supabase.from('cards').select('id')

  const cardEntries: MetadataRoute.Sitemap = (cards || []).map((card) => ({
    url: `${baseUrl}/cards/${card.id}`,
    changeFrequency: 'monthly',
  }))

  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1, lastModified: now },
    { url: `${baseUrl}/sets`, changeFrequency: 'weekly', priority: 0.8 },
    ...cardEntries,
  ]
}

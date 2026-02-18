import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const API_BASE = 'https://api.pokemontcg.io/v2'
const PAGE_SIZE = 250
const DELAY_MS = 1500

interface ApiCard {
  id: string
  tcgplayer?: {
    url: string
    updatedAt: string
    prices: Record<string, Record<string, number>>
  }
  cardmarket?: {
    url: string
    updatedAt: string
    prices: Record<string, number>
  }
}

interface ApiResponse {
  data: ApiCard[]
  totalCount: number
  count: number
  page: number
  pageSize: number
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchPage(page: number): Promise<ApiResponse> {
  const url = `${API_BASE}/cards?page=${page}&pageSize=${PAGE_SIZE}&select=id,tcgplayer,cardmarket`
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (process.env.POKEMON_TCG_API_KEY) {
    headers['X-Api-Key'] = process.env.POKEMON_TCG_API_KEY
  }
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json() as Promise<ApiResponse>
}

async function main() {
  console.log('Fetching Pokemon prices from pokemontcg.io...')
  console.log('(Set POKEMON_TCG_API_KEY env var for higher rate limits)\n')

  let page = 1
  let totalUpdated = 0
  let totalPages = 1

  while (page <= totalPages) {
    console.log(`Fetching page ${page}/${totalPages}...`)

    let data: ApiResponse
    try {
      data = await fetchPage(page)
    } catch (e) {
      console.error(`Failed on page ${page}: ${e}`)
      console.log('Retrying in 5s...')
      await sleep(5000)
      try {
        data = await fetchPage(page)
      } catch {
        console.error(`Skipping page ${page} after retry`)
        page++
        continue
      }
    }

    totalPages = Math.ceil(data.totalCount / PAGE_SIZE)

    const updates = data.data
      .filter(c => c.tcgplayer || c.cardmarket)
      .map(c => ({
        id: c.id,
        prices: {
          ...(c.tcgplayer ? { tcgplayer: c.tcgplayer } : {}),
          ...(c.cardmarket ? { cardmarket: c.cardmarket } : {}),
        },
      }))

    if (updates.length > 0) {
      const { error } = await supabase
        .from('cards')
        .upsert(updates, { onConflict: 'id', ignoreDuplicates: false })
      if (error) {
        console.error(`DB error on page ${page}: ${error.message}`)
      } else {
        totalUpdated += updates.length
        console.log(`  Updated ${updates.length} cards (total: ${totalUpdated})`)
      }
    }

    page++
    if (page <= totalPages) await sleep(DELAY_MS)
  }

  console.log(`\nDone! Updated prices for ${totalUpdated} cards`)
}

main().catch(console.error)

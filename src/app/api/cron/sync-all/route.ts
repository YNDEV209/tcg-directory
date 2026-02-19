import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const day = now.getUTCDate()
  const dayOfWeek = now.getUTCDay()
  const origin = req.nextUrl.origin
  const headers = { authorization: `Bearer ${process.env.CRON_SECRET}` }

  const results: Record<string, unknown> = {}

  // Pokemon prices: every Sunday (dayOfWeek === 0)
  if (dayOfWeek === 0) {
    try {
      const res = await fetch(`${origin}/api/cron/update-prices`, { headers })
      results.prices = await res.json()
    } catch (e) {
      results.prices = { error: e instanceof Error ? e.message : 'failed' }
    }
  }

  // One Piece seed: 1st and 15th of month
  if (day === 1 || day === 15) {
    try {
      const res = await fetch(`${origin}/api/cron/seed-onepiece`, { headers })
      results.onepiece = await res.json()
    } catch (e) {
      results.onepiece = { error: e instanceof Error ? e.message : 'failed' }
    }
  }

  // MTG seed: 1st of month
  if (day === 1) {
    try {
      const res = await fetch(`${origin}/api/cron/seed-mtg`, { headers })
      results.mtg = await res.json()
    } catch (e) {
      results.mtg = { error: e instanceof Error ? e.message : 'failed' }
    }
  }

  const skipped = Object.keys(results).length === 0
  return NextResponse.json({ date: now.toISOString(), skipped, results })
}

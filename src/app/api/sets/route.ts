import { NextRequest, NextResponse } from 'next/server'
import { getSets } from '@/lib/queries'

export async function GET(req: NextRequest) {
  const game_id = req.nextUrl.searchParams.get('game_id') || 'pokemon'

  try {
    const sets = await getSets(game_id)
    return NextResponse.json({ data: sets })
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    )
  }
}

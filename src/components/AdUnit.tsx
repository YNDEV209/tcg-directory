'use client'

import { useEffect, useRef } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export function AdUnit({ slot, format = 'auto', className }: AdUnitProps) {
  const pushed = useRef(false)
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!client || pushed.current) return
    try {
      ;((window as unknown as Record<string, unknown[]>).adsbygoogle ||= []).push({})
      pushed.current = true
    } catch {}
  }, [client])

  if (!client) return null

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
